export class Main_Manager {
	constructor(runtime) {
		this.runtime = runtime

		this.runtime.timeScale_game = 1

		this.isWip = false

		this.isDemo = null

		this.runtime.addEventListener("beforeanylayoutend", () => this.BeforeAnyLayoutEnd())

		this.runtime.events.addEventListener("OnGameTick", () => {
			this.OnGameTick()
		})

		this.DamagesMap = new Map()

		this.toggleHUD = true

		this.unlockAll = false

		this.canUnlockAchievements = true
	}

	get version() {
		//* Demo
		if (this.isDemo) return "0.0.35.2"

		//*Beta
		return "0.1.17.2"
	}

	Hide_StartMenu() {
		this.runtime.platforms.Set_Fullscreen(true)
		this.runtime.progress.SetSetting("Volume_Music", 0)
		this.runtime.menu.bottomLeft.style.display = "none"
		this.runtime.menu.nameToMenu.get("titleScreen").style.display = "none"
	}

	Toggle_HUD() {
		//invert boolean
		this.toggleHUD = !this.toggleHUD

		const isPreview = this.runtime.platforms.Export === "preview"

		if (this.toggleHUD) {
			this.runtime.progress.SetSetting("Volume_Music", this.prevVolumeSetting)
			this.runtime.menu.watermark.style.display = "flex"
		} else {
			this.prevVolumeSetting = this.runtime.progress.GetSetting("Volume_Music")
			this.runtime.progress.SetSetting("Volume_Music", 0)
			this.runtime.menu.watermark.style.display = "none"

			this.CheatBtnPressed(false)
		}

		if (this.runtime.layout.name === "GAME") {
			this.runtime.layout.getLayer("HUD").isVisible = this.runtime.main.toggleHUD
			this.runtime.layout.getLayer("HUD_HTML").isVisible = this.runtime.main.toggleHUD
		}

		if (isPreview) {
			this.runtime.menu.watermark.innerText = ""
			this.runtime.platforms.Set_Fullscreen(true)
			this.runtime.layout.getLayer("Debug").isVisible = this.runtime.main.toggleHUD

			this.runtime.menu.cheatButton.style.display = "none"
			this.runtime.main.ToggleCheats(true)

			this.runtime.main.isPreviewFilming = this.runtime.main.toggleHUD

			for (const player of runtime.playersEnabled) {
				if (!player.unit) continue
				player.unit.AddItemByName("U_Invulnerable", 5)

				player.unit.healthComp.SetCurrentToMax()
				player.unit.healthBar.isVisible = false

				if (!this.runtime.singlePlayer && !player.isPlayer0) {
					player.unit.forceAbis = true
					player.unit.SetAbis({
						Flee: {
							Type: "Move_KeepDistance",
							Flee_KeepDist: Utils.random(30, 150),
							Flee_Margin: 30,

							CanBeInterrupted: false,

							TargetOverride: ["Player0"],
						},
					})

					player.unit.timerComp.Timer_Start_Repeat("FleeChangeDist", "0.5-1", () => {
						const abi = player.unit.brainComp.GetAbi("Flee")
						abi.Flee_KeepDist = Utils.random(30, 150)
					})

					console.error("Braincomp", player.playerIndex, player.unit.brainComp)
				}
			}
		}
	}

	Set_Timescale(scale, onlySingle = true) {
		if (this.runtime.singlePlayer) {
			this.runtime.timeScale_game = scale
			this.runtime.timeScale = scale
		}
	}

	BeforeAnyLayoutEnd() {
		this.DamagesMap.clear()
	}

	OnGameTick() {
		for (const Damage of this.DamagesMap.values()) {
			Damage.DamageTick()
		}
	}

	IsPreview() {
		return this.runtime.platforms.Export === "preview"
	}

	IsDev() {
		//return false
		if (this.isDemo) return false
		if (this.runtime.platforms.Export === "preview") {
			return true
		}
		return false
	}

	IsUnlockAll() {
		//return false
		if (this.isDemo) return false
		/*if (this.runtime.platforms.Export === "preview") {
			return true
		}*/
		return this.unlockAll

		//! only while start of betatest

		return false
	}

	CheatBtnPressed(forceMode = null) {
		const runtime = this.runtime

		if (forceMode === null) {
			if (runtime.menu.cheatButton.style.display === "none") forceMode = true
			else forceMode = false
		}

		if (forceMode === true) {
			runtime.menu.cheatButton.style.display = "flex"

			if (runtime.platforms.Export === "preview") {
				runtime.main.ToggleCheats(true)
				runtime.player.shop.Shop_Fill_Items()
			}
		} else {
			runtime.menu.cheatButton.style.display = "none"
			runtime.main.ToggleCheats(false)
		}
	}

	ToggleCheats(bool = null) {
		if (bool === null) {
			bool = !this.runtime.player.shop.cheatShop
		}

		const cheatButton = this.runtime.menu.cheatButton
		const cheatButtonInput = cheatButton.querySelector(".toggle-checkbox")
		if (cheatButtonInput) {
			if (cheatButtonInput.checked !== bool) {
				cheatButtonInput.checked = bool
			}
		}

		this.runtime.isCheating = bool
		this.runtime.globalVars.isCheating = bool
		for (const player of this.runtime.players) {
			player.shop.cheatShop = bool
			//player.invincibleCheat = bool
			/*
			if (player.unit) {
				if (bool) {
					player.unit.healthComp.SetCurrentToMax(9000)
					//player.AddCoins(10000)
				} else {
					const maxHPStat = player.stats.GetStatValue("HP_Max")
					player.unit.healthComp.SetCurrentToMax(maxHPStat)
					//player.AddCoins(-10000)
				}
			}*/

			player.UpdateCoins()
		}
		//window.alert("cheatShop " + this.runtime.player.shop.cheatShop)
	}

	Get_Pseudo() {
		let keyPseudo = "Pseudo_" + (Utils.randomInt(16) + 1).toString().padStart(3, "0")
		let pseudo = this.runtime.translation.Get(keyPseudo)

		const twitchNames = [...this.runtime.twitch.twitchNames]

		if (this.runtime.twitch.IsTwitchOn() && twitchNames.length > 0) {
			let index = 1
			while (twitchNames.length < 10) {
				let keyPseudo = "Pseudo_" + index.toString().padStart(3, "0")
				let addPseudo = this.runtime.translation.Get(keyPseudo)
				twitchNames.push(addPseudo)
				index++
			}
			console.log("twitchNames", twitchNames)
			const rand = Utils.Array_Random(twitchNames)
			pseudo = rand
		}
		return pseudo
	}

	GetSharedStat_Sum(statName, base = 1) {
		let value = 1
		if (base === 1) {
			for (const player of this.runtime.players) {
				if (!player.enabled) continue
				value *= player.stats.GetStatValue(statName)
			}
		}
		if (base === 0) {
			value = 0
			for (const player of this.runtime.players) {
				if (!player.enabled) continue
				value += player.stats.GetStatValue(statName)
			}
		}
		return value
	}

	Update_SharedStat_Average() {
		for (const statName of Object.keys(this.runtime.dataManager.stats_Average)) {
			this.runtime.dataManager.stats_Average[statName] = this.GetSharedStat_Average(statName)
		}

		console.error("Update_SharedStat_Average", this.runtime.dataManager.stats_Average)
	}

	GetSharedStat_Average(statName) {
		let value = 0

		let count = 0
		for (const player of this.runtime.players) {
			if (!player.enabled) continue
			count++
			value += player.stats.GetStatValue(statName)
		}

		return value / count
	}

	GetSharedStat_Average_Cache(statName) {
		return this.runtime.dataManager.stats_Average[statName]
	}

	DebugOverlay(text) {
		//TODO Save Found
		//
	}
}
