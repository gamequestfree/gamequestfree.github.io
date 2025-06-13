import { Item } from "./Item.js"

/* eslint-disable quotes */
export class Inventory {
	constructor(runtime, player, name = "", items = [], noHTML = false) {
		//store the actuall class in the global C4 object for debugging purposes
		if (!C4.Inventory) C4.Inventory = Inventory

		this.runtime = runtime
		this.player = player
		this.name = name
		this.items = items

		this.hasFilters = false
		this.filterName = ""
		this.filterTags = ""

		this.UID_Holder = null

		this.slotCount = Infinity

		this.Reset_ItemOffset()

		//console.error("😂 Inventory", this.name, this)

		this.noHTML = noHTML
		if (!this.noHTML) {
			this.element = document.createElement("div")
			document.body.appendChild(this.element)
			if (this.name) this.element.id = this.name
			Utils.Elem_SetStyle(this.element, {
				width: "100%",
				height: "100%",
			})

			this.Refresh(true)
		}
	}

	get holderUnit() {
		const holder = this.runtime.getUnitByUID(this.UID_Holder)
		if (holder) return holder
		return this.player.unit
	}

	SetNoHTML() {
		this.noHTML = true
	}

	GenerateInventoryHTML() {
		let shellHtml = `
        <div class="inventory s100">`

		// Conditionally add filter inputs if this.hasFilters is true
		if (this.hasFilters) {
			shellHtml += /*html*/ `
                <div class="topFilters">
                    <div>
                        <input id="nameFilterInput" type="text" placeholder="Filter by name" value="${this.filterName || ""}"/>
                        <input id="tagFilterInput" type="text" placeholder="Filter by tag" value="${this.filterTags || ""}"/>
                    </div>
                </div>
            `
		} else {
			//shellHtml += `<div class="topTitle">Inventory</div>` // Close the topTitle div when no filter is present
		}

		// Continue building the rest of the HTML
		shellHtml += /*html*/ `
            <div id="inventoryInfo" class="" style="
                color:rgb(255, 255, 255);
                margin-left: ${Utils.px(5)};
            ">
                <span id="info_Type"></span> <span id="info_Count"></span> 
            </div>
            <div id="inventoryContainer" class="" style="
                border-radius: ${Utils.px(1)};
                min-height: ${Utils.px(20)};
                overflow: hidden;
            ">
                <div id="inventoryContainer2" class="simplebar_white" style="
                    border-radius: ${Utils.px(1)};
                    max-height: 100%;
                ">
                    <div id="inventoryContent" class="inventory_grid" style="
                        border-radius: ${Utils.px(1)};
                    ">
                    </div>
                </div>
            </div>
    `

		/*<div id="progress_Achievements" class="inventory_grid" style="
                        width:${Utils.px(350)};
                        max-height:${Utils.px(200)};
                    ">
                    </div>*/

		// Close the inventory div
		shellHtml += `</div>`

		// Render the initial shell with inputs and an empty inventory section
		this.element.innerHTML = shellHtml

		this.inventoryInfo = this.element.querySelector("#inventoryInfo")
		this.info_Type = this.element.querySelector("#info_Type")
		this.info_Count = this.element.querySelector("#info_Count")

		if (this.name === "Inventory_Upgrades") {
			Utils.Elem_SetTranslateKey(this.info_Type, "Items")
		} else if (this.name === "Inventory_Weps") {
			Utils.Elem_SetTranslateKey(this.info_Type, "Attacks")
		} else this.inventoryInfo.style.display = "none"

		this.inventoryContainer = this.element.querySelector("#inventoryContainer")
		this.inventoryContent = this.element.querySelector("#inventoryContent")

		// Add event listeners for filter inputs
		if (this.hasFilters) {
			this.element.querySelector("#nameFilterInput").addEventListener("input", (e) => {
				this.filterName = e.target.value
				this.Refresh(false)
			})

			this.element.querySelector("#tagFilterInput").addEventListener("input", (e) => {
				this.filterTags = e.target.value
				this.Refresh(false)
			})
		}
	}

	RemoveItemByName(item, evolution, quantityToRemove = 1) {
		const nameEvo = Utils.GetNameEvo(item, evolution)
		const itemToRemove = this.items.find((i) => i.nameEvo === nameEvo)
		if (!itemToRemove) return false
		this.RemoveItem(itemToRemove)
		return true
	}

	ShowInfoBubble(key, color) {
		// Create the bubble element
		const bubble = document.createElement("div")
		bubble.textContent = this.runtime.translation.Get(key)

		// Apply styles
		Object.assign(bubble.style, {
			position: "absolute",
			bottom: `100%`, // Place it fully above the parent
			left: "0px", // Align left edge with parent
			transform: `translateY(${Utils.px(-3)})`, // Add some spacing
			background: color, // Green with transparency
			color: "white",
			padding: `${Utils.px(2)} ${Utils.px(4)}`,
			borderRadius: `${Utils.px(2)}`,
			fontSize: `${Utils.px(8)}`,
			fontWeight: "bold",
			opacity: "1",
			transition: "opacity 0.8s ease-out",
			zIndex: "1000",
			pointerEvents: "none", // Prevents interaction
			whiteSpace: "nowrap", // Keep text in one line
		})

		// Ensure the parent element has a relative position
		this.element.style.position = "relative"
		this.element.appendChild(bubble)

		// Fade out and remove after a short delay
		setTimeout(() => {
			bubble.style.opacity = "0"
			setTimeout(() => bubble.remove(), 800) // Remove after fade out
		}, 1000) // Stay visible for 1 sec before fading
	}

	Merge(item) {
		return this.ATK_Upgrade(item, "Merge")
	}

	ATK_Upgrade(item, type = "Merge") {
		// "Merge" or "Upgrade" or "Downgrade"

		let newEvo = item.evolution + 1
		if (type === "Downgrade") newEvo = item.evolution - 1

		const nextNameEvo = Utils.GetNameEvo(item.name, newEvo)
		const nextEvoItem = this.runtime.dataInstances["Items"].get(nextNameEvo)
		if (!nextEvoItem) return false

		if (type === "Merge") {
			const sameItemInInv = this.items.find((i) => i !== item && i.nameEvo === item.nameEvo)
			if (!sameItemInInv) return false
			this.RemoveItem(sameItemInInv)
		}

		const itemIsInInv = this.items.find((i) => i === item)
		if (itemIsInInv) this.RemoveItem(item)
		this.AddItem(nextEvoItem, 1, true)

		if (type === "Merge") {
			this.ShowInfoBubble("InvBubble_Merged", "rgba(0, 128, 0, 0.8)")
			this.runtime.audio.PlaySound("Blacksmith")
			this.player.TriggerPlayerEvent("On_Merge")
			this.player.stats.Stat_Add("Merged", 1)
		} else if (type === "Upgrade") {
			this.ShowInfoBubble("InvBubble_Upgraded", "rgba(0, 128, 0, 0.8)")
			this.runtime.audio.PlaySound("Blacksmith")
		} else if (type === "Downgrade") {
			this.ShowInfoBubble("InvBubble_Downgraded", "rgba(128, 0, 0, 0.8)")
			this.runtime.audio.PlaySound("Fart_Transfo")
		}

		return true
	}

	CanMerge(item) {
		if (this.player.effects.GetBool("Cant_ATK_Upgrade")) return false
		const nextNameEvo = Utils.GetNameEvo(item.name, item.evolution + 1)
		const nextEvoItem = this.runtime.dataInstances["Items"].get(nextNameEvo)
		if (!nextEvoItem) return false
		return this.items.find((i) => i !== item && i.nameEvo === item.nameEvo)
	}

	Reset_ItemOffset() {
		this.addItemOffset = 0
		if (this.name === "Inventory_Upgrades") {
			this.addItemOffset = 1
		}
	}

	Reset() {
		this.items = []
		this.Reset_ItemOffset()

		this.Refresh()
	}

	SetSlotCount(count = null) {
		if (count !== null) this.slotCount = count
		if (this.slotCount === Infinity) this.info_Count.textContent = ""
		else this.info_Count.textContent = `(${this.items.length}/${this.slotCount})`
	}

	RemoveAllSynergies(item, evolution, quantityToRemove = 1) {
		const nameEvo = Utils.GetNameEvo(item, evolution)
		const itemToRemove = this.items.find((i) => i.nameEvo === nameEvo)
		if (!itemToRemove) return false
		this.RemoveItem(itemToRemove)
		return true
	}

	UpdateSynergies() {
		const inventoryWepsItems = this?.player?.inventoryWeps?.items

		if (!inventoryWepsItems) return

		let willUpdate = false

		const All_ATK_SynergiesAreMaxed = this.player.effects.GetBool("All_ATK_SynergiesAreMaxed")

		if (this.name === "Inventory_Weps") willUpdate = true
		if (this.name === "Inventory_Upgrades") willUpdate = true
		if (willUpdate) {
			//*
			const invInvisible = this.player.inventoryInvisible
			const synItems = invInvisible.items.filter((item) => item.itemType === "Synergy")
			for (const synItem of synItems) {
				invInvisible.RemoveItem(synItem)
			}

			//*Update Synergies
			this.player.synergies = {}
			const playerSyns = this.player.synergies
			for (const item of inventoryWepsItems) {
				if (item.Synergies) {
					for (const syn of item.Synergies) {
						if (!playerSyns[syn]) {
							playerSyns[syn] = {
								synAmount: 0,
							}
						}
						playerSyns[syn].synAmount++
					}
				}
			}

			const stat_synsLevel = this.player.stats.GetStatValue("SynsLevel")

			for (const synName of Object.keys(playerSyns)) {
				const syn = playerSyns[synName]

				if (this.player.effects.GetBool("All_ATK_Synergize")) {
					syn.synAmount = Math.max(syn.synAmount, this.items.length)
				}

				if (All_ATK_SynergiesAreMaxed) {
					syn.synAmount = 10
				}

				syn.synAmount += stat_synsLevel

				for (let i = 1; i <= syn.synAmount; i++) {
					invInvisible.AddItemByName("U_Syn_" + synName + "_" + i)
				}
			}
		}
	}

	UpdateStatValues() {
		if (this.name === "Inventory_Weps") {
			this.player.stats.SetStatValue("Empty_ATK_Slots", this.slotCount - this.items.length)

			this.player.stats.SetStatValue("Equipped_ATK", this.items.length)

			const uniqueNames = new Set(this.items.map((item) => item.name))
			this.player.stats.SetStatValue("Diff_ATK", uniqueNames.size)

			const uniqueSyns = new Set(this.items.flatMap((item) => item.Synergies))
			this.player.stats.SetStatValue("Diff_Synergies", uniqueSyns.size)

			//duplicate items
			// 1) Build a name → count map
			const duplicateCount_Map = this.items.reduce((map, item) => {
				const name = item.name
				map[name] = (map[name] || 0) + 1
				return map
			}, {})

			// 2) Sum (count – 1) for each name that appears more than once
			const duplicateCount = Object.values(duplicateCount_Map).reduce((sum, c) => sum + (c > 1 ? c - 1 : 0), 0)

			this.player.stats.SetStatValue("Same_ATK", duplicateCount)
		}

		if (this.name === "Inventory_Upgrades") {
			const actualItems = this.items.filter((item) => item.itemType === "Item")
			this.player.stats.SetStatValue("Equipped_Item", actualItems.length)

			const uniqueItems = actualItems.filter((item) => item.limitCount === 1)
			this.player.stats.SetStatValue("Equipped_ItemUnique", uniqueItems.length)
		}
	}

	async Refresh(init = false) {
		if (this.noHTML) return

		if (init) this.GenerateInventoryHTML()

		let filterItems = this.items

		this.SetSlotCount(null)

		this.UpdateStatValues()
		this.UpdateSynergies()

		if (this.hasFilters) {
			filterItems = this.items
				//! now based on Language
				//.filter((item) => item.nameEvo.toLowerCase().includes(this.filterName.toLowerCase()))
				.filter((item) => item.GetItemDisplayName().toLowerCase().includes(this.filterName.toLowerCase()))
				.filter((item) => {
					if (this.filterTags === "") return true // Show all items if no tag filter
					for (let tag of item.tags) {
						if (tag === undefined) {
							console.error("item with undefined tag", item)
							return false
						}
						if (Utils.Translate(tag).toLowerCase().includes(this.filterTags.toLowerCase())) {
							return true
							// Stop iteration and return true as soon as a match is found
						}
						/*
						if (tag.toLowerCase().includes(this.filterTags.toLowerCase())) {
							return true
							// Stop iteration and return true as soon as a match is found
						}*/
					}
					return false // No match found in tags
				})
		}

		const inventoryHtml = filterItems
			.map((item, index) => {
				return /*html*/ `
                <div class="itemBox" data-item-index="${index}" >
                    <img src="${item.img}" draggable="false" 
                        onerror="this.onerror=null; this.src='random_icon.png';">
                    <div class="itemQuantity"></div>
                </div>
            `
			})
			.join("")

		this.inventoryContent.innerHTML = inventoryHtml

		this.runtime.style.Elem_BoxStyle(this.inventoryContainer, "", 3)

		//only select items children of this.element

		this.itemBoxes = Array.from(this.element.querySelectorAll(".itemBox"))

		//const tooltip = document.querySelector(".tooltip")

		this.itemBoxes.forEach((item) => {
			const itemIndex = item.getAttribute("data-item-index")
			const itemClass = filterItems[itemIndex]

			const itemQuantity = item.querySelector(".itemQuantity")
			/*if (itemClass.itemType === "Weapon") {
				itemQuantity.textContent = "ATK"
			} else */

			if (itemClass.quantity > 1) {
				itemQuantity.style.display = "flex"
				itemQuantity.textContent = "x" + itemClass.quantity
			} else itemQuantity.style.display = "none"

			item.player = this.player

			const evolution = itemClass.evolution

			const key = "TIER_" + evolution
			//! REWORK UI
			//this.runtime.style.Elem_ItemStyle(item, key)

			this.runtime.style.Elem_ItemStyleFrame(item, evolution)

			Utils.Elem_FocusableOutline(item)

			//Utils.Elem_FocusableAngleAndScale(item)
			//Utils.Elem_FocusableAngle(item)

			// Click event for item
			item.addEventListener("sn:pressed", (e) => {
				this.ClickItem(itemClass, item)
			})

			item.addEventListener("contextmenu", (e) => {
				e.preventDefault()
			})

			item.addEventListener("sn:rightclick", (e) => {
				e.preventDefault()
				if (this.runtime.isCheating) {
					this.RemoveItem(item, "itembox")
					this.runtime.audio.PlaySound("UI_Click")
				}
			})

			item.itemClass = itemClass

			if (this.player) {
				//! todo: weapon special
				Utils.Elem_AddItemHoverTooltip(item, this.name)
			}
		})

		if (this.player?.shop) this.player.shop.RefreshShopDescriptions()
	}

	Focus(index) {
		if (index < 0 || index >= this.itemBoxes.length) {
			return false
		}
		const elem = this.itemBoxes[index]
		this.player.SN.focus(elem)
		return true
	}

	ClickItem(itemClass, itemBox = null) {
		//
	}

	RemoveItem(item, box = "") {
		const actualItem = box === "itembox" ? item.itemClass : item
		const index = this.items.indexOf(actualItem)
		if (index > -1) {
			this.items.splice(index, 1)
		}

		for (let i = 0; i < actualItem.quantity; i++) {
			actualItem.ItemRemove()
		}

		this.Refresh()
	}

	CanAddItem(item) {
		//
	}

	AddItemByName(itemName, evolution = 0, quantityToAdd = 1, forceAutorize = false) {
		const itemNameEvo = Utils.GetNameEvo(itemName, evolution)
		const item = this.runtime.dataInstances["Items"].get(itemNameEvo)
		if (!item) {
			if (itemNameEvo.includes("U_Syn_")) return
			console.error("Item not found", itemNameEvo)
			return
		} else {
			this.AddItem(item, quantityToAdd, forceAutorize)
		}
	}

	GetTagCount(tagsParam) {
		const tags = Utils.TagsParamToArray(tagsParam) // Use the TagsParamToArray function to parse the input
		if (tags.length === 0) return 0 // If there are no tags, return 0

		return this.items.filter(
			(item) => item.tags.some((tag) => tags.includes(tag)) // Check if any of the item's tags are in the list
		).length
	}

	//! forceAutorize is for Merge

	AddItem(item, quantityToAdd = 1, forceAutorize = true) {
		//* Upgradable
		if (item.upgradable) {
			const existingItem = this.items.find((i) => i.name === item.name)
			if (existingItem) {
				if (existingItem.evolution >= item.evolution) {
					//! you can only upgrade to higher tier
					this.ShowInfoBubble("InvBubble_Impossible", "rgba(128, 0, 0, 0.8)")
					//! sound it already played via false return
					//this.runtime.audio.PlaySound("UI_ClickFailBuzzer", 0.5)
					return false
				}

				this.RemoveItem(existingItem)
				const ret = this.AddItem(item, quantityToAdd)
				this.ShowInfoBubble("InvBubble_Upgraded", "rgba(0, 128, 0, 0.8)")
				this.runtime.audio.PlaySound("Blacksmith")
				//infoBubble Upgraded
				return ret
			}
		}

		//* Regular

		const existingItems = this.items.filter((i) => i.nameEvo === item.nameEvo)

		for (const existingItem of existingItems) {
			if (quantityToAdd <= 0) continue

			const maxToAdd = existingItem.limitCount - existingItem.quantity
			const quantity = Math.min(quantityToAdd, maxToAdd)
			quantityToAdd -= quantity

			existingItem.quantity += quantity

			for (let i = 0; i < quantity; i++) {
				existingItem.Apply()
			}
		}

		while (quantityToAdd > 0) {
			let canEquip = true
			let noEquip_Reason = ""

			//slot Count full
			if (!forceAutorize) {
				if (this.items.length >= this.slotCount) {
					canEquip = false
					noEquip_Reason = this.runtime.translation.Get("Info_ATK_Slots_Full")
					this.ShowInfoBubble("InvBubble_Full", "rgba(128, 0, 0, 0.8)")
				}

				//check Item Limit
				else if (this.name === "Inventory_Weps") {
					const canEquipRet = this.player.shop.Item_CanEquip(item, this)

					canEquip = canEquipRet[0]
					noEquip_Reason = canEquipRet[1]

					if (!canEquip) {
						//!debug only
						//this.ShowInfoBubble("InvBubble_Impossible", "rgba(0, 90, 128, 0.8)")
						this.ShowInfoBubble("InvBubble_Impossible", "rgba(128, 0, 0, 0.8)")
					}
				}
			}

			if (!canEquip) {
				if (this.CanMerge(item)) {
					this.Merge(item)
					this.Refresh()
					return true
				}
				//!todo: display info
				//this.ShowInfoBubble("InvBubble_Impossible", "rgba(4, 128, 0, 0.8)")
				this.Refresh()
				return false
			} else {
				//* NEW ITEM
				if (!canEquip) {
					window.alert("Impossibble to have cantequip here")
				}

				const newItem = new Item(this.runtime, this.player, item.name, item.evolution)

				newItem.inventory = this

				const maxToAdd = newItem.limitCount
				const quantity = Math.min(quantityToAdd, maxToAdd)
				newItem.quantity = quantity
				quantityToAdd -= quantity

				this.items.splice(this.addItemOffset, 0, newItem) // Insert at index 0 or offset

				for (let i = 0; i < quantity; i++) {
					newItem.Apply()
				}
			}
		}

		this.Refresh()
		return true
	}

	//* Test

	Get_ATK_Stat_ThisWave(stat) {
		let total = 0
		for (const item of this.items) {
			const wep = item.actualWep
			if (wep) {
				total += wep.Get_ATK_Stat_ThisWave(stat)
			}
		}
		return total
	}

	//Save/Load

	SavaAsJSON() {
		const items = this.items.map((item) => {
			return {
				name: item.name,
				evolution: item.evolution,
				quantity: item.quantity,
			}
		})

		return JSON.stringify(items)
	}

	LoadFromJSON(json) {
		const items = JSON.parse(json)

		this.items = items.map((item) => {
			const newItem = new Item(this.runtime, this.player, item.name, item.evolution)
			newItem.quantity = item.quantity
			return newItem
		})

		this.Refresh()
	}
}
