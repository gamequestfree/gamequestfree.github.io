import { Tooltip } from "./Tooltip.js"

export class Shop {
	constructor(runtime, player) {
		this.runtime = runtime
		this.player = player

		this.service = new ShopService(this)

		this.cheatShop = false
		if (this.runtime.cheatShop) this.cheatShop = true

		this.itemShopTooltips = []
		this.itemShopRows = []

		this.multi_ShowingStats = false

		this.eventListeners = [{ event: "On_Wave_Start", callback: this.NewWave.bind(this) }]

		if (this.player.isPlayer0) {
			this.HTML_CreateShop_Single()
		}

		this.HTML_CreateShop_Multiplayer()

		this.tab = 0
		this.tab_previous = 0

		this.shopItems = {}

		for (let i = 0; i < NB_SHOP_ITEMS; i++) {
			this.shopItems[i] = {
				itemClass: null,
				priceModifier: 1,
				priceCurrent: 0,
			}
		}

		this.isWepItemContextMenu = null

		this.HTML_SetElementsInShop()
	}

	get element() {
		if (this.runtime.singlePlayer && this.player.isPlayer0) return this.elemSingle
		else return this.elemMulti
	}

	/*
    const selectItemBox = () => {
        player.SN.focus(itembox)
    }*/

	WepItemContextMenu(arg) {
		let overlay = this.element.querySelector("#wepOverlay")
		if (!overlay) overlay = Utils.Elem_AddOverlay(this.element, "wepOverlay")

		overlay.style.display = "none"

		if (arg === null) {
			this.ShopMenuNavigation()
			this.player.inventoryWeps.Focus(0)
			this.isWepItemContextMenu = null
		} else if (arg === "Back") {
			this.ShopMenuNavigation()
			this.player.SN.focus(this.isWepItemContextMenu)
			this.isWepItemContextMenu = null
		}
		//activate context menu for itemBox; and store the itemBox to be able to refocus
		else {
			this.isWepItemContextMenu = arg

			overlay.style.display = "flex"
		}
	}

	SetEnabled(bool) {
		if (this.enabled === bool) return
		this.enabled = bool

		this.eventListeners.forEach(({ event, callback }) => {
			if (this.enabled) {
				this.runtime.events.addEventListener(event, callback)
			} else {
				this.runtime.events.removeEventListener(event, callback)
			}
		})
	}

	/*
    style="
                padding: ${Utils.px(2)};
                background-image: url(BGPattern.png);
                background-size: ${Utils.px(50)} ${Utils.px(50)};
                background-repeat: repeat;
                animation: scrollBG 10s linear infinite;

            ">
            */

	async ExitShop() {
		this.runtime.menu.shopPhase = false

		this.runtime.globalVars["IsInCheatShop"] = false
		this.runtime.menu.ClearStack()

		//*SPAWN HERO SPAWN

		this.runtime.hero.AddHero_NextWave_CheckWave(1)

		//* Movie scene
		const ret = await this.runtime.movie.PlayScene_AfterShop()

		if (ret !== null) {
			if (ret === false) return
			this.ExitShop_StartWave()
			return
		}

		await this.runtime.shutters.Shutters_CloseOpen()

		this.ExitShop_StartWave()
	}

	ExitShop_StartWave() {
		this.runtime.layout.getLayer("NoobsBG").isVisible = false
		this.runtime.layout.getLayer("FG_Above_BG0").isVisible = true
		this.runtime.layout.getLayer("FireShop_BG0").isVisible = false

		this.runtime.layout.getLayer("HUD_HTML").isVisible = this.runtime.main.toggleHUD

		//Camera Effect

		this.runtime.camera.zoomScale = 1

		this.runtime.camera.currentScale = 1

		for (const player of this.runtime.players) {
			player.stats.ShowTabButtons(true)
		}

		this.runtime.waveManager.Wave_Next()
	}

	NewWave() {
		if (!this.player.enabled) return

		this.freeReroll = this.player.stats.GetStatValue("Reroll")
		this.rerollCountThisWave = 0
		this.rerollCountThisWave_paid = 0
		this.GetRerollPrice()
	}

	GetRerollPrice() {
		//if all items are bought, set reroll Price to 0
		//make an array of shopItems and check if all items are bought
		const allItemsBought = Object.values(this.shopItems).every((item) => item.itemClass === null)
		if (allItemsBought) {
			this.rerollPrice = 0
		} else if (this.freeReroll > 0) {
			this.rerollPrice = 0
		} else {
			const waveCount = this.runtime.waveManager.waveCount
			this.rerollPrice = waveCount + Math.max(1, (this.rerollCountThisWave + 1) * Math.floor(waveCount * 0.5))
			this.rerollPrice = Math.round(this.rerollPrice * this.player.stats.GetStatValue("Price_Rerolls"))
		}
		if (this.rerollCostElem) this.player.SetCoinElem(this.rerollCostElem, this.rerollPrice)
		if (this.rerollCostElem_Multi) this.player.SetCoinElem(this.rerollCostElem_Multi, this.rerollPrice)
		if (this.shopStats.rerollCostElem) this.player.SetCoinElem(this.shopStats.rerollCostElem, this.rerollPrice)
		this.player.UpdateCoins()
	}

	ValidateOverlay(bool, shopStats = false) {
		if (this.validate === bool) return
		const parentElem = shopStats ? this.shopStats.elemMulti : this.element
		if (bool) {
			const readyOverlay = document.createElement("div")
			readyOverlay.id = "readyOverlay"

			parentElem.style.position = parentElem.style.position || "relative"

			readyOverlay.classList.add("flex", "items_center", "justify_center")

			Object.assign(readyOverlay.style, {
				position: "absolute",
				inset: "0",
				backgroundColor: "rgba(0, 0, 0, 0.5)",
				zIndex: "10",
			})

			readyOverlay.innerHTML = /*html*/ `
                <img src="checkmark.png" draggable="false" style="
                    pointer-events: none; 
                    width: ${Utils.px(40)}; 
                    height: ${Utils.px(40)}; 
                ">
                `

			parentElem.appendChild(readyOverlay)

			this.validate = true
			let willValidate = true
			for (const player of this.runtime.playersEnabled) {
				if (!player.shop.validate) {
					willValidate = false
				}
			}
			if (willValidate) {
				if (shopStats) {
					const menu = this.runtime.menu.nameToMenu.get("shopStatsMenu_Multi")
					const readyOverlays = menu.querySelectorAll("#readyOverlay").forEach((elem) => elem.remove())
					this.runtime.menu.Toggle_Shop()
				} else {
					const menu = this.runtime.menu.nameToMenu.get("shopMenu_Multi")
					const readyOverlays = menu.querySelectorAll("#readyOverlay").forEach((elem) => elem.remove())
					this.ExitShop()
				}
			}
		} else if (!bool) {
			this.validate = false
			const readyOverlay = parentElem.querySelector("#readyOverlay")
			if (readyOverlay) readyOverlay.remove()
		}
	}

	Reroll() {
		const price = this.rerollPrice

		if (this.player.coins < price) {
			this.runtime.audio.PlaySound("UI_ClickFailBuzzer", 0.5)
			return false
		}

		this.rerollCountThisWave++

		if (this.rerollPrice > 0) this.rerollCountThisWave_paid++

		this.player.AddCoins(-price)

		this.player.events.dispatchEventString("On_Reroll")

		this.runtime.audio.PlaySound("Reroll")

		if (this.freeReroll > 0) {
			this.freeReroll--
		}

		this.player.TriggerPlayerEvent("On_Reroll")

		this.player.stats.Stat_Add("RerollsDone", 1)
		this.player.stats.Stat_Add("RerollsDone_LastShop", 1)

		this.GetRerollPrice()
		return true
	}

	HTML_CreateShop_Single() {
		this.elemSingle = this.runtime.menu.CreateMenuScreen("shopMenu", false, false)
		this.elemSingle.classList.remove("settingsMenu")
		this.elemSingle.classList.add("shopContainer")

		//background: radial-gradient(ellipse at bottom, #310114 0%, #000114 100%);

		let htmlString = /*html*/ `
        <div id="shopBG" class="shop flex s100 justify_between" style="
      
        ">
        <div id="shop" class="shop flex s100 justify_between"
            style="
                padding: ${Utils.px(5)};
                padding-top: ${Utils.px(8)};

            ">
            <div id="shopLeftPart" class="vertical" style="
                ${Utils.propx("width", 533 * 0.8)}
            ">

                <div id="shopHeader" class="shop-header flex justify_between items_center relative" style="
                    font-size: ${Utils.px(10)};
                    padding-bottom: ${Utils.px(5)};
                ">
                    <div id="shop_Instruct_ShowSyns" class="textOutline" style="
                        font-size: ${Utils.px(5)};
                        opacity: 0.5;
                    ">
                    </div>
                    <div id="coinShop_container" class="absolute" style="
                        left: 50%;
                        transform: translateX(-50%);
                        position: absolute !important;
                    ">
                        <div id="coinShop" class="currency textOutline" style="
                            font-weight: bold;
                        ">
                        </div>
                    </div>
                    <div id="rerollContainer"
                        style="
                            border-radius:${Utils.px(2)};
                            padding:${Utils.px(2)};
                        ">
                    </div>
                </div>

                <div id="shopItems" class="flex flex_1" 
                    style="
                        flex-grow: 1;
	                    display: flex;
                        max-height:${Utils.px(190)};
                        gap:${Utils.px(2)}
                    ">
                </div>

                
                <div id="shopInvos" class="player-inventories" style=
                    "max-height:${Utils.px(70)};
                ">

                    <div id="shopInvo_items" class="items-section" style=
                        "width:${Utils.px(310)};
                    ">
                    </div>

                    <div id="shopInvo_weps" class="weapons-section" style=
                        "width:${Utils.px(120)};
                    ">
                    </div>
                </div>
            </div>
            <div id="shopRightPart"  class="vertical items_center flexGrow" style="
                
            ">
                <div id="statsContainer">
                </div>
                <div id="shopGoBtn" class="vertical items_center" style="
                    margin-top:${Utils.px(5)};
                    width:80%;
                ">
                </div>
            </div>
        </div>
        </div>
        `
		this.elemSingle.innerHTML = htmlString

		/*const overlay = Utils.Elem_AddOverlay(this.elemSingle)
		overlay.style.display = "none"*/

		//* add reroll button
		const rerollContainer = this.elemSingle.querySelector("#rerollContainer")
		const rerollSetting = this.runtime.menu.AddSettingsToElem(rerollContainer, "", "", false, [
			{
				type: "button",
				/*style: "outline",*/
				label: "",
				elemClass: "button_Reroll",
				callback: () => {
					const hasReroll = this.Reroll()
					if (hasReroll) {
						this.Shop_Fill_Items()
					}
				},
			},
		])

		rerollSetting.move_left = () => {
			return this.MoveToShopItem("left")
		}

		rerollSetting.move_down = () => {
			return this.MoveToShopItem("left")
		}

		this.rerollCostElem = this.HTML_SetRerollButton(rerollSetting)

		const coinShop_container = this.element.querySelector("#coinShop_container")
		this.runtime.style.Elem_BoxStyle(coinShop_container, "", 4, {
			frameUrl: "Frame_UI_Purple.png",
		})

		coinShop_container.style.position = "absolute"

		const exitButton = this.elemSingle.querySelector("#shopGoBtn")

		const exitButton_actual = this.runtime.menu.AddSettingsToElem(exitButton, "", "", false, [
			{
				type: "button",
				/*style: "outline",*/
				label: "Menu_Shop_Go",
				elemClass: "button_Go",
				BG_Color: "rgb(255 0 86)",
				callback: () => {
					this.ExitShop()
				},
			},
		])

		Object.assign(exitButton_actual.style, {
			fontSize: Utils.px(8),
			fontweight: "bold",
			width: "100%",
		})

		const div = document.createElement("div")
		exitButton.appendChild(div)
		div.id = "shop_NextWave"

		exitButton_actual.move_left = () => {
			return this.MoveToShopItem("left")
		}

		exitButton_actual.move_right = () => {
			return this.MoveToShopItem("right")
		}

		/*
		Utils.Elem_SetTranslateKey(div, "Menu_Shop_NextWave", () => {
			//
		})*/

		/*
		Utils.Elem_FocusableOutline(exitButton)
		Utils.Elem_FocusableBump(exitButton, 0.8, 900, this.springEase)
		exitButton.addEventListener("sn:pressed", (e) => {
			this.ExitShop()
		})*/

		//* add shop item tooltips
		const shopItems = this.elemSingle.querySelector("#shopItems")

		for (let i = 0; i < NB_SHOP_ITEMS; i++) {
			const itemShopTooltip = new Tooltip(this.runtime, false)
			shopItems.appendChild(itemShopTooltip.element)

			this.itemShopTooltips.push(itemShopTooltip)

			itemShopTooltip.shopIndex = i
		}
	}

	MoveToShopItem(side = "left") {
		if (side === "left") {
			for (let i = NB_SHOP_ITEMS - 1; i >= 0; i--) {
				const itemShop = this.itemShopTooltips[i].element
				if (itemShop.style.visibility === "visible") {
					const button_buy = itemShop.querySelector(".button_Buy")
					return button_buy
				}
			}
			return null
		}

		if (side === "right") {
			for (let i = 0; i < NB_SHOP_ITEMS; i++) {
				const itemShop = this.itemShopTooltips[i].element
				if (itemShop.style.visibility === "visible") {
					const button_buy = itemShop.querySelector(".button_Buy")
					return button_buy
				}
			}
			return null
		}
	}

	HTML_SetRerollButton(rerollSetting) {
		const rerollImg = document.createElement("img")
		rerollImg.src = "Game/Graph/Stat_Reroll.png"

		Object.assign(rerollImg.style, {
			height: "1.4em",
			width: "1.4em",
		})

		rerollSetting.appendChild(rerollImg)

		//rerollSetting.style.padding = ""
		const costElem = document.createElement("div")
		costElem.classList.add("rerollCost")

		this.player.SetCoinElem(costElem, this.rerollPrice)

		rerollSetting.appendChild(costElem)

		return costElem
	}

	HTML_CreateShop_Multiplayer() {
		let shopMenu = this.runtime.menu.nameToMenu.get("shopMenu_Multi")
		if (!shopMenu) {
			shopMenu = this.runtime.menu.CreateMenuScreen("shopMenu_Multi", false, false)
			shopMenu.classList.remove("settingsMenu")
			shopMenu.classList.add("shopContainer_Multi", "flex", "flex_nowrap", "justify_between", "overflow_hidden", "s100")

			//shopMenu.style.backgroundColor = "black"
		}

		const shopContainer = document.querySelector(".shopContainer_Multi")

		this.elemMulti = document.createElement("div")
		shopContainer.appendChild(this.elemMulti)
		this.elemMulti.classList.add("shopMulti", "flex_1", "vertical")
		this.elemMulti.style.padding = Utils.px(2)
		//!Rework UI 2
		//this.elemMulti.style.zIndex = -2

		//this.elemMulti.style.backgroundColor = this.player.colorMultiBack
		this.runtime.style.Elem_BoxColorStyle(this.elemMulti, "Player" + this.player.playerIndex)

		let htmlString = /*html*/ `

            <div id="navRow_Container" class="" style="">
            </div>
            <div id="shopMulti_default" class="vertical w100">
                <div id="shopTitle">
                </div>
                <div id="shopHeader" class="flex justify_between items_center">
                    
                    <div id="coinShop_container" class="" style="
                        margin-right:${Utils.px(2)};
                        font-size:${Utils.px(7)};
                    ">
                        <div id="coinShop" class="currency textOutline" style="
                            font-weight: bold;
                        ">
                        </div>
                    </div>
                    <div id="rerollContainer"
                        style="
                            border-radius:${Utils.px(2)};
                            padding:${Utils.px(2)};
                        ">
                    </div>
                </div>

                <div id="shopItems" class="vertical simplebar_white" style="
                    height:${Utils.px(100)};
                    width: 95%;
                    

                ">
                </div>

                <div id="shopInvo_weps" class="weapons-section" style=
                    "height:${Utils.px(37)};
                ">
                </div>

                <div id="shopInvo_items" class="items-section" style=
                    "height:${Utils.px(90)}
                ">
                </div>

                <div id="shopBtnContainer" class="vertical items_center" style="width-max:${Utils.px(90)}">
                </div>

                ${
					"" /*
                <div id="waveInfos" class="wave-infos">
                </div>
                <div id="waveInventory" class="wave-inventory">
                 </div>
                */
				}
                <!--<button id="shopGoBtn" class="shop-go-btn">GO !</button>-->
                
            </div>
            <div id="shopMulti_OverlayStats" class="vertical justify_center items_center s100" style="display: none;">
                <div id="statsContainer" >
                </div>
                
            </div>
        `

		/*padding:${Utils.px(1)};
        background-color: rgba(0, 0, 0, 0.5);*/

		this.elemMulti.innerHTML = htmlString

		/*const overlay = Utils.Elem_AddOverlay(this.elemMulti)
		overlay.style.display = "none"*/

		const elem = this.elemMulti

		this.shopMulti_default = elem.querySelector("#shopMulti_default")

		const navRow_Container = this.elemMulti.querySelector("#navRow_Container")
		this.runtime.menu.CreateNavRow(navRow_Container)
		this.navRow = navRow_Container.querySelector("#navRow")
		this.shopMulti_OverlayStats = elem.querySelector("#shopMulti_OverlayStats")

		//* add ready button (overlay)
		const readyButton_stats = this.runtime.menu.AddSettingsToElem(this.shopMulti_OverlayStats, "", "Menu_Shop", false, [
			{
				type: "button",
				label: "Ready",
				style: "outline",
				callback: () => {
					this.ValidateOverlay(!this.validate)
				},
			},
		])

		readyButton_stats.style.marginTop = Utils.px(10)
		this.readyLabel_Stats = readyButton_stats.querySelector("#buttonLabel")

		//* add ready button (shop)
		const shopBtnContainer = elem.querySelector("#shopBtnContainer")
		const readyButton = this.runtime.menu.AddSettingsToElem(shopBtnContainer, "", "Menu_Shop", false, [
			{
				type: "button",
				label: "Ready",
				elemClass: "button_Ready",
				style: "outline",
				callback: () => {
					this.ValidateOverlay(!this.validate)
				},
			},
		])
		this.readyLabel = readyButton.querySelector("#buttonLabel")

		/*readyButton.move_up = () => {
			const button_Ready = this.elemMulti.querySelector(".button_Ready")
			return button_Ready
		}*/

		//* add ready instructions (overlay)

		const readyInstruct_Stats = document.createElement("div")
		readyInstruct_Stats.id = "readyInstruct_Stats"
		this.shopMulti_OverlayStats.appendChild(readyInstruct_Stats)

		Object.assign(readyInstruct_Stats.style, {
			marginTop: Utils.px(5),
			fontSize: Utils.px(5),
			padding: Utils.px(2),
			backgroundColor: "rgba(0, 0, 0, 0.4)",
			borderRadius: Utils.px(2),
		})

		const updateInstruct = (elemInstruct) => {
			let newText = elemInstruct.innerHTML
			newText = newText.replace("{img1}", "<img src='Control_Button_Dir_Up.png' style='height: 1.5em; vertical-align: middle;'>")
			newText = newText.replace("{img2}", "<img src='Control_Key_R.png' style='height: 1.5em; vertical-align: middle;'>")
			elemInstruct.innerHTML = newText
		}

		Utils.Elem_SetTranslateKey(readyInstruct_Stats, "Control_ShopReady", () => updateInstruct(readyInstruct_Stats))

		//* add ready instructions (shop)

		const readyInstruct = document.createElement("div")
		readyInstruct.id = "readyInstruct"
		shopBtnContainer.appendChild(readyInstruct)

		Object.assign(readyInstruct.style, {
			marginTop: Utils.px(2),
			fontSize: Utils.px(5),
			padding: Utils.px(2),
			backgroundColor: "rgba(0, 0, 0, 0.4)",
			borderRadius: Utils.px(2),
		})

		Utils.Elem_SetTranslateKey(readyInstruct, "Control_ShopReady", () => updateInstruct(readyInstruct))

		//* add reroll button
		const rerollContainer = elem.querySelector("#rerollContainer")
		const rerollSetting = this.runtime.menu.AddSettingsToElem(rerollContainer, "", "", false, [
			{
				type: "button",
				label: "",
				style: "outline",
				callback: () => {
					const hasReroll = this.Reroll()
					if (hasReroll) {
						this.Shop_Fill_Items()
					}
				},
			},
		])

		rerollSetting.move_up = () => {
			const button_Ready = this.elemMulti.querySelector(".button_Ready")
			return button_Ready
		}

		rerollSetting.move_left = () => {
			const button_Ready = this.elemMulti.querySelector(".button_Ready")
			return button_Ready
		}

		rerollSetting.move_right = () => {
			const button_Ready = this.elemMulti.querySelector(".button_Ready")
			return button_Ready
		}

		this.rerollCostElem_Multi = this.HTML_SetRerollButton(rerollSetting)

		//* add shop item rows
		const shopItems = this.elemMulti.querySelector("#shopItems")

		this.runtime.style.Elem_BoxStyle(shopItems, "", 4, {
			zIndex_BG: 0,
		})

		for (let i = 0; i < NB_SHOP_ITEMS; i++) {
			let itemShopElem

			itemShopElem = window.document.createElement("div")
			shopItems.appendChild(itemShopElem)

			itemShopElem.innerHTML = /*html*/ `
                    <div id="shopItem_Row_container" class="" style="padding:${Utils.px(1)};">
                        <div id="shopItem_Row" class="horizontal justify_between items_center bg_black"
                        style="">
                            <div id="itemInfo" class="horizontal items_center">
                                <div class="tooltipImgContain flex justify_center items_center" style="
                                    position: relative;
                                    padding:${Utils.px(1)};
                                    margin-right:${Utils.px(2)};
                                    height:${Utils.px(20)}; 
                                    width:${Utils.px(20)}; 
                                    border-radius: ${Utils.px(2)};
                                    overflow: hidden;
                                    flex-shrink: 0;
                                ">
                                    <!-- Main Image -->
                                    <img id="shopItemImg" class="tooltipImg" style="
                                            max-height: 100%;
                                            max-width: 100%;
                                            object-fit: contain;
                                    "/>
                                    <div class="itemATK"></div> 
                                    <!-- Locked Icon -->
                                    <img id="lockedIcon" src="locked_icon.png" 
                                        style="
                                            position: absolute;
                                            width: ${Utils.px(10)};
                                            height: ${Utils.px(10)};
                                            bottom: 0;
                                            right: 0;
                                            display: none;
                                    "/>
                                </div>
                        

                                <div id="shopItemNameAndTags" class="vertical" style="font-size:${Utils.px(7)}">
                                    <div id="shopItemName"></div>
                                    <div id="shopItemTags" style="font-size:${Utils.px(6)}"></div>
                                </div>
                            </div>
                            <div id="shopItemPrice" class="itemCost" style="
                                margin-right:${Utils.px(2)};
                            ">
                            </div>
                        </div>
                    </div>
                    `
			const itemRow = itemShopElem.querySelector("#shopItem_Row")
			itemRow.player = this.player
			Utils.Elem_FocusableOutline(itemRow, this.player.color)
			itemRow.itemClass = this.runtime.dataManager.randomItem
			Utils.Elem_AddItemHoverTooltip(itemRow, "shopMulti", "bottom-end")
			this.itemShopRows.push(itemRow)

			itemRow.shopIndex = i

			itemRow.addEventListener("sn:pressed", (e) => {
				const hasBuy = this.player.BuyItem(itemRow.itemClass)
				if (hasBuy) {
					const lockedIcon = itemRow.querySelector("#lockedIcon")
					lockedIcon.style.display = "none"
					this.service.lockedIndex.delete(itemRow.shopIndex)
					itemRow.style.visibility = "hidden"
					this.player.tooltip.DisplayNone()
				}
			})

			itemRow.move_left = () => {
				return "noMove"
			}

			itemRow.move_right = () => {
				return "noMove"
			}
		}
	}

	ShopMenuNavigation() {
		this.player.SpatialNavigation(this.element)
	}

	HTML_SetInShop(refreshItems = true) {
		if (!this.player.enabled) {
			this.element.style.display = "none"
			return
		} else {
			this.element.style.display = "flex"
		}

		const waveCount = this.runtime.waveManager.waveCount

		this.runtime.translation.Elem_SetTranslateKey(this.readyLabel, "Menu_Shop_Ready")
		this.runtime.translation.Elem_SetTranslateKey(this.readyLabel_Stats, "Menu_Shop_Ready")

		/*this.readyLabel.innerHTML.replace("{0}", waveCount + 1)
		this.readyLabel_Stats.innerHTML.replace("{0}", waveCount + 1)*/

		const shop_Instruct_ShowSyns = this.element.querySelector("#shop_Instruct_ShowSyns")
		if (shop_Instruct_ShowSyns) {
			//this.runtime.translation.Elem_SetTranslateKey(shop_Instruct_ShowSyns, "Menu_Shop_Title")

			const updateText = (elem) => {
				let newText = elem.innerHTML
				newText = newText.replace("{img1}", "<img src='Control_Button_Tab.png' style='height: 2em; vertical-align: middle;'>")
				newText = newText.replace("{img2}", "<img src='Control_Key_Tab.png' style='height: 2.4em; vertical-align: middle;'>")
				elem.innerHTML = newText
			}

			Utils.Elem_SetTranslateKey(shop_Instruct_ShowSyns, "Control_DisplaySyns", updateText)
		}

		const shop_NextWave = this.element.querySelector("#shop_NextWave")
		if (shop_NextWave) {
			Utils.Elem_SetTranslateKey(shop_NextWave, "Menu_Shop_NextWave")
			shop_NextWave.innerHTML = shop_NextWave.innerHTML.replace("{0}", waveCount + 1)
		}

		this.HTML_SetElementsInShop()

		if (refreshItems) {
			this.Shop_Fill_Items()
		}

		this.player.Tab_Update_InMulti(0)

		this.ShopMenuNavigation()

		this.runtime.layout.getLayer("NoobsBG").isVisible = true
		this.runtime.layout.getLayer("FG_Above_BG0").isVisible = false

		if (this.runtime.singlePlayer) this.runtime.layout.getLayer("FireShop_BG0").isVisible = true

		if (!this.runtime.singlePlayer) {
			//focus first shopRow
			this.player.SN.focus(this.itemShopRows[0])
		} else {
			if (!this.player.shop.cheatShop) {
				const buyBtnTooltip0 = this.itemShopTooltips[0].element.querySelector("#btnContainer").children[0]

				this.player.SN.focus(buyBtnTooltip0)
			}
		}
	}

	HTML_SetElementsInShop() {
		const player = this.player

		const itemSection = this.element.querySelector("#shopInvo_items")
		itemSection.appendChild(this.player.inventory.element)

		const weaponSection = this.element.querySelector("#shopInvo_weps")
		weaponSection.appendChild(this.player.inventoryWeps.element)

		const statsContainer = this.element.querySelector("#statsContainer")
		const statsElement = this.player.stats.element
		statsElement.style.display = "block"
		statsContainer.appendChild(statsElement)
	}

	//for item rows //"#shopItem_Row"
	SetShopItemRow(elemRow, item) {
		const img = elemRow.querySelector("#shopItemImg")
		img.src = item.img
		img.onerror = () => {
			img.src = "random_icon.png"
			item.img = item.src
		}

		const tooltipImgContain = elemRow.querySelector(".tooltipImgContain")

		const itemATK = elemRow.querySelector(".itemATK")

		if (itemATK) {
			itemATK.style.display = "none"
			/*
			if (item.itemType === "Weapon") {
				itemATK.style.display = "flex"
				itemATK.textContent = "ATK"
			} else itemATK.style.display = "none"*/
		}

		//this.runtime.style.Elem_ItemStyle(tooltipImgContain, "TIER_" + item.evolution)
		this.runtime.style.Elem_ItemStyleFrame(tooltipImgContain, item.evolution)

		const title = elemRow.querySelector("#shopItemName")
		title.textContent = item.GetItemDisplayName()
		title.style.color = this.runtime.tierColors["TIER_" + item.evolution]
		//this.runtime.translation.Elem_SetTranslateKey(title, itemName)

		const tags = elemRow.querySelector("#shopItemTags")
		tags.innerHTML = item.GetTypeLoc()

		const costElem = elemRow.querySelector(".itemCost")

		const price = this.GetIndexPrice(elemRow.shopIndex)
		this.player.SetCoinElem(costElem, price)

		costElem.shopIndex = elemRow.shopIndex

		//! important for tooltips
		elemRow.itemClass = item
	}

	Show_ATK_Syns(bool) {
		//console.error("Show_ATK_Syns", bool)
		if (this.runtime.menu.CurMenuName() === "shopMenu") {
			//for all item tooltips
			for (const itemShopTooltip of this.itemShopTooltips) {
				const tooltipElem = itemShopTooltip.element

				const tooltipExtra = itemShopTooltip.tooltipExtra

				//console.error("Show_ATK_Syns", tooltipExtra)

				if (bool) {
					tooltipExtra.style.display = "flex"
				} else {
					tooltipExtra.style.display = "none"
				}
			}
		}
	}

	SetItemPrices() {
		const stat_Price_Items = this.player.stats.GetStatValue("Price_Items")
		const stat_Price_Attacks = this.player.stats.GetStatValue("Price_Attacks")

		const waveManager = this.runtime.waveManager

		for (let i = 0; i < NB_SHOP_ITEMS; i++) {
			const shopItem = this.shopItems[i]

			/*
			if (typeof shopItem?.itemClass?.price !== "number") {
				console.error("❌ No price for shop item number: ", i, shopItem, shopItem.itemClass)
				continue
			}*/
			const item = shopItem.itemClass

			const itemType = item?.itemType
			if (!itemType) {
				console.error("❌ No itemType for shop item number: ", i, shopItem, item)
				continue
			}

			//* Weps
			if (item.itemType === "Weapon") {
				const wepCount = this.player.inventoryWeps.items.length
				//console.error("Wep Price", wepCount, item.evolution)
				if (wepCount >= 3 && item.defaultPrice) {
					if (item.evolution === 0) item.price = 25
					else if (item.evolution === 1) item.price = 40
					//console.error("Wep Price bc > 3")
				}
			}

			let price = item.price

			let wave = waveManager.waveCount
			if (waveManager.difficulty === 1) wave -= 15
			if (waveManager.difficulty === 2) wave -= 13
			if (waveManager.difficulty === 3) wave -= 12
			if (waveManager.difficulty === 4) wave -= 10
			if (waveManager.difficulty === 5) wave -= 9

			//!todo: change wave value based on difficulty (example: diff 1 is only starting at wave 10 ?)
			wave = Math.max(0, wave)

			price += price * wave * 0.07

			price = price * waveManager.endless_Price_Inflation

			//! priceModifier is subtle
			price += item.price * (1 - shopItem.priceModifier)
			//price = price * shopItem.priceModifier //alternative: it apply on the whole

			//* Weps
			if (item.itemType === "Weapon") {
				price = price * stat_Price_Attacks
			}
			//* Items
			else {
				price = price * stat_Price_Items
			}

			price = Math.round(price)

			shopItem.priceCurrent = price
		}
		this.player.UpdateCoins()
	}

	GetIndexPrice(i) {
		return this.shopItems[i].priceCurrent
	}

	GetItemPrice(itemClass) {
		if (this.cheatShop) return 0

		for (let i = 0; i < NB_SHOP_ITEMS; i++) {
			const shopItem = this.shopItems[i]
			if (shopItem.itemClass === itemClass) {
				return shopItem.priceCurrent
			}
		}

		return null
	}

	RemoveShopItem(itemClass) {
		for (let i = 0; i < NB_SHOP_ITEMS; i++) {
			const shopItem = this.shopItems[i]
			if (shopItem.itemClass === itemClass) {
				shopItem.itemClass = null
				shopItem.priceCurrent = null

				//if all items are bought, set reroll Price to 0
				this.GetRerollPrice()
			}
		}
	}

	RefreshShopDescriptions() {
		if (this.runtime.singlePlayer && this.player.isPlayer0) {
			for (const itemShopTooltip of this.itemShopTooltips) {
				const item = itemShopTooltip.element.item
				if (!item) continue

				//console.error("RefreshShopDescriptions", item.name)
				itemShopTooltip.SetTooltipFromItem(itemShopTooltip.element.item, this.player, "shop")
			}

			this.player.UpdateCoins()
		}
	}

	Refresh_Instruct_ShowSyns() {
		if (this.runtime.singlePlayer && this.player.isPlayer0) {
			const visibleShopTooltips = this.itemShopTooltips.filter(
				(itemShop) => itemShop.element.style.visibility === "visible" && itemShop.element.item.itemType === "Weapon"
			)
			const instructElem = this.element.querySelector("#shop_Instruct_ShowSyns")
			if (visibleShopTooltips.length > 0) instructElem.style.visibility = "visible"
			else instructElem.style.visibility = "hidden"
		}
	}

	Shop_Fill_Items() {
		if (this.cheatShop) {
			this.runtime.globalVars["IsInCheatShop"] = true

			const shopItems = this.element.querySelector("#shopItems")
			const invCheats = this.player.inventoryCheats.element
			invCheats.style.display = "flex"

			shopItems.appendChild(invCheats)

			for (const itemShopTooltip of this.itemShopTooltips) {
				itemShopTooltip.DisplayNone()
			}
			for (const itemShopRow of this.itemShopRows) {
				itemShopRow.style.display = "none"
			}
		} else {
			this.player.inventoryCheats.element.style.display = "none"

			const randItems = this.service.GetItems(this.runtime.waveManager.waveCount)

			//const randItems = this.service.FillShopItems(this.runtime.waveManager.waveCount)

			const number = NB_SHOP_ITEMS - this.service.lockedIndex.size

			let index = 0

			for (let i = 0; i < number; i++) {
				const randItem = randItems[i]

				while (this.service.lockedIndex.has(index)) {
					index++
				}

				let y = index

				const shopItem = this.shopItems[y]

				shopItem.itemClass = randItem
				shopItem.priceModifier = Utils.random(0.9, 1.1)

				//* regular shop
				if (this.itemShopTooltips.length > 0) {
					const itemShopTooltip = this.itemShopTooltips[y]
					//console.warn("🛒 Shop_Fill_Items", itemShopTooltip, this.itemShopTooltips)
					itemShopTooltip.SetTooltipFromItem(randItem, this.player, "shop")

					itemShopTooltip.DisplayFlex()
					itemShopTooltip.element.style.visibility = "visible"
				}

				//* column shop (multi)

				if (this.itemShopRows.length > 0) {
					const itemShopRow = this.itemShopRows[y]
					this.SetShopItemRow(itemShopRow, randItem)

					const prevShopIndex = itemShopRow.shopIndex

					itemShopRow.style.display = "flex"
					itemShopRow.style.visibility = "visible"
				}

				index++
			}

			this.SetItemPrices()

			this.GetRerollPrice()
		}

		this.Refresh_Instruct_ShowSyns()
	}

	Reset() {
		this.runtime.menu.shopPhase = false
		this.service.Reset()
		for (const itemRow of this.itemShopRows) {
			const lockedIcon = itemRow.querySelector("#lockedIcon")
			lockedIcon.style.display = "none"
		}

		this.validate = false

		if (this.player.isPlayer0) {
			const overlays = document.querySelectorAll("#readyOverlay")
			overlays.forEach((overlay) => {
				overlay.remove()
			})
		}
	}

	Set_AddArray(set, array) {
		for (const item of array) {
			set.add(item)
		}
	}

	Weps_Get_OnlysAndNones() {
		const stack = this.player.effects.GetStack("Equip_Limit")

		let onlys = new Set()
		let nones = new Set()

		for (const effect of stack) {
			if (effect.Tags) {
				const tags = Utils.TagsParamToArray(effect.Tags)
				if (effect.ActualFX === "Only") {
					this.Set_AddArray(onlys, tags)
				} else if (effect.ActualFX === "No") {
					this.Set_AddArray(nones, tags)
				}
			}
		}

		if (onlys.size === 0) onlys = null
		if (nones.size === 0) nones = null

		//console.error("onlys", onlys, "nones", nones)

		return {
			onlys: onlys,
			nones: nones,
		}
	}

	Item_CanEquip(item, inventory, checkSpawnOnly = false) {
		if (this.player.effects.GetBool("CantEquip_ATK_Twice")) {
			const sameATK = inventory.items.find((i) => i.name === item.name)
			if (sameATK) return [false, null]
		}

		const gets = this.Weps_Get_OnlysAndNones()
		const onlys = gets.onlys
		const nones = gets.nones

		const stack = this.player.effects.GetStack("Equip_Limit")

		//those are the only condition that actually limit spawns

		if (onlys) {
			if (!item.HasTags_Any(onlys)) return [false, null]
		}
		if (nones) {
			if (item.HasTags_Any(nones)) return [false, null]
		}

		if (!checkSpawnOnly) {
			for (const effect of stack) {
				const ActualFX = effect.ActualFX
				const Tags = effect.Tags
				const LimitCount = effect.Count

				if (ActualFX === "Only" || ActualFX === "No") continue
				if (Tags && !item.HasTags_Any(Tags)) continue

				//max is > 0
				if (ActualFX === "Max" && Tags) {
					const currentTagCount = inventory.GetTagCount(Tags)
					if (LimitCount > currentTagCount) return [false, null]
				}

				if (ActualFX === "TierMax") {
					if (LimitCount > item.evolution) return [false, null]
				}
				if (ActualFX === "TierMin") {
					if (LimitCount < item.evolution) return [false, null]
				}
			}
		}

		return [true, null]
	}
}

const NB_SHOP_ITEMS = 4

const CHANCE_WEAPON = 0.35
const CHANCE_SameWep = 0.15
const CHANCE_SameSyn = 0.35
const WAVE_MAX_2_WEPS = 3
const WAVE_MAX_1_WEP = 6
const BONUS_CHANCE_SamSyn = 0.15
const CHANCE_WANTED_ITEM_TAG = 0.05

const TYPE_ATK = "Weapon"
const TYPE_ITEM = "Upgrade"

export class ShopService {
	constructor(shop) {
		this.shop = shop
		this.player = shop.player
		this.runtime = shop.runtime

		this.basePool = []
		this.initBasePools = false

		this.shop_items = []
		this.prev_shop_items = []
		this.locked_items = []

		this.lockedIndex = new Set()

		this.tiersData = {
			0: {
				waveMin: 0,
				chanceBase: 1,
				chanceBonusPerWave: 0,
				chanceMax: 1,
			},
			1: {
				waveMin: 0,
				chanceBase: 0,
				chanceBonusPerWave: 0.06,
				chanceMax: 0.6,
			},
			2: {
				waveMin: 2,
				chanceBase: 0,
				chanceBonusPerWave: 0.06,
				chanceMax: 0.25,
			},
			3: {
				waveMin: 6,
				chanceBase: 0,
				chanceBonusPerWave: 0.023,
				chanceMax: 0.08,
			},
		}
	}

	Reset() {
		this.initBasePools = false
		this.basePool = []

		this.lockedIndex.clear()
		this.shop_items = []
		this.prev_shop_items = []
		this.locked_items = []
		this.isWepItemContextMenu = null
	}

	GetPlayerStack(effect) {
		return this.player.effects.GetStack(effect)
	}

	GetPlayerBool(effect) {
		return this.player.effects.GetBool(effect)
	}

	GetPlayerStat(stat) {
		return this.player.stats.GetStatValue(stat)
	}

	LockItemMulti() {
		if (this.runtime.menu.CurMenuName() === "shopMenu_Multi") {
			const elem = this.player.SN.getCurrentFocusedElement()
			if (elem.id === "shopItem_Row") {
				const lockedIcon = elem.querySelector("#lockedIcon")

				this.LockItemToggle(elem.itemClass, elem.shopIndex)

				if (lockedIcon) {
					lockedIcon.style.display = this.lockedIndex.has(elem.shopIndex) ? "block" : "none"
				}
			}
		}
	}

	LockItemToggle(item, shopIndex) {
		//returns the new lock state
		if (this.lockedIndex.has(shopIndex)) {
			this.lockedIndex.delete(shopIndex)
			this.locked_items = this.locked_items.filter((a) => a != item)
			return false
		} else {
			this.lockedIndex.add(shopIndex)
			this.locked_items.push(item)
			return true
		}
	}

	/*
	FillShopItems(justEnteredShop = false) {
		let prevItems = justEnteredShop ? [...this.locked_items] : [this.shop_items]
		this.shop_items = [...this.locked_items]

		let newItemCount = NB_SHOP_ITEMS - this.locked_items.length

		if (newItemCount > 0) {
			
			if (!justEnteredShop) {
                
				let increaseTierEffects = RunData.getPlayerEffect("increase_tier_on_reroll", playerIndex)
				for (let increaseTierEffect of increaseTierEffects) {
				

					RunData.removeItem(sourceItem, playerIndex)
					getGearContainer(playerIndex).setItemsData(RunData.getPlayerItems(playerIndex))
					break
				}
			}

			let itemsToAdd = this.GetItems(RunData.currentWave, playerIndex, args)
			this.shop_items = this.shop_items.concat(itemsToAdd)
		}
	}*/

	GetItems(wave, number = NB_SHOP_ITEMS) {
		this.Init_BasePools()

		let new_items = []
		this.shop_items = []
		let nb_weapons_guaranteed = 0
		let nb_weapons_added = 0
		let guaranteed_items = [...this.GetPlayerStack("Shop_AlwaysItem")]

		//! for testing (for now it fails)
		/*const wantedItem = this.basePool.filter((a) => a.name.includes("Wraith"))
		guaranteed_items.push(wantedItem)
		console.error("guaranteed_items", guaranteed_items)*/

		number = number - this.lockedIndex.size

		let nb_locked_weapons = 0
		let _nb_locked_items = 0

		for (const item of this.locked_items) {
			if (item.HasTag(TYPE_ITEM)) {
				_nb_locked_items += 1
			}
			if (item.HasTag(TYPE_ATK)) {
				nb_locked_weapons += 1
			}
		}

		if (wave < WAVE_MAX_2_WEPS) {
			nb_weapons_guaranteed = 2
		} else if (wave < WAVE_MAX_1_WEP) {
			nb_weapons_guaranteed = 1
		}

		//TODO
		const effectMinWeaponsInShop = this.player.effects.GetStackValue("Shop_AlwaysWepMin", "max", 0)
		nb_weapons_guaranteed = Math.max(nb_weapons_guaranteed, effectMinWeaponsInShop)

		//for X number of items to get
		for (let i = 0; i < number; i++) {
			//check if locked

			let type
			if (wave <= WAVE_MAX_2_WEPS) {
				type = nb_weapons_added + nb_locked_weapons < nb_weapons_guaranteed ? TYPE_ATK : TYPE_ITEM
			} else if (guaranteed_items.length > 0) {
				type = TYPE_ITEM
			} else {
				type = Math.random() < CHANCE_WEAPON || nb_weapons_added + nb_locked_weapons < nb_weapons_guaranteed ? TYPE_ATK : TYPE_ITEM
			}

			if (this.player.effects.GetBool("Shop_NoATK")) {
				type = TYPE_ITEM
			}

			if (type == TYPE_ATK) {
				nb_weapons_added += 1
			}
			//if (invData.types_excluded?.[TYPE_ATK]) type = TYPE_ITEM

			////Todo
			/*
			if (this.GetPlayerStat("ATK_Slot") <= 0) {
				type = TYPE_ITEM
			}*/

			//guaranteed items

			if (type == TYPE_ITEM && guaranteed_items.length > 0) {
				let item = guaranteed_items[0]
				guaranteed_items.splice(0, 1)
				new_items.push([item, wave])
				this.shop_items.push(item)
				continue
			}
			//else
			{
				const item = this.GetRandomItemFromWave(wave, type, -1, i)
				new_items.push([item, wave])
				this.shop_items.push(item)
			}
		}

		//shuffle new Items
		new_items = Utils.Array_Shuffle(new_items)

		this.prev_shop_items = [...this.shop_items, ...this.locked_items]

		return new_items.map((a) => a[0])
	}

	GetTierFromWave(wave, increaseTier = 0) {
		let rand = Math.random()
		let luckStat = this.GetPlayerStat("Luck")

		//console.warn("🛒 Get Tier From Wave ============", wave)

		let tier = 0
		for (let i = 3; i >= 0; i--) {
			let tierData = this.tiersData[i]

			// Calculate the base chance increase based on the wave number
			let waveBaseChance = Math.max(0, (wave - 1 - tierData.waveMin) * tierData.chanceBonusPerWave)

			//console.warn("🛒", wave, "waveBaseChance for Tier", i, waveBaseChance)

			// Adjust the chance based on player's luck
			let waveChance = waveBaseChance * (1 + luckStat)
			if (luckStat < 0) waveChance = waveBaseChance / (1 + Math.abs(luckStat))

			let chance = tierData.chanceBase + waveChance
			let maxChance = tierData.chanceMax

			if (rand <= Math.min(chance, maxChance)) {
				tier = i
				break
			}
		}

		// Adjust tier by increaseTier, ensuring it stays within valid bounds
		tier = Math.max(0, Math.min(tier + increaseTier, 3))

		return tier
	}

	//specific items

	Get_WantedTags() {
		const wantedTags = ["+HP_Max"]
		const wantedTagsFxAll = this.GetPlayerStack("Tags_Wanted")
		for (const wantedTagsFX of wantedTagsFxAll) {
			for (const tag of wantedTagsFX.tags) {
				if (this.runtime.dataManager.statsData[tag]) {
					wantedTags.push("+" + tag)
				} else {
					wantedTags.push(tag)
				}
			}
		}
		return wantedTags
	}

	Get_NoTags() {
		const noTags = []
		const noTagsFxAll = this.GetPlayerStack("Tags_Excluded")
		for (const noTagsFX of noTagsFxAll) {
			for (const tag of noTagsFX.tags) {
				if (this.runtime.dataManager.statsData[tag]) {
					noTags.push("+" + tag)
				} else {
					noTags.push(tag)
				}
			}
		}
		return noTags
	}

	Get_WantedTags_ATK() {
		const wantedTags = []
		const wantedTagsFxAll = this.GetPlayerStack("Tags_Wanted_ATK")
		for (const wantedTagsFX of wantedTagsFxAll) {
			for (const tag of wantedTagsFX.tags) {
				if (tag.startsWith("!")) {
					//
				} else {
					wantedTags.push(tag)
				}
			}
		}
		return wantedTags
	}

	Init_BasePools() {
		if (this.initBasePools) return
		this.initBasePools = true
		this.basePool = Array.from(this.runtime.dataInstances["Items"]).map((a) => a[1])
		this.basePool = this.basePool.filter((a) => a.HasTag(TYPE_ITEM) || a.HasTag(TYPE_ATK))
		//removed locked

		const charaBest = this.runtime.progress.GetChara_GetBest(this.player.startRun_chara)
		if (charaBest) {
			if (charaBest < 5) {
				this.basePool = this.basePool.filter((item) => item.evolution !== 5)
				console.error("❌ No Diff 5 beaten for this chara", charaBest)
			} else {
				console.error("✅ Diff 5 beaten for this chara")
			}
		}

		if (this.runtime.main.IsUnlockAll()) {
			//here only removed lockedBy (Demo/Commu)
			this.basePool = this.basePool.filter((a) => !a.lockedBy)
		} else {
			this.basePool = this.basePool.filter((a) => !a.locked)
		}
		//removed noPools
		this.basePool = this.basePool.filter((a) => !a.noPool)

		//remove items without effects but keep weapons
		this.basePool = this.basePool.filter((a) => a.HasTag(TYPE_ATK) || a.effects.length > 0)
	}

	GetRandomItemFromWave(wave, type, fixedTier = -1, itemIndex = -1) {
		let luckStat = this.GetPlayerStat("Luck")

		const player = this.player

		//exclude items already in the shop and from the previous shop
		let excluded_items = []

		//locked
		//currently generated
		excluded_items.push(...this.prev_shop_items)
		excluded_items.push(...this.locked_items)
		excluded_items.push(...this.shop_items)

		let retShop = {}

		retShop.excluded_items = excluded_items

		//args.increaseTier //Todo
		let item_tier = this.GetTierFromWave(wave)

		if (fixedTier != -1) {
			item_tier = fixedTier
		}

		const equipLimits = this.GetPlayerStack("Equip_Limit")

		for (let limit of equipLimits) {
			//
		}

		const noDuplicateWeapons = this.GetPlayerBool("CantEquip_ATK_Twice")

		this.Init_BasePools()
		let pool = [...this.basePool]
		pool = pool.filter((item) => item.HasTag(type))

		if (item_tier === 3) {
			pool = pool.filter((item) => item.evolution >= item_tier)
		} else {
			pool = pool.filter((item) => item.evolution === item_tier)
		}

		pool = pool.filter((item) => item.itemDrop >= Math.random())

		retShop.item_tier = item_tier
		retShop.type = type

		/*if (type == TYPE_ATK) {
			const excludedItems = pool.filter((a) => excluded_items.some((item) => item.nameEvo === a.nameEvo))
			console.error("filtered excluded", excluded_items, excludedItems)
		}*/

		pool = pool.filter((a) => !excluded_items.includes(a))

		//* Weps: Onlys and Nones
		if (type == TYPE_ATK) {
			const gets = this.shop.Weps_Get_OnlysAndNones()
			const onlys = gets.onlys
			const nones = gets.nones

			if (onlys) pool = pool.filter((a) => a.HasTags_Any(onlys))
			if (nones) pool = pool.filter((a) => !a.HasTags_Any(nones))
		}

		// START IGNORING BACKUP POOL
		let items_removeFromMainPool = [] //can still be in backup pool
		let items_removeFromPools = [] //completely impossible to pick

		const wantedTags = this.Get_WantedTags()
		const noTags = this.Get_NoTags()
		const wantedTagsATK = this.Get_WantedTags_ATK()

		retShop.tags_wanted = wantedTags
		retShop.tags_no = noTags
		retShop.tags_wantedATK = wantedTagsATK

		let whatHappens = ""

		//* ======== ATK =========== HANDLE UPGRADABLE
		if (type == TYPE_ATK) {
			const playerWepItems = player.inventoryWeps.items

			const playerWepUpgradables = playerWepItems.filter((a) => a.upgradable)
			for (const wep of playerWepUpgradables) {
				const wepInPool = pool.find((a) => a.name === wep.name)

				if (!wepInPool) continue
				const wepUpgrade = this.basePool.find((a) => a.name === wep.name && a.evolution === wep.evolution + 1)
				if (!wepUpgrade) {
					//wep is at max upgrade
					//!remove from pool if not evo + 1
					//!also remove from the pool for the "Same Wep" scenario early return
					items_removeFromPools.push(wepInPool)
					pool = pool.filter((a) => a.name !== wepInPool.name)
					continue
				}

				//! RAGEON BUG REROLL

				console.error("⛔🛒 wepInPool", wepInPool.nameEvo, wepInPool)
				console.error("⛔🛒 wepUpgrade", wepUpgrade.nameEvo, wepUpgrade)

				if (wepInPool === wepUpgrade) continue

				//!remove from pool if not evo + 1
				//!also remove from the pool for the "Same Wep" scenario early return
				items_removeFromPools.push(wepInPool)
				pool = pool.filter((a) => a.name !== wepInPool.name)

				if (fixedTier >= 0) {
					continue
				}

				//! todo, maybe make sure the tier is pretty close to the current one
				if (item_tier <= wepUpgrade.evolution - 2 || item_tier >= wepUpgrade.evolution + 1) {
					continue
				}

				if (!excluded_items.includes(wepUpgrade)) {
					pool.push(wepUpgrade)
				}
			}
		}

		//* ======== ATK =========== SAME ATK // SAME SYN

		if (type == TYPE_ATK) {
			whatHappens = "wep"

			let bonus_chance_SameSyn = Math.max(0, (WAVE_MAX_1_WEP + 1 - wave) * (BONUS_CHANCE_SamSyn / WAVE_MAX_1_WEP))
			let chance_SameSyn = CHANCE_SameSyn + bonus_chance_SameSyn

			const playerWepItems = player.inventoryWeps.items

			//regular

			let rand_wanted = Math.random()

			if (playerWepItems.length > 0) {
				if (this.player.effects.GetBool("Shop_OnlySameATK")) {
					whatHappens = "sameWep_ForceOnly"
					pool = pool.filter((a) => playerWepItems.some((b) => a.name === b.name))
				} else if (rand_wanted < CHANCE_SameWep) {
					whatHappens = "sameWep"
				} else if (rand_wanted < chance_SameSyn) {
					whatHappens = "sameSyn"
				}
			}

			if (whatHappens === "sameWep") {
				//!method to get unique weps instead as it could be used for other things
				const randItem = Utils.Array_Random(playerWepItems)
				//find items with the same name in pool
				const sameItems = pool.filter((a) => a.name === randItem.name && !a.upgradable) //! no upgradable to avoid to often

				//window.alert("Chance Same Wep " + sameItems[0].name)
				if (sameItems.length > 0) {
					const randSameItem = Utils.Array_Random(sameItems)
					if (randSameItem.RareATK) {
						//window.alert("RareATK")
						whatHappens = "sameSyn"
					} else {
						return randSameItem
					}
				} else {
					whatHappens = "sameSyn"
				}
			}

			if (whatHappens === "sameSyn") {
				const supportedTypes = ["_Strength", "_Dex", "_Elem", "_Arcane", "_Minions"]

				let damageTypes_Map = new Map()
				let playerSyns = new Set()

				for (const weapon of playerWepItems) {
					for (const syn of weapon.Synergies) {
						playerSyns.add(syn)
					}

					for (const dmgType of weapon.GetWep_DmgScale_Weights()) {
						const dmgType_Name = dmgType.stat
						const dmgType_Weight = dmgType.weight

						if (supportedTypes.some((type) => dmgType_Name.includes(type))) {
							Utils.Map_Increment(damageTypes_Map, dmgType_Name, dmgType_Weight)
						}
					}
				}

				retShop.types_weights = [...damageTypes_Map]

				const type = Utils.Map_RandomWeight(damageTypes_Map)

				//70% chance to only get the same type
				if (Math.random() > 0.3 && type) {
					console.error("🛒 SameType | Weights", retShop.types_weights)

					const weps_NotSameType = pool.filter((wep) => !wep.HasTag(type))
					for (let wep of weps_NotSameType) items_removeFromPools.push(wep)
				}

				for (let tag of wantedTagsATK) playerSyns.add(tag)

				const synsExcluded = ["Upgradable"]
				for (let excluded of synsExcluded) playerSyns.delete(excluded)

				const synsPair = [["Water", "Plant"]]
				// if player has one of the pair, add the other one to the included
				for (let pair of synsPair) {
					if (playerSyns.has(pair[0])) playerSyns.add(pair[1])
					if (playerSyns.has(pair[1])) playerSyns.add(pair[0])
				}

				const playerSyns_Arr = [...playerSyns]
				const weps_NotSameSyn = pool.filter((wep) => !playerSyns_Arr.some((tag) => wep.HasTag(tag)))
				for (let wep of weps_NotSameSyn) items_removeFromMainPool.push(wep)
			}

			if (whatHappens === "sameSyn_OLD") {
				let playerSyns = new Set()
				let playerSyns_Count = new Map()

				const supportedScales = ["_Strength", "_Dex", "_Elem", "_Arcane", "_Minions"]

				for (let weapon of playerWepItems) {
					for (let syn of weapon.Synergies) {
						playerSyns.add(syn)
						Utils.Map_Increment(playerSyns_Count, syn, 1)
					}

					/*
					for (let syn of weapon.GetWep_DmgScale_Tags()) {
						if (supportedScales.some((scale) => syn.includes(scale))) {
							playerSyns.add(syn)
                            Utils.Map_Increment(playerSyns_Count, syn, 1)
						}
					}*/
				}

				for (let tag of wantedTagsATK) playerSyns.add(tag)

				const synsExcluded = ["Upgradable"]
				//const synsExcluded = ["Upgradable", "Melee", "Ranged"]
				for (let excluded of synsExcluded) playerSyns.delete(excluded)

				const synsPair = [["Water", "Plant"]]
				// if player has one of the pair, add the other one to the included
				for (let pair of synsPair) {
					if (playerSyns.has(pair[0])) playerSyns.add(pair[1])
					if (playerSyns.has(pair[1])) playerSyns.add(pair[0])
				}

				const synsSpecialChance = {
					Melee: 0.4,
					Ranged: 0.4,
				}

				for (let tag of playerSyns) {
					if (tag in synsSpecialChance) {
						const rand = Math.random()
						if (rand < synsSpecialChance[tag]) {
							playerSyns.delete(tag)
							//console.error("🛒 SameSyn | Remove special chance", tag)
						}
					}
				}

				retShop.SameSyn_All = [...playerSyns]
				console.warn("🛒🛒 SameSyn | All", retShop.SameSyn_All)

				const playerSyns_Arr = [...playerSyns]
				const weps_NotSameSyn = pool.filter((wep) => !playerSyns_Arr.some((tag) => wep.HasTag(tag)))
				for (let wep of weps_NotSameSyn) {
					items_removeFromMainPool.push(wep)
				}
			}

			retShop.chance_SameWep = CHANCE_SameWep
			retShop.chance_SameSyn = chance_SameSyn
		}

		if (type === TYPE_ITEM) {
			whatHappens = "item"

			for (const item of pool) {
				for (const tag of noTags) {
					if (item.HasTag(tag)) {
						items_removeFromPools.push(item)
						//console.error("🛒 noTag", tag, "item", item.nameEvo)
						break
					}
				}
			}

			if (Math.random() < CHANCE_WANTED_ITEM_TAG && wantedTags.length > 0) {
				const itemsToRemove = pool.filter((item) => !wantedTags.some((tag) => item.HasTag(tag)))

				for (const item of itemsToRemove) {
					items_removeFromMainPool.push(item)
				}
				whatHappens = "items_wantedTags"
			}
			//! higher HP Chance
			/*
			else if (!noTags.includes("+HP_Max") && Math.random() < 0.04) {
				const itemsToRemove = pool.filter((item) => !item.HasTag("+HP_Max"))

				for (const item of itemsToRemove) {
					items_removeFromMainPool.push(item)
				}
				whatHappens = "items_hp"
			}*/
		}

		retShop.whatHappens = whatHappens

		//* STOP IGNORING BACKUP POOL

		//! ignore weapon (limitCount doesn't correspond to Uniqueness)

		//const invsToCheck = [player.inventory, player.inventoryWeps]
		const invsToCheck = [player.inventory]

		const limitedStacks = new Map()

		for (const inv of invsToCheck) {
			for (const item of inv.items) {
				if (item.limitCount === Infinity) {
					if (item.quantity >= 8) {
						items_removeFromPools.push(item)
					}
				} else if (item.limitCount === 1) {
					Utils.Map_Increment(limitedStacks, item.nameEvo, 1)
				} else if (item.limitCount > 1) {
					Utils.Map_Increment(limitedStacks, item.nameEvo, item.quantity / item.limitCount)
				}
			}
		}

		for (const [key, value] of limitedStacks.entries()) {
			if (value < 1) {
				limitedStacks.delete(key)
			}
		}

		if (this.player.effects.GetBool("Cheat_Unique")) {
			//remove item named Cheater from the pool
			pool = pool.filter((a) => !a.name.includes("Cheater"))

			const rand = Math.random() * 100
			const removeUniqueUnder = 4
			//const removeUniqueUnder = 4 * (1 + luckStat)
			//console.error("Bool Cheat Unique rand", rand, "compare to", removeUniqueUnder)

			if (rand < removeUniqueUnder) {
				for (const [key, value] of limitedStacks.entries()) {
					if (value < 2) {
						limitedStacks.delete(key)
					}
				}
			}
		}

		//push all items that are still in limitedStacks to the removeFromMainPool
		pool = pool.filter((a) => !limitedStacks.has(a.nameEvo))

		pool = pool.filter((a) => !items_removeFromPools.some((item) => item.nameEvo === a.nameEvo))

		const backup_pool = [...pool]

		pool = pool.filter((a) => !items_removeFromMainPool.some((item) => item.nameEvo === a.nameEvo))

		retShop.items_removeFromPools = items_removeFromPools
		retShop.items_removeFromMainPool = items_removeFromMainPool
		retShop.pool_actual = pool
		retShop.pool_backup = backup_pool

		let returned_item = null
		if (pool.length > 0) {
			returned_item = Utils.Array_Random(pool)
		} else if (backup_pool.length > 0) {
			returned_item = Utils.Array_Random(backup_pool)
		} else if (type === TYPE_ATK) {
			returned_item = this.GetRandomItemFromWave(wave, TYPE_ITEM, fixedTier, itemIndex)
		} else if (type === TYPE_ITEM) {
			//! should never happen
			returned_item = this.GetRandomItemFromWave(wave, TYPE_ITEM, Utils.randomInt(0, 3), itemIndex)
		}

		retShop._itemName = returned_item.nameEvo

		console.warn("🛒 SHOP GET player", player.playerIndex, "itemIndex", itemIndex, returned_item.nameEvo, `| (${retShop.whatHappens})`, retShop)

		return returned_item
	}
}
