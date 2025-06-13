const SaveFileName = "save.json"

const backupPrefix = "save_backup_"
const maxBackups = 3

const noSteamSubfolder = "offline_user"

const oldFiles = ["save.json", "save.json.tmp", "save_backup_1.json", "save_backup_2.json", "save_backup_3.json"]

const OFFSET_STEAM64 = 76561197960265728n // 0x0110000100000000 en hexadécimal

export class SaveSystem {
	constructor(runtime) {
		this.runtime = runtime

		this.runtime.save = this

		this.saveTimeout = null
		this.saveDelay = 1000 // 1-second debounce delay
		this.isSaving = false // Lock to prevent concurrent saves
		this.pendingSave = false // Tracks if another save is requested while saving

		this._isPipelab = null

		this.removedOldFiles = false
	}

	accountIDtoSteamID64(accountID) {
		// accountID peut être un Number ≤ 2^32–1 ou un BigInt
		const acc = BigInt(accountID)
		return (acc + OFFSET_STEAM64).toString()
	}

	async Steam_ID() {
		let steamID = ""

		let path_cacheSteamID = this.SaveFolderRoot + "/steamID.txt"
		if (this.isPipelab) path_cacheSteamID = this.runtime.pipelabWrapper.AppDataFolder() + "/" + path_cacheSteamID

		//* get steamID from Steam API

		if (this.ExportIsScirra()) {
			//if (this.runtime.steamworks.inst._isAvailable)

			const steamworksInst = this.runtime.steamworks.inst
			steamID = this.accountIDtoSteamID64(steamworksInst.accountId)
			console.error("steamID from Scirra", steamID)
		} else if (this.ExportIsPipelab()) {
			const steamID_obj = await this.runtime.pipelabWrapper.SteamCall("localplayer", "getSteamId")

			console.error("steamID_obj", steamID_obj)

			if (steamID_obj) {
				steamID = steamID_obj.steamId64
			}
		}

		if (!steamID) {
			steamID = await this.AppData_ReadFile(this.SaveFolderRoot, "steamID.txt")
		}

		if (!steamID) steamID = noSteamSubfolder

		steamID = steamID.toString()
		this.steamID = steamID
		console.error("steamID", steamID)

		//* Update steamID  cache
		if (this.steamID !== noSteamSubfolder) {
			await this.AppData_WriteFile(this.SaveFolderRoot, "steamID.txt", steamID)
		}

		return steamID
	}

	async AppData_DeleteFile(folderPath, fileName) {
		if (this.isPipelab) folderPath = this.runtime.pipelabWrapper.AppDataFolder() + "/" + folderPath
		const filePath = folderPath + "/" + fileName

		if (this.ExportIsScirra()) {
			await this.runtime.filesystemWrapper.DeleteFile("<local-app-data>", filePath)
		} else if (this.ExportIsPipelab()) {
			await this.runtime.pipelab._DeleteFile(filePath)
		}
	}

	async AppData_WriteFile(folderPath, fileName, content) {
		if (this.isPipelab) folderPath = this.runtime.pipelabWrapper.AppDataFolder() + "/" + folderPath
		const filePath = folderPath + "/" + fileName

		if (this.ExportIsScirra()) {
			await this.runtime.filesystemWrapper.CreateFolder("<local-app-data>", folderPath)
			await this.runtime.filesystemWrapper.WriteFile("<local-app-data>", filePath, content)
		} else if (this.ExportIsPipelab()) {
			await this.runtime.pipelab._CreateFolder(folderPath)
			await this.runtime.pipelab._WriteTextFile(filePath, content)
		}
	}

	async AppData_ReadFile(folderPath, fileName) {
		if (this.isPipelab) folderPath = this.runtime.pipelabWrapper.AppDataFolder() + "/" + folderPath
		const filePath = folderPath + "/" + fileName
		console.error("Try reading file", filePath)
		let fileText = null
		if (this.ExportIsScirra()) {
			await this.runtime.filesystemWrapper.ReadFile("<local-app-data>", filePath)
			fileText = this.runtime.filesystemWrapper.sdkInst._fileText
		} else if (this.ExportIsPipelab()) {
			await this.runtime.pipelab._ReadTextFile(filePath)
			fileText = this.runtime.pipelab._ReadFile()
		}
		if (!fileText) {
			console.error(`💾 No file found at ${filePath}`)
			return null
		}
		return fileText
	}

	get SaveFolderRoot() {
		let folderName = "Noobs Are Coming (Save)"
		if (this.runtime.main.isDemo === true) {
			folderName = "Noobs Are Coming DEMO"
		}
		return folderName
	}

	get SaveFolderName() {
		return this.SaveFolderRoot + "/" + this.steamID
	}

	get isPipelab() {
		if (this._isPipelab === null) {
			this._isPipelab = this.runtime.pipelab?.IsAvailable()
		}
		return this._isPipelab
	}

	get path_saveFolder() {
		let path = this.SaveFolderName
		if (this.isPipelab) path = this.runtime.pipelabWrapper.AppDataFolder() + "/" + path
		return path
	}

	get path_saveFile() {
		let path = this.SaveFolderName + "/" + SaveFileName
		if (this.isPipelab) path = this.runtime.pipelabWrapper.AppDataFolder() + "/" + path
		return path
	}

	get path_saveFileTemp() {
		return this.path_saveFile + ".tmp"
	}

	compareVersions(v1, v2) {
		const splitAndNormalize = (version) => version.split(".").map(Number) // Convert to array of numbers

		let arr1 = splitAndNormalize(v1)
		let arr2 = splitAndNormalize(v2)

		// Determine the max length of both versions
		let maxLength = Math.max(arr1.length, arr2.length)

		// Pad shorter array with zeros
		while (arr1.length < maxLength) arr1.push(0)
		while (arr2.length < maxLength) arr2.push(0)

		// Compare each segment
		for (let i = 0; i < maxLength; i++) {
			if (arr1[i] > arr2[i]) return 1 // v1 is greater
			if (arr1[i] < arr2[i]) return -1 // v2 is greater
		}

		return 0 // Versions are equal
	}

	async LoadSave() {
		await this.Steam_ID()

		const loadingInfo = {
			corruption: false,
		}

		if (this.runtime.platforms.Export === "html") {
			const fileText = await this.runtime.storage.getItem("gamesave")

			if (fileText) {
				try {
					const parsedData = JSON.parse(fileText)
					this.runtime.progress.saveData = parsedData

					loadingInfo.parsedData = parsedData

					const parsedVersion = parsedData.version || "0.0.0.0"

					return loadingInfo // Return on first valid save found
				} catch (error) {
					console.error("💾 Error parsing web save data:", error)
					loadingInfo.corruption = true
					return null
				}
			} else {
				return null
			}
		}

		const pipelab = this.runtime.pipelab
		const filePaths = []

		//file paths [folderPath, fileName]

		// Start with the main save file
		filePaths.push([this.SaveFolderName, SaveFileName])

		// Add backup files to the list
		const backupPrefix = "save_backup_"
		const maxBackups = 3
		for (let i = 1; i <= maxBackups; i++) {
			//filePaths.push([this.SaveFolderName, SaveFileName]);
			filePaths.push([this.SaveFolderName, `${backupPrefix}${i}.json`])
		}

		filePaths.push([this.SaveFolderRoot + "/" + noSteamSubfolder, SaveFileName])
		filePaths.push([this.SaveFolderRoot, SaveFileName])

		console.error("Try Loading save from those paths", filePaths)

		let fileText = null
		let parsedData = null

		for (const [index, filePath] of filePaths.entries()) {
			const folderPath = filePath[0]
			const fileName = filePath[1]

			const actualFilePath = `${folderPath}/${fileName}`

			if (!this.isPipelab && !this.runtime.filesystemWrapper.isSupported) {
				console.error("💾 Save error: Neither Scirra nor Pipelab is available")
				return null
			}

			fileText = await this.AppData_ReadFile(folderPath, fileName)

			if (!fileText) {
				if (index === 0) {
					loadingInfo.saveNotFound = true
				}

				continue
			}

			loadingInfo.filePath = actualFilePath

			// Try parsing the file text
			try {
				console.error(`💾 Progress.LoadSave: Successfully read file from ${filePath}`, fileText)
				parsedData = JSON.parse(fileText)
				this.runtime.progress.saveData = parsedData

				loadingInfo.parsedData = parsedData

				const parsedVersion = parsedData.version || "0.0.0.0"

				const compareVersion = this.compareVersions(parsedVersion, this.runtime.main.version)

				if (compareVersion === 0) {
					//!todo
				}

				if (compareVersion < 0) {
					console.error(`💾 Save file version ${parsedData.version} is older than project version ${this.runtime.main.version}`)
					loadingInfo.loadedVersion_Older = true
				}
				if (compareVersion > 0) {
					console.error(`💾 Save file version ${parsedData.version} is newer than project version ${this.runtime.main.version}`)
					loadingInfo.loadedVersion_Newer = true
				}

				return loadingInfo // Return on first valid save found
			} catch (error) {
				console.error(`💾 Error parsing file at ${filePath}:`, error)
				loadingInfo.corruption = true
				// Continue to next file in case of parsing errors
			}
		}

		console.error("💾 No valid save file or backup file could be loaded.")
		return null
	}

	async WriteSave(backup = false) {
		if (this.isSaving) {
			this.pendingSave = true
			return
		}

		if (this.saveTimeout) clearTimeout(this.saveTimeout)

		await new Promise((resolve) => {
			this.saveTimeout = setTimeout(async () => {
				await this.executeSave(backup)
				resolve()
			}, this.saveDelay)
		})

		if (!this.removedOldFiles) {
			console.error("💾 Removing old save files if they exist...")
			for (const oldFile of oldFiles) {
				this.AppData_DeleteFile(this.SaveFolderRoot, oldFile)
			}
			this.removedOldFiles = true
		}
	}

	async executeSave(backup = false) {
		if (this.isSaving) return // Prevent double execution
		this.isSaving = true
		this.pendingSave = false // Reset pending flag

		const _saveData = this.runtime.progress.saveData
		_saveData.version = this.runtime.main.version
		_saveData.date = new Date().toISOString()

		const saveData = JSON.stringify(_saveData)
		const pipelab = this.runtime.pipelab

		try {
			if (this.runtime.platforms.Export === "html") {
				await this.runtime.storage.setItem("gamesave", saveData)
			} else if (this.isPipelab) {
				await this.runtime.pipelab._CreateFolder(this.path_saveFolder)

				// Write to temp file first
				await this.runtime.pipelab._WriteTextFile(this.path_saveFileTemp, saveData)

				// Rename temp file to actual save file

				await this.runtime.pipelab._CopyFile(this.path_saveFileTemp, this.path_saveFile, true)

				/*
                await this.runtime.pipelab._RenameFile(
                tempSavePath,
                this.path_saveFile
                );*/

				console.error("💾 Save written successfully", this.path_saveFileTemp, saveData)

				// Handle backup if requested
				if (backup) {
					await this.handleBackups()
				}
			} else if (this.runtime.filesystemWrapper.isSupported) {
				await this.runtime.filesystemWrapper.CreateFolder("<local-app-data>", this.path_saveFolder)

				// Write to temp file first
				await this.runtime.filesystemWrapper.WriteFile("<local-app-data>", this.path_saveFileTemp, saveData)

				// Rename temp file to actual save file
				await this.runtime.filesystemWrapper.CopyFile("<local-app-data>", this.path_saveFileTemp, this.path_saveFile)

				// Handle backup if requested
				if (backup) {
					await this.handleBackups()
				}
			}
		} catch (error) {
			console.error("💾 Save failed:", error)
		} finally {
			this.isSaving = false

			// If a save was requested while we were saving, trigger another save
			if (this.pendingSave) {
				console.warn("Processing pending save request...")
				this.WriteSave()
			}
		}
	}

	async handleBackups() {
		if (this.isPipelab) {
			//
			await this.runtime.pipelab._CreateFolder(this.path_saveFolder)
		}

		// Shift older backups up (save_backup_4.json → save_backup_5.json, etc.)
		for (let i = maxBackups - 1; i >= 1; i--) {
			const oldBackup = `${this.path_saveFolder}/${backupPrefix}${i}.json`
			const newBackup = `${this.path_saveFolder}/${backupPrefix}${i + 1}.json`

			if (this.isPipelab) {
				await this.runtime.pipelab._CopyFile(oldBackup, newBackup, true)
			} else if (this.runtime.filesystemWrapper.isSupported) {
				/*
				const exists = await this.runtime.filesystemWrapper.FileExists("<local-app-data>", oldBackup)
				if (exists) {
					await this.runtime.filesystemWrapper.CopyFile("<local-app-data>", oldBackup, newBackup)
				}*/
				await this.runtime.filesystemWrapper.CopyFile("<local-app-data>", oldBackup, newBackup)
			}
		}

		// Create new backup (overwrite `save_backup_1.json` with latest save)
		const latestBackup = `${this.path_saveFolder}/${backupPrefix}1.json`

		if (this.isPipelab) {
			await this.runtime.pipelab._CopyFile(this.path_saveFile, latestBackup, true)
		} else if (this.runtime.filesystemWrapper.isSupported) {
			await this.runtime.filesystemWrapper.CopyFile("<local-app-data>", this.path_saveFile, latestBackup)
		}

		console.log("💾 Backup created:", latestBackup)
	}

	ExportIsScirra() {
		return this.runtime.platforms.ExportIsScirra()
	}

	ExportIsPipelab() {
		return this.runtime.platforms.ExportIsPipelab()
	}
}
