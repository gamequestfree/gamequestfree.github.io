import { Inventory } from "../inventory/Inventory.js"

import { Menu_StartRun } from "../menu/Menu_StartRun.js"

export class Menu_Manager {
	constructor(runtime) {
		this.runtime = runtime

		runtime.addEventListener("resize", (e) => this.CheckResize(e))
		runtime.addEventListener("beforeprojectstart", () => this.BeforeProjectStart())

		this.menuStack = []

		this.nameToMenu = new Map()

		this.nameToCallback = new Map()

		this.CreateMenus_Init()

		this.stopFocus = false

		this.playerMenuID = -1
		runtime.addEventListener("beforeanylayoutend", () => (this.playerMenuID = -1))

		runtime.addEventListener("tick", () => this.ScrollElem_Tick())

		this.startRun = new Menu_StartRun(this)

		this.scrollElem = null
		this.scrollAnimating = false
		this.scrollTop_target = 0
		this.scrollTop_current = 0

		document.addEventListener("wheel", (e) => this.HandleMouseWheel(e))
	}

	HandleMouseWheel(event) {
		// Determine scroll direction
		const isScrollingUp = event.deltaY < 0

		// Call ScrollElem_Step with the correct direction
		this.ScrollElem_Step(isScrollingUp, 30)

		// Prevent default behavior if needed
		//event.preventDefault()
	}

	ScrollElem_Set(elem) {
		this.scrollElem = elem
		this.scrollTop_target = 0
		this.scrollTop_current = 0
	}

	ScrollElem_Step(toTop = false, step = 10) {
		if (!this.scrollElem) return false

		if (toTop) {
			step = -step
		}

		this.scrollTop_target += step

		// Calculate the maximum scrollable value
		const maxScroll = this.scrollElem.scrollHeight - this.scrollElem.clientHeight

		// Clamp scrollTop_target between 0 and maxScroll
		this.scrollTop_target = Math.max(0, Math.min(this.scrollTop_target, maxScroll))

		return true
	}

	ScrollElem_Tick() {
		if (!this.scrollElem) return

		this.scrollTop_current = C3.lerp(this.scrollTop_current, this.scrollTop_target, 10 * this.runtime.dt)
		this.scrollElem.scrollTop = this.scrollTop_current
	}

	CreateMenus_Init() {
		this.Create_BottomRightText()
		this.Create_BottomLeftText()
		this.Create_CheatToggle()

		this.Create_InGameUI()

		this.CreateMenus_AllOther()

		const popup_retry_failedWaves = this.Create_PopUp({
			name: "popup_retry_failedWaves",
			keyTitle: "Run_Lost",
			keyScroll: "Popup_Retry_Scroll",
			height: 50,
			buttons_Layout: "vertical",
			bgGray: 0.4,
			buttons: [
				{
					type: "button",
					label: "Yes",
					callback: () => {
						this.runtime.menu.CloseAll()
						this.runtime.timeScale = 1
						this.runtime.waveManager.Wave_Retry()
					},
				},
				{
					type: "button",
					label: "No",
					callback: () => {
						this.runtime.menu.CloseAll()
						this.runtime.menu.GameOver_Actual(false, false)
					},
				},
			],
		})

		const popup_coop_RemotePlay = this.Create_PopUp({
			name: "popup_coop_RemotePlay",
			keyTitle: "Popup_Coop_Title",
			//keyText: "Popup_Coop_Info",
			keyScroll: "Popup_Coop_Scroll",
			buttons: [
				{
					type: "button",
					label: "OK",
					callback: () => {
						this.Back()
					},
				},
			],
		})

		const popup_exitGame = this.Create_PopUp({
			name: "popup_Quit_Demo",
			keyTitle: "Popup_Quit_Title",
			//keyText: "Popup_Quit_Info",
			keyScroll: "Popup_Quit_Scroll",
			width: 200,
			height: 150,
			buttons: [
				{
					type: "button",
					label: "Cancel",
					callback: () => {
						this.Back()
					},
				},
				{
					type: "button",
					label: "Discord",
					BG_Color: "#7289da",
					callback: () => {
						this.OpenDiscord()
					},
				},
				{
					type: "button",
					label: "Wishlist",
					BG_Color: "#1fa11b",
					callback: () => {
						this.OpenSteamPage_App()
					},
				},
				{
					type: "button",

					label: "Quit",
					callback: () => {
						window.close()
					},
				},
			],
		})
	}

	MenuEnterExit(name, enterBool = true) {
		const callbacks = this.nameToCallback.get(name)
		if (callbacks?.onEnterExit) callbacks.onEnterExit(enterBool)
		if (enterBool && callbacks?.onEnter) callbacks.onEnter()
		if (!enterBool && callbacks?.onExit) callbacks.onExit()
	}

	Create_InGameUI() {
		const C3htmlwrap = document.querySelector(".c3html")

		const menuParent = document.createElement("div")
		C3htmlwrap.appendChild(menuParent)
		//menuParent.classList.add("")
		menuParent.id = "InGameUI"

		Utils.Elem_SetStyle(menuParent, {
			position: "absolute",
			top: 0,
			left: 0,
			width: "100%",
			height: "100%",
			display: "none",
		})

		//menuParent.innerHTML = /*html*/ ``
	}

	Create_PopUp(args) {
		let screenName = args.name
		let keyTitle = args.keyTitle
		let keyText = args.keyText
		let keyScroll = args.keyScroll
		let buttonData = args.buttons
		let containerWidth = args.width || 200
		let containerHeight = args.height || 200

		let buttons_Layout = args.buttons_Layout || "horizontal"
		let buttons_minWidth = args.buttons_minWidth || 35

		const popupScreen = this.CreateMenuScreen(screenName, true, false)

		let bgGray = args.bgGray || 0.4

		popupScreen.innerHTML = /*html*/ `
			<div class="vertical items_center justify_center s100" style="
                background-color: rgba(0, 0, 0, ${args.bgGray});
            ">
				<div class="vertical items_center justify_center s100" style="
					gap: ${Utils.px(10)};
				">
					<div id="popupContainer" class="vertical items_center justify_center w100" style="
						height: ${Utils.px(containerHeight)};
						width: ${Utils.px(containerWidth)};
						background-color:rgba(0, 0, 0, 0.84);
						border-radius: ${Utils.px(10)};
						padding: ${Utils.px(10)};
                        gap: ${Utils.px(10)};
					">
                        <div id="popupTitle" class="vertical items_center justify_center" style="
                            font-size: ${Utils.px(10)};
                            font-weight: bold;
                            color: ${this.runtime.colorsText.Title};
                        ">
                        </div>
                        <div id="popupInfo" class="vertical items_center justify_center">
                        </div>
						<div id="popupScrollable" class="vertical items_center justify_start simplebar_white" style="
                             flex-grow: 1; 
							 scrollbar-color: rgba(255, 255, 255, 0.5) transparent;
                             min-width: 50%
						">
                            <div id="popupInfo_Scroll" class="">

                            </div>
						</div>
					</div>
					<div id="popupButtons" class="${buttons_Layout}" style="
                        background-color: transparent;
                        margin: ${Utils.px(1)};
                        gap: ${Utils.px(2)};
                        
                    ">
						<!-- Buttons can be added here -->
					</div>
				</div>
			</div>
		`

		const popupTitle = popupScreen.querySelector("#popupTitle")
		const popupInfo = popupScreen.querySelector("#popupInfo")
		const popupScrollable = popupScreen.querySelector("#popupScrollable")
		const popupInfo_Scroll = popupScreen.querySelector("#popupInfo_Scroll")
		const popupButtons = popupScreen.querySelector("#popupButtons")

		if (keyTitle) Utils.Elem_SetTranslateKey_ToHTML(popupTitle, keyTitle)
		if (keyText) Utils.Elem_SetTranslateKey_ToHTML(popupInfo, keyText)
		if (keyScroll) Utils.Elem_SetTranslateKey_ToHTML(popupInfo_Scroll, keyScroll)

		const creditsCallbacks = this.nameToCallback.get(screenName)
		creditsCallbacks["onEnterExit"] = (bool) => {
			if (bool) this.ScrollElem_Set(popupScrollable)
			else this.ScrollElem_Set(null)
		}

		if (buttonData) {
			let btns = this.AddSettingsToElem(popupButtons, "", "", true, buttonData)
			if (!Array.isArray(btns)) btns = [btns]
			for (const btn of btns) {
				btn.style.padding = Utils.px(3)
				btn.style.minWidth = Utils.px(buttons_minWidth)
			}
		}

		return popupScreen
	}

	Create_CheatToggle() {
		const C3htmlwrap = document.querySelector(".c3html")

		// Create the top-right element
		const topRightElement = document.createElement("div")
		topRightElement.id = "topRightElement"

		// Style the element to be in the top-right corner, above everything else
		Object.assign(topRightElement.style, {
			position: "fixed",
			top: "0",
			right: "0",
			width: Utils.px(100), // Set desired width
			zIndex: "10000", // Ensure it is above all other elements
			display: "flex",
			justifyContent: "center",
			alignItems: "center",

			fontWeight: "bold",
		})

		this.cheatButton = this.AddSettingsToElem(topRightElement, "", "", false, [
			{
				type: "toggle",
				label: "Cheats_Shop&HP",
				callback: (bool) => {
					this.runtime.main.ToggleCheats(bool)
				},
			},
		])

		this.cheatButton.classList.add("pointerLabel")
		this.cheatButton.classList.remove("focusable")
		this.cheatButton.style.pointerEvents = "all"
		this.cheatButton.style.display = "none"

		// Append the element to the C3htmlwrap
		C3htmlwrap.appendChild(topRightElement)
	}

	Create_BottomRightText() {
		const C3htmlwrap = document.querySelector(".c3html")

		if (!C3htmlwrap) return // Ensure the parent element exists

		const watermark = document.createElement("div")
		watermark.id = "watermark"
		watermark.innerText = "Loading..." // Set the text

		Object.assign(watermark.style, {
			position: "fixed",
			bottom: "0",
			right: "0",
			width: Utils.px(100), // Ensure width is a valid string
			zIndex: "10000",
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			fontSize: Utils.px(6),
			fontWeight: "bold",
			pointerEvents: "none",
			color: "white", // Ensures text is readable
			paddingBottom: Utils.px(10),
			borderRadius: Utils.px(1),
		})

		// Append the element to the C3htmlwrap
		C3htmlwrap.appendChild(watermark)

		this.watermark = watermark
	}

	Create_BottomLeftText() {
		const C3htmlwrap = document.querySelector(".c3html")

		if (!C3htmlwrap) return // Ensure the parent element exists

		const bottomLeft = document.createElement("div")
		bottomLeft.id = "bottomLeft"
		bottomLeft.innerText = "" // Set the text

		Object.assign(bottomLeft.style, {
			position: "fixed",
			bottom: "0",
			left: "0",
			zIndex: "10000",
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			fontSize: Utils.px(6),
			fontWeight: "bold",
			pointerEvents: "none",
			color: "white", // Ensures text is readable

			borderRadius: Utils.px(1),
		})

		bottomLeft.innerHTML = /*html*/ `
			<div class="vertical tems_center justify_center" style="
                margin: ${Utils.px(10)};
            ">
                <div id="bottomLeft_Version" class="" style="">
                </div>
                <div id="bottomLeft_ReleaseDate" class="" style="">
                </div>
                <div id="bottomLeft_Wishlist" class="" style="
                    color: #00ff26;
                ">
                </div>
            </div>
         `

		// Append the element to the C3htmlwrap
		C3htmlwrap.appendChild(bottomLeft)

		this.bottomLeft = bottomLeft
	}

	BeforeProjectStart() {
		this.SN = this.runtime.player.SN

		this.CreateMenu_CoopCharacterSelect()

		/*
		this.GoTo("coop_CharacterSelect")
		this.runtime.timeScale = 0*/
	}

	CreateMenu_CoopCharacterSelect() {
		const coop_CharacterSelect = this.CreateMenuScreen("coop_CharacterSelect", true)

		const coopJoinPanel_HTML = /*html*/ `
        <div id="coopJoinPanel" class="vertical justify_center items_center">
            <div id="joinInstructs" style= text-align: center;></div>
            <div class="circularProgressWrapper">
                <svg class="circularProgress" viewBox="0 0 100 100">
                    <circle class="bg"></circle>
                    <circle class="fg"></circle>
                </svg>
            </div>
        </div>
        `

		const joinInstructs = coop_CharacterSelect.querySelector("#joinInstructs")

		const updateText = () => {
			let newText = joinInstructs.innerHTML
			newText = newText.replace("{img1}", "<img src='Control_Button_Dir_Down.png' style='height: 1.5em; vertical-align: middle;'>")
			newText = newText.replace("{img2}", "<img src='Control_Key_Space.png' style='height: 1.5em; vertical-align: middle;'>")
			joinInstructs.innerHTML = newText
		}

		Utils.Elem_SetTranslateKey(joinInstructs, "Control_HoldJoin", updateText)

		/* prettier-ignore */
		coop_CharacterSelect.innerHTML = /*html*/ `
            <div class="vertical justify_center h100 w100 gap_2">
                <div class="horizontal justify_between">
                    ${Utils.HTML_Repeat(4, coopJoinPanel_HTML)}
                   
                </div>
                <div class="vertical items_center">
                    <div id="title_footer" class="column" style="width: 20%;">
                    </div>
                </div>
            </div>
        `

		/*
		requestAnimationFrame(() => {
			const circularProgress = document.querySelector(".circularProgress")
			this.RadialProgress_SetPercent(circularProgress, 0.5)
		})*/
	}

	SpatialNavigation() {
		this.runtime.player.SpatialNavigation()
	}

	//! CAREFUL TODO: it was only to fix the fact player could still press the previously selected PAUSE button
	/*
    ClearSpatialNavigation() {
		for (const player of this.runtime.players) {
			player.SN.blur()
		}
	}*/

	SNPause() {
		for (const player of this.runtime.players) {
			player.SN.pause()
		}
	}

	SNResume() {
		for (const player of this.runtime.players) {
			player.SN.resume()
		}
	}

	CurMenuName() {
		if (this.menuStack.length > 0) {
			return this.menuStack[this.menuStack.length - 1].id
		}
	}

	CurMenu_IsShop() {
		const menuName = this.CurMenuName()
		return menuName === "shopMenu" || menuName === "shopMenu_Multi"
	}

	CloseAll() {
		this.ClearStack()
	}

	ClearStack() {
		this.playerMenuID = -1

		//this.ClearSpatialNavigation()
		for (const player of this.runtime.players) {
			//! GAMEPLAY RESUME
			player.tooltip.DisplayNone()
			player.SN.pause()
		}

		if (this.runtime.layout.name === "GAME") {
			this.runtime.layout.getLayer("HTML_Local").isVisible = true
			this.runtime.layout.getLayer("HUD_HTML").isVisible = this.runtime.main.toggleHUD

			this.runtime.player.Update_CoinPortal()
		}

		this.runtime.globalVars["Menu"] = false
		this.runtime.timeScale = this.runtime.timeScale_game
		this.menuStack.forEach((menu) => {
			menu.style.display = "none"
		})
		this.menuStack = []
	}

	GoTo(targetMenuName, playerIndex = -1, drawOver = false) {
		this.playerMenuID = playerIndex
		//window.alert("GoTo " + targetMenuName + " " + playerIndex)
		const player = this.runtime.players[playerIndex]

		this.runtime.globalVars["Menu"] = true
		const targetMenu = this.nameToMenu.get(targetMenuName)
		if (!targetMenu) {
			console.error(`Menu with ID ${menuId} not found.`)
			return
		}

		const previousMenuName = this.menuStack[this.menuStack.length - 1]?.id
		this.MenuEnterExit(previousMenuName, false)
		this.MenuEnterExit(targetMenuName, true)

		if (this.runtime.layout.name === "GAME") {
			this.runtime.layout.getLayer("HTML_Local").isVisible = false
			this.runtime.layout.getLayer("HUD_HTML").isVisible = false
		}

		if (this.menuStack.length === 0) {
			for (const player of this.runtime.players) {
				//! In case coming from GAMEPLAY
				player.SN.resume()
				player.needToRetriggerNav = true
			}
		}

		if (!drawOver) {
			if (this.menuStack.length > 0) {
				const currentMenu = this.menuStack[this.menuStack.length - 1]
				currentMenu.style.display = "none"
			}
		} else if (drawOver) {
			/*
			targetMenu.classList.add("active")
			targetMenu.style.zIndex = this.menuStack.length + 2 */
		}

		this.menuStack.push(targetMenu)
		targetMenu.style.display = "block"

		targetMenu.playerMenuID = playerIndex

		if (targetMenuName === "pauseMenu") {
			this.HTML_SetPauseMenu(playerIndex)
		} else if (targetMenuName === "titleScreen") {
			//this.SpatialNavigation()

			const resumeButton = targetMenu.querySelector(".ResumeButton")
			const startButton = targetMenu.querySelector(".StartButton")
			//window.alert("Check Resume Button")
			//!temp disable ResumeRun
			resumeButton.style.display = "none"
			/*
			if (this.runtime?.progress?.saveData?.currentRun) {
				resumeButton.style.display = "flex"
				//is.runtime.player.SN.focus(resumeButton)
			} else {
				resumeButton.style.display = "none"
				//this.runtime.player.SN.focus(startButton)
			}*/
		} else if (targetMenuName === "progressMenu") {
			this.runtime.progress.HTML_SetProgressMenu()
		} else if (targetMenuName === "commuMenu") {
			this.runtime.commu.HTML_SetCommuMenu()
		}
		//===================================================

		const focusOnEnter = targetMenu.querySelector(".focusOnEnter")

		//only for PauseMenu
		if (player) {
			player.SpatialNavigation()
			player.SN.focus(focusOnEnter)
		} else {
			this.SpatialNavigation()
			this.runtime.player.SN.focus(focusOnEnter)
		}

		//focus specific
	}

	Back_HasBackPriority(player = null) {
		const evt = document.createEvent("CustomEvent")
		evt.initCustomEvent("sn:escape", true, true, {})
		document.dispatchEvent(evt)

		//window.alert("Back_HasBackPriority")

		let ret = false
		if (this.runtime.layout.name === "GAME") {
			if (player && player.shop.isWepItemContextMenu) {
				player.shop.WepItemContextMenu("Back")
				ret = true
			}
		}
		return ret
	}

	//* Back() FUNCTION

	Back(player = null, isToggleMenuButton = false) {
		if (player && this.playerMenuID !== -1 && this.playerMenuID !== player.playerIndex) {
			return
		}
		if (this.Back_HasBackPriority(player)) {
			return
		}
		if (this.runtime.layout.name === "START") {
			if (this.menuStack.length >= 2) {
				console.error("Back_Menu in START (because additional screen")
				this.Back_Menu(player)
				this.runtime.menu.startRun.Players_Blur()
			} else {
				this.startRun.Back(player)
			}
			return
		}

		if (this.runtime.layout.name === "GAME") {
			if (this.CurMenuName() === "endMenu" || this.CurMenuName() === "endMenu_Multi") {
				return
			}
			//* EDGE CASE
			if (this.CurMenuName() === "settingsGeneral") {
				this.Back_Menu(player)
			}
			//* CLOSE PAUSE/RESUME
			else if (this.CurMenuName() === "pauseMenu") {
				this.Back_Menu(player)
				this.runtime.isPause = false
			}
			//*ACTIVATE PAUSE
			else if (isToggleMenuButton) {
				const pauseMenu = this.nameToMenu.get("pauseMenu")
				this.runtime.timeScale = 0

				this.runtime.isPause = true

				for (const player of this.runtime.players) {
					//player.SN.pause()
					player.shop.WepItemContextMenu(null)
					player.tooltip.DisplayNone()
					player.stats.ShowTabButtons(true)
				}

				//player.SN.resume()

				this.GoTo("pauseMenu", player.playerIndex)

				const waveManager = this.runtime.waveManager
				const button_endRun = pauseMenu.querySelector(".button_endRun")
				//console.error("button_endRun", button_endRun)
				const label_button_endRun = button_endRun.querySelector("label")

				const pause_EndRun_Info = pauseMenu.querySelector("#pause_EndRun_Info")

				if (waveManager.waveCount > waveManager.waveMax) {
					Utils.Elem_SetTranslateKey(label_button_endRun, "EndRun_Endless")
					pause_EndRun_Info.style.display = "flex"
				} else {
					Utils.Elem_SetTranslateKey(label_button_endRun, "BackToMenu")
					pause_EndRun_Info.style.display = "none"
				}
				if (this.menuStack.length >= 2) {
					//pauseMenu.style.backgroundColor = "rgba(0, 0, 0, 1)"
					//pauseMenu.style.backgroundColor = ""
					pauseMenu.style.background = "radial-gradient(ellipse at bottom, rgb(6 21 22) 0%, rgb(0 0 0) 100%)"
					//window.alert("Pause in Shop")
				} else {
					pauseMenu.style.background = ""
					pauseMenu.style.backgroundColor = "rgba(0, 0, 0, 0.55)"
					//window.alert("Pause not in Shop")
				}
			}
		}
		//
		else if (this.menuStack.length > 1) {
			this.Back_Menu(player)
		}
		//!what was that for, should it be moved in the layout above ?
		else {
			if (this.runtime.layout.name === "GAME") {
				this.ClearStack()
			}
		}

		//console.error("menuStack", this.menuStack)
	}

	Back_Menu(player) {
		// Remove the current screen from the stack

		const previousMenuName = this.menuStack[this.menuStack.length - 1].id
		this.MenuEnterExit(previousMenuName, false)

		const currentMenu = this.menuStack.pop()
		currentMenu.style.display = "none"
		const backMenu = this.menuStack[this.menuStack.length - 1]

		if (backMenu) {
			const backMenuName = backMenu.id

			this.MenuEnterExit(backMenuName, true)

			this.playerMenuID = backMenu.playerMenuID || -1

			backMenu.style.display = "block"

			const focusOnEnter = backMenu.querySelector(".focusOnEnter")

			if (backMenuName === "shopMenu" || backMenuName === "shopMenu_Multi") {
				for (const player of this.runtime.players) {
					player.shop.HTML_SetInShop(false)
				}
			} else if (backMenuName === "shopStatsMenu" || backMenuName === "shopStatsMenu_Multi") {
				for (const player of this.runtime.players) {
					if (!player.enabled) continue
					player.shopStats.HTML_SetInShopStats()
					player.shopStats.RefreshSelect()
				}
			} else {
				//window.alert("Back FocusOnEnter")
				if (player) {
					player.SpatialNavigation()
					player.SN.focus(focusOnEnter)
				} else {
					this.SpatialNavigation()
					this.runtime.player.SN.focus(focusOnEnter)
				}
			}
		} else {
			this.ClearStack()
		}
	}

	Toggle_Pause(player = null) {
		this.Back(player, true)
	}

	Back_Gamepad(player) {
		this.Back(player, false)
	}

	Back_Keyboard(player) {
		this.Back(player)
	}

	//

	CheckResize(e) {}

	RezChange() {
		//
	}

	CreateMenuScreen(name, returnRoot = false, color = true) {
		const C3htmlwrap = document.querySelector(".c3html")
		const menuParent = document.createElement("div")
		C3htmlwrap.appendChild(menuParent)
		menuParent.classList.add("menu")
		menuParent.id = name

		Utils.Elem_SetStyle(menuParent, {
			position: "absolute",
			top: 0,
			left: 0,
			width: "100%",
			height: "100%",
			display: "none",
		})

		if (color === true) {
			menuParent.style.backgroundColor = "#0000008c"
		} else if (color === false) {
			menuParent.style.backgroundColor = "transparent"
		} else if (typeof color === "string") {
			menuParent.style.backgroundColor = color
		}

		// Create General Settings Menu
		const menuContainer = document.createElement("div")
		menuContainer.classList.add("settingsMenu")
		menuParent.appendChild(menuContainer)

		this.nameToMenu.set(name, menuParent)

		this.nameToCallback.set(name, {})

		return returnRoot ? menuParent : menuContainer
	}

	Toggle_Shop() {
		const shopMenu = this.nameToMenu.get("shopMenu")
		const shopMenu_Multi = this.nameToMenu.get("shopMenu_Multi")

		if (shopMenu.style.display === "none") {
			this.runtime.audio.PlaySound("Shop_Enter", 1, 0.99)
			this.runtime.shutters.Shutters_Open(true)

			if (this.runtime.singlePlayer) {
				this.runtime.menu.GoTo("shopMenu")
			} else {
				this.runtime.menu.GoTo("shopMenu_Multi")
			}

			for (const player of this.runtime.players) {
				player.shop.validate = false
				player.shop.HTML_SetInShop()
			}
			this.runtime.progress.SaveCurrentRun("Shop")
		} else {
			this.runtime.menu.Back()
			shopMenu.style.display = "none"
			shopMenu_Multi.style.display = "none"
		}
	}

	SetIn_ShopStats() {
		const shopMenu = this.nameToMenu.get("shopStatsMenu")
		const shopMenu_Multi = this.nameToMenu.get("shopStatsMenu_Multi")
		if (shopMenu.style.display === "none") {
			this.runtime.layout.getLayer("NoobsBG").isVisible = true
			this.runtime.layout.getLayer("FG_Above_BG0").isVisible = true
			if (this.runtime.singlePlayer) {
				this.runtime.menu.GoTo("shopStatsMenu")
			} else {
				this.runtime.menu.GoTo("shopStatsMenu_Multi")
			}

			for (const player of this.runtime.players) {
				player.shop.validate = false
				player.shopStats.HTML_SetInShopStats()
				if (!player.enabled) {
					continue
				}
				player.shopStats.NextStep()
			}

			//runtime.menu.GoTo("shopMenu")
		}
	}

	StartShopPhase() {
		//temp testShopStats_multi
		//this.runtime.player.shopStats.levelUps = [0]
		//this.runtime.player2.shopStats.itemFounds = 1
		this.shopPhase = true

		let shopStats_bool = false
		for (const player of this.runtime.playersEnabled) {
			player.shop.validate = false
			if (player.shopStats.WillAppear()) {
				shopStats_bool = true
				break
			}
		}

		if (shopStats_bool) {
			//avoid infinite loop in multiplayer
			//! should not happen anymore
			//if (this.runtime.menu.CurMenuName() !== "shopStatsMenu_Multi") {
			this.runtime.progress.SaveCurrentRun("ShopStats")
			this.SetIn_ShopStats()
		} else {
			this.Toggle_Shop()
		}
	}

	GetRunInfo(type = "regular") {
		const waveManager = this.runtime.waveManager
		let waveCount = waveManager.waveCount
		if (type === "endless") waveCount -= 1

		let WaveText = this.runtime.translation.Get("RunInfo_Wave").replace("{0}", waveCount)
		const diff = waveManager.difficulty
		let DiffText = this.runtime.translation.Get("RunInfo_Diff")
		DiffText = Utils.Replace(DiffText, "0", diff)
		DiffText = Utils.Color(DiffText, this.runtime.style.GetTierColor(diff))

		let text = `${WaveText} | ${DiffText}`
		text = Utils.parseBBCode(text)
		return text
	}

	HTML_SetPauseMenu(playerIndex = -1) {
		let player = null
		if (playerIndex !== -1) player = this.runtime.players[playerIndex]

		//window.alert("HTML_SetPauseMenu" + playerIndex)

		const pause_RunInfo = this.pauseMenu.querySelector("#pause_RunInfo")
		pause_RunInfo.innerHTML = this.GetRunInfo()

		const pause_PlayerInfo_Row = this.pauseMenu.querySelector("#pause_PlayerInfo_Row")

		//clean by putting all player inventories in the right place
		for (const player of this.runtime.players) {
			player.shop.HTML_SetElementsInShop()
		}

		if (this.runtime.singlePlayer) {
			pause_PlayerInfo_Row.style.display = "none"
		} else {
			pause_PlayerInfo_Row.style.display = "flex"
			const pause_PlayerName = this.pauseMenu.querySelector("#pause_PlayerName")

			if (player) pause_PlayerName.style.color = player.color_

			pause_PlayerName.textContent = this.runtime.translation.Get("RunInfo_Player").replace("{0}", player.playerIndex + 1)

			//!TODO Later: switch to other player

			// const leftIcon = this.pauseMenu.querySelector("#leftIcon")
			// const rightIcon = this.pauseMenu.querySelector("#rightIcon")

			// leftIcon.style.visibility = "visible"
			// rightIcon.style.visibility = "visible"

			// if (player.playerIndex === 0) {
			// 	leftIcon.style.visibility = "hidden"
			// }
			// if (player.playerIndex + 1 === this.runtime.playersEnabled.length) {
			// 	rightIcon.style.visibility = "hidden"
			// }
		}

		if (!player) {
			player = this.runtime.player
			//window.alert("Set Pause Singleplayer")
		}

		const menu = this.nameToMenu.get("pauseMenu")

		const itemSection = menu.querySelector("#pause_Items")
		itemSection.appendChild(player.inventory.element)

		const weaponSection = menu.querySelector("#pause_Weps")
		weaponSection.appendChild(player.inventoryWeps.element)

		const shopStats = menu.querySelector("#pause_Stats")
		const statsElement = player.stats.element
		statsElement.style.display = "block"
		shopStats.appendChild(statsElement)
	}

	GameOver(win = false, instant = false) {
		console.error("👿 GAME OVER win", win)

		if (win) {
			//this.runtime.audio.PlaySound("Jingle_Win")
		} else {
			this.runtime.audio.PlaySound("Devil_GameOver", 1, 0.99)
			this.runtime.audio.PlaySound("Gong_Dark", 1, 0.99)
		}

		this.runtime.gameOver = true

		if (instant) {
			this.GameOver_Actual(win)
			return
		}

		let duration = win ? 1 : 2

		this.runtime.player.unit.timerComp.Timer_Start("GameOver", duration, () => {
			this.GameOver_Actual(win)
		})
	}

	GameOver_Actual(win = false, canRetry = true) {
		this.runtime.timeScale = 0

		const waveManager = this.runtime.waveManager

		if (!win && canRetry && waveManager.waveCount <= waveManager.waveMax) {
			if (this.runtime.settings["Retry_Failed_Waves"] || this.runtime.main.IsPreview()) {
				this.runtime.menu.GoTo("popup_retry_failedWaves")
				return
			}
		}

		let actualMenuScreen = this.nameToMenu.get("endMenu")
		if (!this.runtime.singlePlayer) actualMenuScreen = this.nameToMenu.get("endMenu_Multi")

		const wonOrLost = actualMenuScreen.querySelector("#end_runWonOrLost")

		const runInfo = actualMenuScreen.querySelector("#end_runInfos")
		runInfo.innerHTML = this.GetRunInfo()

		//* Remove current run
		const currentRun = this.runtime.progress?.saveData?.currentRun
		if (currentRun) this.runtime.progress.saveData.currentRun = null
		this.runtime.save.WriteSave()

		//* ENDLESS
		if (waveManager.waveCount > waveManager.waveMax) {
			runInfo.innerHTML = this.GetRunInfo("endless")

			this.isEndless = true
			win = false

			wonOrLost.style.color = "rgb(255, 149, 0)"
			wonOrLost.style.textTransform = "uppercase"
			Utils.Elem_SetTranslateKey(wonOrLost, "Endless Score")

			this.runtime.progress.CheckMission_TotalValue("Deaths", 1)

			//!todo run info record

			runInfo.innerHTML += /*html*/ `
			    <br>
                <div id="endless_Record" class="horizontal" style="
                    background: rgba(0, 0, 0, 0.7);
                    border-radius: ${Utils.px(2)};
                    margin-bottom: ${Utils.px(2)};
                    text-align: center;
                    gap: ${Utils.px(2)};
                
                ">
                    <div id="newHigh" class="horizontal items_center justify_center">
                        <img id="recordIcon" src="Game/Graph/RecordIcon.png" draggable="false" style="
                            width: ${Utils.px(9)}; 
                            height: ${Utils.px(9)};
                            margin-right: ${Utils.px(1)};
                            object-fit: contain;
                            
                        ">
                        <div id="endless_Record_New" class="text_center"></div>
                    </div>
                    <div id="newHigh_withChara" class="horizontal items_center justify_center">
                        <img id="recordIcon" src="Game/Graph/RecordIcon.png" draggable="false" style="
                            width: ${Utils.px(9)}; 
                            height: ${Utils.px(9)};
                            margin-right: ${Utils.px(1)};
                            object-fit: contain;
                        ">
                        <div id="endless_Record_New_WithChara" class="text_center"></div>
                    </div>
            </div>
            `

			if (waveManager.waveCount !== waveManager.waveMax) {
				this.runtime.progress.GameOver_WinRun("endless")

				/*const endless_Record_New = runInfo.querySelector("#endless_Record_New")
                const endless_Record_New_WithChara = runInfo.querySelector("#endless_Record_New_WithChara")

                Utils.Elem_SetTranslateKey(endless_Record_New, "Menu_End_HighScore")
                Utils.Elem_SetTranslateKey(endless_Record_New_WithChara, "Menu_End_HighScore_With", (elem) => {
				let charaStr = this.runtime.player.playableName
				charaStr = `[c=yellow]${charaStr}[/c]`
				charaStr = Utils.parseBBCode(charaStr)
				elem.innerHTML = elem.innerHTML.replace("{charas}", this.runtime.player.playableName)
			})*/
			}
		}

		//* WIN
		else if (win) {
			this.runtime.audio.PlaySound("Jingle_Win")

			this.runtime.progress.CheckMission_TotalValue("Wins", 1)

			this.runtime.progress.CheckMission_TotalValue("Wins_Diff" + waveManager.difficulty, 1)

			this.runtime.progress.GameOver_WinRun("regular")
			wonOrLost.style.color = "#00ff00"
			wonOrLost.style.textTransform = "uppercase"
			Utils.Elem_SetTranslateKey(wonOrLost, "Run_Won")
		}
		//* LOSE
		else {
			wonOrLost.style.color = "#ff0000"
			wonOrLost.style.textTransform = "uppercase"
			Utils.Elem_SetTranslateKey(wonOrLost, "Run_Lost")

			this.runtime.progress.CheckMission_TotalValue("Deaths", 1)

			this.runtime.platforms.Steam_Achieve_Get("achieve_die_1")
		}

		//endless button
		//! here to disable feature
		let showEndlessButton = win
		if (this.runtime.main.isDemo) showEndlessButton = false

		if (this.runtime.singlePlayer) {
			this.GoTo("endMenu")

			//!show layers
			this.runtime.layout.getLayer("NoobsBG").isVisible = true
			this.runtime.layout.getLayer("FG_Above_BG0").isVisible = false

			const menu = this.nameToMenu.get("endMenu")

			const player = this.runtime.player

			const itemSection = menu.querySelector("#end_Items")
			itemSection.appendChild(player.inventory.element)

			const weaponSection = menu.querySelector("#end_Weps")
			weaponSection.appendChild(player.inventoryWeps.element)

			const shopStats = menu.querySelector("#end_Stats")
			const statsElement = player.stats.element
			statsElement.style.display = "block"
			shopStats.appendChild(statsElement)

			//endProgress
			const end_Progress = menu.querySelector("#end_Progress")

			this.runtime.progress.HTML_SetEndProgress(end_Progress)

			this.runtime.waveManager.EndlessButton_SetVisible_AndFocusTopButton(menu, showEndlessButton)
		} else {
			this.GoTo("endMenu_Multi")

			const endMulti = this.nameToMenu.get("endMenu_Multi")
			const end_Progress = endMulti.querySelector("#end_Progress")
			this.runtime.progress.HTML_SetEndProgress(end_Progress)

			this.runtime.waveManager.EndlessButton_SetVisible_AndFocusTopButton(endMulti, showEndlessButton)

			//endProgress

			const activePlayerCount = this.runtime.playersEnabled.size

			for (const player of this.runtime.players) {
				const menu = player.endElem

				if (!this.runtime.playersEnabled.has(player)) {
					menu.style.display = "none"
					continue
				}

				menu.style.maxWidth = `${100 / activePlayerCount}%`

				menu.style.display = "flex"

				/*
				if (player.playerIndex === 0) {
					player.SpatialNavigation([menu, endButtons])
				} else {
					player.SpatialNavigation([menu])
				}*/

				const itemSection = menu.querySelector("#end_Items")
				itemSection.appendChild(player.inventory.element)

				const weaponSection = menu.querySelector("#end_Weps")
				weaponSection.appendChild(player.inventoryWeps.element)

				const shopStats = menu.querySelector("#statsContainer")
				const statsElement = player.stats.element
				statsElement.style.display = "block"
				shopStats.appendChild(statsElement)

				player.Tab_Update_InMulti(0)

				player.SN.focus(player.inventory.itemBoxes[0])
			}
		}
	}

	CreateNavRow(elem) {
		elem.innerHTML = /*html*/ `
        <div id="navRow" class="justify_center items_center" style="
            display: flex; 
            align-items: center;
            gap: ${Utils.px(4)};
            width: 100%;
        ">
            <div id="tabLabel_Left" style="
                opacity: 0.67;
                white-space: nowrap;
            ">
            </div>
            <img id="leftIcon" src="steamdeck_button_l1.png" style="
                height: 1.5em;
                vertical-align: middle; 
            ">
            <div id="tabLabel" style="
                flex-grow: 1;  /* Allow it to expand */
                text-align: center;
                min-width: max-content; /* Ensure it doesn’t collapse */
            ">
            </div>
            <img id="rightIcon" src="steamdeck_button_r1.png"  style="
                height: 1.5em;
                vertical-align: middle;
            ">
            <div id="tabLabel_Right" style="
                opacity: 0.67;
                white-space: nowrap;
            ">
            </div>
        </div>
        `

		//!todo
		//this.addEventListener("swapInputMethod", (e) => {})
	}

	OpenDiscord() {
		this.runtime.platforms.OpenWindow("https://discord.com/invite/wMK34Z3RMU")
	}

	OpenSteamPage_Web() {
		const steamGameId = 2225960
		window.open(`https://store.steampowered.com/app/${steamGameId}`, "_blank")
	}

	OpenSteamPage_App() {
		const steamGameId = 2225960
		let steamUrl = `steam://store/${steamGameId}`
		this.runtime.platforms.OpenWindow(steamUrl)
	}

	OpenPresskit() {
		const presskitUrl = `https://drive.google.com/drive/folders/1Pg-k_eXhw8ROzGVZbUzmkNK2VLrOeRVj`

		if (this.runtime.platforms.Export === "html") {
			window.open(presskitUrl, "_blank")
		} else {
			this.runtime.platforms.OpenWindow(presskitUrl)
		}
	}

	CreateMenus_AllOther() {
		//#region Title

		const titleScreen = this.CreateMenuScreen("titleScreen", true, false)

		const titleCallbacks = this.nameToCallback.get("titleScreen")
		titleCallbacks["onEnterExit"] = (bool) => {
			this.runtime.layout.getLayer("TITLE").isVisible = bool
			this.runtime.layout.getLayer("Title_Things").isVisible = bool
		}

		//<iframe src="https://store.steampowered.com/widget/2225960/" width=${Utils.px(100)} height=${Utils.px(50)} frameborder="0"></iframe>

		titleScreen.innerHTML = /*html*/ `
            <div class="vertical items_center justify_center s100">
                <div class="horizontal items_center justify_between" style="
                    width: 90%;
                ">
                    <div id="title_Column_Left" class="column">
                    </div>
                    <div id="title_Column_Right" class="column" style="
                    ">
                    </div>
                </div>
                
                <div class="vertical items_center">
                    <div id="title_footer" class="column" style="width: 20%;">
                    </div>
                </div>
            </div>
        `

		this.AddSettingsToID("title_Column_Left", "", "", true, [
			{
				type: "button",
				label: "Resume",
				elemClass: "ResumeButton",
				callback: () => {
					this.runtime.progress.ResumeRun_Test()
				},
			},
			{
				type: "button",
				label: "Start",
				elemClass: "StartButton, focusOnEnter",
				BG_Color: "rgb(255 0 86)",
				callback: () => {
					this.ClearStack()
					this.runtime.goToLayout("START")
				},
			},
			{
				type: "button",
				label: "Options",
				callback: () => {
					this.GoTo("settingsGeneral")

					//this.GoTo("settingsChoose")
				},
			},
			{
				type: "button",
				label: "Progress",
				onTranslate: (elem) => {
					if (this.runtime.progress?.GetProgressPercent) {
						elem.innerHTML = elem.innerHTML + " " + this.runtime.progress.GetProgressPercent(false)
					}
				},
				callback: () => {
					this.GoTo("progressMenu")
				},
			},

			{
				type: "button",
				label: "Community Goals",

				callback: () => {
					this.GoTo("commuMenu")
				},
			},
			/*
			{
				type: "button",
				label: "DevTools",
				callback: () => {
					if (this.runtime.showingDevTools) {
						this.runtime.pipelab._ShowDevTools(false)
						this.runtime.showingDevTools = false
					} else {
						this.runtime.pipelab._ShowDevTools(true)
						this.runtime.showingDevTools = true
					}
				},
			},*/
			{
				type: "button",
				elemClass: "button_quit",
				label: "Quit",
				callback: () => {
					this.runtime.menu.GoTo("popup_Quit_Demo")
					//window.close()
				},
			},
		])

		if (this.runtime.platforms.Export === "html") {
			const button_quit = titleScreen.querySelector(".button_quit")
			button_quit.style.display = "none"
		}

		//

		this.AddSettingsToID("title_Column_Right", "", "", true, [
			{
				type: "button",
				label: "Wishlist",
				elemClass: "button_wishlist_main",
				BG_Color: "#1fa11b",
				callback: () => {
					this.OpenSteamPage_App()
				},
			},
			{
				type: "button",
				label: "Wishlist (Web)",
				elemClass: "button_wishlist_web",
				BG_Color: "#1fa11b",
				callback: () => {
					this.OpenSteamPage_Web()
				},
			},
			{
				type: "button",
				label: "Wishlist (App)",
				BG_Color: "#1fa11b",
				elemClass: "button_wishlist_app",
				callback: () => {
					this.OpenSteamPage_App()
				},
			},
			{
				type: "button",
				label: "Discord",
				BG_Color: "#7289da",
				callback: () => {
					this.OpenDiscord()
				},
			},
			//StreamerMode
			{
				type: "button",
				label: "Patch Notes",
				imgBefore: "Discord.png",
				callback: () => {
					this.OpenDiscord()
				},
			},
			/*
			{
				type: "button",
				label: "Press Kit",
				callback: () => {
					this.OpenPresskit()
				},
			},*/
			{
				type: "button",
				label: "Report a bug",
				imgBefore: "Discord.png",
				callback: () => {
					this.OpenDiscord()
				},
			},
			{
				type: "button",
				label: "Help to translate",
				imgBefore: "Discord.png",
				callback: () => {
					this.OpenDiscord()
				},
			},
			{
				type: "button",
				label: "Credits",
				callback: () => {
					this.GoTo("creditsScreen")
				},
			},
		])

		const button_wishlist_main = titleScreen.querySelector(".button_wishlist_main")
		const button_wishlist_web = titleScreen.querySelector(".button_wishlist_web")
		const button_wishlist_app = titleScreen.querySelector(".button_wishlist_app")

		if (this.runtime.platforms.Export === "html" || this.runtime.platforms.Export === "preview") {
			button_wishlist_main.style.display = "none"
		} else {
			button_wishlist_web.style.display = "none"
			button_wishlist_app.style.display = "none"
		}

		//#endregion Title

		//#region Credits

		const creditsScreen = this.CreateMenuScreen("creditsScreen", true, false)

		const accentColor = "#ff0066"

		creditsScreen.innerHTML = /*html*/ `
			<div class="vertical items_center justify_center s100">
				<div class="vertical items_center justify_center s100" style="
					gap: ${Utils.px(10)};
				">
					<div id="credits" class="vertical items_center justify_center w100" style="
						height: ${Utils.px(200)};
						width: ${Utils.px(200)};
						background-color:rgba(0, 0, 0, 0.84);
						border-radius: ${Utils.px(10)};
						padding: ${Utils.px(10)};
					">
                        <div class="vertical items_center justify_center">
                            <h2>A Game <span style="color: ${accentColor}">solodev</span> by <span style="color: ${accentColor}">Overboy</span></h2>
                            <h1>Special Thanks</h1>
                        </div>
						<div id="specialThanks" class="vertical items_center justify_start simplebar_white" style="
                             flex-grow: 1; 
							 scrollbar-color: rgba(255, 255, 255, 0.5) transparent;
                             min-width: 50%
						">
						</div>
					</div>
					<div id="creditButtons" style="background-color: transparent;">
						<!-- Buttons can be added here -->
					</div>
				</div>
			</div>
		`

		const specialThanksContainer = creditsScreen.querySelector("#specialThanks")

		const creditsCallbacks = this.nameToCallback.get("creditsScreen")
		creditsCallbacks["onEnterExit"] = (bool) => {
			if (bool) this.ScrollElem_Set(specialThanksContainer)
			else this.ScrollElem_Set(null)
		}

		// Fetch the JSON file and populate the specialThanks section
		fetch("credits.json")
			.then((response) => {
				if (!response.ok) {
					throw new Error("Failed to load credits.json")
				}
				return response.json()
			})
			.then((data) => {
				const specialThanks = data.thanks || []
				specialThanks.forEach((name) => {
					const entry = document.createElement("div")
					entry.classList.add("credit-entry")
					entry.textContent = name
					specialThanksContainer.appendChild(entry)
				})
			})
			.catch((error) => {
				console.error("Error loading credits:", error)
				const errorMessage = document.createElement("div")
				errorMessage.classList.add("credit-entry")
				errorMessage.textContent = "Failed to load special thanks."
				specialThanksContainer.appendChild(errorMessage)
			})

		const creditButton = creditsScreen.querySelector("#creditButtons")

		this.AddSettingsToElem(creditButton, "", "", true, [
			//GAMEOVER buttons
			{
				type: "button",
				label: "Back",
				callback: () => {
					this.Back()
				},
			},
		])

		//#endregion Credits

		//#region End Run

		const endMenu = this.CreateMenuScreen("endMenu", true)

		endMenu.innerHTML = /*html*/ `
        <div id="" class="vertical justify_center items_center h100 w100" style="
        ">
            <div id="end_runTitle" class="vertical items_center justify_center">
                <div id="end_runWonOrLost" class="textOutline" style="
                    font-size: ${Utils.px(9)};
                ">
                </div>
                <div id="end_runInfos" style="
                    background: rgba(0, 0, 0, 0.7);
                    border-radius: ${Utils.px(1)};
                    margin-bottom: ${Utils.px(2)};
                    text-align: center;
                ">
                </div>
               
            </div>
            <div id="end_Container" class="inlineFlex row items_start justify_center gap_2 ">
                

                <div id="end_Stats" style="
                    scale:88%;
                    margin-top: calc(var(--px)* -17);
                ">
                </div>

                <div id="end_PlayerInfo" class="vertical" style= "width:${Utils.px(200)};">
                    <div id="end_Weps" class= "vertical" style= "height:${Utils.px(40)};">
                    </div>
                    <div id="end_Items" class= "vertical" style= "height:${Utils.px(120)};">
                    </div>
                    <div id="end_Progress" class="vertical" style= "height:${Utils.px(40)};">
                        <div id="end_newUnlocks_Text" class="" style="
                            width: fit-content
                            border-radius: ${Utils.px(2)};
                            color:rgb(34, 255, 0);
                            padding: ${Utils.px(2)};
                            background-color:rgba(0, 0, 0, 0.72);
                        ">
                        </div>
                        <div id="end_Progress_Invo" class="inventory_grid simplebar_white" style=" 
                            
                            border-radius: ${Utils.px(1)};
                        ">
                        </div>
                    </div>
                </div>

               
            
                
               
            </div>
            <div id="end_Buttons" class= "vertical" style="gap:${Utils.px(2)};">
            </div>
        </div>
        `

		const end_Buttons = endMenu.querySelector("#end_Buttons")

		const end_Buttons_Actual = this.AddSettingsToElem(end_Buttons, "", "", true, [
			//GAMEOVER buttons
			{
				type: "button",
				label: "Continue in Endless",
				elemClass: "endlessButton",
				callback: () => {
					this.runtime.waveManager.Endless_Continue()
				},
			},
			{
				type: "button",
				label: "Restart",
				elemClass: "restartButton",
				callback: () => {
					this.ClearStack()
					this.runtime.goToLayout(this.runtime.layout.name)
				},
			},
			{
				type: "button",
				label: "New Run",
				callback: () => {
					this.ClearStack()
					this.runtime.goToLayout("START")
				},
			},
			{
				type: "button",
				label: "BackToMenu",
				callback: () => {
					this.ClearStack()
					this.runtime.goToLayout("TITLE")
				},
			},
		])

		/*const callbacks_endMenu = this.nameToCallback.get("endMenu")
		creditsCallbacks["onEnter"] = () => {
			//pick the first button with display flex
		}*/

		//#endregion End Run

		//#region End Run

		const endMenu_Multi = this.CreateMenuScreen("endMenu_Multi", true)

		//end_Container had: height: ${Utils.px(180)};

		endMenu_Multi.innerHTML = /*html*/ `
        <div id="" class="menuBG vertical justify_center items_center s100" style="
            gap: ${Utils.px(3)};
    ">
            <div id="end_runTitle" class="vertical items_center justify_center" style="
            ">
                <div id="end_runWonOrLost" class="textOutline" style="
                    font-size: ${Utils.px(9)};
                ">
                </div>
                <div id="end_runInfos" style="
                    background: rgba(0, 0, 0, 0.7);
                    border-radius: ${Utils.px(1)};
                    margin-bottom: ${Utils.px(2)};
                    text-align: center;
                ">
                <div id="endless_Record" style="
                    background: rgba(0, 0, 0, 0.7);
                    border-radius: ${Utils.px(1)};
                    margin-bottom: ${Utils.px(2)};
                    text-align: center;
                ">
                    <div id="newHigh" class="horizontal items_center justify_center">
                        <img id="recordIcon" src="Game/Graph/RecordIcon.png" draggable="false" style="
                            width: ${Utils.px(14)}; 
                            height: ${Utils.px(14)};
                            object-fit: contain;
                        ">
                        <div id="endless_Record_New" class="text_center"></div>
                    </div>
                    <div id="newHigh_withChara" class="horizontal items_center justify_center">
                        <img id="recordIcon" src="Game/Graph/RecordIcon.png" draggable="false" style="
                            width: ${Utils.px(14)}; 
                            height: ${Utils.px(14)};
                            object-fit: contain;
                        ">
                        <div id="endless_Record_New_WithChara" class="text_center"></div>
                    </div>
                </div>
            </div>
            <div id="end_Container" class="vertical items_start justify_center w100" style="
                gap: ${Utils.px(10)};
                background-color: #000000;
            ">
                

                <div id="end_Players" class="horizontal w100" style="
                    max-height: ${Utils.px(170)};

                ">
    
                </div>

        
               
            </div>
            <div id="end_Footer" class= "vertical w100" style="
                gap:${Utils.px(2)};
            ">
                <div id="end_Progress" class="vertical justify_start" style= "height:${Utils.px(40)};">
                    <div id="end_newUnlocks_Text" class="" style="
                        width: fit-content
                        border-radius: ${Utils.px(2)};
                        color:rgb(34, 255, 0);
                        padding: ${Utils.px(2)};
                        background-color:rgba(0, 0, 0, 0.72);
                    ">
                    </div>
                    <div id="end_Progress_Invo" class="inventory_grid simplebar_white" style=" 
                       
                        border-radius: ${Utils.px(1)};
                    ">
                    </div>
                </div>
                <div id="end_Buttons" class= "vertical" style="
                    gap: ${Utils.px(2)};
                    margin: auto;
                    margin-top: ${Utils.px(10)};

                ">
                </div>
            </div>

        </div>
        `

		const end_Players = endMenu_Multi.querySelector("#end_Players")

		for (const player of this.runtime.players) {
			//add NavRow
			end_Players.insertAdjacentHTML(
				"beforeend",
				/*html*/
				`
                <div id="end_Player_${player.playerIndex}" class="vertical flexGrow" style= "
                    padding: ${Utils.px(1)};
                ">
                    <div class="navRow_Container"></div>
                    <div id="end_PlayerInfo" class="vertical" style= "
                    ">
                        <div id="end_Weps" class= "vertical" style= "height:${Utils.px(40)};">
                        </div>
                        <div id="end_Items" class= "vertical" style= "height:${Utils.px(120)};">
                        </div>
                    </div>
                    <div id="shopMulti_OverlayStats" class="vertical justify_center items_center s100" style="
                        display: none;
                    ">
                        <div id="statsContainer">
                        </div>
                    </div>
                </div>
                `
			)
			const end_Player = end_Players.querySelector(`#end_Player_${player.playerIndex}`)
			player.endElem = end_Player

			//this.runtime.style.Elem_BoxStyle(end_Player, "Player" + player.playerIndex)

			this.runtime.style.Elem_BoxStyle(end_Player, "", 5)
		}

		const navRow_Containers = end_Players.querySelectorAll(".navRow_Container")
		for (const navRow_Container of navRow_Containers) {
			this.CreateNavRow(navRow_Container)
			//! Disabled to avoid bugs
			navRow_Container.style.display = "none"
		}

		const end_Buttons_Multi = endMenu_Multi.querySelector("#end_Buttons")

		this.AddSettingsToElem(end_Buttons_Multi, "", "", true, [
			{
				type: "button",
				label: "Continue in Endless",
				style: "outline",
				elemClass: "endlessButton",
				callback: () => {
					this.runtime.waveManager.Endless_Continue()
				},
			},
			{
				type: "button",
				label: "Restart",
				style: "outline",
				elemClass: "restartButton",
				callback: () => {
					this.ClearStack()
					this.runtime.goToLayout(this.runtime.layout.name)
				},
			},
			{
				type: "button",
				label: "New Run",
				style: "outline",
				callback: () => {
					this.ClearStack()
					this.runtime.goToLayout("START")
				},
			},
			{
				type: "button",
				label: "BackToMenu",
				style: "outline",
				callback: () => {
					this.ClearStack()
					this.runtime.goToLayout("TITLE")
				},
			},
		])

		//#endregion End Run

		//#region Pause

		this.pauseMenu = this.CreateMenuScreen("pauseMenu", true)

		this.pauseMenu.innerHTML = /*html*/ `
        <div id="" class="vertical justify_center items_center h100 w100">
            <div id="pause_Container" class="inlineFlex row items_start justify_center gap_2 ">
                <div id="pause_LeftPart" class="vertical">
                    <div id="pause_RunInfo" class="" style="
                        background: rgba(0, 0, 0, 0.7);
                        border-radius: ${Utils.px(1)};
                        margin-bottom: ${Utils.px(2)};
                        text-align: center;
                    ">
                    </div>
                    <div id="pause_Buttons" class="column" style="
                        gap: ${Utils.px(2)};
                    ">
                    </div>
                    <div id="pause_EndRun_Info" class="" style="
                        margin-top: ${Utils.px(2)};
                        background: rgba(0, 0, 0, 0.7);
                        text-align: center;
                        max-width: 100%;
                        
                        box-sizing: border-box;
                        overflow-wrap: break-word;   /* ✅ allows breaking long words */
                        word-break: break-word;      /* ✅ ensures long strings wrap */
                        white-space: normal;         /* ✅ allows wrapping */
                    ">
                    </div>
                </div>

                <div id="pause_PlayerInfo" class="vertical" style= "width:${Utils.px(200)};">
                    <div id="pause_PlayerInfo_Row" class= "horizontal justify_center items_center" style= "
                        height:${Utils.px(20)};
                        gap: ${Utils.px(2)};
                    ">
                        <img id="leftIcon" src="steamdeck_button_l1.png" style="
                            visibility: hidden;
                            height: 1.5em;
                            vertical-align: middle; 
                        ">
                        <div id="pause_PlayerName" class="textOutline" style="
                            font-size: ${Utils.px(9)};
                            font-weight: bold;
                        ">
                        </div>
                        <img id="rightIcon" src="steamdeck_button_r1.png"  style="
                            visibility: hidden;
                            height: 1.5em;
                            vertical-align: middle;
                        ">
                    </div>
                    <div id="pause_Weps" class= "vertical" style= "height:${Utils.px(40)};">
                    </div>
                    <div id="pause_Items" class= "vertical" style= "height:${Utils.px(120)};">
                    </div>
                </div>
            
                
                <div id="pause_Stats">
                </div>
            </div>
        </div>
        `

		this.AddSettingsToID("pause_Buttons", "", "", true, [
			{
				type: "button",
				label: "Resume",
				elemClass: "focusOnEnter, button_Resume",
				callback: () => {
					this.Toggle_Pause()
				},
			},
			{
				type: "button",
				label: "Restart",
				callback: () => {
					this.ClearStack()
					this.runtime.goToLayout(this.runtime.layout.name)
				},
			},
			{
				type: "button",
				label: "Options",
				callback: () => {
					this.GoTo("settingsGeneral", this.playerMenuID)
					//window.alert("GoTo settingsGeneral" + this.playerMenuID)
					//this.GoTo("settingsChoose")
				},
			},
			{
				type: "button",
				label: "BackToMenu",
				elemClass: "button_endRun",
				callback: () => {
					this.ClearStack()

					const waveManager = this.runtime.waveManager

					if (waveManager.waveCount > waveManager.waveMax) {
						this.GameOver_Actual()
					} else {
						this.runtime.goToLayout("TITLE")
					}
				},
			},
		])

		const pause_EndRun_Info = this.pauseMenu.querySelector("#pause_EndRun_Info")
		Utils.Elem_SetTranslateKey(pause_EndRun_Info, "EndRun_Info")

		//#endregion Settings Choose
	}

	CreateSettings() {
		//#region Settings Choose

		const settingsChoose = this.CreateMenuScreen("settingsChoose", true)

		settingsChoose.innerHTML = /*html*/ `
            <div id="choose_Container" class="settingsMenu items_center">
                <div id="choose_Column" class="column justify_center w33">
                </div>
            </div>
        `

		this.AddSettingsToID("choose_Column", "", "Menu_Options", true, [
			{
				type: "button",
				label: "General",
				callback: () => {
					this.GoTo("settingsGeneral")
				},
			},
			//! not implemented for first releases
			/*
			{
				type: "button",
				label: "Gameplay",
				callback: () => {
					this.GoTo("settingsGameplay")
				},
			},
            */
			{
				type: "button",
				label: "Back",
				translate: "Back",
				callback: () => {
					this.Back()
				},
			},
		])

		//#endregion Settings Choose

		//#region General Settings

		const settingsGeneral = this.CreateMenuScreen("settingsGeneral", true)

		settingsGeneral.innerHTML = /*html*/ `
            <div class="vertical justify_center h100 w100 gap_2" style="
                background: radial-gradient(ellipse at bottom, rgb(6 21 22) 0%, rgb(0 0 0) 100%);
            ">
                <div class="horizontal justify_center gap_1">
                    <div id="video_Column" class="column">
                    </div>
                    <div id="sound_Column" class="column">
                    </div>
                    <div id="other_Column" class="column">
                    </div>
                </div>
                <div class="vertical items_center">
                    <div id="genSettings_Footer" class="column" style="width: 20%;">
                    </div>
                </div>
            </div>
        `

		this.AddSettingsToID("video_Column", "Video", "", true, [
			{
				//!help navigation
				type: "button",
				label: "",
				noFrame: true,
				height: 4,
			},
			{
				type: "dropdown",
				settingLink: "Language",
				//translate: "Language",
				options: [
					["English", "en"],
					["Français", "fr"],
					["Deutsch", "de"],
					["Español", "es"],
					["Italiano", "it"],
					["Polski", "pl"],
					["Português", "pt"],
					["Русский", "ru"],
					["Türkçe", "tr"],
					["中文", "zh"],
					["中文 (繁體)", "zh_TW"],
					["日本語", "ja"],
					["한국어", "ko"],
				],
			},

			{
				type: "toggle",
				settingLink: "Screenshake",
				translate: "Menu_Options_Screenshake",
			},
			{
				type: "toggle",
				settingLink: "Fullscreen",
				elemClass: "FullscreenButton",
				translate: "Menu_Options_Fullscreen",
			},

			/*
			{
				type: "toggle",
				settingLink: "Visual_Effects",
			},*/
			/*
			{
				type: "toggle",
				settingLink: "Damage_Display",
			},*/
			/*
			{
				type: "toggle",
				settingLink: "Optimize_End_Waves",
			},*/
		])

		this.AddSettingsToID("sound_Column", "Audio", "", true, [
			/*
			{
				type: "toggle",
				settingLink: "Menu_Options_Mute_OnFocusLost",
			},*/
			{
				//!help navigation
				type: "button",
				label: "",
				noFrame: true,
				height: 4,
			},
			{
				type: "slider",
				label: "Volume_Master",
				settingLink: "Volume_Master",
				min: 0,
				max: 100,
				value: 50,
				addRecommended: true,
			},
			{
				type: "slider",
				label: "Volume_Sound",
				settingLink: "Volume_Sound",
				min: 0,
				max: 100,
				value: 100,
			},
			{
				type: "slider",
				label: "Volume_Music",
				settingLink: "Volume_Music",
				min: 0,
				max: 100,
				value: 90,
				addRecommended: true,
			},
			{
				//!help navigation
				type: "button",
				label: "",
				noFrame: true,
				height: 4,
			},
			/*
			{
				type: "toggle",
				settingLink: "Menu_Options_Pause_OnFocusLost",
			},*/
		])

		this.AddSettingsToID("other_Column", "Other", "", true, [
			{
				//!help navigation
				type: "button",
				label: "",
				noFrame: true,
				height: 4,
			},
			{
				type: "button",
				label: "Streamer_Mode",
				imgBefore: "twitch.png",
				elemClass: "StreamerModeButton",
				callback: () => {
					this.runtime.twitch.Button_Press()
				},
				onCreated: (elem) => {
					this.runtime.twitch.Button_Add(elem)
				},
			},
			{
				type: "toggle",
				label: "VIP_Unlock",
				elemClass: "VIP_Unlock_Button",
				callback: (bool) => {
					this.runtime.main.unlockAll = bool
				},
			},
			/*
			{
				type: "toggle",
				settingLink: "Retry_Failed_Waves",
			},*/
			/*
			{
				type: "toggle",
				settingLink: "Mouse_Only",
			},*/
		])

		if (this.runtime.main.isDemo) {
			const vipToggle = settingsGeneral.querySelector(".VIP_Unlock_Button")
			vipToggle.style.display = "none"
		}

		if (this.runtime.platforms.Export === "preview") {
			const vipToggle = settingsGeneral.querySelector(".VIP_Unlock_Button")
			//cheked the child input
			const input = vipToggle.querySelector("input")
			input.checked = true
			this.runtime.main.unlockAll = true
		}

		if (this.runtime.platforms.MaybeSteamdeck()) {
			const fullscreenToggle = settingsGeneral.querySelector(".FullscreenButton")
			fullscreenToggle.style.display = "none"
		}

		if (!this.runtime.twitch.SupportsTwitch()) {
			const streamerModeButton = settingsGeneral.querySelector(".StreamerModeButton")
			streamerModeButton.style.display = "none"
		}

		this.AddSettingsToID("genSettings_Footer", "", "", true, [
			{
				type: "button",
				label: "Reset",
				callback: () => {
					this.runtime.progress.ResetSettings("General")
				},
			},
			{
				type: "button",
				label: "Back",
				elemClass: "focusOnEnter",
				callback: () => {
					this.Back()
				},
			},
		])

		//#endregion General Settings

		//#region Gameplay Settings

		const settingsGameplay = this.CreateMenuScreen("settingsGameplay", false)

		settingsGameplay.innerHTML = /*html*/ `
            <div class="vertical justify_center h100 w100 gap_2">
                <div class="horizontal justify_center gap_1">
                    <div id="gameplay_Column" class="column">
                    </div>
                    <div id="acccess_Column" class="column">
                    </div>
                </div>
                <div class="vertical items_center">
                    <div id="gameSettings_Footer" class="column" style="width: 20%;">
                    </div>
                </div>
            </div>
        `

		this.AddSettingsToID("gameplay_Column", "Gameplay", "Menu_Options", true, [
			{
				type: "toggle",
				settingLink: "Mouse_Only",
			},
			{
				type: "dropdown",
				settingLink: "Manual_Aim",
				options: ["No", "Always", "OnPress"],
			},
			{
				type: "toggle",
				settingLink: "HPBar_Player",
			},
			{
				type: "toggle",
				settingLink: "Keep_Items_Locked",
			},
			{
				type: "toggle",
				settingLink: "Coop_LockCam",
			},
			{
				type: "toggle",
				settingLink: "Coop_ShareLoot",
			},
			/*,
			{
				type: "dropdown",
				label: "Endless score",
				options: ["Highest wave", "Lowest time", "Highest score"]
			}*/
		])
		this.AddSettingsToID("acccess_Column", "Accessibility", "Menu_Options", true, [
			/*
			{
				type: "slider",
				settingLink: "Enemy_HP",
				min: 25,
				max: 200,
				value: 100
			},
			{
				type: "slider",
				settingLink: "Enemy_Damage",
				min: 25,
				max: 200,
				value: 100
			},
			{
				type: "slider",
				settingLink: "Enemy_Speed",
				min: 25,
				max: 150,
				value: 100
			},*/
			{
				type: "slider",
				settingLink: "Opacity_Explosions",
				min: 0,
				max: 100,
				value: 100,
			},
			{
				type: "slider",
				settingLink: "Opacity_Projectiles",
				min: 0,
				max: 100,
				value: 100,
			},
			{
				type: "slider",
				settingLink: "Font_Size",
				min: 0,
				max: 100,
				value: 100,
			},
			{
				type: "toggle",
				settingLink: "Highlight_Characters",
			},
			{
				type: "toggle",
				settingLink: "Highlight_Weapons",
			},
			{
				type: "toggle",
				settingLink: "Highlight_Projectiles",
			},
			{
				type: "toggle",
				settingLink: "Screen_Darkening",
			},
			{
				type: "toggle",
				settingLink: "Retry_Failed_Waves",
			},
		])
		this.AddSettingsToID("gameSettings_Footer", "", "", true, [
			{
				type: "button",
				label: "Reset",
				callback: () => {
					this.runtime.progress.ResetSettings("Gameplay")
				},
			},
			{
				type: "button",
				label: "Back",
				callback: () => {
					this.Back()
				},
			},
		])

		//#endregion Gameplay Settings
	}

	SetSetting(key, value) {
		this.runtime.progress.SetSetting(key, value)
	}

	GetSetting(key) {
		return this.runtime.progress.GetSetting(key)
	}

	AddSettingsToID(id = "", title = "", translatePrefix = "", width100 = false, settings) {
		const element = document.getElementById(id)
		if (!element) {
			console.error(`Element with ID ${id} not found.`)
			return
		}

		return this.AddSettingsToElem(element, title, translatePrefix, width100, settings)
	}

	AddSettingsToElem(element, title = "", translatePrefix = "", width100 = false, settings) {
		if (title) {
			const header = document.createElement("h2")
			Utils.Elem_SetTranslateKey(header, title)
			element.appendChild(header)
		}

		let elements = []

		settings.forEach((setting) => {
			const settingElem = this.CreateSettingElement(setting, translatePrefix, width100)
			elements.push(settingElem)
			element.appendChild(settingElem)
		})
		if (elements.length === 1) elements = elements[0]
		return elements
	}

	CreateSettingElement(args, translatePrefix = "", width100 = false) {
		let settingElem
		const settingLink = args.settingLink
		if (settingLink) {
			if (!args.label) args.label = settingLink
		}

		switch (args.type) {
			case "slider":
				settingElem = this.CreateSetting_Slider(args)
				break
			case "toggle":
				settingElem = this.CreateSetting_Toggle(args)
				break
			case "dropdown":
				settingElem = this.CreateSetting_Dropdown(args)
				break
			case "button":
				settingElem = this.CreateSetting_Button(args)
				break
		}

		if (settingLink) {
			if (!this.runtime.progress.settingLinks[settingLink]) {
				this.runtime.progress.settingLinks[settingLink] = []
			}
			this.runtime.progress.settingLinks[settingLink].push(settingElem)
		}

		if (args.elemClass) {
			const classSplit = args.elemClass.split(", ")
			classSplit.forEach((elemClass) => {
				settingElem.classList.add(elemClass)
			})
		}

		if (width100) settingElem.style.width = "100%"

		if (args.height) {
			settingElem.style.height = Utils.px(args.height)
		}

		if (!args.noFrame) {
			this.runtime.style.Elem_BoxStyle(settingElem, "TIER_0", 2, {
				hasTransparentBG: false,
				isSetting: true,
			})
		}

		const translateElem = settingElem.querySelector("label")
		if (translateElem) {
			let translateKey = args.translate || (translatePrefix ? translatePrefix + "_" : "") + args.label
			//!
			//if (args.imgBefore) translateKey = `[img=${args.imgBefore}] ${translateKey}`

			this.runtime.translation.Elem_SetTranslateKey_ToHTML(translateElem, translateKey, args.onTranslate)

			translateElem.classList.add("noBreak")
		}

		if (args.onCreated) {
			args.onCreated(settingElem)
		}

		return settingElem
	}

	CreateFooterButtons(elem) {}

	_LabelToId(type, id, label) {
		if (!id) {
			id = type + "_" + label
			label = label.replace(/\s/g, "_")
		}
		return id
	}

	CreateSetting_Slider(args) {
		let id = args.id
		let label = args.label
		let min = args.min || 0
		let max = args.max || 100
		let value = args.value || 50
		let increment = args.increment || 5
		let callback = args.callback || null
		let settingLink = args.settingLink || null
		let addRecommended = args.addRecommended || false

		id = this._LabelToId("slider", id, label)

		const settingSlider = document.createElement("div")
		settingSlider.classList.add("settingSlider")
		settingSlider.id = id

		const labelElem = document.createElement("label")
		labelElem.textContent = label
		Utils.Elem_SetAttributes(labelElem, { for: id })

		const sliderContainer = document.createElement("div")
		sliderContainer.classList.add("custom-slider")

		settingSlider.appendChild(labelElem)
		settingSlider.appendChild(sliderContainer)

		// Create the slider track
		const sliderTrack = document.createElement("div")
		sliderTrack.classList.add("slider-track")

		// Create the slider fill bar
		const sliderFill = document.createElement("div")
		sliderFill.classList.add("slider-fill")
		sliderFill.style.width = `${((value - min) / (max - min)) * 100}%`

		sliderTrack.appendChild(sliderFill)
		sliderContainer.appendChild(sliderTrack)

		// Handle left and right movement events
		settingSlider.addEventListener("sn:move_left", () => {
			value = Math.max(min, value - increment)
			updateSlider(value)
		})

		settingSlider.addEventListener("sn:move_right", () => {
			value = Math.min(max, value + increment)
			updateSlider(value)
		})

		const focus = () => {
			sliderFill.style.backgroundColor = getComputedStyle(sliderFill).getPropertyValue("--sliderfillColor_Focus")
		}

		const unfocus = () => {
			sliderFill.style.backgroundColor = getComputedStyle(sliderFill).getPropertyValue("--sliderfillColor_Regular")
		}

		Utils.Elem_Focusable(settingSlider, focus, unfocus, true)

		// Update the fill and thumb position
		const updateSlider = (newValue) => {
			const percentage = ((newValue - min) / (max - min)) * 100
			sliderFill.style.width = `${percentage}%`

			if (typeof sliderThumb !== "undefined" && sliderThumb !== null) sliderThumb.style.left = `${percentage}%`

			if (callback) callback(newValue)
			if (settingLink) this.SetSetting(settingLink, newValue)
		}

		// Update slider based on the mouse or touch position
		const updateSliderOnPosition = (position) => {
			const rect = sliderTrack.getBoundingClientRect()
			const newValue = Math.round(((position - rect.left) / rect.width) * (max - min) + min)
			value = Math.max(min, Math.min(max, newValue))
			updateSlider(value)
		}

		//* ========= Handle mouse and touch events ================================== *//
		//! =============

		// Global variables to control dragging state and prevent interaction

		// Function to start dragging
		const onDragStart = (e) => {
			this.stopFocus = true
			document.activeElement.blur() // Remove focus from the active element
			const position = e.clientX // Use clientX directly for pointer events
			updateSliderOnPosition(position)

			// Prevent focus and click on any element while dragging
			document.addEventListener("focus", preventInteraction, true)
			document.addEventListener("click", preventInteraction, true)
			document.addEventListener("mouseenter", preventInteraction, true)
			document.addEventListener("mouseover", preventInteraction, true)
			document.addEventListener("mouseout", preventInteraction, true)
			document.addEventListener("mouseleave", preventInteraction, true)

			// Add event listeners for pointer move and pointer up to document
			document.addEventListener("pointermove", onDragMove)
			document.addEventListener("pointerup", onDragEnd)
		}

		// Prevent focus and click on any element while dragging
		const preventInteraction = (e) => {
			e.stopPropagation()
			e.preventDefault()
		}

		// Function to update the slider position based on pointer movement
		const onDragMove = (e) => {
			const position = e.clientX // Use clientX for pointermove
			updateSliderOnPosition(position)
		}

		// Function to end dragging
		const onDragEnd = () => {
			this.stopFocus = false

			// Remove the event listeners that prevent interaction
			document.removeEventListener("focus", preventInteraction, true)
			document.removeEventListener("click", preventInteraction, true)
			document.removeEventListener("mouseenter", preventInteraction, true)
			document.removeEventListener("mouseover", preventInteraction, true)
			document.removeEventListener("mouseout", preventInteraction, true)
			document.removeEventListener("mouseleave", preventInteraction, true)

			// Remove event listeners for pointer move and pointer up
			document.removeEventListener("pointermove", onDragMove)
			document.removeEventListener("pointerup", onDragEnd)

			unfocus()
		}

		// Modify the existing event listeners for pointer events
		sliderContainer.addEventListener("pointerdown", onDragStart)

		// Handle click event to change value
		sliderContainer.addEventListener("sn:pressed", (e) => {
			const rect = sliderTrack.getBoundingClientRect()
			const newValue = Math.round(((e.clientX - rect.left) / rect.width) * (max - min) + min)
			value = Math.max(min, Math.min(max, newValue))
			updateSlider(value)
		})

		if (settingLink) {
			const settingValue = this.GetSetting(settingLink)

			if (settingLink === "Volume_Music") {
				//window.alert("Create Volume " + settingValue)
			}
			updateSlider(settingValue)
		} else {
			updateSlider(value)
		}

		settingSlider.updateValue = updateSlider

		if (addRecommended) {
			const recommended = document.createElement("div")
			recommended.classList.add("recommended")
			const percentage = ((value - min) / (max - min)) * 100
			recommended.style.left = `${percentage}%`
			recommended.style.width = `${Utils.px(0.3)}`
			recommended.style.height = "100%"
			recommended.style.backgroundColor = "black"
			recommended.style.position = "absolute"
			recommended.style.transform = "translateX(-50%)"
			sliderTrack.appendChild(recommended)
		}

		return settingSlider
	}

	CreateSetting_Toggle(args) {
		let id = args.id
		let label = args.label
		let callback = args.callback || null
		let onCallback = args.onCallback || null
		let offCallback = args.offCallback || null
		let settingLink = args.settingLink || null

		id = this._LabelToId("toggle", id, label)

		const settingItem = document.createElement("div")
		settingItem.classList.add("settingItem")
		/*Utils.Elem_SetAttributes(settingItem, {
			pointer: "cursor"
		})*/

		const labelElem = document.createElement("label")
		labelElem.textContent = label
		Utils.Elem_SetAttributes(labelElem, {
			for: id,
		})
		settingItem.appendChild(labelElem)

		const toggleContainer = document.createElement("div")
		toggleContainer.classList.add("toggle-container")

		const checkboxElem = document.createElement("input")
		Utils.Elem_SetAttributes(checkboxElem, {
			type: "checkbox",
			class: "toggle-checkbox",
			id: id,
		})

		const toggleLabel = document.createElement("label")
		toggleLabel.classList.add("toggle-label")
		Utils.Elem_SetAttributes(toggleLabel, {
			for: id,
		})

		const toggleButton = document.createElement("span")
		toggleButton.classList.add("toggle-button")

		toggleLabel.appendChild(toggleButton)
		toggleContainer.appendChild(checkboxElem)
		toggleContainer.appendChild(toggleLabel)

		settingItem.appendChild(toggleContainer)

		// Set up spatial navigation events
		settingItem.classList.add("toggle-item") // Add a class for selection

		const focus = () => {
			settingItem.style.backgroundColor = "white"
			settingItem.style.color = "black"
			//settingItem.style.fontWeight = "bold"
		}

		const unfocus = () => {
			settingItem.style.backgroundColor = ""
			settingItem.style.color = ""
			//settingItem.style.fontWeight = ""
		}

		Utils.Elem_Focusable(settingItem, focus, unfocus, true)

		settingItem.addEventListener("sn:pressed", () => checkboxElem.click()) // Toggle checkbox

		checkboxElem.addEventListener("change", (e) => {
			const bool = checkboxElem.checked
			if (settingLink) this.SetSetting(settingLink, bool)
			if (callback) callback(bool)
			if (bool) {
				if (onCallback) onCallback()
			} else {
				if (offCallback) offCallback()
			}
		})

		if (settingLink) {
			checkboxElem.checked = this.GetSetting(settingLink)
			checkboxElem.dispatchEvent(new Event("change"))
		}

		settingItem.updateValue = (bool) => {
			checkboxElem.checked = bool
			checkboxElem.dispatchEvent(new Event("change"))
		}

		return settingItem
	}

	CreateSetting_Dropdown(args) {
		let id = args.id
		let label = args.label
		let options = args.options || []
		let callback = args.callback || null
		let settingLink = args.settingLink || null
		let onlyList = args.onlyList || false

		id = this._LabelToId("dropdown", id, label)

		// Create the main container for the dropdown
		const settingItem = document.createElement("div")
		settingItem.classList.add("settingItem")

		// Create the label for the dropdown
		if (!onlyList) {
			const labelElem = document.createElement("label")
			labelElem.textContent = label
			Utils.Elem_SetAttributes(labelElem, { for: id })
			settingItem.appendChild(labelElem)
		}

		// Create the dropdown trigger container
		const dropdownContainer = document.createElement("div")
		dropdownContainer.classList.add("customDropdownContainer")
		dropdownContainer.setAttribute("tabindex", "0") // Make it focusable
		dropdownContainer.setAttribute("id", id)

		// Create the selected option display (trigger)
		const dropdownTrigger = document.createElement("div")
		dropdownTrigger.classList.add("customDropdownTrigger")
		this.runtime.translation.Elem_SetTranslateKey(dropdownTrigger, Array.isArray(options[0]) ? options[0][0] : options[0])

		// Create the arrow icon
		const arrowIcon = document.createElement("span")
		arrowIcon.classList.add("arrowIcon")
		arrowIcon.textContent = "▼" // Unicode down arrow

		// Create the dropdown menu container
		const dropdownMenu = document.createElement("div")
		dropdownMenu.classList.add("customDropdownMenu")
		dropdownMenu.style.display = "none" // Hide menu by default

		// Populate dropdown menu with options
		const optionsFirstParams = options.map((option) => {
			return Array.isArray(option) ? option[0] : option
		})
		options.forEach((option) => {
			const optionElem = document.createElement("div")
			optionElem.classList.add("customDropdownOption")

			optionElem.setAttribute("tabindex", "-1") // Option is focusable through keyboard navigation

			const translateKey = Array.isArray(option) ? option[0] : option
			const callbackParam = Array.isArray(option) && option.length === 2 ? option[1] : option
			optionElem.setAttribute("callbackParam", callbackParam)

			this.runtime.translation.Elem_SetTranslateKey(optionElem, translateKey)

			Utils.Elem_Focusable(
				optionElem,
				() => {},
				() => {},
				false
			)

			// Set click event on option
			optionElem.addEventListener("sn:pressed", () => {
				//window.alert("Pressed Option")
				select_option(optionElem)
			})

			dropdownMenu.appendChild(optionElem)
		})

		// Append trigger and menu to container
		dropdownContainer.appendChild(dropdownTrigger)
		dropdownContainer.appendChild(arrowIcon)
		dropdownContainer.appendChild(dropdownMenu)

		// Append label and dropdown container to setting item

		settingItem.appendChild(dropdownContainer)

		let currentValue

		const focusSelectedOption = () => {
			const options = dropdownMenu.querySelectorAll(".customDropdownOption")
			const currentIndex = Array.from(options).findIndex((option) => option.textContent === dropdownTrigger.textContent)
			if (currentIndex >= 0) {
				options[currentIndex].focus()
			}
		}

		// Toggle dropdown menu visibility on trigger click
		settingItem.addEventListener("sn:pressed", (event) => {
			if (!dropdownMenu.contains(event.target)) {
				if (dropdownMenu.style.display === "none") {
					//event.stopPropagation()
					dropdownMenu.style.display = "block"
					currentValue = dropdownTrigger.textContent // Save current value
					/*
					const event = document.createEvent("Event")
					event.initCustomEvent("sn:unfocused", true, true, null)
					settingItem.dispatchEvent(event)*/

					this.SNPause()

					settingItem.addEventListener("sn:move_up", dropdown_up)

					settingItem.addEventListener("sn:move_down", dropdown_down)

					setTimeout(() => {
						settingItem.addEventListener("sn:pressed", dropdown_pressed)
						document.addEventListener("sn:pressed", dropdown_misclick)
						document.addEventListener("click", dropdown_misclick)
						document.addEventListener("sn:pressDropdown", dropdown_pressed)
					}, 0)

					/*
					requestAnimationFrame(() => {
						settingItem.addEventListener("sn:pressed", dropdown_pressed)
						document.addEventListener("sn:pressed", dropdown_misclick)
					})*/

					//!careful refacto
					document.addEventListener("sn:escape", dropdown_escape)

					//window.alert("FocusDropdown")
				}
			}
		})

		const resetToCurrentValue = () => {
			dropdownTrigger.textContent = currentValue // Reset dropdown to current value
			focusSelectedOption() // Focus the selected option
		}

		const dropdown_misclick = (event) => {
			//window.alert("Misclick")
			resetToCurrentValue()
			dropdown_exit()
		}

		const dropdown_escape = (event) => {
			//window.alert("Dropdown Escape")
			resetToCurrentValue()
			dropdown_exit()
		}

		const select_option = (optionElem, initSetting = false) => {
			if (optionElem) {
				const translateKey = optionElem.getAttribute("data-translate")
				const callbackParam = optionElem.getAttribute("callbackParam")
				this.runtime.translation.Elem_SetTranslateKey(dropdownTrigger, translateKey)
				if (settingLink) this.SetSetting(settingLink, callbackParam)
				if (callback) callback(callbackParam)
			}
			if (!initSetting) dropdown_exit()
		}

		/*
		const dropdown_misclick = (event) => {
			//!isTrusted guarantees that the event was not generated by a script
			if (event.isTrusted && !dropdownContainer.contains(event.target)) {
				window.alert("Misclick")
				dropdown_exit()
			}
		}*/

		const dropdown_up = () => {
			const options = dropdownMenu.querySelectorAll(".customDropdownOption")
			let currentOptionIndex = Array.from(options).findIndex((option) => option.textContent === dropdownTrigger.textContent)
			if (currentOptionIndex > 0) {
				currentOptionIndex -= 1
			} else {
				currentOptionIndex = options.length - 1 // Wrap around
			}
			const selectedOption = options[currentOptionIndex]
			dropdownTrigger.textContent = selectedOption.textContent

			//dropdownTrigger.currentOptionIndex = currentOptionIndex

			selectedOption.focus()
		}

		const dropdown_down = () => {
			const options = dropdownMenu.querySelectorAll(".customDropdownOption")
			let currentOptionIndex = Array.from(options).findIndex((option) => option.textContent === dropdownTrigger.textContent)
			if (currentOptionIndex < options.length - 1) {
				currentOptionIndex += 1
			} else {
				currentOptionIndex = 0 // Wrap around
			}
			const selectedOption = options[currentOptionIndex]
			dropdownTrigger.textContent = selectedOption.textContent

			dropdownTrigger.currentOptionIndex = currentOptionIndex

			selectedOption.focus()
		}

		const dropdown_pressed = () => {
			//window.alert("dropdown_pressed")
			const options = dropdownMenu.querySelectorAll(".customDropdownOption")
			let currentOption = Array.from(options).find((option) => option.textContent === dropdownTrigger.textContent)

			if (currentOption) {
				//window.alert("dropdown_selectFocusedOption")
				select_option(currentOption)
			}
		}

		const dropdown_exit = () => {
			settingItem.removeEventListener("sn:move_up", dropdown_up)
			settingItem.removeEventListener("sn:move_down", dropdown_down)
			settingItem.removeEventListener("sn:pressed", dropdown_pressed)
			document.removeEventListener("sn:pressed", dropdown_misclick)
			document.removeEventListener("sn:escape", dropdown_escape)
			document.removeEventListener("sn:pressDropdown", dropdown_pressed)

			document.removeEventListener("click", dropdown_misclick)

			this.SNResume()

			requestAnimationFrame(() => {
				dropdownMenu.style.display = "none"
			})

			/*
			const event = document.createEvent("Event")
			event.initCustomEvent("sn:focused", true, true, null)
			settingItem.dispatchEvent(event)*/
		}

		// Close the dropdown menu if clicked outside of it

		// Set focus and unfocus styles
		const focus = () => {
			dropdownContainer.style.borderColor = "#007bff" // Highlight border on focus
		}

		const unfocus = () => {
			dropdownContainer.style.borderColor = ""
		}

		Utils.Elem_Focusable(settingItem, focus, unfocus, true)

		const updateValue = (value) => {
			const selectOpts = dropdownMenu.querySelectorAll(".customDropdownOption")
			let selectElem = Array.from(selectOpts).find((option) => option.getAttribute("callbackParam") === value)
			if (!selectElem) selectElem = selectOpts[0]
			select_option(selectElem, true)
		}

		if (settingLink) {
			const settingValue = this.GetSetting(settingLink)

			updateValue(settingValue)
		}

		settingItem.updateValue = updateValue

		return settingItem
	}

	CreateSetting_Button(args) {
		let id = args.id
		let label = args.label
		let callback = args.callback || null
		//let settingLink = args.settingLink || null
		let color = args.color || "white"
		let style = args.style || "default"

		let BG_Color = args.BG_Color || "black"

		id = this._LabelToId("button", id, label)

		const settingItem = document.createElement("div")
		settingItem.classList.add("settingItem")
		Utils.Elem_SetStyle(settingItem, {
			//pointer: "cursor",
			justifyContent: "center",
		})

		if (!label.startsWith("!")) {
			const labelElem = document.createElement("label")
			labelElem.id = "buttonLabel"
			labelElem.textContent = label
			Utils.Elem_SetAttributes(labelElem, {
				for: id,
			})
			settingItem.appendChild(labelElem)
		}

		//temp add outline
		//settingItem.style.border = `${Utils.px(0.2)} solid rgb(255, 255, 255)`

		if (BG_Color !== "black") {
			settingItem.style.backgroundColor = BG_Color
		}

		if (style === "default") {
			const focus = () => {
				settingItem.style.backgroundColor = "white"
				settingItem.style.color = "black"
				//settingItem.style.fontWeight = "bold"
			}

			const unfocus = () => {
				settingItem.style.backgroundColor = BG_Color
				settingItem.style.color = ""
				//settingItem.style.fontWeight = ""
			}

			Utils.Elem_Focusable(settingItem, focus, unfocus, true)
		} else if (style === "outline") {
			Utils.Elem_FocusableOutline(settingItem)
		} else if (style === "colorBG") {
			Utils.Elem_FocusableBG(settingItem)
		}

		settingItem.addEventListener("sn:pressed", callback)

		return settingItem
	}
}
