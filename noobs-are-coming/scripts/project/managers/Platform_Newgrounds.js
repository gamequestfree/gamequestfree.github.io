// Set up the options for NGIO.
const options = {
	// This should match the version number in your Newgrounds App Settings page
	version: "1.0.0",

	// If you aren't using any of these features, set them to false, or delete the line
	checkHostLicense: true,
	autoLogNewView: true,
	preloadMedals: true,
	preloadScoreBoards: true,
	preloadSaveSlots: true,
	debugMode: true,
}

const appID = "59870:2ONhASg7"
const appKey = "6tUNyT0dESNpoQ1a5ZCWFQ=="

export class Platform_Newgrounds {
	constructor(runtime) {
		this.runtime = runtime
		this.NG_Init()
	}

	async NG_Init() {
		if (this.runtime.platforms.Export !== "html" && this.runtime.platforms.Export !== "preview") {
			return
		}

		this.init = false

		const ngScript = document.createElement("script")
		ngScript.src = "cdn/gh/PsychoGoldfishNG/NewgroundsIO-JS@8c72515/dist/NewgroundsIO.min.js"
		ngScript.onload = () => {
			NGIO.init(appID, appKey, options)
			console.log("NewgroundsIO initialized", NGIO)
		}
		document.body.appendChild(ngScript)

		const response = await fetch("NG_medals.json")
		const data = await response.json()

		// Extract achievements from the JSON data
		const dataArray = data

		this.medalsMap = new Map()
		for (const medal of dataArray) {
			this.medalsMap.set(medal.steamID, medal.id)
		}

		console.error("🆖 Medal Map", this.medalsMap)
	}

	Get_Medal(medal_id) {
		const ng_medal_id = this.medalsMap.get(medal_id)

		NGIO.unlockMedal(ng_medal_id)
		console.log("🆖🏅 Medal unlocked:", medal_id)
		console.log("🆖 The user's total medal score is: " + NGIO.medalScore)
	}
}
