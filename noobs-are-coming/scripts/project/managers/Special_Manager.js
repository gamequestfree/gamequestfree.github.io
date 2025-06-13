export class Special_Manager {
	constructor(runtime) {
		this.runtime = runtime

		this.identity = ""
	}

	Check_Username(username) {
		if (typeof username === "string") {
			username = username.toLowerCase()
		}

		console.error("💫 Check_Username", username)

		if (username === "mynthos" || username === "overboygames" || username === "overboy") {
			console.error("💤 Set Identity StreamerFR", username)
			this.Set_Indentity_StreamerFR()
		}
	}

	Set_Indentity_StreamerFR() {
		this.identity = "StreamerFR"

		this.runtime.hero.forceNextHeroes = ["Mynthos", "JDG", "MV", "Bob", "Lundi_Antoine"]
	}
}
