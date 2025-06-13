import { Tooltip } from "../inventory/Tooltip.js"

//#region CONST

const settings_game = {
	Mouse_Only: false,
	Manual_Aim: "No",
	HPBar_Player: true,
	Keep_Items_Locked: true,
	Coop_LockCam: false,
	Coop_ShareLoot: true,
}

const settings_video = {
	Language: "en",
	Screenshake: true,
	Fullscreen: false,
	Visual_Effects: true,
	Damage_Display: true,
	Optimize_End_Waves: false,
}

const settings_sound = {
	Volume_Master: 50,
	Volume_Sound: 100,
	Volume_Music: 90,
	Mute_OnFocusLost: false,
	Pause_OnFoucsLost: true,
}

const settings_access = {
	Enemy_HP: 1,
	Enemy_Damage: 1,
	Enemy_Speed: 1,
	Opacity_Explosions: 1,
	Opacity_Projectiles: 1,
	Font_Size: 1,
	Highlight_Characters: false,
	Highlight_Weapons: false,
	Highlight_Projectiles: false,
	Screen_Darkening: true,
	Retry_Failed_Waves: false,
}

const settings_ideas = {
	alt_gold_sounds: false,
	background: 0,
	deactivated_dlcs: [],
	limit_fps: false,
	streamer_mode_tracks: true,
	endless_score_storing: 0,
}

const totalValues = {
	Wins: 0,
	Deaths: 0,
	Kills: 0,
	Damages: 0,
	Crits: 0,
	Souls: 0,
	Units_Mined: 0,

	Wins_Diff1: 0,
	Wins_Diff2: 0,
	Wins_Diff3: 0,
	Wins_Diff4: 0,
	Wins_Diff5: 0,

	Wins_Coop: 0,
	Deaths_Coop: 0,
}

let settings = {
	Mode_Coop: false,
	Mode_Endless: false,
	Zone_Selected: "OVERMOBS",

	RewardAsIcon: false,
}

let completedAchievements_Test = ["Final Boss", "ReachStat_HP_Max 2"]

let charaData_Test = {
	Mergoboy: [["U_Chara_Adept", "U_Chara_Skull"]],

	OVERMOBS: {
		U_Chara_Bigfoot: {
			regular: {
				single: {
					Diff: "1",
					Version: "0.0.0.1",
				},
			},
		},
		U_Chara_Adept: {
			regular: {
				single: {
					Diff: "5",
					Version: "0.0.0.1",
				},
			},
			endless: {
				single: {
					Diff0: {
						WaveReached: 23,
					},
					Diff1: {
						WaveReached: 45,
					},
				},
				coop: {
					Diff4: {
						WaveReached: 68,
						Roaster: ["chara1", "chara2", "chara3"],
					},
					Diff5: {
						WaveReached: 52,
						Roaster: ["chara1", "chara2", "chara3"],
					},
				},
			},
		},
		U_Chara_Skull: {
			regular: {
				single: {
					Diff: "1",
					Version: "0.0.0.1",
				},
			},
		},
	},
}

let currentRun_Test = {}

let currentRun_example = {
	step: "wave", // wave, shopStats, shop
	zone: "Test",
	wave: 10,
	DLCS: ["abyssal_terrors"],
	isCoop: true,
	isEndless: true,
	runTweaks: {},
	playersData: [
		{
			character: "",
			inv_items: [],
			inv_weps: [],
			inv_invisible: [],
			HP: 10,
			Level: 3,
			XP: 0,
			effectData: [],
		},
	],
}

let charaRecords_example = {
	zone1: {
		regular: {
			single: {
				Diff: 0,
				Version: 0,
				DLC: ["dlc1", "dlc2"],
			},
			coop: {
				Diff: 0,
				Roaster: ["chara1", "chara2", "chara3"],
			},
			single_tweaks: {
				Diff: 0,
				Tweaks: {
					Enemy_HP_Lowest: 1,
					Enemy_Damage_Lowest: 1,
					Enemy_Speed_Lowest: 1,
					Retries: 0,
					Mods: ["mod1", "mod2"],
				},
			},
			coop_tweaks: {
				Diff: 0,
				Roaster: ["chara1", "chara2", "chara3"],
				Tweaks: {
					Enemy_HP: 1,
					Enemy_Damage: 1,
					Enemy_Speed: 1,
					Retries: 0,
					Mods: ["mod1", "mod2"],
				},
			},
		},
		endless: {
			single: {
				Diff0: {
					WaveReached: -1,
				},
				Diff1: {
					WaveReached: -1,
				},
			},
			coop: {
				Diff0: {
					WaveReached: -1,
					Roaster: ["chara1", "chara2", "chara3"],
				},
				Diff1: {
					WaveReached: -1,
					Roaster: ["chara1", "chara2", "chara3"],
				},
			},
			single_tweaks: {
				Diff0: {
					WaveReached: -1,
				},
				Diff1: {
					WaveReached: -1,
				},
			},
			coop_tweaks: {
				Diff0: {
					WaveReached: -1,
					Roaster: ["chara1", "chara2", "chara3"],
					Tweaks: {
						Enemy_HP: 1,
						Enemy_Damage: 1,
						Enemy_Speed: 1,
						Retries: 0,
						Mods: ["mod1", "mod2"],
					},
				},
				Diff1: {
					WaveReached: -1,
					Roaster: ["chara1", "chara2", "chara3"],
				},
			},
		},
	},
}

const runTweaks = {
	Enemy_HP: 1,
	Enemy_Damage: 1,
	Enemy_Speed: 1,
	Retries: 0,
	Mods: [],
}

//#endregion CONST

export class Progress {
	constructor(runtime) {
		this.runtime = runtime
		this.runtime.progress = this

		Object.assign(settings, settings_game, settings_video, settings_sound, settings_access)

		this.challenges = new Map()
		console.error("challenges", this.challenges)

		this.unlockableContent = new Set()

		this.chalDatas = []

		this.activeMissions = {}

		this.saveData = {}

		this.dataManager = runtime.dataManager

		this.settingLinks = {}

		this.completedAchievements = []

		this.lockedItemToChallenge = new Map()

		this.isSavingSettings = false

		this.newItemsUnlocked = []

		this.CreateMenu_Progress()
	}

	async SaveCurrentRun(step) {
		//!disabled for now

		return
		const currentRun = {
			version: this.runtime.main.version,
			step: step, // wave, shopStats, shop
			zone: this.runtime.waveManager.zoneName,
			wave: this.runtime.waveManager.waveCount,
			diff: this.runtime.dataManager.difficulty,
			isCoop: !this.runtime.singlePlayer,
			isEndless: this.runtime.settings.Mode_Endless,
			runTweaks: this.runTweaks,
			playersData: [],
		}

		for (const player of this.runtime.playersEnabled) {
			const playerData = player.GetSavePlayerData()
			currentRun.playersData.push(playerData)
		}
		this.saveData.currentRun = currentRun
		console.error("SaveCurrentGame", currentRun)
		await this.runtime.save.WriteSave()
	}

	RemoveCurrentRun() {
		delete this.saveData.currentRun
		this.runtime.save.WriteSave()
	}

	ResumeRun_Test() {
		const savedRun = this.saveData.currentRun
		if (!savedRun) return
		this.VerifySavedRun()
		if (!this.canLoadSavedRun) {
			window.alert("Failed to load saved run")
			return
		}
		const isCoop = savedRun.isCoop
		if (isCoop) {
			this.SetJoinPlayer(0)
		} else {
			this.ResumeRun()
		}
	}

	SetJoinPlayer(index) {
		const savedRun = this.saveData.currentRun
		if (!this.joinPrevGame_Screen) {
			this.joinPrevGame_Screen = this.runtime.menu.CreateMenuScreen("joinPrevGame_Screen", true)
		}
		if (this.runtime.menu.CurMenuName() !== "joinPrevGame_Screen") {
			this.runtime.menu.GoTo("joinPrevGame_Screen")
		}

		const player = this.runtime.players[index]
		const tempPlayer = this.tempPlayers[index]
		const playerData = savedRun.playersData[index]
		player.Reset()

		for (const item of tempPlayer.inv_items) {
			player.inventory.AddItem(item[0], item[1])
		}
		for (const item of tempPlayer.inv_weps) {
			player.inventoryWeps.AddItem(item[0], item[1])
		}

		this.joinPrevGame_Screen.innerHTML = /*html*/ `
        <div class="vertical justify_center h100 w100">
            <div id="PlayerName" class="" style="
                color: ${player.color_};
            ">
            </div>
            <div id="JoinInstruct" class="">
            </div>
            <div id="JoinProgress" class="">
            </div>
            <div id="PlayerInfos" class="vertical" style="
                color: ${player.colorDark_};
                border: ${Utils.px(2)} solid ${player.color_};
            ">
                <div id="" class="horizontal" style= "height:${Utils.px(200)};">
                    <div id="join_Items" class= "vertical flexGrow" style= "">
                    </div>
                    <div id="join_Weps" class= "vertical" style= "width:${Utils.px(100)};">
                    </div>
                </div>
                <div id="coinElem" class="justify_start" style="
                ">
                    Coins: 0
                </div>
            </div>
        </div>
        `

		const coinElem = this.joinPrevGame_Screen.querySelector("#coinElem")
		const coinValue = playerData.coins || 0
		player.SetCoinElem(coinElem, coinValue)

		const itemSection = this.joinPrevGame_Screen.querySelector("#join_Items")
		itemSection.appendChild(player.inventory.element)

		const weaponSection = this.joinPrevGame_Screen.querySelector("#join_Weps")
		weaponSection.appendChild(player.inventoryWeps.element)
	}

	ResumeRun() {
		this.LoadSavedRun()
		this.runtime.menu.ClearStack()
		this.runtime.goToLayout("GAME")
	}

	VerifySavedRun() {
		const savedRun = this.saveData.currentRun

		if (!savedRun || !savedRun.playersData) {
			this.canLoadSavedRun = false
			return
		}

		this.tempPlayers = []

		this.canLoadSavedRun = true

		this.failedItems = []

		const GetItemByName = (item) => {
			const nameEvo = Utils.GetNameEvo(item[0], item[1])
			const itemActual = this.runtime.dataInstances["Items"].get(nameEvo)
			if (!itemActual) this.failedItems.push(nameEvo)
			return itemActual
		}

		let i = -1
		for (const playerData of savedRun.playersData) {
			i++
			const tempPlayer = {
				inv_items: [],
				inv_weps: [],
				inv_invisible: [],
			}
			this.tempPlayers.push(tempPlayer)

			if (playerData.character) {
				const itemActual = GetItemByName([playerData.character, 0])
				tempPlayer.inv_items.push([itemActual, 1])
			}

			for (const item of playerData.inv_items) {
				const itemActual = GetItemByName(item)
				tempPlayer.inv_items.push([itemActual, item[2]])
			}
			for (const item of playerData.inv_weps) {
				const itemActual = GetItemByName(item)
				tempPlayer.inv_weps.push([itemActual, item[2]])
			}
			for (const item of playerData.inv_invisible) {
				const itemActual = GetItemByName(item)
				tempPlayer.inv_invisible.push([itemActual, item[2]])
			}
		}

		console.error("VerifySavedRun this.tempPlayers", this.tempPlayers)

		if (this.failedItems.length > 0) {
			console.error("Failed items", this.failedItems)
			this.canLoadSavedRun = false
		}
	}

	LoadSavedRun() {
		const savedRun = this.saveData.currentRun

		for (const player of this.runtime.players) {
			player.Reset()
		}

		const waveManager = this.runtime.waveManager
		this.SetSetting("Zone_Selected", savedRun.zone)
		waveManager.wave_enforce = savedRun.wave
		waveManager.wave_OnGameStart = savedRun.step === "Wave"
		waveManager.difficulty = savedRun.diff

		this.runTweaks = savedRun.runTweaks

		let i = -1
		for (const playerData of savedRun.playersData) {
			i++
			const player = this.runtime.players[i]
			player.loadingRunData = playerData
		}
	}

	async LoadSave() {
		let hadSave = false

		//! this.saveData is loaded from SaveSystem.js
		let loadingInfo = await this.runtime.save.LoadSave()

		if (loadingInfo) {
			/*
      if (loadingInfo.saveNotFound)
        window.alert(
          "The main save file was not found, but a backup was successfully loaded instead."
        );
      if (loadingInfo.corruption)
        window.alert(
          "One of the most recent save file was corrupted, but a backup was successfully loaded instead."
        );*/
			hadSave = true
		}

		//!! for now only disabled feature, but should be reimplement in SaveSystem.js
		this.VerifySave()

		//window.alert("LoadSave(), hadSave: " + hadSave)

		if (!hadSave) {
			this.CreateSave()
		}

		this.runtime.settings.Mouse_Only = false

		console.error("create settings", JSON.parse(JSON.stringify(this.runtime.settings)))
		console.error("Screenshake", this.runtime.settings.Screenshake)
		//window.alert("Volume_Music" + this.runtime.settings.Volume_Music)
		this.runtime.events.dispatchEventString("LoadSave")
		this.LoadSave_Achievements()
		this.runtime.menu.CreateSettings()

		//window.alert("Volume_Music after Create" + this.runtime.settings.Volume_Music)

		/*
		this.LoadSavedSettings()

		this.isSavingSettings = true*/
	}

	ResetSave_TotalValues() {
		this.saveData.totalValues = JSON.parse(JSON.stringify(totalValues))
	}

	CreateSave() {
		this.saveData = {}
		this.saveData.version = this.runtime.main.version
		this.saveData.date = new Date().toISOString()
		this.saveData.settings = JSON.parse(JSON.stringify(settings))

		this.saveData.completedAchievements = []
		//this.saveData.totalValues
		this.ResetSave_TotalValues()
		this.saveData.charaData = {}

		if (this.runtime.platforms.Export === "preview") {
			this.saveData.completedAchievements = JSON.parse(JSON.stringify(completedAchievements_Test))
			this.saveData.charaData = JSON.parse(JSON.stringify(charaData_Test))

			//this.saveData.settings.Language = "fr"
			//this.saveData.settings.Volume_Music = 0
		}

		//https://partner.steamgames.com/doc/store/localization/languages
		const supportedLanguages = [
			["english", "en"],
			["french", "fr"],
			["german", "de"],
			["spanish", "es"],
			["latam", "es"],
			["italian", "it"],
			["polish", "pl"],
			["portuguese", "pt"],
			["brazilian", "pt"],
			["russian", "ru"],
			["turkish", "tr"],
			["schinese", "zh"],
			["tchinese", "zh_TW"],
			["japanese", "ja"],
			["korean", "ko"],
		]

		let languageCode = "en"

		if (this.runtime.platforms.steamLanguage) {
			for (const [langKey, code] of supportedLanguages) {
				if (this.runtime.platforms.steamLanguage === langKey) {
					languageCode = code
					break
				}
			}
		}

		if (this.runtime.platforms.Export === "html") {
			let isoLangFull = (navigator.language || navigator.userLanguage).toLowerCase() // e.g., "zh-tw", "en-us"

			// Handle zh-specific cases
			if (isoLangFull.startsWith("zh")) {
				if (isoLangFull.includes("tw") || isoLangFull.includes("hk") || isoLangFull.includes("mo")) {
					languageCode = "zh_TW" // Traditional Chinese
				} else {
					languageCode = "zh" // Simplified Chinese
				}
			} else {
				// General match by ISO code
				const isoLang = isoLangFull.split("-")[0]
				for (const [, code] of supportedLanguages) {
					if (code === isoLang) {
						languageCode = code
						break
					}
				}
			}
		}

		this.saveData.settings.Language = languageCode

		//

		this.MapSave()
		this.runtime.save.WriteSave()
	}

	/*
	async WriteSave() {
		const saveData = JSON.stringify(this.saveData, null, 2)
		if (this.writingSave) {
			this.pendingSave = saveData
		} else {
			this.pendingSave = null
			this.writingSave = true

			await this.dataManager.WriteFile("<local-app-data>", SaveFolderName + "/save.json", saveData)

			if (this.pendingSave) {
				const newSave = this.pendingSave
				this.pendingSave = null
				await this.dataManager.WriteFile("<local-app-data>", SaveFolderName + "/save.json", newSave)
			}
			this.writingSave = false
		}
	}*/

	VerifySave() {
		this.VerifySavedRun()
		this.MapSave()
	}

	MapSave() {
		this.runtime.settings = this.saveData.settings
		this.completedAchievements = this.saveData.completedAchievements || []
		this.charaData = this.saveData.charaData || {}
	}

	//#region SETTING

	CallSettingFunction(key) {
		const methodName = "Setting_" + key
		const value = this.saveData.settings[key]

		if (methodName in this) {
			this[methodName](value)
		}
	}

	LoadSavedSettings() {
		for (const [key, value] of Object.entries(this.saveData.settings)) {
			const settingLinks = this.settingLinks[key]
			if (settingLinks) {
				for (const settingLink of settingLinks) {
					settingLink.updateValue(value)
				}
			}
		}
	}

	ResetSettings(category = "") {
		const toReset = {}
		if (category === "Gameplay") {
			Object.assign(toReset, settings_access, settings_game)
		} else if (category === "General") {
			Object.assign(toReset, settings_video, settings_sound)
			delete toReset.Language
		} else return
		for (const key in toReset) {
			const settingLinks = this.settingLinks[key]
			if (settingLinks) {
				for (const settingLink of settingLinks) {
					settingLink.updateValue(toReset[key])
				}
			}
		}
	}

	GetSetting(key) {
		//! useful for race condition
		const saveDataSettings = this.saveData.settings || {}
		let settingsValue = saveDataSettings[key]
		if (settingsValue === undefined) settingsValue = settings[key]
		return settingsValue
	}

	SetSetting(key, value) {
		if (this?.saveData?.settings?.[key] === undefined) {
			console.error("Setting key not found at that point:", key)
			return
		}

		this.saveData.settings[key] = value

		this.CallSettingFunction(key)

		this.runtime.save.WriteSave()

		//if (this.isSavingSettings) this.runtime.save.WriteSave()
	}

	async Setting_Fullscreen(bool) {
		await this.runtime.platforms.Set_Fullscreen(bool)
	}

	Setting_Volume_Master(param) {
		this.runtime.audio.SetVolume_Master(param)
	}

	Setting_Volume_Sound(param) {
		this.runtime.audio.SetVolume_Sound(param)
	}

	Setting_Volume_Music(param) {
		this.runtime.audio.SetVolume_Music(param)
	}

	Setting_Language(param) {
		this.runtime.translation.ChangeLang(param)
	}

	/*
	Setting_HPBar_Player(bool) {
		for (const player of this.runtime.players) {
			player.Option_HPBarCharacter(bool)
		}
	}*/

	Setting_Manual_Aim(param) {
		//No, Always, OnPress
		for (const player of this.runtime.players) {
			if (!player.unit) continue
			if (param === "No") {
				player.unit.manualAiming = false
			} else if (param === "Always") {
				player.unit.manualAiming = true
			}
		}
	}

	Setting_Zone_Selected(param) {
		const zonesData = this.runtime.loadedData["Zones"]
		const zoneData = zonesData.get(param)
		if (!zoneData) {
			param = Array.from(zonesData.keys())[0]
		}
		this.runtime.waveManager.LoadZone(param)
	}

	//#endregion SETTING

	//!Todo: recreate from Steam Achievements, find chal from reward

	AddChalData(chalData) {
		chalData._Rules.modLoading = this.runtime.dataManager.modLoading
		this.chalDatas.push(chalData)
	}

	LoadChalData() {
		for (let listData of this.chalDatas) {
			const rules = listData._Rules
			const defaultData = listData._Default

			if (!rules.UnlockPrefix) {
				rules.UnlockPrefix = []
			} else if (typeof rules.UnlockPrefix === "string") {
				rules.UnlockPrefix = [rules.UnlockPrefix]
			}
			rules.UnlockPrefix.unshift("") //insert in front of array

			console.error("unlockPrefix for", rules._Ruleset, ": ", rules.UnlockPrefix)

			if (rules._Ruleset === "Missions") {
				for (let [name, chalData] of Object.entries(listData)) {
					if (name === "_Rules") continue
					if (chalData.LockedBy) {
						continue
					}

					chalData.unlockPrefix = rules.UnlockPrefix
					chalData.img = rules.Img.replace("[name]", chalData.Img)

					if (chalData.Img_AnimObject) {
						chalData.img = this.runtime.dataManager.Get_AnimObjectUrl(chalData.Img_AnimObject)
					}

					chalData.modLoading = rules.modLoading

					const challenge = new Challenge(this.runtime, name, chalData)
				}
			} else if (rules.ItemType === "Playable" || rules.ItemType === "Chal_ATKs") {
				for (let [charaName, charaData] of Object.entries(listData)) {
					if (charaName.startsWith("_")) continue
					let unlockDataAll = charaData.Unlocks
					if (!unlockDataAll) continue
					if (charaData.LockedBy) {
						continue
					}

					if (typeof unlockDataAll === "string") unlockDataAll = { 0: unlockDataAll }

					if (rules.ItemType === "Playable") {
						for (let [winConditions, unlock] of Object.entries(unlockDataAll)) {
							//synthetically create a challenge
							const chalData = {
								Img: charaName,
								Missions: {
									Win: {
										Chara: charaName,
									},
								},
							}

							const split = winConditions.split("|")
							let difficulty = parseInt(split[0]) || 0
							let zone = split.length > 1 ? split[1] : null

							chalData.Missions.Win.Diff = difficulty
							if (zone) {
								chalData.Missions.Win.Zone = zone
							}

							chalData.Unlocks = unlock
							chalData.unlockPrefix = rules.UnlockPrefix

							const data = Utils.deepMerge(defaultData, charaData)
							if (data.Img_AnimObject) {
								data.Img_AnimObject = data.Img_AnimObject.replace("[name]", charaName).replace(/ /g, "_")
							}

							chalData.img = this.runtime.dataManager.Get_AnimObjectUrl(data.Img_AnimObject)

							/*
						if (charaName === "Bigfoot") {
							console.error("Challenge BigFoot", data, defaultData, charaData)
						}*/

							//!TODO: handle AnimObject for challenge

							chalData.modLoading = rules.modLoading

							let chalName = charaName
							if (difficulty === 5) {
								chalName += " " + 2
								chalData.Tier = 5
							}

							const challenge = new Challenge(this.runtime, chalName, chalData)
						}
					} else if (rules.ItemType === "Chal_ATKs") {
						const atkName = charaName
						const atkData = charaData

						const evoGroup = this.runtime.dataManager.evolutionMap[atkName]
						const atkItemInst = Utils.Obj_GetFirstValue(evoGroup)

						console.error("atkItemInst", atkName, evoGroup, atkItemInst)

						for (let [winConditions, unlock] of Object.entries(unlockDataAll)) {
							const chalData = {
								img: atkItemInst.img,
								Missions: {
									AtkWin: {
										ATK: atkName,
									},
								},
							}

							const split = winConditions.split("|")
							let difficulty = parseInt(split[0]) || 0
							let count = split.length > 1 ? split[1] : 1

							chalData.Missions.AtkWin.Diff = difficulty
							chalData.Missions.AtkWin.Count = 1
							chalData.Missions.AtkWin.WaveFirst = 3
							chalData.Missions.AtkWin.WaveLast = 20
							//chalData.Missions.AtkWin.AtkNameKey set up somewhere else

							chalData.Unlocks = unlock
							chalData.unlockPrefix = rules.UnlockPrefix

							chalData.modLoading = rules.modLoading

							let chalName = atkName
							if (difficulty === 5) {
								chalName += " " + 2
								chalData.Tier = 5
							}

							const challenge = new Challenge(this.runtime, chalName, chalData)
						}
					}
				}
			}
		}
	}

	InvertAllChallenges() {
		if (this.runtime.isCheating) {
			this.ResetSave_TotalValues()

			const chalArray = Array.from(this.challenges.values())
			for (const challenge of chalArray) {
				const bool = !challenge.completed
				challenge.SetCompleted(bool, false)
			}
		}
	}

	UnlockAllChallenges() {
		if (this.runtime.isCheating) {
			this.ResetSave_TotalValues()

			const chalArray = Array.from(this.challenges.values())
			for (const challenge of chalArray) {
				challenge.SetCompleted(true, false)
			}
		}
	}

	CreateMenu_Progress() {
		this.progressMenu = this.runtime.menu.CreateMenuScreen("progressMenu", true, false)

		/*background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);*/

		/*background: radial-gradient(ellipse at bottom, rgb(6 21 22) 0%, rgb(0 0 0) 100%);*/

		/* background: radial-gradient(ellipse at bottom, rgb(6 21 22) 0%, rgb(0 0 0) 100%);*/

		this.progressMenu.innerHTML = /*html*/ `
        <div id="" class="vertical justify_center items_center h100 w100" style="
           
           position: relative;
           
    
        ">
            ${
				/*
				<div class="absolute inset0 overflow_hidden pointer_none">
					<div
						class="dark jumbo absolute"
						style="
                    opacity: 0.5;
                    inset: ${Utils.px(-10)};
                    
                "
					></div>
				</div>
			*/ ""
			}

            <div class="vertical justify_center items_center h100 w100" style="
                z-index: 1;
            ">

                <div id="progress_Title" class="textOutline" style="
                    color: ${this.runtime.colorsText.Title};
                    font-weight: bold;
                    font-size: ${Utils.px(7)};
                    margin: ${Utils.px(2)};
                    padding: ${Utils.px(4)};
                    font-family: Arial, sans-serif;
                    background-color:rgba(0, 0, 0, 0.58);
                    border-radius: ${Utils.px(2)};
                ">
                </div>
                <div id="progress_Container" class="inlineFlex row items_start justify_center" style="
                    gap: ${Utils.px(10)};
                    height:${Utils.px(200)};
                    max-height:${Utils.px(200)};
                    margin-bottom: ${Utils.px(10)};
                ">
                    
                    <div id="progress_Achievements_Cadre" class="" style="
                            width:${Utils.px(350)};
                            max-height:${Utils.px(200)};
                            display: flex;
                            flex-direction: column;
                        ">

                         <div id="progress_Achievements_Scrollbar" class="simplebar_white" style="
                            flex: 1 1 auto; 
                        ">
                        
                            <div id="progress_Achievements" class="inventory_grid" style="
                                width:100%;
                            ">
                            </div>

                        </div>
                    </div>

                    <div id="progress_Infos" class="vertical items_center" style="
                        width:${Utils.px(100)};
                        gap:${Utils.px(2)};
                    ">
                        <div id="progress_achieve_Text">
                        </div>
                        <div id="progress_achieve_Container" class="s100">
                        </div>
                        <div id="progress_Reward_Text">
                        </div>
                        <div id="progress_Reward" class= "vertical w100" style= "height:${Utils.px(120)};">
                        </div>
                    </div>

                    <div id="end_Progress" class="column">

                    </div>
                
                
                </div>
                <div id="progress_Buttons" class="vertical" style="gap:${Utils.px(1)};">
                </div>
            </div>
            
        </div>
        `

		const progressBtns = this.runtime.menu.AddSettingsToID("progress_Buttons", "", "", false, [
			{
				type: "toggle",
				settingLink: "RewardAsIcon",
			},
			{
				type: "button",
				label: "Back",
				callback: () => {
					this.runtime.menu.Back()
				},
			},
		])

		const rewardAsIcon = progressBtns[0]
		rewardAsIcon.addEventListener("sn:rightclick", (e) => {
			e.preventDefault()
			this.InvertAllChallenges()
		})

		const backBtn = progressBtns[1]
		backBtn.style.marginTop = Utils.px(2)

		this.progressTitle = this.progressMenu.querySelector("#progress_Title")

		const onTranslate = (elem) => {
			if (this.runtime.progress?.GetProgressPercent) {
				elem.innerHTML = elem.innerHTML + " " + this.runtime.progress.GetProgressPercent(true)
			}
		}

		this.runtime.translation.Elem_SetTranslateKey(this.progressTitle, "Progress", onTranslate)

		const tempChallenge = new Challenge(this.runtime)
		this.achievement = tempChallenge.CreateElem_Achieve(false)
		const achievementContainer = this.progressMenu.querySelector("#progress_achieve_Container")
		achievementContainer.appendChild(this.achievement)

		const container = this.progressMenu.querySelector("#progress_Achievements_Cadre")

		this.runtime.style.Elem_BoxStyle(container, "", 3)

		this.inventoryContent = this.progressMenu.querySelector("#progress_Achievements")

		this.rewardTooltip = new Tooltip(this.runtime, false)
		const progressReward = this.progressMenu.querySelector("#progress_Reward")
		progressReward.appendChild(this.rewardTooltip.element)

		const progressRewardText = this.progressMenu.querySelector("#progress_Reward_Text")
		this.runtime.translation.Elem_SetTranslateKey(progressRewardText, "Reward")

		const progressAchieveText = this.progressMenu.querySelector("#progress_achieve_Text")
		this.runtime.translation.Elem_SetTranslateKey(progressAchieveText, "Challenge")

		this.achievementStack = document.createElement("div")
		this.achievementStack.id = "achievementStack"
		this.achievementStack.classList.add("vertical")
		const C3htmlwrap = document.querySelector(".c3html")
		C3htmlwrap.appendChild(this.achievementStack)
		Object.assign(this.achievementStack.style, {
			pointerEvents: "none",
			zIndex: 99999,
			width: Utils.px(100),
			position: "absolute",
			bottom: Utils.px(10),
			right: Utils.px(10),
			padding: Utils.px(10),
			gap: Utils.px(3),
		})

		//add animation style
		const style = document.createElement("style")
		style.innerHTML = /*css*/ `
            @keyframes achieve_Bump {
                0% { transform: translateY(0); }
                50% { transform: translateY(${Utils.px(-10)}); }
                100% { transform: translateY(0); }
            }

            @keyframes achieve_fadeOut {
                0% { opacity: 1; }
                100% { opacity: 0; }
            }
        `
		document.head.appendChild(style)

		//this.Refresh()
	}

	LoadSave_Achievements() {
		let achievements = Array.from(this.challenges.values())

		achievements = achievements.filter((a) => !a.recheckOnLoad)

		const achievements_completed = achievements.filter((a) => this.completedAchievements.includes(a.nameFull))
		const achievements_toDo = achievements.filter((a) => achievements_completed.indexOf(a) === -1)

		for (const achieve of achievements_toDo) {
			achieve.SetCompleted(false, true)
		}

		for (const achieve of achievements_completed) {
			achieve.SetCompleted(true, true)
		}

		//special achievements
		this.CheckMission_Overboy()
	}

	CompleteChallenge(name, fromSave = false) {
		const challenge = this.challenges.get(name)
		if (!challenge) return
		challenge.SetCompleted(true, fromSave)
	}

	CheckChallenges_WaveEnd() {}

	CheckMission_Overboy() {
		let missions = this.activeMissions["AllCharas"]
		if (!missions) return
		missions = Array.from(missions)

		let pool_charas = Array.from(this.runtime.dataInstances["Items"].values())
		pool_charas = pool_charas.filter((item) => item.HasTag("Playable"))
		pool_charas = pool_charas.filter((item) => !item.lockedBy)
		pool_charas = pool_charas.filter((item) => !item.name.includes("Overboy"))

		//check if all charas are unlocked
		const allUnlocked = pool_charas.every((chara) => !chara.locked)
		if (allUnlocked) {
			for (const mission of missions) {
				mission.SetCompleted()
			}
		} else {
			const lockedCharas = pool_charas.filter((chara) => chara.locked)
			console.error("lockedCharas", lockedCharas)
		}
	}

	CheckMission_MedalWin() {
		let missions = this.activeMissions["MedalWin"]
		if (!missions) return
		missions = Array.from(missions)

		let pool_charas = Array.from(this.runtime.dataInstances["Items"].values())
		pool_charas = pool_charas.filter((item) => item.HasTag("Playable"))
		pool_charas = pool_charas.filter((item) => !item.lockedBy)

		const thresholdCounts = {
			1: 0,
			2: 0,
			3: 0,
			4: 0,
			5: 0,
		}

		for (const charaItem of pool_charas) {
			const bestSingle = this.GetChara_GetBest(charaItem, "regular", "single")
			const bestCoop = this.GetChara_GetBest(charaItem, "regular", "coop")

			const bestBoth = Math.max(bestSingle, bestCoop)

			// Increment counts for all thresholds met
			for (let i = 1; i <= 5; i++) {
				if (bestBoth >= i) {
					thresholdCounts[i]++
				}
			}

			if (bestBoth > 0) {
				console.log("Chara", charaItem.name, "BestDiff:", bestBoth)
			}
		}

		console.log("WinMedal, Diff completed with charas:", thresholdCounts)

		for (const mission of missions) {
			if (thresholdCounts[mission.winDiff] >= mission.winCount) {
				mission.SetCompleted()

				const achieveName = mission.challenge.steamAchievement
				console.error("CheckMission_MedalWin", achieveName, "completed")
				this.runtime.platforms.Steam_Achieve_Get(achieveName)
			}
		}
	}

	CheckMissionStat(statObj) {
		if (!this.runtime.main.canUnlockAchievements) return

		let missions = this.activeMissions["ReachStat"]
		if (!missions) return
		missions = Array.from(missions)
		missions = missions.filter((m) => m.split[1] === statObj.Name)
		if (missions.length === 0) return
		const statValue = statObj.GetDisplayValue()

		for (const mission of missions) {
			const missionValue = mission.data

			let completed = false

			if (missionValue > 0 && statValue >= missionValue) {
				mission.SetCompleted()
				completed = true
			} else if (missionValue < 0 && statValue <= missionValue) {
				mission.SetCompleted()
				completed = true
			} else if (missionValue === 0 && statValue === missionValue) {
				mission.SetCompleted()
				completed = true
			}

			if (completed) {
				const achieveName = mission.challenge.steamAchievement
				console.error("Challenge ReachStat completed", achieveName)

				this.runtime.platforms.Steam_Achieve_Get(achieveName)
			}
		}
	}

	CheckMission_TotalValue(valueName, increment) {
		if (!this.runtime.main.canUnlockAchievements) return

		if (!this.saveData.totalValues) {
			//window.alert("this.ResetSave_TotalValues()")
			this.ResetSave_TotalValues()
		}
		const TotalValues = this.saveData.totalValues
		TotalValues[valueName] = TotalValues[valueName] || 0

		TotalValues[valueName] += increment
		//window.alert("TotalValues " + valueName + " " + TotalValues[valueName])

		const statValue = TotalValues[valueName]

		let missions = this.activeMissions["TotalValue"]
		if (!missions) return
		missions = Array.from(missions)
		missions = missions.filter((m) => m.split[1] === valueName)
		if (missions.length === 0) return

		for (const mission of missions) {
			const missionValue = mission.data

			if (missionValue > 0 && statValue >= missionValue) {
				mission.SetCompleted()
			} else if (missionValue < 0 && statValue <= missionValue) {
				mission.SetCompleted()
			} else if (missionValue === 0 && statValue === missionValue) {
				mission.SetCompleted()
			}
		}
	}

	CheckMissionType(type) {
		if (!this.runtime.main.canUnlockAchievements) return
		const missions = this.activeMissions[type]
		if (!missions) return
		missions.forEach((mission) => {
			mission.CheckCompleted()
		})
	}

	//* RUN

	StartRun() {
		this.runIsTweaked = false
		this.runTweaks = JSON.parse(JSON.stringify(runTweaks))
	}

	GameOver_WinRun(Mode = "regular") {
		//! CAREFUL FULLY DISABLED IF IN CHEAT MODE

		if (!this.runtime.main.canUnlockAchievements) return

		const playersEnabled = Array.from(this.runtime.playersEnabled)

		const Diff = this.runtime.waveManager.difficulty
		const Zone = this.runtime.waveManager.zoneName

		const Coop = playersEnabled.length > 1 ? "coop" : "single"

		const Roaster = playersEnabled.map((player) => {
			return player.startRun_chara.name
		})

		this.runtime.platforms.Steam_Achieve_Get(`difficulty_${Diff}`)

		for (const charaName of Roaster) {
			let charaNameLower = charaName.replace(/ /g, "_").replace("U_", "").replace("Chara_", "")
			charaNameLower = charaNameLower.toLowerCase()

			this.runtime.platforms.Steam_Achieve_Get(`play_${charaNameLower}_1`)

			console.error("Chara achievement", `play_${charaNameLower}_1`)

			if (Diff >= 5) {
				this.runtime.platforms.Steam_Achieve_Get(`play_${charaNameLower}_2`)
			}
		}

		const runType = this.runIsTweaked ? Coop + "_tweaks" : Coop
		const diffType = "Diff" + Diff

		for (const player of playersEnabled) {
			const CharaName = player.startRun_chara.name

			if (CharaName.includes("Overboy") && !this.runtime.main.isDemo) {
				let mergoboyWins = this.charaData?.Mergoboy?.Diff6
				if (!mergoboyWins) Utils._set(this.charaData, ["Mergoboy", "Diff6"], {})

				const mergedCharas = player.inventory.items
					.filter((item) => item.itemType === "Playable")
					.filter((item) => !item.name.includes("Overboy"))
				const mergedCharasString = mergedCharas.map((item) => item.name).join(", ")
				console.error("Mergoboy wins", mergedCharasString)
			}

			let previousBest = null

			if (Mode === "regular") {
				previousBest = this.charaData?.[Zone]?.[CharaName]?.[Mode]?.[runType]
			} else if (Mode === "endless") {
				previousBest = this.charaData?.[Zone]?.[CharaName]?.[Mode]?.[runType]?.[diffType]
			}

			if (previousBest) previousBest = JSON.parse(JSON.stringify(previousBest))

			let newRecord = null
			if (Mode === "regular") {
				if (!previousBest || Diff >= previousBest.Diff) {
					newRecord = Utils._set(this.charaData, [Zone, CharaName, Mode, runType], {})
					newRecord.Diff = Diff
				}
			}
			if (Mode === "endless") {
				const Wave = this.runtime.waveManager.waveCount - 1

				if (!previousBest || Wave >= previousBest.WaveReached) {
					newRecord = Utils._set(this.charaData, [Zone, CharaName, Mode, runType, diffType], {})
					newRecord.WaveReached = Wave
				}
			}

			if (newRecord) {
				newRecord.Version = this.runtime.main.version
				if (Coop === "coop") {
					newRecord.Roaster = Roaster
				}

				if (this.runIsTweaked) {
					newRecord.Tweaks = JSON.parse(JSON.stringify(this.runTweaks))
				}
			}
		}

		console.error("charaData", this.charaData)

		this.runtime.progress.CheckMissionType("Win")
		this.runtime.progress.CheckMissionType("AtkWin")
		this.runtime.progress.CheckMissionType("OverboyWins")

		this.runtime.progress.CheckMission_MedalWin()

		this.runtime.save.WriteSave(true)
	}

	GetCharaData(item) {
		//item string or item object
		let charaName = typeof item === "string" ? item : item.name
		charaName = charaName.replace(/ /g, "_").toLowerCase()

		const Zone = this.runtime.waveManager.zoneName

		const recordsThisZone = this.runtime.progress.charaData?.[Zone]

		let charaDataThis = null

		if (recordsThisZone) {
			const charaKey = Object.keys(recordsThisZone).find((key) => key.replace(/ /g, "_").toLowerCase().endsWith(charaName))
			if (charaKey) charaDataThis = recordsThisZone[charaKey]
		}
		return charaDataThis
	}

	GetChara_GetBest(item, gameMode = "regular", playerMode = "single", tweaks = null, diff = 1) {
		const charaDataThis = this.GetCharaData(item)
		if (charaDataThis) {
			const playerMode_tweaks = playerMode + "_tweaks"

			const record_noTweaks = charaDataThis?.[gameMode]?.[playerMode]
			const record_tweaks = charaDataThis?.[gameMode]?.[playerMode_tweaks]

			let best_noTweaks = -1
			let best_tweaks = -1
			let best = -1

			if (gameMode === "regular") {
				best_noTweaks = record_noTweaks?.Diff || -1
				best_tweaks = record_tweaks?.Diff || -1
			} else if (gameMode === "endless") {
				diff = "Diff" + diff

				best_noTweaks = record_noTweaks?.[diff]?.WaveReached || -1
				best_tweaks = record_tweaks?.[diff]?.WaveReached || -1
			}

			if (tweaks === true) best = best_tweaks
			else if (tweaks === false) best = best_noTweaks
			else if (tweaks === null) best = Math.max(best_noTweaks, best_tweaks)

			return best
		}
		return -1
	}

	GetProgressPercent(writeDemo = false) {
		let chals = Array.from(this.challenges.values())
		chals = chals.filter((chal) => !chal?.lockedBy)

		let chalCount = chals.length
		let chalUnlockedCount = chals.filter((chal) => chal.completed).length

		const percent = Math.round((chalUnlockedCount / chalCount) * 100)

		let returnString = percent + "%"
		if (writeDemo && this.runtime.main.isDemo) returnString = "(Demo: " + returnString + ")"
		else returnString = "(" + returnString + ")"

		return returnString
	}

	HTML_SetProgressMenu() {
		this.Refresh()

		const settingRewardAsIcon = this.GetSetting("RewardAsIcon")
		this.Setting_RewardAsIcon(settingRewardAsIcon)
	}

	Setting_RewardAsIcon(bool) {
		const chalArray = Array.from(this.challenges.values())

		for (const challenge of chalArray) {
			const itemIcon = challenge.box.querySelector("#itemIcon")
			if (bool) itemIcon.src = challenge?.unlockedItem?.img || "random_icon.png"
			else itemIcon.src = challenge.img || "random_icon.png"

			let tier = 0

			if (bool) tier = challenge?.unlockedItem?.evolution || 0
			else tier = challenge.levelTier || 0

			const key = "TIER_" + tier

			//this.runtime.style.Elem_ItemStyle(challenge.box, key)

			this.runtime.style.Elem_ItemStyleFrame(challenge.box, tier)
		}
	}

	SetHTML_Achieve_LockedBy(elem, img, lockedBy) {
		const achieveImg = elem.querySelector(".achieveImg")
		const achieveTitle = elem.querySelector(".itemTitle")
		const achieveTags = elem.querySelector(".itemTags")

		const achieveBoxStyle = this.runtime.style.Elem_BoxStyle(elem, "TIER_0", 5)

		achieveImg.src = img
		Utils.Elem_SetTranslateKey(achieveTitle, "Locked_" + lockedBy)

		achieveTags.textContent = ""
	}

	HTML_SetEndProgress(endProgress) {
		const end_Progress_Invo = endProgress.querySelector("#end_Progress_Invo")
		const end_newUnlocks_Text = endProgress.querySelector("#end_newUnlocks_Text")

		if (this.newItemsUnlocked.length === 0) {
			//Utils.Elem_SetTranslateKey(end_newUnlocks_Text, "NewUnlocks_None")
			endProgress.style.display = "none"
			return
		}

		Utils.Elem_SetTranslateKey(end_newUnlocks_Text, "NewUnlocks")
		endProgress.style.display = "flex"

		const inventoryHtml = this.newItemsUnlocked
			.map((item, index) => {
				return /*html*/ `
                <div class="itemBox" data-item-index="${index}" style="position:relative;">
                    <img id="itemIcon" src="${item.img}" draggable="false" 
                        onerror="this.onerror=null; this.src='random_icon.png';">
                    <img id="lockedIcon" src="NewUnlock.png"
                        style="
                            position: absolute;
                            width: ${Utils.px(7)};
                            height: ${Utils.px(7)};
                            bottom: 0;
                            right: 0;
                    ">
                </div>
            `
			})
			.join("")

		end_Progress_Invo.innerHTML = inventoryHtml

		const itemBoxes = end_Progress_Invo.querySelectorAll(".itemBox")

		itemBoxes.forEach((item) => {
			const itemIndex = item.getAttribute("data-item-index")
			const itemClass = this.newItemsUnlocked[itemIndex]

			item.itemClass = itemClass
			item.player = this.runtime.player

			const key = "TIER_" + itemClass.evolution
			//this.runtime.style.Elem_ItemStyle(item, key)

			this.runtime.style.Elem_ItemStyleFrame(item, itemClass.evolution)

			Utils.Elem_FocusableOutline(item)

			Utils.Elem_AddItemHoverTooltip(item, "EndRun")
		})
	}

	Refresh() {
		const chalArray = Array.from(this.challenges.values())

		//Demo: filler achievements
		if (this.runtime.main.isDemo) {
			for (let i = 0; i < 120; i++) {
				chalArray.push({
					img: "locked_fullGame.png",
					LockedBy: "Demo",
				})
			}
		}

		if (!this.runtime.main.isDemo) {
			for (let i = 0; i < 70; i++) {
				chalArray.push({
					img: "locked_fullGame.png",
					LockedBy: "Soon",
				})
			}
		}

		const inventoryHtml = chalArray
			.map((item, index) => {
				return /*html*/ `
                <div class="itemBox" data-item-index="${index}" style="position:relative;">
                    <img id="itemIcon" src="${item.img}" draggable="false" 
                        onerror="this.onerror=null; this.src='random_icon.png';">
                    <div id="grayOut" style="
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.69); /* Adjust opacity as needed */
                        pointer-events: none; /* Ensure clicks pass through */
                    "></div>
                    <img id="lockedIcon" src="locked_icon.png"
                        style="
                            position: absolute;
                            width: ${Utils.px(10)};
                            height: ${Utils.px(10)};
                            bottom: 0;
                            right: 0;
                    ">
                </div>
            `
			})
			.join("")

		this.inventoryContent.innerHTML = inventoryHtml

		//only select items children of this.element

		const items = this.inventoryContent.querySelectorAll(".itemBox")

		//const tooltip = document.querySelector(".tooltip")

		const player = this.runtime.player

		items.forEach((item) => {
			const itemIndex = item.getAttribute("data-item-index")
			const challenge = chalArray[itemIndex]

			const key = "TIER_" + (challenge.levelTier || 0)

			//this.runtime.style.Elem_ItemStyle(item, key)

			this.runtime.style.Elem_ItemStyleFrame(item, challenge.levelTier || 0)

			Utils.Elem_FocusableOutline(item)

			const lockedIcon = item.querySelector("#lockedIcon")
			const grayOut = item.querySelector("#grayOut")

			if (challenge.LockedBy) {
				lockedIcon.style.display = "none"
				const focus = () => {
					/*if (!challenge.completed) {
                        this.LockedItem(item)
                    }*/
					this.SetHTML_Achieve_LockedBy(this.achievement, challenge.img, challenge.LockedBy)
					this.rewardTooltip.element.style.visibility = "hidden"
				}

				const unfocus = () => {
					/*
                    this.rewardTooltip.element.style.visibility = "hidden"
                    */
				}

				Utils.Elem_Focusable(item, focus, unfocus)
				return
			}

			const itemClass = challenge.unlockedItem

			challenge.box = item
			challenge.lockedIcon = lockedIcon
			challenge.grayOut = grayOut

			if (challenge.completed) {
				grayOut.style.display = "none"
				lockedIcon.style.display = "none"
			}

			item.player = player
			item.itemClass = itemClass

			// Click event for item
			item.addEventListener("sn:pressed", (e) => {
				//
			})

			item.addEventListener("sn:rightclick", (e) => {
				e.preventDefault()
				if (this.runtime.isCheating) {
					const bool = !challenge.completed
					challenge.SetCompleted(bool, false)
				}
			})

			const focus = () => {
				/*if (!challenge.completed) {
					this.LockedItem(item)
				}*/
				challenge.SetHTML_Achieve(this.achievement)
				if (itemClass) {
					this.rewardTooltip.element.style.visibility = "visible"
					this.rewardTooltip.SetTooltipFromItem(itemClass, player, "challengeReward")
				} else {
					this.rewardTooltip.element.style.visibility = "hidden"
				}
			}

			const unfocus = () => {
				/*
				this.rewardTooltip.element.style.visibility = "hidden"
                */
			}

			Utils.Elem_Focusable(item, focus, unfocus)
		})
	}

	SetChallengeUnlocks(challenge, data) {
		if (!data) return
		let unlockDataAll = data.Unlocks
		if (unlockDataAll) {
			if (typeof unlockDataAll === "string") unlockDataAll = { Item: unlockDataAll }
			for (const [unlockType, unlock] of Object.entries(unlockDataAll)) {
				if (unlockType === "Item") {
					challenge.unlockedItem = null
					for (let prefix of data.unlockPrefix) {
						if (challenge.unlockedItem) break
						challenge.unlockedEvoGroup = this.runtime.dataManager.evolutionMap[prefix + unlock]
						if (challenge.unlockedEvoGroup) {
							let i = -1
							for (const [evoIndex, evoItem] of Object.entries(challenge.unlockedEvoGroup)) {
								i++
								if (i === 0) {
									challenge.unlockedItem = evoItem
								}
							}
						}
					}
				} else {
					challenge.otherUnlocks.push([unlockType, unlock])
				}
			}
		}
	}
}

export class Challenge {
	constructor(runtime, nameFull = "", data = {}) {
		this.runtime = runtime
		this.progress = runtime.progress
		this.nameFull = nameFull
		if (this.nameFull) {
			this.progress.challenges.set(nameFull, this)
			//find " Number" at the end of the name (space + number)
			const match = nameFull.match(/^(.*)\s(\d+)$/)
			if (match) {
				this.name = match[1]
				this.level = parseInt(match[2])
				this.levelTier = this.level - 1
			} else {
				this.name = nameFull
				this.level = 0
				this.levelTier = 0
			}
		}

		this.steamAchievement = this.nameFull.replace(/ /g, "_").toLowerCase()

		if (data.Tier) this.levelTier = data.Tier

		this.challNameKey = this.name || ""

		if (this.challNameKey.startsWith("ReachStat_")) {
			this.challNameKey = this.challNameKey.replace("ReachStat_", "STAT_")

			if (this.runtime.translation.HasKey(this.challNameKey + "_CHAL")) {
				this.challNameKey = this.challNameKey + "_CHAL"
			}
		}

		this.unlockedItem = null
		this.otherUnlocks = []
		this.img = data.img || ""
		this.modLoading = data.modLoading || null

		this.recheckOnLoad = data.Recheck

		this.missions = []

		this.completed = false

		if (this.progress.completedAchievements.includes(this.nameFull)) {
			this.completed = true
		}

		if (data) {
			this.progress.SetChallengeUnlocks(this, data)

			this.LockReward()

			if (data.Missions) {
				this.SetMissions(data.Missions)

				if (this.missions.length > 0) {
					if (this.missions[0].type === "AtkWin") {
						this.challNameKey = Utils.GetItemDisplayKey(this.name)[0]

						this.missions[0].AtkNameKey = this.challNameKey
					}
				}
			}
		}
	}

	CheckCompleted() {
		if (this.completed) return
		let completed = true
		for (const mission of this.missions) {
			if (!mission.completed) {
				completed = false
				return
			}
		}
		if (completed) {
			this.SetCompleted(true)
		}
	}

	SetCompleted(bool, fromSave = false) {
		this.completed = bool

		if (bool) {
			if (this.box) {
				this.grayOut.style.display = "none"
				this.lockedIcon.style.display = "none"
			}

			this.UnlockReward()
		} else {
			if (this.box) {
				this.grayOut.style.display = "block"
				this.lockedIcon.style.display = "block"
			}

			this.LockReward()
		}

		if (!bool && !fromSave) {
			const index = this.progress.completedAchievements.indexOf(this.nameFull)
			if (index > -1) {
				this.progress.completedAchievements.splice(index, 1)
			}
			console.error("💾 Removed", this.nameFull, this.progress.completedAchievements)

			this.runtime.save.WriteSave(true)
		}

		if (bool && !fromSave) {
			this.progress.completedAchievements.push(this.nameFull)

			// window.alert("completed the challenge: " + this.nameFull);

			console.error("💾 Completed", this.nameFull, this.progress.completedAchievements)

			this.runtime.save.WriteSave(true)

			const elem = this.CreateElem_Achieve()
			this.progress.achievementStack.appendChild(elem)

			Object.assign(elem.style, {
				height: Utils.px(30),
				animation: "achieve_Bump 0.1s ease, achieve_fadeOut 1s 1s forwards",
				zIndex: 9999,
			})
		}

		/*
        if (this.runtime.hasSteam()) {
            var steam_achievement = Steam.getAchievement(chal_id)
            if (!steam_achievement.achieved) {
                var _achievement = Steam.setAchievement(chal_id)
                var _stored = Steam.storeStats()
            }
        }*/
	}

	UnlockReward() {
		if (this.unlockedEvoGroup) {
			let i = 0
			for (const [evoIndex, evoItem] of Object.entries(this.unlockedEvoGroup)) {
				evoItem.locked = false
				if (i === 0) this.progress.newItemsUnlocked.push(evoItem)
				i++
			}
		}
		this.runtime.progress.CheckMission_Overboy()
	}

	LockReward() {
		if (this.runtime.unlockAll) return
		if (this.unlockedEvoGroup) {
			for (const [evoIndex, evoItem] of Object.entries(this.unlockedEvoGroup)) {
				evoItem.locked = true
				this.progress.lockedItemToChallenge.set(evoItem, this)
			}
		}
	}

	SetMissions(dataMissions) {
		for (const [missionType, missionData] of Object.entries(dataMissions)) {
			const mission = new Mission(this, missionType, missionData)
			this.missions.push(mission)
		}
	}

	CreateElem_Achieve(set = true) {
		const tempContainer = document.createElement("div")

		tempContainer.innerHTML = /*html*/ `
        <div id="progress_Achieve" class= "horizontal" style= 
            "height:${Utils.px(55)};
            padding:${Utils.px(2)}; 
            gap:${Utils.px(2)};"
        >
        
            <div class="achieveImgContain flex justify_center items_center" style="
                        padding:${Utils.px(1)};
                        
                        height:${Utils.px(16)};
                        width:${Utils.px(16)};
                        border-radius: ${Utils.px(2)};
                        overflow: hidden;
                        flex-shrink: 0;
                        ">
                <img class="achieveImg" 
                    src="random_icon.png" onerror="this.src='random_icon.png'; item.img = item.src"
                    style="
                        max-height: 100%;
                        max-width: 100%;
                        object-fit: contain;
                        
                "/>  
            </div>
            <div class="vertical" style= 
                "margin-left:${Utils.px(1)};
            ">
                <div class="itemTitle" style="
                    font-size:${Utils.px(7)};
                    color: yellow;
                "></div>
                <div class="itemTags" style="
                    font-size:${Utils.px(5)};
                "></div>
            </div>
        </div>
        `

		const achieveImgContain = tempContainer.querySelector(".achieveImgContain")
		//achieveImgContain.style.background = `linear-gradient(360deg,rgb(50, 50, 50),rgb(19, 19, 19)`

		this.runtime.style.Elem_ItemStyleFrame(achieveImgContain)

		const createdElem = tempContainer.firstElementChild

		this.runtime.style.Elem_BoxStyle(createdElem, "TIER_0")

		if (set) this.SetHTML_Achieve(createdElem)

		return createdElem
	}

	SetHTML_Achieve(elem) {
		const achieveImg = elem.querySelector(".achieveImg")
		const achieveTitle = elem.querySelector(".itemTitle")
		const achieveTags = elem.querySelector(".itemTags")

		const achieveBoxStyle = this.runtime.style.Elem_BoxStyle(elem, "TIER_" + this.levelTier, 5)

		achieveImg.src = this.img

		let translateKey = this.challNameKey
		if (this.runtime.translation.HasKey("Chal_" + this.challNameKey)) {
			translateKey = "Chal_" + this.challNameKey
		}

		Utils.Elem_SetTranslateKey(achieveTitle, translateKey)

		if (this.level > 0) {
			const romanMap = {
				1: "I",
				2: "II",
				3: "III",
				4: "IV",
				5: "V",
				6: "VI",
				7: "VII",
				8: "VIII",
				9: "IX",
				10: "X",
			}

			let numberValue = romanMap[this.level] || this.level

			//font-size:${Utils.px(5)};

			achieveTitle.innerHTML += `<span style="
                
                color: white;
            "> 
                (${numberValue})
            </span>`
		}

		this.SetHTML_MissionDesc(achieveTags)
	}

	SetHTML_MissionDesc(elem) {
		elem.innerHTML = ""

		elem.innerHTML = ""
		for (const mission of this.missions) {
			const missionElem = mission.GetMissionElem()

			elem.appendChild(missionElem)
		}
	}

	GetItem() {
		return this.unlocks[0]
	}
}

export class Mission {
	constructor(challenge, type, data) {
		this.challenge = challenge
		this.runtime = challenge.runtime
		this.progress = challenge.runtime.progress

		this.fullName = type

		this.split = type.split("|")
		type = this.split[0]

		this.progress.activeMissions[type] ??= new Set()

		if (!this.challenge.completed) {
			this.progress.activeMissions[type].add(this)
		}

		this.type = type
		this.data = data
		this.completed = false

		this.translateKey = null

		if (this.type === "TotalValue") {
			this.translateKey = this.fullName

			if (this.fullName.includes("Wins_Diff")) {
				this.translateKey = "TotalValue|Wins_Diff"
			}

			if (this.data === 1) {
				this.translateKey += "|1"
			}
		}

		if (this.type === "Win") {
			if (this.data.hasOwnProperty("Diff")) this.winDiff = this.data.Diff
			if (this.data.Chara) this.winChara = this.data.Chara
			if (this.data.Zone) this.winZone = this.data.Zone

			if (this.winDiff && this.winChara && this.winZone) {
				this.translateKey = "Win_CharaDiffZone"
			} else if (this.winDiff && this.winChara) {
				this.translateKey = "Win_CharaDiff"
			} else if (this.winDiff && this.winZone) {
				this.translateKey = "Win_DiffZone"
			} else if (this.winChara && this.winZone) {
				this.translateKey = "Win_CharaZone"
			} else if (this.winChara) {
				this.translateKey = "Win_Chara"
			} else if (this.winZone) {
				this.translateKey = "Win_Zone"
			} else if (this.winDiff) {
				this.translateKey = "Win_Diff"
			} else {
				this.translateKey = "Win_Diff"
			}
		}
		if (this.type === "AtkWin") {
			this.winDiff = this.data.Diff
			this.atkAmount = this.data.Count
			this.waveFirst = this.data.WaveFirst
			this.waveLast = this.data.WaveLast
			if (this.winDiff && this.winDiff > 1) {
				this.translateKey = "AtkWin_Diff"
			}
		}
		if (this.type === "MedalWin") {
			this.winDiff = this.split[1]
			this.winCount = this.data
		}
	}

	CheckCompleted() {
		let completed = false
		if (this.type === "Win") {
			completed = true
			if (this.winDiff > this.runtime.waveManager.difficulty) {
				completed = false
			}
			if (this.winZone) {
				if (this.winZone !== this.runtime.waveManager.zoneName) {
					completed = false
				}
			}
			if (this.winChara) {
				const winCharaName = this.winChara.replace(/ /g, "_").toLowerCase()
				const matchingPlayers = []

				for (const player of this.runtime.playersEnabled) {
					const charaItem = player.startRun_chara
					if (charaItem) {
						const charaName = charaItem.name.replace(/ /g, "_").toLowerCase()

						if (charaName.endsWith(winCharaName)) {
							matchingPlayers.push(player)
						}
					}
				}
				if (matchingPlayers.length === 0) {
					completed = false
				}
			}
		}
		if (this.type === "AtkWin") {
			completed = true
			if (this.winDiff > this.runtime.waveManager.difficulty) {
				completed = false
			}
		}

		if (completed) this.SetCompleted()
	}

	SetCompleted() {
		//window.alert("CompleteMission: " + this.type + " " + this.data)
		this.completed = true
		this.progress.activeMissions[this.type].delete(this)
		this.challenge.CheckCompleted()
	}

	GetMissionElem() {
		const elem = document.createElement("div")
		let transKey = "Mission_" + (this.translateKey || this.type)

		if (transKey === "Mission_AllCharas" && this.runtime.main.isDemo) {
			transKey = "Mission_AllCharas_Demo"
		}

		Utils.Elem_SetTranslateKey(elem, transKey)

		const replace = (find, replace, color = null, translate = true) => {
			find = "{" + find + "}"

			if (translate && typeof replace === "string") {
				replace = this.runtime.translation.Get(replace)
			}

			// Check if color is provided
			if (color) {
				if (color === "green") color = "#00ff00"
				replace = `<span style="color: ${color}">${replace}</span>`
			}

			elem.innerHTML = elem.innerHTML.replace(find, replace)
		}

		if (this.type === "Win") {
			replace("diff", this.winDiff)
			replace("chara", this.winChara, "yellow")
			replace("zone", this.winZone, "yellow")
		} else if (this.type === "MedalWin") {
			//replace("diff", this.winDiff, this.runtime.tierColors["TIER_" + this.winDiff])
			replace("diff", this.winDiff, "yellow")
			replace("x", this.winCount, "yellow")
			replace("zone", this.winZone, "yellow")
		} else if (this.type === "AtkWin") {
			replace("diff", this.winDiff)
			replace("count", this.atkAmount)
			replace("waveFirst", this.waveFirst)
			replace("waveLast", this.waveLast)
			replace("atk", this.runtime.translation.Get(this.AtkNameKey), "yellow")
		} else if (this.type === "ReachStat") {
			const statName = this.split[1]
			console.error("statName", statName, this)
			let statValue = this.runtime.player.stats.GetStatValueColored(statName, this.data)
			statValue = Utils.parseBBCode(statValue)

			let statKey = "STAT_" + statName
			if (this.runtime.translation.HasKey(statKey + "_CHAL")) {
				statKey = statKey + "_CHAL"
			}

			replace("value", statValue)
			replace("stat", statKey, "green")
		} else {
			replace(0, this.data)
		}

		return elem
	}
}
