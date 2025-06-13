import { Inventory } from "../inventory/Inventory.js"
import { Tooltip } from "../inventory/Tooltip.js"

const lockedIcon = "locked_icon.png"
const lockedIcon_Special = "locked_icon_Special.png"
const lockedIcon_Demo = "locked_fullGame.png"
const lockedIcon_Steam = "locked_Steam.png"
const rewardIcon = "Game/Graph/RecordIcon.png"
const rewardIcon_No = "Game/Graph/RecordIcon_No.png"

const playerCo = {
	progress: 0,
	inputID: 0,
}

const infoWidth = 90

const infoWidth_Tooltip = 100

export class Menu_StartRun {
	constructor(menu) {
		this.menu = menu
		this.runtime = menu.runtime

		this.runtime.addEventListener("beforeprojectstart", () => this.BeforeProjectStart())
		this.runtime.addEventListener("beforeanylayoutstart", (e) => this.BeforeStart(e))
		this.runtime.addEventListener("beforeanylayoutend", (e) => this.BeforeEnd(e))

		this.playerConnect = []
		this.validateItems = [null, null, null, null]
	}

	async GetDemoLocks() {
		try {
			// Fetch the JSON data and await its resolution
			const response = await fetch("locks.json")
			const data = await response.json()

			// Extract achievements from the JSON data
			this.demoLocks = data.demoLocks
			this.nonSteamLocks = data.nonSteamLocks

			console.log("demoLocks", this.demoLocks)
			console.log("nonSteamLocks", this.nonSteamLocks)
		} catch (error) {
			console.error("Error fetching or processing JSON:", error)
		}
	}

	async BeforeProjectStart() {
		//await this.GetDemoLocks()
		this.CreateMenu_Select()
	}

	BeforeEnd(e) {
		if (this.runtime.layout.name === "START") {
			for (const charaItem of this.pool_charas) {
				charaItem.evolution = 0
			}
		}
	}

	BeforeStart(e) {
		if (this.runtime.layout.name === "START") {
			if (!this.runtime.audio.currentMusic) {
				this.runtime.audio.PlayMusic("Title_Eat_a_slug_and_die")
			}

			for (const player of this.runtime.players) {
				player.startRun_wep = null
			}

			this.UpdatePools()
			this.ResetPlayerConnection()

			if (this.runtime.settings.Mode_Coop) {
				this.Multi_RunSelect_Chara()
			} else this.Single_RunSelect_Chara()
		}
	}

	SetInfo_Locked(elem, item) {
		elem.style.display = "flex"

		const select_locked_MissionDesc = elem.querySelector("#select_locked_MissionDesc")

		console.error("SetInfo_Locked", item.lockedBy, item)

		if (item.lockedBy === "Demo" || item.lockedBy === "Dev") {
			select_locked_MissionDesc.innerHTML = this.runtime.translation.Get("Locked_Demo")
		} else if (item.lockedBy === "Steam") {
			select_locked_MissionDesc.innerHTML = this.runtime.translation.Get("Locked_Steam")
		} else {
			const challenge = this.runtime.progress.lockedItemToChallenge.get(item)

			challenge.SetHTML_MissionDesc(select_locked_MissionDesc)
		}

		select_locked_MissionDesc.style.textAlign = "center"
	}

	SelectRecord_Refresh() {
		this.selectRecord.innerHTML = /*html*/ `
        <div class="horizontal items_center justify_center">
                            <img id="recordIcon" src="${rewardIcon}" draggable="false" style="
                                width: ${Utils.px(14)}; 
                                height: ${Utils.px(14)};
                                margin-right: ${Utils.px(1)};
                                object-fit: contain;
                            ">
                            <div id="select_record_title" class="text_center"></div>
                        </div>
                        <div id="select_record_inZone" class="text_center" style="
                            margin-bottom: ${Utils.px(2)};
                        "></div>
                        <div id="select_record_maxBeaten" style="
                            margin-bottom: ${Utils.px(1)};
                        "></div>
                        <div id="select_record_descBeaten" class="w100"style="
                            margin-bottom: ${Utils.px(2)};
                        "></div>
                        <div id="sep_endless" class="separator_html" style="
                            display: none;
                        "></div>
                        <div id="select_record_maxEndless" style="
                            margin-bottom: ${Utils.px(1)};
                        "></div>
                        <div id="select_record_descEndless" class="w100"style="
                            margin-bottom: ${Utils.px(2)};
                        "></div>`
	}

	//only for singlePlayer
	SetInfo_Record(elem, item, charaTooltipElem = null) {
		this.SelectRecord_Refresh()
		elem.style.display = "flex"

		const best = this.runtime.progress.GetChara_GetBest(item, "regular", "single")

		const bestTier = best

		let key = "TIER_" + bestTier
		if (best === -1) key = "TIER_0"

		this.runtime.style.Elem_BoxStyle(elem, key, 5)

		const charaDataThis = this.runtime.progress.GetCharaData(item)

		const selectRecordTitle = elem.querySelector("#select_record_title")
		const recordInZone = elem.querySelector("#select_record_inZone")

		const recordMaxBeaten = elem.querySelector("#select_record_maxBeaten")
		const recordDesc = elem.querySelector("#select_record_descBeaten")

		this.runtime.translation.Elem_SetTranslateKey(selectRecordTitle, "Progress_Records")

		//Depending on the zone

		const zoneName = this.runtime?.waveManager?.zoneName || this.runtime?.progress?.settings?.Zone_Selected
		const zoneTr = this.runtime.translation.Get(zoneName)

		//Method 1: append title
		//selectRecordTitle.innerText += ` (${zoneTr})`

		//2 : special line
		/*this.runtime.translation.Elem_SetTranslateKey(recordInZone, "Progress_Records_InZone", (elem) => {
			
			elem.innerHTML = elem.innerHTML.replace("{zone}", `<span style="color: yellow">${zoneTr}</span>`)
		})*/

		const recordIcon = elem.querySelector("#recordIcon")

		if (!charaDataThis) {
			recordIcon.src = rewardIcon_No
			this.runtime.translation.Elem_SetTranslateKey(recordInZone, "Progress_Records_None")
		} else {
			//* regular (always if data exists)
			recordIcon.src = rewardIcon
			this.runtime.translation.Elem_SetTranslateKey(recordMaxBeaten, "Progress_Records_MaxDifficulty")

			recordIcon.src = rewardIcon
			this.AppendGetRecordLine(recordDesc, item, "regular", "single", false)
			this.AppendGetRecordLine(recordDesc, item, "regular", "coop", false)

			if (recordDesc.innerHTML === "") {
				this.runtime.translation.Elem_SetTranslateKey(recordDesc, "Progress_Records_None")
			}

			//* endless

			const thStyle = `
                width: 33%;
                text-align: center;
            `
			//border: ${Utils.px(0.3)} solid white;

			let tableHTML = /*html*/ `<table style="
                    width: 100%; 
                    border-collapse: collapse;
                    opacity: 0.9;
                    background: rgba(0, 0, 0, 0.5);
                    font-weight: bold;
                ">
                <thead>
                    <tr>
                        <th style="${thStyle}">${this.runtime.translation.Get("Difficulty")}</th>
                        <th style="${thStyle}">${this.runtime.translation.Get("Progress_single_Short")}</th>
                        <th style="${thStyle}">${this.runtime.translation.Get("Progress_coop_Short")}</th>
                    </tr>
                </thead>
                <tbody>`

			let hasEndlessRecord = false

			for (let i = 1; i <= 5; i++) {
				let bestSolo = this.runtime.progress.GetChara_GetBest(item, "endless", "single", false, i)
				let bestCoop = this.runtime.progress.GetChara_GetBest(item, "endless", "coop", false, i)

				const diffColor = this.GetDiffColor(i)

				if (bestSolo === -1 && bestCoop === -1) {
					//no record
				} else {
					hasEndlessRecord = true
					tableHTML += /*html*/ `<tr>
                        <td style="text-align: center; color: ${diffColor};">${i}</td>
                        <td style="text-align: center; color: ${bestSolo !== -1 ? diffColor : "gray"};">
                            ${bestSolo !== -1 ? bestSolo : "-"}
                        </td>
                        <td style="text-align: center; color: ${bestCoop !== -1 ? diffColor : "gray"};">
                            ${bestCoop !== -1 ? bestCoop : "-"}
                        </td>
                    </tr>`
				}
			}

			tableHTML += `</tbody></table>`

			//* Has Endless Record
			if (hasEndlessRecord) {
				const recordMaxEndless = elem.querySelector("#select_record_maxEndless")
				const recordDescEndless = elem.querySelector("#select_record_descEndless")

				this.runtime.translation.Elem_SetTranslateKey(recordMaxEndless, "Progress_Records_MaxEndless")
				elem.querySelector("#sep_endless").style.display = "flex"
				recordDescEndless.innerHTML = tableHTML
			}
		}
	}

	AppendEndlessLine(elem) {
		// Create a flex container
		const lineContainer = document.createElement("div")

		lineContainer.innerHTML = /*html*/ `
            <div class="horizontal justify_between w100" style="
                box-sizing: border-box; 
                padding-left: ${Utils.px(2)};
                padding-right: ${Utils.px(2)};
            ">
                <span style="flex: 1;">
                    ${description}
                </span>
                <span style="
                    color: ${bestColor}; 
                    text-align: right;
                    font-weight: bold;
                ">
                    ${best}
                </span>
            </div>
        `

		// Append line to the parent element
		elem.appendChild(lineContainer)
	}

	GetDiffColor(diff) {
		let diffColor = "white"
		if (diff === -1) {
			diffColor = "gray"
			diff = "None"
		} else {
			diffColor = this.runtime.tierColors["TIER_" + diff]
		}
		return diffColor
	}

	AppendGetRecordLine(elem, item, gameMode, playerMode, tweaks) {
		let best = this.runtime.progress.GetChara_GetBest(item, gameMode, playerMode, tweaks)

		const transKey = "Progress_" + playerMode + "_" + (tweaks ? "Tweaks" : "Vanilla")
		const description = this.runtime.translation.Get(transKey)

		const bestColor = this.GetDiffColor(best)

		if (best === -1) {
			best = "-"
		}

		// Create a flex container
		const lineContainer = document.createElement("div")

		lineContainer.innerHTML = /*html*/ `
            <div class="horizontal justify_between w100" style="
                box-sizing: border-box; 
                padding-left: ${Utils.px(2)};
                padding-right: ${Utils.px(2)};
            ">
                <span style="flex: 1;">
                    ${description}
                </span>
                <span style="
                    color: ${bestColor}; 
                    text-align: right;
                    font-weight: bold;
                ">
                    ${best}
                </span>
            </div>
        `

		// Append line to the parent element
		elem.appendChild(lineContainer)
	}

	SetCharaBoxStyle(elem, gameMode = "regular", playerMode = "single") {
		const item = elem.itemClass

		let best = this.runtime.progress.GetChara_GetBest(item, gameMode, playerMode)

		if (best > 0) {
			let bestTier = best //- 1

			/*
			if (this.runtime.main.isDemo) {
				best = 6
				bestTier = 6
			}*/

			let key = "TIER_" + bestTier
			if (best === -1) key = "TIER_0"
			if (best === 1) key = "TIER_0_Gray"
			//this.runtime.style.Elem_ItemStyle(elem, key)

			if (!item.locked || this.runtime.main.IsUnlockAll()) {
				item.evolution = bestTier
				this.runtime.style.Elem_ItemStyleFrame(elem, bestTier)
			}
		}
	}

	CreateMenu_Select() {
		this.runScreen = this.menu.CreateMenuScreen("runScreen", true, false)

		this.runScreen.innerHTML = /*html*/ `
            <div class="vertical justify_center s100" style="
                gap: ${Utils.px(10)};
               
            ">
                <div id="select_backBtn" class="horizontal justify_start" style="
                    gap: ${Utils.px(2)};
                     padding: ${Utils.px(5)};
                ">
                </div>
                <div id="select_Title" class="horizontal justify_center textOutline" style="
                    color: ${this.runtime.colorsText.Title};
                    font-weight: bold;
                    font-size: ${Utils.px(7)};
                ">
    
                </div>

                


                <div id="select_Descriptions" class="horizontal justify_center"
                    style="
                        height: ${Utils.px(200)}; 
                        gap: ${Utils.px(2)};
                    ">


                    <div id="select_locked" class="vertical items_center" style="width: ${Utils.px(infoWidth)};">
                        <div class="horizontal items_center justify_center">
                            <img src="${lockedIcon}" draggable="false"
                            style="width: ${Utils.px(20)}; height: ${Utils.px(20)};">
                            <div id="select_locked_title"> </div>
                        </div>
                        <div id="select_locked_MissionDesc">
                        </div>
                    </div>

                    <div id="select_record" class="vertical items_center" style="
                        width: ${Utils.px(infoWidth)};
                        padding: ${Utils.px(2)};
                    ">
                    </div>

                   


                    <div id="selectOptions" class="vertical items_center" style="width: ${Utils.px(infoWidth)};">
                        <div id="selectOptions_Title" style="
                            font-size: ${Utils.px(6)};
                            margin: ${Utils.px(2)};
                        ">
                        </div>
                        <div id="selectOptions_Options" class="vertical" style="
                            gap: ${Utils.px(1)};
                            margin: ${Utils.px(1)};
                        ">
                        </div>
                    </div>
                    
                </div>
                <div id="select_footer" class="vertical items_center" style="height: ${Utils.px(90)};">
                    <div id="inventoryChoice" class="inventory_grid simplebar_white justify_center" 
                        style="
                        box-sizing: border-box;
                        max-height: 95%;
                        max-width: 80%;
              
                        border-radius: ${Utils.px(1)};
                        ">
                        
                    </div>
                    <div id="wepChoices_Multi" class="horizontal s100" style="
                        display: none;
                        margin: ${Utils.px(2)};
                        gap: ${Utils.px(2)};
                    ">
                        
                    </div>
                    <div id="select_footerInstructs" class="" style="display:none;">
                    </div>
                    
                </div>
            </div>
        `

		this.selectTitle = this.runScreen.querySelector("#select_Title")

		const selectOptionsTitle = this.runScreen.querySelector("#selectOptions_Title")
		this.runtime.translation.Elem_SetTranslateKey(selectOptionsTitle, "Run_Options")

		/*const selectLockedTitle = this.runScreen.querySelector("#select_locked_title")
		this.runtime.translation.Elem_SetTranslateKey(selectLockedTitle, "Locked")*/

		const topButtons = this.runtime.menu.AddSettingsToID("select_backBtn", "", "", false, [
			{
				type: "button",
				label: "Back",
				style: "outline",
				callback: () => {
					this.BackSelect_Button()
				},
			},
			{
				type: "button",
				label: "Popup_Coop_GoTo",
				style: "outline",
				callback: () => {
					this.runtime.menu.GoTo("popup_coop_RemotePlay")
				},
			},
			{
				type: "button",
				label: "Coop_Reset_Players",
				style: "outline",
				callback: (bool) => {
					this.Players_Blur()
					this.Set_Coop(true)
				},
			},
		])

		this.select_backBtn = this.runScreen.querySelector("#select_backBtn")

		const selectOptions_Options = this.runScreen.querySelector("#selectOptions_Options")

		const WaveTypes = Array.from(this.runtime.loadedData["Zones"].keys())

		const settingsElem = this.runtime.menu.AddSettingsToElem(selectOptions_Options, "", "", false, [
			{
				type: "dropdown",
				//onlyList: true,
				label: "Zone",
				settingLink: "Zone_Selected",
				options: WaveTypes,
			},

			/*
			{
				type: "toggle",
				label: "Endless",
				settingLink: "Mode_Endless",
			},*/
			{
				type: "toggle",
				label: "Coop",
				settingLink: "Mode_Coop",
				callback: (bool) => {
					//! disabled automatic display
					/*
					if (bool && !this.displayed_coopRemotePlayPopup) {
						this.displayed_coopRemotePlayPopup = true
						this.runtime.menu.GoTo("popup_coop_RemotePlay")
					}*/
					this.Players_Blur()
					this.Set_Coop(bool)
				},
			},
			/*
			{
				type: "toggle",
				label: "Cheats_Shop&HP",
				callback: (bool) => {
					this.runtime.main.ToggleCheats(bool)
				},
			},
            */
			/*
			{
				type: "button",
				label: "Coop_Reset_Players",
				callback: (bool) => {
					this.Players_Blur()
					this.Set_Coop(true)
				},
			},*/
		])

		this.zoneSelect_dropdown = settingsElem[0]
		this.zoneSelect_dropdown.style.display = "none"

		//select Coop_Reset_Players

		//this.button_Coop_Reset_Players = settingsElem[3]

		this.button_Coop_Popup_GoToPopup = topButtons[1]
		this.button_Coop_Popup_GoToPopup.style.display = "none"

		//! CAREFUL: depends on Coop_Popup_GoToPopup position

		this.button_Coop_Reset_Players = topButtons[2]
		this.button_Coop_Reset_Players.style.display = "none"

		this.inventoryChoice = this.runScreen.querySelector("#inventoryChoice")

		this.wepChoices_Multi = this.runScreen.querySelector("#wepChoices_Multi")

		this.selectOptions = this.runScreen.querySelector("#selectOptions")
		this.selectLocked = this.runScreen.querySelector("#select_locked")
		this.selectRecord = this.runScreen.querySelector("#select_record")

		this.runtime.style.Elem_BoxStyle(this.selectLocked, "TIER_0", 5)

		this.runtime.style.Elem_BoxStyle(this.selectRecord, "TIER_0", 5)

		this.runtime.style.Elem_BoxStyle(this.selectOptions, "TIER_0", 5)

		this.selectLocked.style.display = "none"
		this.selectRecord.style.display = "none"

		this.SelectRecord_Refresh()

		this.charaTooltip = new Tooltip(this.runtime, false)
		this.wepTooltip = new Tooltip(this.runtime, false)
		this.diffTooltip = new Tooltip(this.runtime, false)

		this.charaTooltip.element.style.width = Utils.px(infoWidth_Tooltip)
		this.wepTooltip.element.style.width = Utils.px(infoWidth_Tooltip)
		this.diffTooltip.element.style.width = Utils.px(infoWidth_Tooltip)

		this.selectDesc = this.runScreen.querySelector("#select_Descriptions")

		this.selectDesc.insertBefore(this.diffTooltip.element, this.selectDesc.children[0])
		this.selectDesc.insertBefore(this.wepTooltip.element, this.selectDesc.children[0])
		this.selectDesc.insertBefore(this.charaTooltip.element, this.selectDesc.children[0])

		this.select_footerInstructs = this.runScreen.querySelector("#select_footerInstructs")

		//*multiplayer 4 players
		this.tooltipMulti_chara = []
		this.tooltipMulti_wep = []
		this.addPlayers = []
		this.locks = []
		for (let i = 0; i < 4; i++) {
			const addPlayer = document.createElement("div")
			const player = this.runtime.players[3 - i] //reverse order for correct color

			//!keep innerHTML way instead of outerHTML to avoid weird issues
			addPlayer.id = "addPlayer"
			addPlayer.className = "vertical justify_center items_center"
			addPlayer.style.display = "none" // Set initial styles
			addPlayer.style.width = Utils.px(infoWidth)

			addPlayer.innerHTML = /*html*/ `
            <div id="joinInstructs" style="
                margin-bottom: ${Utils.px(2)};
                text-align: center;
            ">
            </div>
            <div class="progressContainer"
                    style="
                        width: 80%;
                        height: ${Utils.px(30)};
                        background-color: #e0e0e0;
                        overflow: hidden;
                        position: relative;
                        border-radius: ${Utils.px(2)};
                    ">
                <div class="progressBar"
                    style="
                    width: 5%;
                    height: 100%;
                    background: linear-gradient(180deg, ${player.color_}, ${player.colorDark_});
                    border-radius: ${Utils.px(2)};
                    ">
                </div>
            </div>`

			this.runtime.style.Elem_BoxStyle(addPlayer, "TIER_0", 5)

			const joinInstructs = addPlayer.querySelector("#joinInstructs")

			const updateText = () => {
				let newText = joinInstructs.innerHTML
				newText = newText.replace("{img1}", "<img src='Control_Button_Dir_Down.png' style='height: 1.5em; vertical-align: middle;'>")
				newText = newText.replace("{img2}", "<img src='Control_Key_Space.png' style='height: 1.5em; vertical-align: middle;'>")
				joinInstructs.innerHTML = newText
			}

			Utils.Elem_SetTranslateKey(joinInstructs, "Control_HoldJoin", updateText)

			this.selectDesc.insertBefore(addPlayer, this.selectDesc.children[0])
			this.addPlayers.unshift(addPlayer)

			const tooltip = new Tooltip(this.runtime, false)
			tooltip.element.style.width = Utils.px(infoWidth_Tooltip)
			tooltip.DisplayNone()
			this.tooltipMulti_chara.unshift(tooltip)
			this.selectDesc.insertBefore(tooltip.element, this.selectDesc.children[0])

			const tooltipWep = new Tooltip(this.runtime, false)
			tooltipWep.element.style.width = Utils.px(infoWidth_Tooltip)
			tooltipWep.DisplayNone()
			this.tooltipMulti_wep.unshift(tooltipWep)
			this.selectDesc.insertBefore(tooltipWep.element, this.selectDesc.children[0])

			const locked = document.createElement("div")
			this.selectDesc.insertBefore(locked, this.selectDesc.children[0])
			this.locks.unshift(locked)
			locked.classList.add("vertical", "items_center", "justify_center")
			locked.style.display = "none"
			/*locked.style.border = this.runtime.borderSolid(player.color_)
			locked.style.backgroundColor = player.colorDark_*/

			locked.style.width = Utils.px(infoWidth)

			locked.innerHTML = /*html*/ `
                <img src="${lockedIcon}" draggable="false"
                style="width: ${Utils.px(40)}; height: ${Utils.px(40)};">
                <div id="select_locked_MissionDesc">
                </div>
                `

			this.runtime.style.Elem_BoxStyle(locked, "Player" + player.playerIndex, 5)
		}

		this.menuInit = true
	}

	ResetAny() {
		this.button_Coop_Popup_GoToPopup.style.display = "none"
		this.button_Coop_Reset_Players.style.display = "none"

		this.inventoryChoice.classList.remove("justify_center")

		this.inventoryChoice.style.maxWidth = "80%"

		this.selectOptions.style.display = "none"

		this.selectLocked.style.display = "none"
		this.selectRecord.style.display = "none"
		this.wepTooltip.DisplayNone()
		this.charaTooltip.DisplayNone()
		this.diffTooltip.DisplayNone()

		this.select_footerInstructs.style.display = "none"
		this.inventoryChoice.style.display = "none"

		this.wepChoices_Multi.style.display = "none"
		this.wepChoices_Multi.innerHTML = ""

		for (const tooltip of this.tooltipMulti_chara) {
			tooltip.DisplayNone()
		}

		for (const tooltip of this.tooltipMulti_wep) {
			tooltip.DisplayNone()
		}

		this.addPlayers.forEach((addPlayer) => {
			addPlayer.style.display = "none"
		})

		this.locks.forEach((locked) => {
			locked.style.display = "none"
		})
	}

	press(kind, bool) {
		let index = this.playerConnect.findIndex((elem) => elem && elem.kind === kind)

		const mult = bool ? 1 : -1

		//on press
		if (bool) {
			if (index === -1) {
				this.playerConnect.push({ kind: kind, progress: 0 })
				index = this.playerConnect.length - 1
			}
		}
		//on not pressed
		else {
			if (index === -1) {
				return
			}
		}
		const nextAddPlayer = this.addPlayers[index]
		const nextTooltip = this.tooltipMulti_chara[index]
		const player = this.runtime.players[index]

		const playerCo = this.playerConnect[index]

		const progressBar = nextAddPlayer.querySelector(".progressBar")

		if (!bool) {
			progressBar.style.width = `0%`
			if (playerCo.progress === 100) return
			this.playerConnect.splice(index, 1)
			return
		}

		playerCo.progress = Utils.clamp(playerCo.progress + 100 * mult * this.runtime.dt, 0, 100)

		progressBar.style.width = `${playerCo.progress}%`
		if (playerCo.progress === 0) {
			this.playerConnect.splice(index, 1)
		}

		//* Actually connect the player
		if (!playerCo.connected && playerCo.progress === 100) {
			//*show reset button
			this.button_Coop_Popup_GoToPopup.style.display = "flex"
			this.button_Coop_Reset_Players.style.display = "flex"

			playerCo.connected = true

			//playerCo.progress = 0
			nextAddPlayer.style.display = "none"
			nextTooltip.DisplayFlex()

			nextTooltip.SetTooltipFromItem(this.runtime.dataManager.randomItem, player, "runSelect")
			//focus
			const items = this.inventoryChoice.querySelectorAll(".itemBox")

			if (index === 0) {
				this.select_footerInstructs.style.display = "none"
				this.inventoryChoice.style.display = "flex"
			}

			player.SetPlayerEnabled(true)

			player.SetInputID(kind)

			if (player.isPlayer0) player.SpatialNavigation()
			else player.SpatialNavigation(this.inventoryChoice)

			//player.SpatialNavigation()

			player.SN.focus(items[0])
		}
	}

	BackSelect_Button() {
		this.Back(null, true)
	}

	Back(player = null, viaButton = false) {
		//*COOP
		if (this.runtime.settings.Mode_Coop) {
			//*was Ready => not Ready
			const ID = player ? player.playerIndex : 0
			if (this.validateItems[ID]) {
				this.ValidateOverlay(ID, false)
				return
			}

			//COOP just disconnect or Cancel Prepare
			if (this.step === 0) {
				//if the actual Back Button was pressed, go to Title
				//If at least one player is connected
				if (!viaButton && this.playerConnect.length > 0) {
					//* NOTHING HAPPENS (=EXPECTED BEHAVIOR)
				}
				//* If no player is connected
				else {
					this.runtime.menu.ClearStack()
					this.runtime.goToLayout("TITLE")
				}
			} else if (this.step === 1) {
				this.Multi_RunSelect_Chara(true)
			} else if (this.step === 2) {
				this.Multi_RunSelect_Wep(true)
			}
		}
		//*SINGLE
		else {
			if (this.step === 0) {
				this.runtime.menu.ClearStack()
				this.runtime.goToLayout("TITLE")
			} else if (this.step === 1) {
				this.Single_RunSelect_Chara(true)
			} else if (this.step === 2) {
				this.Single_RunSelect_Wep(true)
			}
		}
	}

	ResetPlayerConnection() {
		this.playerConnect = []
		const progressBars = this.runScreen.querySelectorAll(".progressBar")
		progressBars.forEach((progressBar) => {
			progressBar.style.width = `0%`
		})

		for (const player of this.runtime.players) {
			if (player.playerIndex !== 0) player.SetPlayerEnabled(false)

			player.startRun_chara = null
			player.startRun_wep = null
		}

		this.runtime.player.SetInputID(null)
	}

	Players_Blur() {
		for (const player of this.runtime.players) {
			player.SN.blur()
		}
	}

	Set_Coop(bool) {
		if (!this.menuInit) return

		this.ResetAny()

		//this.runtime.singlePlayer = !bool

		//reset players

		this.ResetPlayerConnection()

		//Set Coop
		if (bool) {
			this.Multi_RunSelect_Chara()
		}
		//Set Singleplayer
		else {
			this.Single_RunSelect_Chara()
		}
	}

	Init_Select(itemsArray, elemChoiceGrid = null, player = null) {
		if (!this.runtime.main.isDemo) {
			itemsArray = itemsArray.filter((item) => item.lockedBy !== "Demo_Dummy")
		}
		const inventoryHtml = itemsArray
			.map((item, index) => {
				let imgIcon = item.img

				if (!this.runtime.main.IsUnlockAll()) {
					if (item.locked) {
						imgIcon = lockedIcon
					}
				}

				if (item.lockedBy === "Demo" || item.lockedBy === "Dev") {
					imgIcon = lockedIcon_Demo
				}
				if (item.lockedBy === "Steam") {
					imgIcon = lockedIcon_Steam
				}
				if (item.locked) {
					if (item.name.includes("Overboy")) {
						imgIcon = lockedIcon_Special
					}
				}

				return /*html*/ `
                <div class="itemBox" data-item-index="${index}">
                    <img src="${imgIcon}" draggable="false" 
                        onerror="this.onerror=null; this.src='random_icon.png';">
                    
                </div>


            `
			})
			.join("")

		elemChoiceGrid = elemChoiceGrid || this.inventoryChoice
		player = player || this.runtime.player

		const backgroundImg = "Brota/Graph/_curse_border.png"

		elemChoiceGrid.innerHTML = inventoryHtml
		const items = elemChoiceGrid.querySelectorAll(".itemBox")
		items.forEach((item) => {
			/*
			item.style.cssText += `
            background-image: url('${backgroundImg}'); 
            background-size: contain; 
            background-position: center; 
            background-repeat: no-repeat; `*/

			const itemIndex = item.getAttribute("data-item-index")
			const itemClass = itemsArray[itemIndex]

			const key = "TIER_" + itemClass.evolution
			//this.runtime.style.Elem_ItemStyle(item, key)

			this.runtime.style.Elem_ItemStyleFrame(item, itemClass.evolution)

			item.player = this.player
			item.itemClass = itemClass

			if (!this.runtime.main.IsUnlockAll()) {
				item.locked = itemClass.locked
			}

			Utils.Elem_FocusableOutline(item)
		})
	}

	UpdatePools() {
		this.pool_difficulty = Array.from(this.runtime.dataInstances["Items"].values())
		this.pool_difficulty = this.pool_difficulty.filter((item) => item.HasTag("Difficulty"))

		this.pool_charas = Array.from(this.runtime.dataInstances["Items"].values())
		this.pool_charas = this.pool_charas.filter((item) => item.HasTag("Playable"))

		this.pool_charas = this.pool_charas.filter((item) => item.lockedBy !== "Invisible")

		//Demo: filler characters achievements
		if (this.runtime.main.isDemo) {
			for (let i = 0; i < 30; i++) {
				this.pool_charas.push({
					name: "Chara_Dummy_Demo_" + i,
					locked: true,
					lockedBy: "Demo",
					evolution: 0,
				})
			}
		}

		this.pool_charaRands = [...this.pool_charas]
		this.pool_charaRands = this.pool_charaRands.filter((item) => !item.locked)

		this.pool_charas.unshift(this.runtime.dataManager.randomItem) //add random item in Front

		this.pool_weps = Array.from(this.runtime.dataInstances["Items"].values())
		this.pool_weps = this.pool_weps.filter((item) => item.itemType === "Weapon" && item.isEvoMin)

		this.pool_wepRands = [...this.pool_weps]
		this.pool_wepRands = this.pool_wepRands.filter((item) => !item.locked)

		//this.pool_weps.unshift(this.runtime.dataManager.randomItem) //add random item in Front (no need, added later)

		const nullsFirst = this.pool_charas.filter((chara) => chara.modLoading === null)
		const others = this.pool_charas.filter((chara) => chara.modLoading !== null)
		this.pool_charas = [...nullsFirst, ...others]
	}

	//singlePlayer

	LockedItem(item) {
		const lockedIconImg = item.querySelector("img")
		Utils.Elem_Shake(lockedIconImg)
		this.runtime.audio.PlaySound("UI_ClickFailBuzzer", 0.5)
	}

	SetWidth_CharaSelect() {
		if (this.runtime.main.isDemo) {
			this.inventoryChoice.style.maxWidth = Utils.px(280)
		} else {
			this.inventoryChoice.style.maxWidth = Utils.px(250)
		}
	}

	Single_RunSelect_Chara(back = false) {
		this.step = 0

		this.ResetAny()

		//reset set visible
		this.selectOptions.style.display = "flex"
		this.inventoryChoice.style.display = "flex"

		//
		this.runtime.translation.Elem_SetTranslateKey(this.selectTitle, "Select_Chara")

		this.Init_Select(this.pool_charas)

		this.SetWidth_CharaSelect()

		const items = this.inventoryChoice.querySelectorAll(".itemBox")
		const player = this.runtime.player
		items.forEach((item) => {
			let itemClass = item.itemClass

			this.SetCharaBoxStyle(item)

			item.addEventListener("sn:pressed", (e) => {
				if (item.locked) {
					this.LockedItem(item)
				} else {
					this.selectRecord.style.display = "none"

					if (itemClass === this.runtime.dataManager.randomItem) {
						itemClass = Utils.Array_Random(this.pool_charaRands)
					}

					this.runtime.player.startRun_chara = itemClass

					this.Single_RunSelect_Wep()
				}
			})

			const focus = () => {
				if (itemClass) {
					this.selectLocked.style.display = "none"
					if (item.locked) {
						this.SetInfo_Locked(this.selectLocked, itemClass)
						this.selectRecord.style.display = "none"
						this.charaTooltip.DisplayNone()

						const achieveMap = Array.from(this.runtime.progress.challenges.values())
						const achievement = achieveMap.find((c) => c.unlockedItem === itemClass)
					} else {
						//set info record first

						this.charaTooltip.DisplayFlex()
						this.charaTooltip.SetTooltipFromItem(itemClass, player, "runSelect")
					}
					this.SetInfo_Record(this.selectRecord, itemClass, this.charaTooltip.element)
				}
			}

			const unfocus = () => {
				if (this.state === 0) {
					//this.charaTooltip.DisplayNone()
				}
			}

			Utils.Elem_Focusable(item, focus, unfocus, false)
		})

		requestAnimationFrame(() => {
			if (back) {
				const itemsArray = Array.from(items)
				const foundItem = itemsArray.find((item) => item.itemClass === player.startRun_chara)

				if (foundItem) {
					player.SN.focus(foundItem)
				}
			} else player.SN.focus(items[0])

			this.runtime.player.startRun_chara = null
		})
	}

	GetWepArray(startRun_chara) {
		const startWepNames = startRun_chara.Start_ATK
		let wepArray = [...this.pool_weps]

		if (startWepNames.includes("All")) {
			wepArray = this.pool_weps.filter((inst) => !inst.name.includes("zFiller"))
			//sort alphabetically by evoName
			wepArray.sort((a, b) => a.nameEvo.localeCompare(b.nameEvo))
		} else {
			wepArray = this.pool_weps.filter((inst) => startWepNames.includes(inst.name))

			const typeArray = startWepNames.filter((typeName) => typeName.startsWith("Type_")).map((typeName) => typeName.replace("Type_", ""))
			for (const type of typeArray) {
				const typeWeps = this.pool_weps.filter((inst) => inst.HasTag(type))
				for (const typeWep of typeWeps) {
					if (!wepArray.includes(typeWep)) {
						wepArray.push(typeWep)
					}
				}
			}

			wepArray.sort((a, b) => startWepNames.indexOf(a.name) - startWepNames.indexOf(b.name))
		}

		const excludesFromAll = ["Minime", "Twin", "Doppel", "Minion_Tank"]

		wepArray = wepArray.filter((inst) => !excludesFromAll.some((exclude) => inst.name.includes(exclude)))

		wepArray.unshift(this.runtime.dataManager.randomItem)

		// Sort so that items with locked = true are at the end
		wepArray.sort((a, b) => {
			if (a.locked === b.locked) return 0
			return a.locked ? 1 : -1
		})

		return wepArray
	}

	Single_RunSelect_Wep(back = false) {
		this.step = 1

		this.ResetAny()

		//reset set visible

		this.charaTooltip.DisplayFlex()
		this.inventoryChoice.style.display = "flex"

		this.runtime.translation.Elem_SetTranslateKey(this.selectTitle, "Select_Attack")

		const player = this.runtime.player

		const wepArray = this.GetWepArray(player.startRun_chara)

		this.Init_Select(wepArray)

		const items = this.inventoryChoice.querySelectorAll(".itemBox")

		items.forEach((item) => {
			let itemClass = item.itemClass
			item.addEventListener("sn:pressed", (e) => {
				if (item.locked) {
					this.LockedItem(item)
				} else {
					if (itemClass === this.runtime.dataManager.randomItem) {
						//get random wep among availables
						let wepRands = wepArray.slice(1)
						wepRands = wepRands.filter((item) => !item.locked)
						itemClass = Utils.Array_Random(wepRands)
						console.error("Random wep", itemClass, wepRands)
					}

					this.runtime.player.startRun_wep = itemClass

					this.RunSelect_Difficulty()
				}
			})

			const focus = () => {
				if (itemClass) {
					this.selectLocked.style.display = "none"
					if (item.locked) {
						this.SetInfo_Locked(this.selectLocked, itemClass)
						this.wepTooltip.DisplayNone()
					} else {
						this.wepTooltip.DisplayFlex()

						this.wepTooltip.SetTooltipFromItem(itemClass, player, "runSelect")
					}
				}
			}

			const unfocus = () => {
				if (this.state === 1) {
					//this.wepTooltip.DisplayNone()
				}
			}

			Utils.Elem_Focusable(item, focus, unfocus, false)
		})

		requestAnimationFrame(() => {
			if (back) {
				const itemsArray = Array.from(items)
				const foundItem = itemsArray.find((item) => item.itemClass === player.startRun_wep)

				if (foundItem) {
					player.SN.focus(foundItem)
				}
			} else player.SN.focus(items[0])

			this.runtime.player.startRun_wep = null
		})
	}

	//* ================== Multiplayer ================== *//

	Multi_RunSelect_Chara(back = false) {
		this.step = 0

		//reset if needed (back button)
		this.ResetAny()

		this.selectOptions.style.display = "flex"

		//show stuff
		if (back) {
			this.inventoryChoice.style.display = "flex"
			for (let i = 0; i < 4; i++) {
				const player = this.runtime.players[i]
				if (i < this.runtime.playersEnabled.size) {
					this.tooltipMulti_chara[i].DisplayFlex()
				} else {
					this.addPlayers[i].style.display = "flex"
				}
			}
		}
		if (!back) {
			this.select_footerInstructs.style.display = "flex"
			this.addPlayers.forEach((addPlayer) => {
				addPlayer.style.display = "flex"
			})
		}

		//
		this.runtime.translation.Elem_SetTranslateKey(this.selectTitle, "Select_Chara")

		this.Init_Select(this.pool_charas)

		this.SetWidth_CharaSelect()

		//mask it first

		const items = this.inventoryChoice.querySelectorAll(".itemBox")

		items.forEach((item) => {
			let itemClass = item.itemClass
			item.addEventListener("sn:pressed", (e) => {
				const playerID = e.detail.playerID || 0
				const player = this.runtime.players[playerID]
				const tooltip = this.tooltipMulti_chara[playerID]
				const locked = this.locks[playerID]

				if (item.locked) {
					this.LockedItem(item)
				} else {
					//add validate overlay

					//random item

					if (itemClass === this.runtime.dataManager.randomItem) {
						itemClass = Utils.Array_Random(this.pool_charaRands)
					}

					this.ValidateOverlay(playerID, true, itemClass)

					player.startRun_chara = itemClass

					this.Multi_CheckReady()
				}
			})

			const focus = (e) => {
				const playerID = e.detail.playerID || 0
				const player = this.runtime.players[playerID]
				const tooltip = this.tooltipMulti_chara[playerID]
				const locked = this.locks[playerID]

				if (itemClass) {
					this.ValidateOverlay(playerID, false)
					if (item.locked) {
						tooltip.DisplayNone()
						this.SetInfo_Locked(locked, itemClass)
					} else {
						tooltip.DisplayFlex()
						locked.style.display = "none"

						tooltip.SetTooltipFromItem(itemClass, player, "runSelect", {
							colorOutline: player.color_,
							colorBG: player.colorDark_,
							colorTitle: "white",
						})
					}
				}
			}

			const unfocus = (e) => {
				//
			}

			Utils.Elem_Focusable(item, focus, unfocus, false)
		})

		requestAnimationFrame(() => {
			if (back) {
				for (const player of this.runtime.playersEnabled) {
					if (player.isPlayer0) player.SpatialNavigation()
					else player.SpatialNavigation(this.inventoryChoice)

					const itemsArray = Array.from(items)
					const foundItem = itemsArray.find((item) => item.itemClass === player.startRun_chara)

					if (foundItem) {
						player.SN.focus(foundItem)
					}
				}
			} else {
				this.Players_Blur()
			}

			for (const player of this.runtime.players) {
				player.startRun_chara = null
			}
		})
	}

	Multi_RunSelect_Wep(back = false) {
		this.step = 1

		this.ResetAny()

		this.runtime.translation.Elem_SetTranslateKey(this.selectTitle, "Select_Attack")

		this.selectOptions.style.display = "none"

		for (const player of this.runtime.playersEnabled) {
			const i = player.playerIndex
			this.tooltipMulti_wep[i].DisplayFlex()

			this.wepChoices_Multi.style.display = "flex"

			const color = this.runtime.colorUtils.hexOpacity(player.color_, 0.2)

			this.wepChoices_Multi.insertAdjacentHTML(
				"beforeend",
				/*html*/ `
                <div id="inventoryChoice" class="inventory_grid flex_1 simplebar_white justify_center" 
                        style="
                            box-sizing: border-box;
                            max-width: 100%;
                            max-height: 95%;
                            border-radius: ${Utils.px(1)};
                            background-color:${color};
                        ">
                        
                    </div>
                    `
			)

			const wepChoice = this.wepChoices_Multi.lastElementChild

			const wepArray = this.GetWepArray(player.startRun_chara)

			this.Init_Select(wepArray, wepChoice, player)

			const items = wepChoice.querySelectorAll(".itemBox")

			const wepTooltip = this.tooltipMulti_wep[i]
			const locked = this.locks[i]
			const playerID = i

			items.forEach((item) => {
				let itemClass = item.itemClass
				item.addEventListener("sn:pressed", (e) => {
					if (item.locked) {
						this.LockedItem(item)
					} else {
						if (itemClass === this.runtime.dataManager.randomItem) {
							//get random wep among availables
							let wepRands = wepArray.slice(1)
							wepRands = wepRands.filter((item) => !item.locked)
							itemClass = Utils.Array_Random(wepRands)
						}

						player.startRun_wep = itemClass

						this.ValidateOverlay(playerID, true, itemClass)

						this.Multi_CheckReady()
					}
				})

				const focus = () => {
					if (itemClass) {
						this.ValidateOverlay(playerID, false)
						if (item.locked) {
							this.SetInfo_Locked(locked, itemClass)
							wepTooltip.DisplayNone()
						} else {
							locked.style.display = "none"

							wepTooltip.DisplayFlex()

							wepTooltip.SetTooltipFromItem(itemClass, player, "runSelect", {
								colorOutline: player.color_,
								colorBG: player.colorDark_,
								colorTitle: "white",
							})
						}
					}
				}

				const unfocus = () => {
					if (this.state === 1) {
						//this.wepTooltip.DisplayNone()
					}
				}

				Utils.Elem_Focusable(item, focus, unfocus, false)
			})

			//!todo focus only the selected itemboxs
			player.SpatialNavigation([wepChoice, this.select_backBtn])

			requestAnimationFrame(() => {
				if (back) {
					const itemsArray = Array.from(items)
					const foundItem = itemsArray.find((item) => item.itemClass === player.startRun_wep)

					if (foundItem) {
						player.SN.focus(foundItem)
					}
				} else player.SN.focus(items[0])

				player.startRun_wep = null
			})
		}
	}

	RunSelect_Difficulty() {
		this.step = 2

		this.ResetAny()

		this.Init_Select(this.pool_difficulty)

		this.runtime.translation.Elem_SetTranslateKey(this.selectTitle, "Select_Difficulty")

		this.inventoryChoice.classList.add("justify_center")
		this.inventoryChoice.style.display = "flex"
		this.selectLocked.style.display = "none"

		this.diffTooltip.DisplayFlex()

		if (!this.runtime.settings.Mode_Coop) {
			this.wepTooltip.DisplayFlex()
			this.charaTooltip.DisplayFlex()
		}

		const items = this.inventoryChoice.querySelectorAll(".itemBox")
		const player = this.runtime.player
		items.forEach((item) => {
			let itemClass = item.itemClass
			const itemIndex = item.getAttribute("data-item-index")
			item.addEventListener("sn:pressed", (e) => {
				if (item.locked) {
					this.LockedItem(item)
				} else {
					this.runtime.waveManager.difficultyItem = itemClass
					this.runtime.waveManager.Set_Difficulty(parseInt(itemIndex) + 1)

					this.menu.CloseAll()
					this.runtime.goToLayout("GAME")
				}
			})

			const focus = () => {
				if (itemClass) {
					this.selectLocked.style.display = "none"
					if (item.locked) {
						this.SetInfo_Locked(this.selectLocked, itemClass)
						this.diffTooltip.DisplayNone()
					} else {
						this.diffTooltip.DisplayFlex()

						this.diffTooltip.SetTooltipFromItem(itemClass, player, "runSelect")
					}
				}
			}

			const unfocus = () => {
				//
			}

			Utils.Elem_Focusable(item, focus, unfocus, false)
		})

		for (const player of this.runtime.players) {
			if (player.isPlayer0) {
				player.SpatialNavigation()
				player.SN.focus(items[0])
			} else player.SN.clear()
		}
	}

	ValidateOverlay(index, bool, item = null) {
		const tooltip = this.step === 0 ? this.tooltipMulti_chara[index] : this.tooltipMulti_wep[index]
		if (bool) {
			if (this.validateItems[index] === null) {
				const readyOverlay = document.createElement("div")
				readyOverlay.id = "readyOverlay"

				readyOverlay.classList.add("flex", "items_center", "justify_center")

				Object.assign(readyOverlay.style, {
					position: "absolute",
					top: "0",
					left: "0",
					width: "100%",
					height: "100%",
					backgroundColor: "rgba(0, 0, 0, 0.31)",
					zIndex: "10",
				})

				readyOverlay.innerHTML = /*html*/ `
                <img src="checkmark.png" draggable="false" style="
                    pointer-events: none; 
                    width: ${Utils.px(40)}; 
                    height: ${Utils.px(40)}; 
                ">
                `

				tooltip.element.appendChild(readyOverlay)
			}

			this.validateItems[index] = item
		} else if (!bool) {
			if (this.validateItems[index] === item) return
			this.validateItems[index] = null
			const readyOverlay = tooltip.element.querySelector("#readyOverlay")
			if (readyOverlay) readyOverlay.remove()
		}
	}

	Multi_CheckReady() {
		const playerCount = this.runtime.playersEnabled.size
		if (playerCount < 2) return false
		for (let i = 0; i < playerCount; i++) {
			if (this.validateItems[i] === null) return false
		}
		//all players ready
		this.runScreen.querySelectorAll("#readyOverlay").forEach((readyOverlay) => {
			readyOverlay.remove()
		})
		this.validateItems = [null, null, null, null]

		if (this.step === 0) {
			this.Multi_RunSelect_Wep()
		} else if (this.step === 1) {
			this.RunSelect_Difficulty()
		}
	}
}
