import { Tooltip } from "./Tooltip.js"

const statUpgradePools = []
let initPool = false

const infoWidth = 90
const infoWidth_Tooltip = 100

export class ShopStats {
	constructor(runtime, player) {
		this.runtime = runtime
		this.player = player
		this.shop = player.shop
		this.service = player.shop.service

		this.upgradeTooltips = []

		this.multi_ShowingStats = false

		this.overboyChoice = []
		this.itemFounds = 0
		this.itemFounds_Legendary = 0
		this.levelUps = []

		this.HTML_CreateMainColumn()

		this.runtime.addEventListener("beforeanylayoutstart", () => this.OnBeforeFirstLayoutStart())
	}

	OnBeforeFirstLayoutStart() {
		if (this.firstLayoutInit) return
		this.firstLayoutInit = true
		if (this.player.isPlayer0) {
			this.HTML_CreateShopStats_Single()
			this.HTML_CreateShopStats_Multi()
		}
	}

	Reset() {
		console.error("💥 Reset ShopStats for player", this.player.playerIndex, this.player.shopStats)
		this.overboyChoice = []
		this.itemFounds = 0
		this.itemFounds_Legendary = 0
		this.levelUps = []

		/*this.overboyChoice = [5]
		this.itemFounds = 1
		this.levelUps = [1]*/
	}

	WillAppear() {
		return this.itemFounds > 0 || this.itemFounds_Legendary > 0 || this.levelUps.length > 0 || this.overboyChoice.length > 0
	}

	HTML_CreateMainColumn() {
		this.element = document.createElement("div")

		//! adding to document fix the issue with elements not translating properly
		document.body.appendChild(this.element)
		this.element.style.display = "none"

		this.element.classList.add("vertical", "s100")

		this.element.style.height = Utils.px(280)

		this.element.innerHTML = /*html*/ `
        <div id="parent_which" class="vertical s100 flex_1 relative" style="
            top:${Utils.px(20)};
        ">
            <div id="Mergoboy" class="vertical flexGrow justify_center items_center">
                <div id="Mergoboy_Title" class= "horizontal textOutline" style="
                    font-size:${Utils.px(7)};
                    font-weight: bold;
                    margin-bottom:${Utils.px(2)};
                    gap:${Utils.px(2)};
                    background-color: #000000;
                    padding:${Utils.px(1.5)};
                    border-radius:${Utils.px(1)};
                    text-align: center;
                ">
                    <img id="mergoboyIcon" src="Game/Graph/Icon_Mergoboy.png" style="
                    height: 1.5em;
                    vertical-align: middle; 
                    ">
                    <div id="Mergoboy_Trans">
                    </div>
                
                </div>
                <div id="Mergoboy_Descriptions"  class="horizontal justify_center" style="
                    height: ${Utils.px(150)}; 
                    gap: ${Utils.px(2)};
                ">
                    <div id="Mergoboy_TooltipContainer" class= "horizontal" style="
                    ">
                    </div>
                    <div id="Mergoboy_TooltipFake" class="vertical items_center" style="
                        width: ${Utils.px(infoWidth)};
                        margin-left: ${Utils.px(-2)};
                    ">
                    </div>

                </div>
                <div id="Mergoboy_Choice" class="inventory_grid simplebar_white justify_center" style="
                    box-sizing: border-box;
                    max-height: 100%;
                    max-width: 80%;
            
                    border-radius: ${Utils.px(1)};
                ">    
                </div>
            </div>
            <div id="ItemFound" class="vertical flexGrow justify_center items_center">
                <div id="ItemFound_Title" class= "horizontal textOutline" style="
                    font-size:${Utils.px(8)};
                    font-weight: bold;
                    margin-bottom:${Utils.px(2)};
                    gap:${Utils.px(2)};
                    background-color: #000000;
                    padding:${Utils.px(1.5)};
                    border-radius:${Utils.px(1)};
                ">
                    <img id="chestIcon" src="Game/Graph/Pickup_Chest.png" style="
                    height: 1.5em;
                    vertical-align: middle; 
                    ">
                    <div id="ItemFound_Trans">
                    </div>
                
                </div>
                <div id="ItemFound_Item" class= "horizontal">
                </div>
                <div id="ItemFound_Buttons" class= "horizontal" style="
                    margin-top:${Utils.px(1)};
                    gap:${Utils.px(2)};
                ">
                </div>
            </div>
            <div id="ChooseUpgrade" class="vertical flexGrow justify_center items_center" 
                style="
                    height:${Utils.px(80)};
                    gap:${Utils.px(5)};
            ">
                <div id="ChooseUpgrade_Title" class= "horizontal textOutline" style="
                    font-size:${Utils.px(8)};
                    font-weight: bold;
                    margin-bottom:${Utils.px(2)};
                    gap:${Utils.px(2)};
                    background-color: #000000;
                    padding:${Utils.px(1.5)};
                    border-radius:${Utils.px(1)};
                ">
                    <img id="levelupIcon" src="Game/Graph/Stat_Level.png" style="
                    height: 1.5em;
                    vertical-align: middle; 
                    ">
                    <div id="ChooseUpgrade_Trans">
                    </div>
                </div>
                <div id="ChooseUpgrade_Items" class= "horizontal" style="
                        gap:${Utils.px(2)};
                ">
                </div>
                <div id="ChooseUpgrade_Buttons" class= "horizontal justify_center">
                </div>
            </div>
        </div>
        <div id="shopStats_Invos" class="vertical relative" style="
                    height:${Utils.px(65)};
                    width:${Utils.px(410)};
                ">
                    <div id="shopStats_Invos_NavigationHelper" class="flex w100 relative focusable" style="
                        top: ${Utils.px(10)};
                    ">
                    </div>
                    <div id="shopStats_Invos_actual" class="player-inventories" style="
                    ">

                        <div id="shopStats_Invo_items" class="items-section" style=
                            "width:${Utils.px(280)};
                        ">
                        </div>

                        <div id="shopStats_Invo_weps" class="weapons-section" style=
                            "width:${Utils.px(120)};
                        ">
                        </div>
                    </div>
        </div>
        `
		//! is it needed ?
		//this.shopStats_Buttons = this.element.querySelector("#shopStats_Buttons")

		this.elem_Mergoboy = this.element.querySelector("#Mergoboy")
		this.elem_ItemFound = this.element.querySelector("#ItemFound")
		this.elem_ChooseUpgrade = this.element.querySelector("#ChooseUpgrade")

		//hide both
		this.elem_Mergoboy.style.display = "none"
		this.elem_ItemFound.style.display = "none"
		this.elem_ChooseUpgrade.style.display = "none"

		const title_Mergoboy = this.element.querySelector("#Mergoboy_Trans")
		this.runtime.translation.Elem_SetTranslateKey(title_Mergoboy, "Run_Mergoboy")

		const title_ItemFound = this.element.querySelector("#ItemFound_Trans")
		this.runtime.translation.Elem_SetTranslateKey(title_ItemFound, "Run_ItemFound")

		const title_ChooseUpgrade = this.element.querySelector("#ChooseUpgrade_Trans")
		this.runtime.translation.Elem_SetTranslateKey(title_ChooseUpgrade, "Run_LevelUp")

		//* mergoboy

		this.mergoTooltip = new Tooltip(this.runtime, false)
		this.mergoTooltip.element.style.width = Utils.px(infoWidth_Tooltip)

		this.mergoTooltip_fake = this.element.querySelector("#Mergoboy_TooltipFake")
		this.runtime.style.Elem_BoxStyle(this.mergoTooltip_fake, "TIER_0", 5)

		const mergoTooltipContainer = this.element.querySelector("#Mergoboy_TooltipContainer")
		mergoTooltipContainer.appendChild(this.mergoTooltip.element)

		//* add reroll button
		const ChooseUpgrade_Buttons = this.element.querySelector("#ChooseUpgrade_Buttons")
		const rerollSetting = this.runtime.menu.AddSettingsToElem(ChooseUpgrade_Buttons, "", "", false, [
			{
				type: "button",
				label: "",
				style: "outline",
				elemClass: "button_reroll_chooseUpgrade",
				callback: () => {
					const hasReroll = this.shop.Reroll()
					if (hasReroll) {
						this.Get_LevelUp(true)
					}
				},
			},
		])

		this.rerollCostElem = this.player.shop.HTML_SetRerollButton(rerollSetting)

		//* add take/recyle buttons
		const ItemFound_Buttons = this.element.querySelector("#ItemFound_Buttons")
		this.runtime.menu.AddSettingsToElem(ItemFound_Buttons, "", "", false, [
			{
				type: "button",
				label: "Menu_Shop_Take",
				style: "outline",
				callback: () => {
					this.Item_Take()
				},
			},
			{
				type: "button",
				label: "Menu_Shop_Sell",
				style: "outline",
				elemClass: "button_recycle",
				callback: () => {
					this.ChestItem_Sell()
				},
			},
		])

		const item_Found = this.element.querySelector("#ItemFound_Item")
		this.itemFoundTooltip = new Tooltip(this.runtime, false)
		item_Found.appendChild(this.itemFoundTooltip.element)

		this.itemFoundTooltip.element.style.width = Utils.px(90)

		//* QOL NAVIGATION

		//* Invos Bottom

		const invos_navHelper = this.element.querySelector("#shopStats_Invos_NavigationHelper")

		const shopStats_actual = this.element.querySelector("#shopStats_Invos_actual")
		const parent_which = this.element.querySelector("#parent_which")

		invos_navHelper.navRedirect = (dir) => {
			if (dir === "up") {
				return this.player.SN.getFocusable_parentFromDir(parent_which, "up")
			}
			if (dir === "down") {
				return this.player.SN.getFocusable_parentFromDir(shopStats_actual, "down")
			}
			if (dir === "left") {
				return this.player.SN.getFocusable_parentFromDir(shopStats_actual, "left")
			}
			if (dir === "right") {
				return this.player.SN.getFocusable_parentFromDir(shopStats_actual, "right")
			}
			return null
		}

		//* Chest

		const itemFoundButtons = this.element.querySelector("#ItemFound_Buttons")

		itemFoundButtons.move_up = () => {
			return "noMove"
		}

		itemFoundButtons.move_left_external = () => {
			return "noMove"
		}

		itemFoundButtons.move_right_external = () => {
			if (!this.runtime.singlePlayer) return "noMove"
			const tab_Primary = this.player.stats.element.querySelector(".tab_Primary")
			return tab_Primary
		}

		//* Mergoboy

		const mergoboyChoice = this.elem_Mergoboy.querySelector("#Mergoboy_Choice")

		mergoboyChoice.move_up = () => {
			if (!this.runtime.singlePlayer) return null
			const tab_Primary = this.player.stats.element.querySelector(".tab_Primary")
			return tab_Primary
		}

		mergoboyChoice.move_down = () => {
			if (!this.runtime.singlePlayer) return "noMove"
			return null
		}

		mergoboyChoice.move_left_external = () => {
			return "loop"
		}

		mergoboyChoice.move_right_external = () => {
			return "loop"
		}

		//* ChooseUpgrade

		this.ChooseUpgrade_Items = this.element.querySelector("#ChooseUpgrade_Items")

		const button_reroll_chooseUpgrade = this.element.querySelector(".button_reroll_chooseUpgrade")

		this.ChooseUpgrade_Items.move_down = () => {
			if (!this.runtime.singlePlayer) return null
			return button_reroll_chooseUpgrade
		}

		this.ChooseUpgrade_Items.move_up = () => {
			if (!this.runtime.singlePlayer) return null
			return "noMove"
		}

		this.ChooseUpgrade_Items.move_left = () => {
			if (!this.runtime.singlePlayer) return "noMove"
			return null
		}

		this.ChooseUpgrade_Items.move_right = () => {
			if (!this.runtime.singlePlayer) return "noMove"
			return null
		}

		this.ChooseUpgrade_Items.move_left_external = () => {
			return "noMove"
		}

		this.ChooseUpgrade_Items.move_right_external = () => {
			if (!this.runtime.singlePlayer) return "noMove"
			const tab_Primary = this.player.stats.element.querySelector(".tab_Primary")
			return tab_Primary
		}

		for (let i = 0; i < 4; i++) {
			const itemShopTooltip = new Tooltip(this.runtime, false)
			//itemShopTooltip.element.style.display = ""
			itemShopTooltip.element.style.width = Utils.px(90)
			this.ChooseUpgrade_Items.appendChild(itemShopTooltip.element)
			this.upgradeTooltips.push(itemShopTooltip)
		}
	}

	HTML_CreateShopStats_Single() {
		this.shopStatsMenu_Single = this.runtime.menu.CreateMenuScreen("shopStatsMenu", false, false)

		this.shopStatsMenu_Single.innerHTML = /*html*/ `
        <div id="" class="vertical justify_center items_center h100 w100">
           
            <div id="shopStats_Container" class="inlineFlex row items_center justify_center" style="gap: ${Utils.px(15)};">
                
                

                <div id="shopStats_MainContainer" class="vertical">
                    
                </div>

                <div id="leftContainer" class="vertical items_center" style="gap: ${Utils.px(2)};">
                    <div id="coinShop_container" class="" style="
                    ">
                        <div id="coinShop" class="currency textOutline" style="
                            font-weight: bold;
                            font-size: ${Utils.px(10)};
                        ">
                        </div>
                    </div>
                    <div id="statsContainer">
                    </div>
                </div>

               
               
            </div>
            <div id="shopStats_Buttons">
            </div>
        </div>
        `

		this.containerSingle = this.shopStatsMenu_Single.querySelector("#shopStats_MainContainer")

		const coinShop_container = this.shopStatsMenu_Single.querySelector("#coinShop_container")
		this.runtime.style.Elem_BoxStyle(coinShop_container, "", 4, {
			frameUrl: "Frame_UI_Purple.png",
		})

		this.single_coinText = this.shopStatsMenu_Single.querySelector("#coinShop")
	}

	HTML_CreateShopStats_Multi() {
		const shopStatsMenu = this.runtime.menu.CreateMenuScreen("shopStatsMenu_Multi", false, false)
		shopStatsMenu.classList.remove("settingsMenu")
		shopStatsMenu.classList.add("shopContainer_Multi", "flex", "flex_nowrap", "justify_between", "overflow_hidden", "s100")

		const shopContainerMulti = shopStatsMenu

		for (const player of this.runtime.players) {
			player.shopStats.elemMulti = document.createElement("div")
			const elemMulti = player.shopStats.elemMulti
			shopContainerMulti.appendChild(elemMulti)
			elemMulti.classList.add("shopStats_Multi", "flex_1")

			//elemMulti.style.backgroundColor = player.colorMultiBack
			this.runtime.style.Elem_BoxColorStyle(elemMulti, "Player" + player.playerIndex)

			elemMulti.style.position = "relative"

			const color = player.color_

			elemMulti.innerHTML = /*html*/ `
            <div id="" class="vertical s100">
                <div id="shopStats_Header" class="vertical justify_center items_center">
                    <div class="topRow1 justify_center items_center" style="
                        display: flex; 
                        position: relative; 
                        width: 100%; 
                    ">
                        <div id="coinContainer" class="items_center" style="
                            position: absolute; 
                            top: ${Utils.px(4)};
                            left: ${Utils.px(4)};
                            font-size: ${Utils.px(7)};
                            display: flex; 
                            gap: ${Utils.px(4)};
                        ">
                            <div id="coinText" style="
                                display: flex; 
                                color: ${color};
                                font-weight: bold;
                            ">
                            </div>
                        </div>
                        <!-- Center: Player Label -->
                        <div id="playerLabel" style="
                            font-weight: bold; 
                            text-align: center;
                            color: ${color};
                        ">
                            Player 1
                        </div>
                    </div>
                    <div id="navRow_Container" class="" style="">
                    </div>
                </div>
                <div id="shopStats_MainContainer" class="vertical justify_center items_center flexGrow">
                </div>
                <div id="shopMulti_OverlayStats" class="vertical justify_center items_center s100" style="display: none;">
                    <div id="statsContainer" >
                    </div>
                
                </div>
            </div>
            `

			//background: linear-gradient(to top, #3204fdba, #9907facc), url(${coinImg}) no-repeat top center;

			this.runtime.menu.CreateNavRow(elemMulti.querySelector("#navRow_Container"))
			player.shopStats.navRow = elemMulti.querySelector("#navRow")
			player.shopStats.tabLabel = elemMulti.querySelector("#navLabel")
			this.runtime.translation.Elem_SetTranslateKey(player.shopStats.tabLabel, "Menu_Shop_Upgrades")

			player.shopStats.multi_playerLabel = elemMulti.querySelector("#playerLabel")
			player.shopStats.multi_coinText = elemMulti.querySelector("#coinText")

			player.SetCoinElem(player.shopStats.multi_coinText, 10, color, true)

			const setPlayerNumber = () => {
				player.shopStats.multi_playerLabel.textContent = player.shopStats.multi_playerLabel.textContent.replace("{0}", player.playerIndex + 1)
			}

			this.runtime.translation.Elem_SetTranslateKey(player.shopStats.multi_playerLabel, "RunInfo_Player", setPlayerNumber)

			player.shopStats.shopMulti_OverlayStats = elemMulti.querySelector("#shopMulti_OverlayStats")

			player.shopStats.containerMulti = elemMulti.querySelector("#shopStats_MainContainer")
		}
	}

	HTML_SetInShopStats() {
		if (!this.player.enabled) {
			this.element.style.display = "none"
			this.elemMulti.style.display = "none"
			return
		}

		this.element.style.display = "flex"

		/*if (this.player.isPlayer0) {
			//! fix weird bug with this menu
			this.runtime.translation.TranslatePage()
		}*/

		this.Init_StatUpgradesPool()

		const player = this.player

		let statsContainer

		this.ChooseUpgrade_Items.classList.remove("vertical", "horizontal")

		const parent_which = this.element.querySelector("#parent_which")
		parent_which.style.top = Utils.px(0)

		const shopStats_Invos = this.element.querySelector("#shopStats_Invos")
		shopStats_Invos.style.display = "none"

		if (this.runtime.singlePlayer) {
			this.containerSingle.appendChild(this.element)
			statsContainer = this.shopStatsMenu_Single.querySelector("#statsContainer")

			const itemSection = this.element.querySelector("#shopStats_Invo_items")
			itemSection.appendChild(this.player.inventory.element)

			const weaponSection = this.element.querySelector("#shopStats_Invo_weps")
			weaponSection.appendChild(this.player.inventoryWeps.element)

			this.ChooseUpgrade_Items.classList.add("horizontal")

			parent_which.style.top = Utils.px(20)
			shopStats_Invos.style.display = "flex"
		} else {
			this.elemMulti.style.display = "flex"

			this.containerMulti.appendChild(this.element)
			statsContainer = this.elemMulti.querySelector("#statsContainer")

			this.ChooseUpgrade_Items.classList.add("vertical")

			//this.player.SpatialNavigation(this.element)
		}

		/*
		if (!this.runtime.singlePlayer) {
			const itemSection = this.multi_OverlayInvo.querySelector("#shopInvo_items")
			itemSection.appendChild(this.player.inventory.element)

			const weaponSection = this.multi_OverlayInvo.querySelector("#shopInvo_weps")
			weaponSection.appendChild(this.player.inventoryWeps.element)
		}*/

		const statsElement = this.player.stats.element
		statsElement.style.display = "block"
		statsContainer.appendChild(statsElement)

		this.player.Tab_Update_InMulti(0)
	}

	Item_Take() {
		const item = this.itemFoundTooltip.element.item
		this.player.inventory.AddItem(item)
		this.NextStep()
	}

	ChestItem_Sell() {
		const item = this.itemFoundTooltip.element.item
		this.player.SellItem(item, "chest")
		this.NextStep()
	}

	StatUp_Choose(item) {
		this.player.inventory.AddItem(item)
		//this.player.inventoryInvisible.AddItem(item)
		this.NextStep()
	}

	Stats_Reroll() {
		//
	}

	RefreshSelect() {
		console.error("refreshSelect")

		if (this.runtime.singlePlayer) {
			//important to be able to focus
			this.player.SpatialNavigation()
		} else {
			this.player.SpatialNavigation(this.element)
		}
	}

	NextStep() {
		this.elem_ItemFound.style.display = "none"
		this.elem_ChooseUpgrade.style.display = "none"
		this.elem_Mergoboy.style.display = "none"

		console.error("NextStep", this.player.playerIndex, "things", this.itemFounds, this.itemFounds_Legendary, this.levelUps)

		if (this.overboyChoice.length > 0) {
			this.Get_Mergoboy()
			this.RefreshSelect()
		} else if (this.itemFounds > 0) {
			this.itemFounds -= 1

			this.Get_ItemFound()
			this.RefreshSelect()
		} else if (this.itemFounds_Legendary > 0) {
			this.itemFounds_Legendary -= 1

			this.Get_ItemFound(3)
			this.RefreshSelect()
		} else if (this.levelUps.length > 0) {
			this.Get_LevelUp(false)
			this.RefreshSelect()
		} else {
			if (this.runtime.singlePlayer) {
				this.runtime.menu.StartShopPhase()
			} else {
				this.shop.ValidateOverlay(true, true)
			}
		}
	}

	Init_StatUpgradesPool() {
		console.error("init_statUpgradesPool for player", this.player.playerIndex)
		if (!initPool) {
			let pool = Array.from(this.runtime.dataInstances["Items"]).map((a) => a[1])
			pool = pool.filter((item) => item.HasTag("Stat"))

			for (let i = 0; i < 4; i++) {
				const tierPool = pool.filter((item) => item.evolution === i)
				statUpgradePools.push(tierPool)
			}
			initPool = true

			console.error("statUpgradePools", statUpgradePools)
		}
	}

	Get_Mergoboy() {
		//get first overboy choice and remove it
		const mergoChoiceCount = this.overboyChoice.shift()

		this.elem_Mergoboy.style.display = "flex"
		this.mergoTooltip_fake.style.display = "flex"
		this.mergoTooltip.DisplayNone()

		const mergoboyChoice = this.elem_Mergoboy.querySelector("#Mergoboy_Choice")

		let pool_charas = Array.from(this.runtime.dataInstances["Items"].values())
		pool_charas = pool_charas.filter((item) => item.HasTag("Playable"))
		pool_charas = pool_charas.filter((item) => item.lockedBy !== "Invisible")
		pool_charas = pool_charas.filter((item) => !item.name.includes("Overboy"))
		// item is not in the inventory
		const equipItemNames = this.player.inventory.items.map((item) => item.name)
		pool_charas = pool_charas.filter((item) => !equipItemNames.includes(item.name))

		const itemsArray = Utils.Array_Random(pool_charas, mergoChoiceCount)

		const inventoryHtml = itemsArray
			.map((item, index) => {
				let imgIcon = item.img

				return /*html*/ `
                    <div class="itemBox" data-item-index="${index}">
                        <img src="${imgIcon}" draggable="false" 
                            onerror="this.onerror=null; this.src='random_icon.png';">
                        
                    </div>
    
    
                `
			})
			.join("")

		const elemChoiceGrid = mergoboyChoice
		const player = this.player

		elemChoiceGrid.innerHTML = inventoryHtml
		const items = elemChoiceGrid.querySelectorAll(".itemBox")
		items.forEach((item) => {
			const itemIndex = item.getAttribute("data-item-index")
			const itemClass = itemsArray[itemIndex]

			const key = "TIER_" + itemClass.evolution
			//this.runtime.style.Elem_ItemStyle(item, key)

			this.runtime.style.Elem_ItemStyleFrame(item, itemClass.evolution)

			item.player = this.player
			item.itemClass = itemClass
			item.locked = itemClass.locked

			Utils.Elem_FocusableOutline(item)

			//*========== SPECIFIC ========================
		})

		items.forEach((item) => {
			const itemIndex = item.getAttribute("data-item-index")
			const itemClass = itemsArray[itemIndex]

			const key = "TIER_" + itemClass.evolution
			//this.runtime.style.Elem_ItemStyle(item, key)

			this.runtime.style.Elem_ItemStyleFrame(item, itemClass.evolution)

			item.player = this.player
			item.itemClass = itemClass
			item.locked = itemClass.locked

			Utils.Elem_FocusableOutline(item)
		})

		//*========== SPECIFIC Item Icon Logic ========================

		items.forEach((item) => {
			let itemClass = item.itemClass

			item.addEventListener("sn:pressed", (e) => {
				//* END MERGOBOY
				this.elem_Mergoboy.style.display = "none"
				elemChoiceGrid.innerHTML = ""
				this.player.inventory.AddItem(itemClass)

				this.player.inventory.addItemOffset += 1
				this.NextStep()
			})

			const focus = () => {
				if (itemClass) {
					this.mergoTooltip_fake.style.display = "none"

					this.mergoTooltip.DisplayFlex()
					this.mergoTooltip.SetTooltipFromItem(itemClass, player, "runSelect")
				}
			}

			const unfocus = () => {
				this.mergoTooltip_fake.style.display = "flex"
				this.mergoTooltip.DisplayNone()
			}

			Utils.Elem_Focusable(item, focus, unfocus, false)
		})
	}

	Get_ItemFound(fixedTier = -1) {
		this.elem_ItemFound.style.display = "flex"

		const item = this.service.GetRandomItemFromWave(this.runtime.waveManager.waveCount, "Upgrade", fixedTier)

		this.itemFoundTooltip.SetTooltipFromItem(item, this.player, "itemFound")

		const recycleButton = this.element.querySelector(".button_recycle")
		if (recycleButton) {
			const recycleLabel = recycleButton.querySelector("#buttonLabel")
			if (recycleLabel) {
				recycleLabel.textContent = this.runtime.translation.Get("Menu_Shop_Sell")
				recycleLabel.textContent = recycleLabel.textContent.replace("{0}", item.Get_Sell_Value())
			}
		}
	}

	Get_LevelUp(isReroll = false) {
		this.elem_ChooseUpgrade.style.display = "flex"

		//get and remove first level up
		if (!isReroll) {
			this.levelUpElem_last = this.levelUps.shift()
		}

		const randStats = this.Get_StatUpgrades(this.levelUpElem_last)

		for (let i = 0; i < 4; i++) {
			const tooltip = this.upgradeTooltips[i]
			if (randStats.length <= i) {
				tooltip.DisplayNone()
				continue
			}
			tooltip.DisplayFlex()

			const randStat = randStats[i][0]
			tooltip.SetTooltipFromItem(randStat, this.player, "statUpgrade")
		}
	}

	Get_StatUpgrades(levelUpElem, count = 4) {
		this.Init_StatUpgradesPool()
		const statUpgrades = []

		this.statUpgrades_Names = []
		if (!this.statUpgrades_Names_Previous) this.statUpgrades_Names_Previous = []

		const levelUpTier = levelUpElem.tier || -1

		for (let i = 0; i < count; i++) {
			let tier = this.service.GetTierFromWave(this.runtime.waveManager.waveCount)

			if (levelUpTier >= 0) tier = levelUpTier

			const tierPool = statUpgradePools[tier]
			let randStatUpgrade

			do {
				randStatUpgrade = Utils.Array_Random(tierPool)
			} while (this.statUpgrades_Names.includes(randStatUpgrade.name) || this.statUpgrades_Names_Previous.includes(randStatUpgrade.name))

			this.statUpgrades_Names.push(randStatUpgrade.name)

			const statUpgradesModifier = this.player.stats.GetStatValue("StatsFromLevelUpgrades")
			if (statUpgradesModifier !== 1) {
				//
			}

			statUpgrades.push([randStatUpgrade, false])
		}

		this.statUpgrades_Names_Previous = [...this.statUpgrades_Names]

		return statUpgrades
	}
}
