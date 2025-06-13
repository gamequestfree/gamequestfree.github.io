export class Platforms {
	constructor(runtime) {
		this.runtime = runtime

		this.assetManager = sdk_runtime._assetManager
		console.error("this.assetManager", this.assetManager)

		this.runtime.addEventListener("beforeprojectstart", () => this.OnBeforeProjectStart())

		this.browserInst = sdk_runtime?.GetObjectClassByName("Browser")?._instances?.[0]?._sdkInst

		this.SetExportType()
	}

	async OnBeforeProjectStart() {
		//await this.Steam_Achieve_ClearAll()
		/*
          await this.Steam_Achieve_Clear("achieve_die_1")
  
          await this.Steam_Achieve_Get("achieve_die_1")*/
	}

	IsElectron() {
		return !!(window && window.process && window.process.type)
	}

	SetExportType() {
		this.Export = "preview"

		const exportType = this.runtime.platformInfo.exportType

		this.runtime.baseUrl = sdk_runtime._runtimeBaseUrl
		if (exportType === "preview") this.runtime.baseUrl = "https://preview.construct.net/"
		if (exportType === "nwjs") this.runtime.baseUrl = ""

		if (exportType === "windows-webview2") {
			this.Export = "webview2"
		} else if (exportType === "linux-cef") {
			this.Export = "linux"
		} else if (exportType === "nwjs") {
			this.Export = "nwjs"
		} else if (this.runtime.baseUrl !== "https://preview.construct.net/") {
			if (window.electronAPI) {
				this.Export = "pipelab"
			} else {
				this.Export = "html"
			}
		} else {
			this.Export = "preview"
		}
	}

	ExportIsPipelab() {
		return this.Export === "pipelab"
	}

	async RecoverSave_FromAchievements() {
		//!Todo
	}

	async Steam_Achieve_Get(id) {
		if (this.ExportIsScirra()) {
			await this.runtime.steamworks.Achieve_Get(id)
		} else if (this.ExportIsPipelab()) {
			await this.runtime.pipelabWrapper.SteamCall("achievement", "activate", id)
		} else if (this.Export === "html" || this.Export === "preview") {
			await this.runtime.newgrounds.Get_Medal(id)
		}
	}

	async Steam_Achieve_Clear(id) {
		if (this.ExportIsScirra()) {
			await this.runtime.steamworks.Achieve_Clear(id)
		} else if (this.ExportIsPipelab()) {
			await this.runtime.pipelabWrapper.SteamCall("achievement", "clear", id)
		}
	}

	async Steam_Achieve_ClearAll() {
		try {
			// Fetch the JSON data and await its resolution
			const response = await fetch("achieve.json")
			const data = await response.json()

			// Extract achievements from the JSON data
			const achievements = data.achieve

			console.log("achievements", achievements)

			// Iterate over the achievements and clear each one
			for (let i = 0; i < achievements.length; i++) {
				await this.Steam_Achieve_Clear(achievements[i])
			}
		} catch (error) {
			console.error("Error fetching or processing JSON:", error)
		}
	}
	//let filesArr = await this.ListAllContentFiles("<web-resource>", "")

	ExportIsScirra() {
		return this.Export === "webview2" || this.Export === "linux"
	}

	async GetExportInsights() {
		if (this.Export === "pipelab") {
			this.runtime.isSteamDeck = await this.runtime.pipelab.SteamCall("utils", "isSteamRunningOnSteamDeck")
		}
	}

	async GetAppFiles() {
		console.error("GetAppFiles - " + this.Export.toUpperCase())

		//*WEBVIEW2 / LINUX
		if (this.ExportIsScirra()) {
			//window.alert("Reading Files from Webview2 / Linux")

			await this.runtime.filesystemWrapper.waitForInit()

			let filesArr = await this.runtime.filesystemWrapper.ListContent("<app>", "www")
			filesArr = filesArr.map((a) => a.replace("www/", ""))
			this.appFiles = filesArr
		}

		//* ELECTRON
		else if (this.Export === "pipelab") {
			await this.runtime.pipelabWrapper.Init_Pipelab()

			const filesPath = this.runtime.pipelab._AppFolder() + "/src/app"
			let filesArr = await this.runtime.pipelab.ListFiles(filesPath)
			filesArr = filesArr
				.map((path) => path.replace(/\\/g, "/")) // Normalize slashes
				.filter((path) => path.includes("src/app/")) // Filter paths containing 'src/app/'
				.map((path) => {
					// Extract substring starting after 'src/app/'
					const index = path.indexOf("src/app/")
					return path.substring(index + 8) // Skip 'src/app/' (8 characters)
				})
			this.appFiles = filesArr
		}

		//*NWJS
		else if (this.Export === "nwjs") {
			let filesArr = await this.runtime.nwjsWrapper.ListContent(this.runtime.nwjsWrapper.AppFolder())
			this.appFiles = filesArr
		}

		//*HTML WEB
		else if (this.Export === "html") {
			console.error("💚 Loading files.json for HTML export")
			try {
				let response = await fetch("files.json") // Wait for the fetch to complete

				if (!response.ok) {
					throw new Error("Failed to load files.json")
				}

				this.appFiles = await response.json() // Wait for JSON parsing
				console.log("Files loaded:", this.appFiles)
			} catch (error) {
				console.error("Error loading files.json:", error)
			}
		}

		//*PREVIEW
		else {
			this.appFiles = Array.from(this.assetManager._fileMap.keys())
			this.appFiles = this.appFiles.map((key) => key.replace("https://preview.construct.net/", ""))

			//await this.runtime.pipelabWrapper.Init_Pipelab()
		}

		this.runtime.dataManager.appFiles = this.appFiles
		this.runtime.appFiles = this.appFiles
		console.error("this.appFiles", this.appFiles)

		await this.GetExportInsights()
	}

	OpenWindow(url) {
		if (this.Export === "pipelab") {
			window.open(url, "_blank")
		} else {
			window.open(url, "_blank")
		}
	}

	MaybeSteamdeck() {
		return this.runtime.isSteamDeck || this.Export === "linux"
	}

	async Set_Fullscreen(bool) {
		if (this.MaybeSteamdeck()) {
			return
		} else if (this.Export === "pipelab") {
			if (bool) {
				this.runtime.pipelab._SetFullscreen(1)
				//pipelab._Maximize()
			} else {
				this.runtime.pipelab._SetFullscreen(0)
				//pipelab._Restore()
			}
		} else {
			if (bool) {
				this.Brower_RequestFullScreen()
			} else {
				this.Brower_CancelFullScreen()
			}
		}
	}

	Brower_IsFullScreen() {
		const ace = C3.Plugins.Browser.Cnds.IsFullscreen.bind(this.browserInst)
		return ace()
	}

	Brower_RequestFullScreen() {
		const ace = C3.Plugins.Browser.Acts.RequestFullScreen.bind(this.browserInst)
		//Arg0 : 3 = Letterbox Scale
		ace(3, 0)
	}

	Brower_CancelFullScreen() {
		const ace = C3.Plugins.Browser.Acts.CancelFullScreen.bind(this.browserInst)
		ace()
	}

	Set_Scalemode(mode) {
		//letterbox-scale scale-outer
		const canvasManager = sdk_runtime._canvasManager
		canvasManager._fullscreenMode = mode
		canvasManager.SetSize(canvasManager._windowInnerWidth, canvasManager._windowInnerHeight, true)
	}
}
