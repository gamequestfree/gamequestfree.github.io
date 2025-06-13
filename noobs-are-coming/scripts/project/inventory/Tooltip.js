export class Tooltip {
	constructor(runtime, isHover = false) {
		this.runtime = runtime
		this.isHover = isHover

		this.evolution = 0

		this.tooltipY = 0

		this.CreateTooltip()
	}

	CreateTooltip() {
		const tooltip = document.createElement("div")
		this.element = tooltip
		tooltip.classList.add("tooltip", "horizontal")
		document.body.appendChild(tooltip)

		this.tooltipContent = document.createElement("div")
		this.tooltipContent.id = "tooltipContent"
		this.tooltipContent.classList.add("vertical", "s100")
		tooltip.appendChild(this.tooltipContent)

		this.tooltipExtra = document.createElement("div")
		this.tooltipExtra.id = "tooltipExtra"
		this.tooltipExtra.classList.add("vertical")
		tooltip.appendChild(this.tooltipExtra)
		this.tooltipExtra.style.display = "none"

		Object.assign(tooltip.style, {
			fontSize: Utils.px(5.6),
			boxSizing: "border-box",
			pointerEvents: "none",
		})

		Object.assign(this.tooltipContent.style, {
			color: "#fff",
			zIndex: 1,
			wordBreak: "break-word",
			overflowWrap: "anywhere",
		})

		Object.assign(this.tooltipExtra.style, {
			boxSizing: "border-box",
			gap: Utils.px(1),
			margin: Utils.px(1),
		})

		if (this.isHover) {
			Object.assign(tooltip.style, {
				position: "absolute",
				zIndex: 9000,

				/*minWidth: Utils.px(50),
				maxWidth: Utils.px(150),*/
			})
		} else {
			Object.assign(tooltip.style, {
				position: "relative",
				flex: "1",
			})
		}
	}

	SetTooltipFromItem(item, player = null, type = "", args = {}) {
		if (player) item.player = player

		player = item.player

		const tooltip = this.element
		tooltip.item = item

		this.tooltipExtra.style.display = "none"

		if (this.runtime.playersEnabled.size > 2) {
			this.element.classList.remove("horizontal")
			this.element.classList.add("vertical")
		} else {
			this.element.classList.remove("vertical")
			this.element.classList.add("horizontal")
		}

		let showSyns = false
		if (type === "Inventory_Weps") showSyns = true

		if (this.isHover) {
			this.tooltipContent.style.width = Utils.px(90)

			this.tooltipExtra.style.maxWidth = Utils.px(90)
		}

		this.tooltipExtra.classList.remove("tooltipExtraShop")

		if (type === "shop") {
			showSyns = true
			//tooltip extra should be absolute

			this.tooltipExtra.classList.add("tooltipExtraShop")

			Object.assign(this.tooltipExtra.style, {
				opacity: 1,
				position: "absolute",
				width: "100%",
				top: "50%",
				left: "50%",
				transform: "translateX(-50%)",
				zIndex: 3,

				gap: "",
				padding: "",
			})
		}

		if (showSyns) {
			this.tooltipExtra.style.display = "flex"
			let htmlString = ""

			let synBGColor = `linear-gradient(360deg, ${this.runtime.tierColors["TIER_0_DARK"]}, rgba(0, 0, 0))`
			let opacity = 0.95

			if (type === "shop") {
				this.tooltipExtra.style.display = "none"
				synBGColor = `rgba(0, 0, 0)`
				opacity = 1
			}

			let synIndex = 0

			for (const syn of item.Synergies) {
				if (synIndex === 0) {
					//this.element.style.width = Utils.px(160)
				}

				const playerSyn = player.synergies?.[syn] || { synAmount: 0 }

				//console.error("playerSyn", syn, player, playerSyn)

				const synTranslate = `${this.runtime.translation.Get(syn)} <span style="color: gray">(${playerSyn.synAmount})</span>`

				synIndex++
				const synItems = []
				for (let i = 2; i < 8; i++) {
					const synItem = this.runtime.dataInstances["Items"].get("U_Syn_" + syn + "_" + i)
					if (synItem) synItems.push([synItem, i])
				}

				//old
				//border: ${this.runtime.borderSolid("#a9a9a9")};

				htmlString += /*html*/ `
                <div id="syn" class="vertical relative" style="
                    
                    border-radius: ${Utils.px(2)};
                    
                    box-sizing: border-box;
                    padding: ${Utils.px(1)};
                    font-size: ${Utils.px(5)};
                ">
                    <div>${synTranslate}</div>
                    <div>
                    <div id="synBG" class="" style="
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: ${synBGColor};
                        border: ${Utils.px(0.5)} solid rgb(172, 172, 172);
                        opacity: ${opacity};
                        z-index: -1; 
                        pointer-events: none; 
                    ">
                    </div>
                `

				let firstItem = true
				let firstEffect = true
				for (const a of synItems) {
					const synItem = a[0]
					const synLevel = a[1]
					synItem.player = player
					let synLevelString = "(" + synLevel + ") "
					let firstEffect = true
					for (const effect of synItem.effects) {
						if (!firstEffect) synLevelString += ", "
						firstEffect = false
						synLevelString += effect.GetEffectInfo()
					}

					if (playerSyn.synAmount < synLevel) {
						synLevelString = this.runtime.richText.removeBBCode(synLevelString)
						synLevelString = "[c=grey]" + synLevelString + "[/c]"
					}
					synLevelString = Utils.parseBBCode(synLevelString)

					if (!firstItem) synLevelString = "<br>" + synLevelString
					firstItem = false
					htmlString += synLevelString
				}

				htmlString += /*html*/ `
                    </div>
                </div>

                `
			}

			this.tooltipExtra.innerHTML = htmlString
		}

		if (type === "runSelect") {
			this.element.style.flex = ""
		}

		if (type === "itemFound" || type === "statUpgrade") {
			//this.tooltipContent.style.position = ""
			//this.element.style.flex = ""
		}

		//
		let htmlString = /*html*/ `
        
        <div id="tooltipBox" class="vertical justify_between w100 flex_1 relative"> 
            <div id="tooltipBox_Begin" class="vertical items_start" style="
                gap:${Utils.px(2)};
            "
            >
                <div class="horizontal" style="margin:${Utils.px(2)}; gap:${Utils.px(2)};">

                    <div class="tooltipImgContain flex justify_center items_center" style="
                        padding:${Utils.px(1)};
                        height:${Utils.px(17)};
                        width:${Utils.px(17)};
                        border-radius: ${Utils.px(2)};
                        overflow: hidden;
                        flex-shrink: 0;
                        position: relative;
                        ">
                        <img class="tooltipImg" 
                            src="${item.img}" onerror="this.src='random_icon.png'; item.img = item.src"
                            style="
                                max-height: 95%;
                                max-width: 95%;
                                object-fit: contain;
                                
                        "/>
                        <div class="itemATK"></div>  
                        
                    </div>
                    <div class="vertical flexGrow">
                        <div class="itemTitle" style="
                            font-size:${Utils.px(7)};
                        "></div>
                        <div class="itemTags" style="
                            font-size:${Utils.px(6)};
                        "></div>
                    </div>
                </div>
                <div class="tooltipEffects simplebar_white" style="
                    width:100%;
                ">
                </div>

            </div>
            <div id="tooltipFooter" class="horizontal justify_center relative" style="
                margin-bottom: ${Utils.px(4)};
            ">
                <div id="btnContainer"  class="vertical" style="
                        gap:${Utils.px(1)};
                        margin-bottom: ${Utils.px(2)};
                        margin-top: ${Utils.px(2)};
                        pointer-events: auto;
                    ">
                </div>
            </div>
           
        </div>
        
        `

		const contentActual = this.tooltipContent

		contentActual.innerHTML = htmlString

		/*
		if (type === "shop") {
			document.body.appendChild(this.tooltipExtra)
			const tooltipBox_Begin = this.tooltipContent.querySelector("#tooltipBox_Begin")

			const beginRect = tooltipBox_Begin.getBoundingClientRect()
			const scale = Utils.HTML_C3Scale() // if your app uses zoom/scaling

			// Screen-space coordinates (adjust for scale if zoomed)
			const top = beginRect.bottom / scale
			const left = beginRect.left / scale

			// Apply forced positioning
			Object.assign(this.tooltipExtra.style, {
				position: "absolute",
				top: `${top}px`,
				left: `${left}px`,
				opacity: 0.9,
				transform: "translateX(0%)", // or -50% if centering
				width: "auto", // override previous 100% if needed
				zIndex: 9999, // force render on top
				pointerEvents: "auto",
			})
		}*/

		/*if (type === "shop") {
		

			const tooltipBox_Begin = this.tooltipContent.querySelector("#tooltipBox_Begin")
			const beginRect = tooltipBox_Begin.getBoundingClientRect()
			const scale = Utils.HTML_C3Scale() // accounts for canvas or global UI scaling

			// Compute absolute positioning values (adjusted for scale)
			const y = Utils.px(beginRect.bottom / scale)
			const x = Utils.px(beginRect.left / scale)

			Object.assign(this.tooltipExtra.style, {
				opacity: 0.9,
				position: "absolute", // relative to viewport
				top: `${y}`,
				left: `${x}`,
				width: "100%", // or an explicit px if needed
				transform: "translateX(0%)", // align left edge
				zIndex: 3,
			})
		}*/

		const tooltipBox = contentActual.querySelector("#tooltipBox")

		const itemATK = tooltipBox.querySelector(".itemATK")
		if (itemATK) {
			if (item.itemType === "Weapon") {
				itemATK.style.display = "flex"
				itemATK.textContent = "ATK"
			} else itemATK.style.display = "none"
		}

		//! TEMP DISABLE
		itemATK.style.display = "none"

		this.runtime.style.Elem_BoxStyle(tooltipBox, "TIER_" + item.evolution)

		const tooltipBox_Cadre = tooltipBox.querySelector(".borderFrame")
		if (tooltipBox_Cadre) tooltipBox_Cadre.style.zIndex = -1

		//! REWORK UI
		//tooltipBox.style.paddingBottom = Utils.px(5)

		const tooltipFooter = contentActual.querySelector("#tooltipFooter")

		const tooltipImgContain = tooltipBox.querySelector(".tooltipImgContain")

		//! REWORK UI

		Object.assign(tooltipImgContain.style, {
			backgroundImage: `url('frame_item_${item.evolution}.png')`,
			backgroundSize: "cover", // Ensures the image covers the element without distortion
			backgroundRepeat: "no-repeat",
			backgroundPosition: "center",
			// backgroundSize: "100% 100%" // Not needed since "cover" is used
		})

		//tooltipImgContain.style.background = `linear-gradient(360deg,rgb(50, 50, 50),rgb(19, 19, 19)`
		//this.runtime.style.Elem_BGGradient(tooltipImgContain)

		Object.assign(tooltipBox.style, {
			//backgroundColor: "#181818",
			borderRadius: Utils.px(2),
			//border: this.runtime.borderSolid("#a9a9a9"),
			boxSizing: "border-box",
		})

		//! REWORK UI
		/*if (type === "itemFound" || type === "statUpgrade") {
			tooltipBox.style.paddingBottom = Utils.px(3)
		}*/

		if (type === "shopMulti") {
			tooltipBox.style.maxWidth = Utils.px(100)

			Utils.Elem_AddSeparator(tooltipBox)

			const pressLock = document.createElement("div")
			tooltipBox.appendChild(pressLock)

			pressLock.style.textAlign = "center"
			pressLock.style.color = this.runtime.colorsText.Gray
			pressLock.style.marginBottom = Utils.px(2)

			let pressLock_text = this.runtime.translation.Get("Control_PressLock")
			pressLock_text = pressLock_text.replace(
				"{img1}",
				"<img src='Control_Button_Dir_Left.png' style='height: 1.5em; vertical-align: middle;'>"
			)
			pressLock_text = pressLock_text.replace("{img2}", "<img src='Control_Key_F.png' style='height: 1.5em; vertical-align: middle;'>")

			pressLock.innerHTML = pressLock_text
		}

		if (type === "shop") {
			tooltipBox.style.fontSize = Utils.px(6)

			tooltipBox.insertAdjacentHTML(
				"afterend",
				/*html*/ `
        <div class="horizontal justify_center items_center" style="
            margin-top: ${Utils.px(2)};
        ">
            <div id="lockContainer" class= "" style="
                height: ${Utils.px(12)};
                pointer-events: auto;
            ">
            </div>
        </div>
        `
			)
		}

		// Add title
		const title = contentActual.querySelector(".itemTitle")
		title.textContent = item.GetItemDisplayName()
		//this.runtime.translation.Elem_SetTranslateKey(title, itemName)

		const tags = contentActual.querySelector(".itemTags")
		tags.innerHTML = item.GetTypeLoc("yellow")

		const background = tooltip.querySelector(".transparentBG")
		const evolution = item.evolution

		title.style.color = this.runtime.tierColors["TIER_" + evolution]

		let bgColor = this.runtime.tierColors["TIER_" + evolution + "_DARK"]
		if (args.colorBG) bgColor = args.colorBG
		if (args.colorOutline) background.style.borderColor = args.colorOutline
		if (args.colorTitle) title.style.color = args.colorTitle

		background.style.background = `linear-gradient(360deg, ${bgColor}, rgba(0, 0, 0, 1))`
		//background.style.backgroundColor = this.runtime.tierColors["TIER_" + evolution + "_DARK"]

		const tooltipEffects = contentActual.querySelector(".tooltipEffects")

		item.tempPlayer = player

		if (item.itemType === "Weapon") {
			Utils.Elem_AddSeparator(tooltipEffects)
			item.GetWepInfo(player, contentActual)
			Utils.Elem_AddSeparator(tooltipEffects)
		}

		// Loop through all effects and append their info
		//ignore HideEffects

		if (item.lockedBy === "Commu" || item.secretDescription) {
			tooltipEffects.insertAdjacentHTML(
				"beforeend",
				/*html*/ `
                <ul><li><div style="color:${this.runtime.colorsText.Gray} ">
                ????
                </div></li></ul>
            `
			)
		} else {
			let hasDisplayedEffect = false

			for (let i = 0; i < item.effects.length; i++) {
				const effect = item.effects[i]
				if (item.hideEffects.includes(i)) continue
				effect.GetHTMLInfo(tooltipEffects)
				hasDisplayedEffect = true
			}

			if (hasDisplayedEffect && item.itemType === "Weapon") {
				Utils.Elem_AddSeparator(tooltipEffects)
			}
		}

		/*
		if (hasDisplayedEffect) {
			Utils.Elem_AddSeparator(tooltipEffects)
		}*/

		if (item.modLoading) {
			tooltipEffects.insertAdjacentHTML(
				"beforeend",
				/*html*/ `
                
            <ul><li><div style="color:${this.runtime.colorsText.Gray} ">
            <br>[Mod] ${item.modLoading} 
            </div></li></ul>
        `
				/*<img src="info_icon_grey.png" style="
                vertical-align: middle; 
                height:${Utils.px(5)}; width:${Utils.px(5)}; 
                object-fit: contain;">Mod: ${item.modLoading} */
			)
		}

		const btnContainer = contentActual.querySelector("#btnContainer")

		//* STAT UPGRADE
		if (type === "statUpgrade") {
			// CHOOSE BUTTON
			const btns = this.runtime.menu.AddSettingsToElem(btnContainer, "", "Menu_Shop", false, [
				{
					type: "button",
					label: "Choose",
					style: "outline",
					callback: () => {
						//! careful, item.player would cause a bug
						player.shopStats.StatUp_Choose(item)
					},
				},
			])
		}
		//* SHOP
		else if (type === "shop") {
			//* BUY BUTTON
			const buyBtnElem = this.runtime.menu.AddSettingsToElem(btnContainer, "", "Menu_Shop", false, [
				{
					type: "button",
					label: "!",
					elemClass: "button_Buy",
					//BG_Color: "rgba(255, 255, 255, 0.05)",
					callback: () => {
						const hasBuy = player.BuyItem(item)
						if (hasBuy) {
							player.shop.service.lockedIndex.delete(this.shopIndex) //or tooltip.shopIndex ?
							tooltip.style.visibility = "hidden"

							//! todo: automatically select reroll when all is buy?

							const visibleShopTooltips = player.shop.itemShopTooltips.filter(
								(itemShop) => itemShop.element.style.visibility === "visible"
							)

							player.shop.Refresh_Instruct_ShowSyns()

							if (visibleShopTooltips.length === 0) {
								const button_reroll = player.shop.elemSingle.querySelector(".button_Reroll")
								player.SN.focus(button_reroll)
							}
						}
					},
				},
			])

			buyBtnElem.addEventListener("sn:focused", () => {
				this.SetTooltipY(2)
			})

			buyBtnElem.addEventListener("sn:unfocused", () => {
				this.SetTooltipY(0)
			})

			buyBtnElem.move_up = () => {
				//! automatically select reroll?

				/*player.shop.MoveToShopItem("left")
                return "noMove"*/

				const button_reroll = player.shop.elemSingle.querySelector(".button_Reroll")

				return button_reroll
			}

			buyBtnElem.move_down = () => {
				if (tooltip.style.visibility === "hidden") return "noMove"
				return null
			}

			buyBtnElem.move_left = () => {
				const shop = player.shop

				for (let i = this.shopIndex - 1; i >= 0; i--) {
					const itemShop = shop.itemShopTooltips[i].element
					if (itemShop.style.visibility === "visible") {
						const button_buy = itemShop.querySelector(".button_Buy")
						return button_buy
					}
				}

				const button_Go = shop.elemSingle.querySelector(".button_Go")

				return button_Go
			}

			buyBtnElem.move_right = () => {
				const shop = player.shop

				for (let i = this.shopIndex + 1; i < 4; i++) {
					const itemShop = shop.itemShopTooltips[i].element
					if (itemShop.style.visibility === "visible") {
						const button_buy = itemShop.querySelector(".button_Buy")
						return button_buy
					}
				}

				const button_Go = shop.elemSingle.querySelector(".button_Go")

				return button_Go
			}

			Object.assign(buyBtnElem.style, {
				padding: Utils.px(3),
				fontSize: Utils.px(10.5),
				fontWeight: "bold",
				//border: `${Utils.px(0.4)} solid rgba(0, 0, 0, 0.7)`,
			})

			const costElem = document.createElement("div")
			costElem.classList.add("itemCost")

			costElem.shopIndex = this.shopIndex

			const price = this.runtime.player.shop.GetIndexPrice(this.shopIndex)

			player.SetCoinElem(costElem, price)

			buyBtnElem.appendChild(costElem)

			//* LOCK BUTTON

			const lockContainer = tooltip.querySelector("#lockContainer")
			const lockBtn = this.runtime.menu.AddSettingsToElem(lockContainer, "", "Menu_Shop", false, [
				{
					type: "button",
					label: "Lock",
					elemClass: "button_Lock",
					callback: () => {
						const isNowLocked = item.player.shop.service.LockItemToggle(item, this.shopIndex)
						const lockBtn = tooltip.querySelector(".button_Lock")
						if (isNowLocked) {
							const rowElem = lockBtn.parentElement
							rowElem.insertAdjacentHTML(
								"afterend",
								/*html*/ `
                                <img 
                                src="locked_icon.png" 
                                class="lockedIcon"
                                alt="Icon" 
                                style="
                                    object-fit: cover;
                                    height:${Utils.px(12)};
                                    width:${Utils.px(12)};
                                "
                            />`
							)
						} else {
							const lockedIcon = tooltip.querySelector(".lockedIcon")
							if (lockedIcon) lockedIcon.remove()
						}
					},
				},
			])
			lockBtn.style.padding = "0 " + Utils.px(3)
			lockBtn.style.fontSize = Utils.px(8)

			/*
			lockBtn.addEventListener("sn:focused", () => {
				this.SetTooltipY( -2)
			})

			lockBtn.addEventListener("sn:unfocused", () => {
				this.SetTooltipY( 0)
			})*/

			//in case of refresh
			if (item.player.shop.service.lockedIndex.has(this.shopIndex)) {
				const rowElem = lockBtn.parentElement
				rowElem.insertAdjacentHTML(
					"afterend",
					/*html*/ `
                    <img 
                    src="locked_icon.png" 
                    class="lockedIcon"
                    alt="Icon" 
                    style="
                        object-fit: cover;
                        height:${Utils.px(12)};
                        width:${Utils.px(12)};
                    "
                />`
				)
			}

			//! set animation here

			//const transition = "transform 0.08s ease-out"
			const transition = "none"

			tooltipBox.style.transition = transition
			tooltipBox.style.willChange = "transform"

			const tooltipFooter = tooltip.querySelector("#tooltipFooter")
			if (tooltipFooter) {
				tooltipFooter.style.transition = transition
				tooltipFooter.style.willChange = "transform"
			}
		}
		//* WEP INV
		else if (type === "Inventory_Weps") {
			item.Get_WepATK_Stats(tooltipEffects)
			Utils.Elem_AddSeparator(tooltipEffects)

			const curMenuName = this.runtime.menu.CurMenuName()
			if (curMenuName === "shopMenu" || curMenuName === "shopMenu_Multi") {
				const itembox = player.inventoryWeps.itemBoxes.find((itembox) => itembox.itemClass === item)

				let settingsArr = [
					{
						type: "button",
						label: "Menu_Shop_Merge",
						style: "outline",
						elemClass: "invWepButton",
						callback: () => {
							const hasMerge = player.inventoryWeps.Merge(item)
							if (hasMerge) {
								this.DisplayNone()
								player.shop.WepItemContextMenu(null)
							}
						},
					},
					{
						type: "button",
						label: "Menu_Shop_Sell",
						style: "outline",
						elemClass: "invWepButton, button_recycle",
						callback: () => {
							player.SellItem(item, "shop")
							this.DisplayNone()
							player.shop.WepItemContextMenu(null)
						},
					},
					{
						type: "button",
						label: "Cancel",
						style: "outline",
						elemClass: "invWepButton",
						callback: () => {
							player.shop.WepItemContextMenu("Back")
						},
					},
				]

				if (!player.inventoryWeps.CanMerge(item)) {
					//if other same wep
					settingsArr = settingsArr.filter((btn) => btn.label !== "Menu_Shop_Merge")
				}

				if (player.inventoryWeps.items.length <= 1) {
					settingsArr = settingsArr.filter((btn) => btn.label !== "Menu_Shop_Sell")
				}

				this.has_InvWepButtons = false

				// if length = 1, remove the last button too (cancel)
				if (settingsArr.length >= 2) {
					this.has_InvWepButtons = true

					let btns = this.runtime.menu.AddSettingsToElem(btnContainer, "", "", false, settingsArr)

					for (const btn of btns) {
						btn.style.border = `${Utils.px(0.2)} solid rgba(255, 255, 255, 0.5)`
					}

					const recycleButton = btnContainer.querySelector(".button_recycle")
					if (recycleButton) {
						const recycleLabel = recycleButton.querySelector("#buttonLabel")
						if (recycleLabel) {
							recycleLabel.textContent = this.runtime.translation.Get("Menu_Shop_Sell")
							recycleLabel.textContent = recycleLabel.textContent.replace("{0}", item.Get_Sell_Value())
						}
					}
				}
			}
		}

		//! call after content is added
		if (this.isHover) {
			// Add class to trigger the transition
			this.DisplayNone()
		}
	}

	SetTooltipY(y) {
		return
		if (this.runtime.platforms.Export === "html") return
		this.tooltipY = y
		const tooltipBox = this.element.querySelector("#tooltipBox")
		if (tooltipBox) {
			tooltipBox.style.transform = `translateY(${this.tooltipY}px)`
		}
		const tooltipFooter = this.element.querySelector("#tooltipFooter")
		if (tooltipFooter) {
			tooltipFooter.style.transform = `translateY(${this.tooltipY}px)`
		}
	}

	DisplayNone() {
		this.element.style.display = "none"
	}

	DisplayFlex() {
		this.element.style.display = "flex"
	}
}
