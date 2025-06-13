export class Platform_Pipelab {
	constructor(runtime) {
		this.runtime = runtime

		this.runtime.pipelab = this.runtime.objects["Pipelab"].getFirstInstance()
		this.pipelab = this.runtime.pipelab

		this.showingDevTools = false

		console.error("pipelab", this.pipelab)

		this.pipelab.IsAvailable = () => this.IsAvailable()
		this.pipelab.SteamCall = (namespace, method, args) => this.SteamCall(namespace, method, args)
		this.pipelab.ListFiles = (path, recursive) => this.ListFiles(path, recursive)

		globalThis.SteamCall = (namespace, method, args) => this.SteamCall(namespace, method, args)

		document.addEventListener("keydown", (event) => {
			// Use arrow function
			if (event.code === "Numpad8") {
				this.ShowDevTools()
			}
		})
	}

	async Discord_RichPresence(details = "", state = "") {
		const startTimestamp = Math.floor(Date.now() / 1000).toString() // Current timestamp in seconds
		const largeImgKey = "steam_icon_discord"

		try {
			await this.pipelab._DiscordSetActivity(
				"You are the Final Boss",
				"(Steam Roguelike)",
				"",
				"steam_icon_discord",
				"Noobs Are Coming", // largeImageText
				"none", // smallImageKey
				"Noobs Are Coming", // smallImageText
				"" // tag or party ID
			)
			console.error("Discord Rich Presence set successfully")
		} catch (error) {
			console.error("Failed to set Discord Rich Presence:", error)
		}
	}

	async Init_Pipelab() {
		this.runtime.pipelabPromise = this.pipelab._Initialize() // Start initialization

		await this.runtime.pipelabPromise

		const steamName = await this.SteamCall("localplayer", "getName")

		this.runtime.special.Check_Username(steamName)

		this.runtime.platforms.steamLanguage = await this.SteamCall("apps", "currentGameLanguage")

		this.Discord_RichPresence()
	}

	async ListFiles(path, recursive = true) {
		await this.pipelab._ListFiles(path, recursive)
		return this.pipelab._ListFilesResultValue.map((file) => file.path)
	}

	AppDataFolder() {
		///return this.pipelab._AppDataFolder().replace(/\\/g, "/")
		return this.pipelab._LocalAppDataFolder().replace(/\\/g, "/")
	}

	IsAvailable() {
		return this.pipelab && this.pipelab._isInitialized && this.pipelab.ws?.isConnected
	}

	ShowDevTools() {
		if (!this.IsAvailable()) return
		this.showingDevTools = !this.showingDevTools
		if (this.showingDevTools) {
			this.pipelab._ShowDevTools(1)
		} else {
			this.pipelab._ShowDevTools(0)
		}
	}

	async SteamCall(namespace, method, args = [""]) {
		if (!this.runtime.pipelabPromise) {
			return null
		}
		await this.runtime.pipelabPromise

		try {
			// Access the WebSocket instance
			const ws = globalThis.pipelab.ws

			// Ensure args is always an array
			if (!Array.isArray(args)) {
				args = [args] // Wrap single value in an array
			}

			// Send the request and wait for the response
			const result = await ws.sendAndWaitForResponse({
				url: "/steam/raw",
				body: {
					namespace, // Pass the namespace dynamically
					method, // Pass the method dynamically
					args, // Pass the arguments dynamically
				},
			})

			console.log(namespace, method, args, result)

			// Return the 'data' field from the response body
			return result?.body?.data
		} catch (error) {
			console.error("SteamCall error:", error)
			return null
		}
	}
}
