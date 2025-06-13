export class Platform_Filesystem {
	constructor(runtime) {
		this.runtime = runtime

		const sdkInst = sdk_runtime?.GetObjectClassByName("Filesystem")?._instances?.[0]?._sdkInst
		if (sdkInst) {
			this.sdkInst = sdkInst
			console.error("fileSystem", sdkInst)
		}

		this.isSupported = false
	}

	async waitForInit() {
		while (this.sdkInst._pickerTagSet.size < 10) {
			// Wait until _pickerTagSet has 10 elements
			await new Promise((resolve) => setTimeout(resolve, 50)) // Poll every 50ms
		}
		this.isSupported = true
		window.alert("Init completed!")
	}

	async ListContent_All(picker, folderPath) {
		const result = []
		await this.ListContent_NonRec(picker, folderPath)
		const fileNames = this.sdkInst._fileNames
		const folderNames = this.sdkInst._folderNames
		for (const fileName of fileNames) {
			let filePath = folderPath ? folderPath + "/" + fileName : fileName
			result.push(filePath)
		}
		for (const folderName of folderNames) {
			const subFolderPath = folderPath ? folderPath + "/" + folderName : folderName
			const subFiles = await this.ListContent_All(picker, subFolderPath)
			result.push(...subFiles)
		}
		return result
	}

	async ListContent_NonRec(picker, folderPath) {
		const listContent = C3.Plugins.FileSystem.Acts.ListContent.bind(this.sdkInst)
		await listContent(picker, folderPath, false, "")
	}

	//! careful race condition do get the supported status
	/*
	IsSupported() {
		return this.sdkInst._isSupported && this.sdkInst._isFSAPISupported
	}*/

	async ListContent(picker, folderPath, recursive = true) {
		const result = []

		const listContent = C3.Plugins.FileSystem.Acts.ListContent.bind(this.sdkInst)
		await listContent(picker, folderPath, recursive, "")
		const fileNames = this.sdkInst._fileNames
		for (const fileName of fileNames) {
			let filePath = folderPath ? folderPath + "/" + fileName : fileName
			result.push(filePath)
		}

		return result
	}

	async WriteFile(picker, folder, text, mode = "overwrite") {
		//overwrite or append

		const writeFile = C3.Plugins.FileSystem.Acts.WriteTextFile.bind(this.sdkInst)
		await writeFile(picker, folder, "", text, mode)
	}

	async DeleteFile(picker, folder) {
		const deleteFile = C3.Plugins.FileSystem.Acts.Delete.bind(this.sdkInst)
		await deleteFile(picker, folder, true, "")
	}

	async ReadFile(picker, folder) {
		const readFile = C3.Plugins.FileSystem.Acts.ReadTextFile.bind(this.sdkInst)
		await readFile(picker, folder, "")
	}

	async CreateFolder(picker, folder) {
		const ace = C3.Plugins.FileSystem.Acts.CreateFolder.bind(this.sdkInst)
		await ace(picker, folder, "")
	}

	async HasFileAt(picker, folder, name) {
		await this.ListContent(picker, folder)
		const fileNames = this.sdkInst._fileNames

		return fileNames.includes(name)
	}

	async CopyFile(picker, source, dest, tag = "") {
		const readFile = C3.Plugins.FileSystem.Acts.CopyFile.bind(this.sdkInst)
		await readFile(picker, source, dest, (tag = ""))
	}

	HasFile(name) {
		const hasFile = C3.Plugins.FileSystem.Cnds.HasFileOrFolder.bind(this.sdkInst)
		return hasFile(0, name, true)
	}
}
