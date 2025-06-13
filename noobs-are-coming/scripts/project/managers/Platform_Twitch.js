//3q6rwwtrsnka70r57mzwcbbxwmhsmz
//runtime.twitch.openTwitchAuthPopup()

export class Platform_Twitch {
	constructor(runtime) {
		this.runtime = runtime
		this.clientId = "3q6rwwtrsnka70r57mzwcbbxwmhsmz" // 🔹 Twitch Developer Client ID
		this.redirectUri = "https://overboydev.github.io/noobs-utils/twitch-redirect-web" // 🔹 Works for both Web & Electron
		this.scopes = "chat:read" // 🔹 Allows reading Twitch chat messages

		this.token = null
		this.channelName = null
		this.username = null
		this.socket = null

		this.status = "Off"
		this.buttons = new Set()

		this.msgWasCast = false

		this.twitchMessages = []
		this.twitchNames = new Set()

		this.InitTwitch()
	}

	SupportsTwitch() {
		const supportedPlatforms = ["pipelab", "html", "preview"]
		if (supportedPlatforms.includes(this.runtime.platforms.Export)) {
			return true
		}
		return false
	}

	InitTwitch() {
		if (!this.SupportsTwitch()) return

		// 🔹 Load stored token on game start
		this.loadToken()

		// 🔹 Listen for messages from Twitch popup
		window.addEventListener(
			"message",
			(event) => {
				if (event.data.type === "TwitchAuth" && event.data.token) {
					console.log("✅ Received Twitch Token from Popup:", event.data.token)
					localStorage.setItem("twitch_token", event.data.token)
					this.token = event.data.token
					this.fetchStreamerUsername(this.token).then((username) => {
						if (username) {
							localStorage.setItem("twitch_username", username)
							this.channelName = username
							this.username = username
							console.log("✅ Logged in as:", username)
							this.connectToChat()
						}
					})
				}
			},
			{ once: true }
		)
		if (this.runtime.platforms.Export === "pipelab") {
			this.InitTwitchElectron()
		}
	}

	async InitTwitchElectron() {
		this.redirectUri = "https://overboydev.github.io/noobs-utils/twitch-redirect-electron"

		// Listen for the token from the main process
		window.electronAPI.handle("TwitchTokenReceived", async (token) => {
			console.log("Received token in renderer:", token)
			localStorage.setItem("twitch_token", token)
			this.token = token

			try {
				// 🔸 Fetch the Twitch username using the newly received token
				const username = await this.fetchStreamerUsername(this.token)
				if (username) {
					this.username = username
					this.channelName = username
					localStorage.setItem("twitch_username", username)
					console.log("✅ Logged in as:", username)

					// Now we have both token + channelName, so connect to chat
					this.connectToChat()
				} else {
					console.error("❌ Failed to fetch username. Invalid token?")
				}
			} catch (err) {
				console.error("❌ Error fetching username:", err)
			}
		})

		console.log("Twitch Electron Initialized")
	}

	getAuthUrl(redirectUrl = "") {
		if (!redirectUrl) redirectUrl = this.redirectUri
		return `https://id.twitch.tv/oauth2/authorize?client_id=${this.clientId}&redirect_uri=${redirectUrl}&response_type=token&scope=${this.scopes}`
	}

	/** 🔹 Open Twitch Login Popup */
	openTwitchAuthPopup() {
		console.log("🔄 Opening Twitch login popup...")

		let authUrl = this.getAuthUrl()

		//Open Popup
		if (this.runtime.platforms.Export === "pipelab") {
			window.open(authUrl, "_blank")
			//window.electronAPI.openExternal(authUrl);
		} else {
			const loginPopup = window.open(authUrl, "TwitchLogin", "width=500,height=600")

			if (!loginPopup) {
				alert("Popup blocked! Please allow popups for Twitch login.")
				return
			}

			// Monitor the popup until login completes
			const checkPopup = setInterval(() => {
				if (loginPopup.closed) {
					console.log("🔄 Twitch login popup closed. Checking for token...")
					this.loadToken()
					clearInterval(checkPopup)
				}
			}, 1000)
		}
	}

	/** 🔹 Load Stored OAuth Token (Auto-Login on Game Start) */
	async loadToken() {
		this.token = localStorage.getItem("twitch_token")

		if (this.token) {
			console.log("✅ Found stored Twitch token:", this.token)

			// 🔹 Fetch streamer's username using the token
			this.username = await this.fetchStreamerUsername(this.token)
			if (this.username) {
				this.runtime.special.Check_Username(this.username)

				this.channelName = this.username
				localStorage.setItem("twitch_username", this.username)
				console.log(`✅ Auto-reconnecting as ${this.username}`)
				this.connectToChat()
			} else {
				console.error("❌ Invalid token. Clearing stored data.")
				this.logout()
			}
		} else {
			console.log("⚠ No Twitch token found. Streamer must log in.")
		}
	}

	/** 🔹 Extract & Send Token from Twitch Popup to Main Game */
	static extractTokenFromUrl() {
		console.log("🔄 Checking URL for Twitch token...")

		const params = new URLSearchParams(window.location.hash.substring(1))
		const token = params.get("access_token")

		if (token) {
			console.log("✅ Twitch Token Found:", token)

			// Send the token back to the main game (opener)
			if (window.opener) {
				window.opener.postMessage({ type: "TwitchAuth", token: token }, "*")
				console.log("🔄 Sent token back to main game.")
				window.close() // Close popup after sending
			} else {
				console.error("❌ No opener window found. Storing in localStorage instead.")
				localStorage.setItem("twitch_token", token)
			}
		} else {
			console.error("❌ No Twitch token found in URL.")
		}
	}

	/** 🔹 Fetch Streamer's Username from Twitch API */
	async fetchStreamerUsername(token) {
		try {
			const response = await fetch("https://api.twitch.tv/helix/users", {
				headers: {
					Authorization: `Bearer ${token}`,
					"Client-ID": this.clientId,
				},
			})

			const data = await response.json()
			return data?.data?.[0]?.login || null
		} catch (error) {
			console.error("❌ Failed to fetch Twitch username:", error)
			return null
		}
	}

	/** 🔹 Connect to Twitch Chat */
	connectToChat() {
		if (this.socket && this.socket.readyState === WebSocket.OPEN) {
			console.log("Already connected to Twitch Chat. Skipping re-connect.")
			return
		}

		if (!this.token || !this.channelName) {
			console.error("❌ Cannot connect to Twitch chat. No token or channel name.")
			return
		}

		this.socket = new WebSocket("wss://irc-ws.chat.twitch.tv")

		this.socket.onopen = () => {
			console.log("✅ Connected to Twitch Chat!")
			this.socket.send(`PASS oauth:${this.token}`)
			this.socket.send(`NICK ${this.username}`)
			this.socket.send(`JOIN #${this.channelName}`)
			this.SetStatus("On")
		}

		this.socket.onmessage = (event) => this.handleMessageEvent(event)
		this.socket.onerror = (error) => console.error("⚠ WebSocket Error:", error)
		this.socket.onclose = () => {
			console.log("⚠ Connection closed. Reconnecting in 5 seconds...")
			this.SetStatus("Loading")
			setTimeout(() => this.connectToChat(), 5000)
		}
	}

	/** 🔹 Handle Incoming Twitch Chat Messages */
	handleMessageEvent(event) {
		// The raw IRC messages come in event.data (often multiple lines at once)
		const rawData = event.data

		// Split by line breaks since Twitch can send multiple IRC lines in one "message" event
		const lines = rawData.split("\r\n")
		for (const line of lines) {
			if (!line) continue // Skip empty lines
			this.parseIrcMessage(line)
		}
	}

	parseIrcMessage(line) {
		// The lines you don't care about (like PING/PONG or JOIN/PART notices) won't match.
		const match = line.match(/:(\w+)!.* PRIVMSG #\w+ :(.*)/)
		if (match) {
			const username = match[1]
			const message = match[2]

			// You can dispatch this to your game logic or other event handlers
			this.OnTwitchMessage(username, message)

			// Example: if user says "!jump", trigger a function
			if (message.toLowerCase() === "!jump") {
				this.runtime.callFunction("PlayerJump")
			}
		}

		// If you want to handle PING from Twitch (to keep connection alive):
		if (line.startsWith("PING")) {
			// Respond with PONG
			this.socket.send("PONG :tmi.twitch.tv")
		}
	}

	OnTwitchMessage(username, message) {
		this.twitchNames.add(username)

		console.log(`[💬 ${username}]: ${message}`)
		this.twitchMessages.push({
			username: username,
			message: message,
		})
		this.Bark_Twitch(message)
	}

	Bark_Twitch(message) {
		const enemies = this.runtime.units.GetUnitsByTags("Noob", "Chara")
		let hasBark = false
		while (!hasBark && enemies.length > 0) {
			const enemy = Utils.Array_Random(enemies)
			hasBark = enemy.Bark_Specific(message)
			enemies.splice(enemies.indexOf(enemy), 1)
		}

		if (hasBark) this.runtime.twitch.msgWasCast = true
	}

	SetStatus(status = "") {
		this.status = status

		for (const button of this.buttons) {
			const statusElem = button.querySelector("#twitchStatus")
			statusElem.style.marginLeft = Utils.px(2)
			statusElem.style.color = "white"
			//button.innerHTML = ` (${status})`
			if (status == "On") {
				statusElem.innerText = ` (On)`
				statusElem.style.color = "#00FF00"
			}
			if (status == "Off") {
				statusElem.innerText = ` (Off)`
			}
			if (status == "Loading") {
				statusElem.innerText = ` (Load)`
				statusElem.style.color = "#00FF00"
			}
		}
	}

	Button_Add(elem) {
		const div = document.createElement("div")
		div.id = "twitchStatus"

		//const label = elem.querySelector("#buttonLabel")

		elem.appendChild(div)

		this.buttons.add(elem)

		this.SetStatus(this.status)
	}

	Button_Press(elem) {
		if (this.status == "On") {
			this.logout()
		} else {
			this.openTwitchAuthPopup()
		}
	}

	IsTwitchOn() {
		return this.socket && this.socket.readyState === WebSocket.OPEN
	}

	/** 🔹 Logout (Clear Token & Disconnect) */
	logout() {
		//localStorage.removeItem("twitch_token")
		//localStorage.removeItem("twitch_username")
		this.token = null
		this.channelName = null
		this.username = null

		if (this.socket) {
			this.socket.onclose = () => {}
			this.socket.close()
		}

		this.SetStatus("Off")

		console.log("❌ Logged out of Twitch.")
	}
}
