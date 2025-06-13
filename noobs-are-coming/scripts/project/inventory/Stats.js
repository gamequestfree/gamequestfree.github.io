import { EventDispatcher } from "../managers/EventDispatcher.js"

import * as FloatingUI from "../managers/Module_FloatingUI_DOM.js"

/* eslint-disable quotes */
export class Stats extends EventDispatcher {
	constructor(runtime, holder, isPlayer = false) {
		super(runtime)
		this.runtime = runtime
		this.holder = holder

		if (isPlayer) {
			this.player = holder
			this.unit = this.player.unit
			this.hasUI = true
			this.UI_generated = false
		} else {
			this.unit = holder
		}

		this.increment //useful?

		this.dataManager = this.runtime.dataManager

		this.stats = {}

		this.statsContaiers = {}

		this.primaryStats = [
			"Level",
			"HP_Max",
			"!sep",
			"Damage",
			"Damage_Strength",
			"Damage_Dex",
			"Damage_Arcane",
			"Damage_Elem",
			"Damage_Minions",
			"!sep",
			"Crit_Chance",
			"Cooldown",
			"Duration",
			"Amount",
			"Size",
			"Range",
			"!sep",
			"Speed",
			"Luck",
			"Harvest",
			"!sep",
			"Potion_Heal",
			"HP_Regen",
			"Life_Steal",
			"Dodge",
			"Armor",
		]

		//! TODO : dynamically populate this list (set visible/invisible)
		this.secondStats = [
			"XP_Gain",
			"Pickup_Range",
			"Knockback",
			"!sep",
			"SoulPortal",
			"Reroll",
			"Price_Rerolls",
			"Price_Items",
			"Price_Attacks",
			"Sell_Value",
			"!sep",
			"Bullet_BounceWall",
			"Bullet_BounceEnemy",
			"Bullet_Pierce",
			"!sep",
			"Enemy_Count",
			"Enemy_HP",
			"Enemy_Damage",
			"Enemy_Speed",
			"!sep",
			//"ThisWave_Crits",
			//"Empty_ATK_Slots",
		]

		this.LoadStats_Try()
	}

	Reset() {
		this.ClearEvents()
		this.stats = {}
		this.LoadStats_Try()
	}

	LoadStats_Try() {
		if (!this.dataManager.dataIsLoaded) {
			this.dataManager.dispatcher.addEventListener("dataLoaded", () => {
				this.LoadStats()
			})
		} else this.LoadStats()
	}

	LoadStats() {
		for (let [key, stat] of Object.entries(this.dataManager.statsData)) {
			this.AddStat(key, stat)
		}

		if (this.hasUI && !this.UI_generated) {
			this.HTML_GenerateStats()
		}

		this.AddStatListeners()
		this.RemapStatContainersEvent()
	}

	Stat_Pickup_Range() {
		const attraction = this.runtime.objects["CircleArea_Attraction"].getFirstInstance()
	}

	//*

	Stat_Color(statName, text, value, compareTo = 0) {
		const myStat = this.stats[statName]
		if (!myStat) return text
		else return myStat.GetColorBBCode(text, value, compareTo)
	}

	GetStatValueColored(statName, value, withPlus = false) {
		const myStat = this.stats[statName]
		value = Math.round(value)
		let valueText = value
		if (withPlus && value >= 0) valueText = "+" + value
		if (!myStat) {
			window.alert("GetStatValueColored: stat not found: " + statName)
			console.error("myStat", statName, myStat)
		}
		if (myStat.IsPercent) valueText = valueText + "%"
		return myStat.GetColorBBCode(valueText, value, 0)
	}

	AddStat(statName, statData) {
		this.stats[statName] = new Stat(this, statName, statData)
	}

	Stat_Add(statName, value, isPerma = true) {
		const myStat = this.stats[statName]
		if (myStat) {
			myStat.Stat_AddValue(value, isPerma)
		}
	}

	SetStatValue(statName, value) {
		const myStat = this.stats[statName]
		if (myStat) {
			myStat.SetValue(value)
			//console.error("🎃 SetStatValue", statName, myStat.GetDisplayValue())
		}
	}

	GetStat(statName) {
		return this.stats[statName]
	}

	GetStatValue(statName) {
		const myStat = this.stats[statName]
		if (myStat) {
			return myStat.Value_Processed
		}
	}

	ShowTabButtons(bool) {
		this.tabButtons.style.display = bool ? "flex" : "none"
	}

	HTML_GenerateStats() {
		this.UI_generated = true

		const tempElemParent = document.createElement("div")
		//! min width important for chinese and korean
		tempElemParent.innerHTML =
			/*html*/
			`
            <div id="statsTabs" style="
                border-radius: ${Utils.px(2)};
                color: white;
                min-width: ${Utils.px(70)};
                max-width: ${Utils.px(85)};
            ">
                <div id="tabButtons" class="horizontal justify_center" style="
                    margin: ${Utils.px(1)};
                    gap: ${Utils.px(1)};
                    position: relative;
                    z-index: 1;
                ">
                </div>
            </div>
        `

		this.element = tempElemParent.querySelector("#statsTabs")

		this.runtime.style.Elem_BoxStyle(this.element, "TIER_0", 5, {
			zIndex_BG: 0,
		})

		document.body.appendChild(this.element)

		this.tabButtons = this.element.querySelector("#tabButtons")
		this.runtime.menu.AddSettingsToElem(this.tabButtons, "", "", false, [
			{
				type: "button",
				label: "Primary",
				elemClass: "tablinks, tab_Primary",
				callback: () => {
					this.OpenTab("Primary")
				},
			},
			{
				type: "button",
				label: "Secondary",
				elemClass: "tablinks, tab_Secondary",
				callback: () => {
					this.OpenTab("Secondary")
				},
			},
		])

		this.primaryTab = document.createElement("div")
		this.primaryTab.id = "Primary"
		this.primaryTab.classList.add("tabcontent")
		this.primaryTab.style.display = "block"
		this.element.appendChild(this.primaryTab)

		this.secondTab = document.createElement("div")
		this.secondTab.id = "Secondary"
		this.secondTab.classList.add("tabcontent")
		this.secondTab.style.display = "none"
		this.element.appendChild(this.secondTab)

		this.primaryTab.style.padding = Utils.px(2)
		this.secondTab.style.padding = Utils.px(2)

		//stat Tooltip
		const tempElem = document.createElement("div")
		tempElem.innerHTML = /*html*/ `
            <div class="statTooltip" style="
            display: none;
            background-color: rgba(1, 1, 1, 0.91);
            border-radius: ${Utils.px(2)};
            border: ${Utils.px(0.5)} solid rgb(172, 172, 172);
            position: absolute;
            border-radius: ${Utils.px(3)};
            z-index: 500;
            max-width: ${Utils.px(100)};
            word-break: break-word;
			overflow-wrap: anywhere;
            ">
                <div class="vertical" style="margin: ${Utils.px(5)}">
                    <div class="statName" style="font-size: ${Utils.px(6)}; color:rgb(255, 238, 0);">
                    Stat</div>
                    <div class="statDesc" style="font-size: ${Utils.px(5)}">
                    0</div>
                </div>
            </div>
        `

		this.statTooltip = tempElem.querySelector(".statTooltip")
		this.element.appendChild(this.statTooltip)

		//add stats Containers
		for (let stat of this.primaryStats) {
			this.HTML_AddStatToTab(stat, this.primaryTab, true)
		}

		for (let stat of this.secondStats) {
			this.HTML_AddStatToTab(stat, this.secondTab, false)
		}

		this.RemapStatContainersEvent()

		this.OpenTab("Primary")

		this.TabsUpdateHeight()
		//! important to set display none after height is calculated
		this.element.style.display = "none"
	}

	TabsUpdateHeight() {
		this.primaryTab.style.height = Utils.px(200)
		this.secondTab.style.height = Utils.px(200)
		return

		// Preserve the original display styles
		const primaryDisplay = this.primaryTab.style.display
		const secondaryDisplay = this.secondTab.style.display

		// Temporarily force visibility without affecting layout
		this.primaryTab.style.visibility = "hidden"
		this.primaryTab.style.position = "absolute"
		this.primaryTab.style.display = "block"
		// Reset height to let the element determine its natural size
		this.primaryTab.style.height = "auto"

		this.secondTab.style.visibility = "hidden"
		this.secondTab.style.position = "absolute"
		this.secondTab.style.display = "block"
		// Reset height for the same reason
		this.secondTab.style.height = "auto"

		// Measure heights of both tabs
		const primaryHeight = this.primaryTab.scrollHeight
		const secondaryHeight = this.secondTab.scrollHeight

		// Determine the maximum height
		const maxHeight = Math.max(primaryHeight, secondaryHeight)

		const scale = Utils.HTML_C3Scale()
		const maxHeightInPxUnits = maxHeight / scale

		// Apply the maximum height to both tabs
		this.primaryTab.style.height = Utils.px(maxHeightInPxUnits)
		this.secondTab.style.height = Utils.px(maxHeightInPxUnits)

		// Restore original styles
		this.primaryTab.style.visibility = ""
		this.primaryTab.style.position = ""
		this.primaryTab.style.display = primaryDisplay

		this.secondTab.style.visibility = ""
		this.secondTab.style.position = ""
		this.secondTab.style.display = secondaryDisplay
	}

	OpenTab(tabName) {
		this.TabsUpdateHeight()

		this.statTooltip.style.display = "none"

		// Hide all tab content
		let tabcontent = this.element.querySelectorAll(".tabcontent")
		for (let i = 0; i < tabcontent.length; i++) {
			tabcontent[i].style.display = "none"
		}

		let tablinks = this.element.querySelectorAll(".tablinks")
		for (let i = 0; i < tablinks.length; i++) {
			tablinks[i].className = tablinks[i].className.replace(" active", "")
			tablinks[i].style.outline = ""
		}

		// Show the current tab, and add an "active" class to the button that opened the tab
		this.element.querySelector(`#${tabName}`).style.display = "block"

		const buttonClass = ".tab_" + tabName
		const tabButton = this.element.querySelector(buttonClass)
		tabButton.className += " active"
		tabButton.style.outline = `${Utils.px(2)} solid #464646`
		//evt.currentTarget.className += " active"
	}

	Stat_Update(myStat) {
		this.runtime.progress.CheckMissionStat(myStat)

		const e = new C3.Event(myStat.Name, true)
		e.myStat = myStat
		this.dispatchEvent(e)
	}

	AddStatListeners() {
		this.addEventListener("Pickup_Range", (e) => {
			if (!this.player) return
			const myStat = e.myStat
			this.player.circlePickup.setSize(myStat.Value_Processed * 100, myStat.Value_Processed * 100)
		})

		this.addEventListener("Souls", (e) => {
			if (!this.player) return
			this.player.UpdateCoins()
		})

		this.addEventListener("Orbit_Speed", (e) => {
			if (!this.player) return
			const orbit = this.player?.unit?.orbitWep

			if (orbit) {
				orbit.SetSpeed(e.myStat.Value_Processed)
			}
		})

		this.addEventListener("ATK_Slot", (e) => {
			if (!this.player) return
			const myStat = e.myStat
			this.player.inventoryWeps.SetSlotCount(myStat.Value_Processed)
		})

		this.addEventListener("Reroll", (e) => {
			if (!this.player) return
			const myStat = e.myStat

			this.player.shop.freeReroll += myStat.lastIncrement
			this.player.shop.GetRerollPrice()
		})

		this.addEventListener("Damage_All", (e) => {
			if (!this.player) return
			const increment = e.myStat.lastIncrement

			this.Stat_Add("Damage_Strength", increment, true)
			this.Stat_Add("Damage_Dex", increment, true)
			this.Stat_Add("Damage_Arcane", increment, true)
			this.Stat_Add("Damage_Elem", increment, true)
			this.Stat_Add("Damage_Minions", increment, true)
		})

		this.addEventListener("HP_Max", (e) => {
			if (!this.player) return
			const myStat = e.myStat
			const healthComp = this.player?.unit?.healthComp
			if (!healthComp) return
			healthComp.setMax(myStat.Value_Processed)
		})

		this.addEventListener("Price_Rerolls", (e) => {
			if (!this.player) return
			this.player.shop.GetRerollPrice()
		})

		this.addEventListener("Price_Attacks", (e) => {
			if (!this.player) return
			this.player.shop.SetItemPrices()
		})

		this.addEventListener("Price_Items", (e) => {
			if (!this.player) return
			this.player.shop.SetItemPrices()
		})

		this.addEventListener("HP_Regen", (e) => {
			if (!this.player) return

			const HP_Regen = this.GetStatValue("HP_Regen")

			if (HP_Regen > 0) {
				if (!this.player.unit.timerComp.Timer_Get("HP_Regen")) {
					this.player.HP_Regen_Trigger(true)
				}
			} else {
				this.player.unit.timerComp.Timer_Stop("HP_Regen")
			}
		})

		this.addEventListener("Neck_Length", (e) => {
			const Neck_Length = this.GetStatValue("Neck_Length")

			if (this.player.playableName === "Longnek") {
				const pileComp = this.player.unit.pileComp
				pileComp.Pile_Parts_Min = Neck_Length
				pileComp.Attachements_Update()
			}
		})

		//! no need
		/*
		this.addEventListener("Sell_Value", (e) => {
			if (!this.player) return
            this.player.tooltip
			//this.player.shop.UpdateSellValue()
		})*/
	}

	//* ===== SPECIAL DESC ==============================

	//*Regen

	GetSpecialDesc_HP_Regen() {
		const HP_Regen = this.GetStatValue("HP_Regen")
		let text = ""
		if (HP_Regen > 0) {
			text = this.runtime.translation.Get("STAT_HP_Regen_Desc")
			text = text.replace("{0}", "[color=#00ff00]" + 1 + "[/color]")
			text = text.replace("{1}", "[color=#00ff00]" + this.Stat_Regen_IntervalPerHP().toFixed(2) + "[/color]")
			text = text.replace("{2}", "[color=#00ff00]" + this.Stat_Regen_HPPerSec().toFixed(2) + "[/color]")
		} else {
			text = this.runtime.translation.Get("STAT_HP_Regen_Desc_0")
		}
		return text
	}

	Stat_Regen_IntervalPerHP() {
		const HP_Regen = this.GetStatValue("HP_Regen")
		return 5 / (1 + (HP_Regen - 1) / 2.25)
	}

	Stat_Regen_HPPerSec() {
		return 1 / this.Stat_Regen_IntervalPerHP()
	}
	//* ===============================================================

	HTML_AddStatToTab(stat, tab, icon = false) {
		if (stat === "!sep") {
			Utils.Elem_AddSeparator(tab)
			return
		}

		const myStat = this.GetStat(stat)
		if (!myStat) return

		//window.alert("Stat added")

		const statContainer = document.createElement("div")
		statContainer.classList.add("statContainer", "flex", "justify_between", "items_center")

		tab.appendChild(statContainer)

		const focus = async () => {
			this.statTooltip.style.display = "flex"

			const statName = this.statTooltip.querySelector(".statName")
			const statDesc = this.statTooltip.querySelector(".statDesc")

			this.runtime.translation.Elem_SetTranslateKey_ToHTML(statName, "STAT_" + stat)

			const myStatObj = this.GetStat(stat)
			const statValue = myStatObj.GetDisplayValue()

			let text = ""

			if (myStatObj.SpecialTooltip) {
				text = this["GetSpecialDesc_" + stat]()
			} else {
				if (statValue >= 0 && this.runtime.translation.HasKey("STAT_" + stat + "_+")) {
					this.runtime.translation.Elem_SetTranslateKey_ToHTML(statDesc, "STAT_" + stat + "_+")
				} else if (statValue < 0 && this.runtime.translation.HasKey("STAT_" + stat + "_-")) {
					this.runtime.translation.Elem_SetTranslateKey_ToHTML(statDesc, "STAT_" + stat + "_-")
				} else if (statValue === 0 && this.runtime.translation.HasKey("STAT_" + stat + "_0")) {
					this.runtime.translation.Elem_SetTranslateKey_ToHTML(statDesc, "STAT_" + stat + "_0")
				} else if (this.runtime.translation.HasKey("STAT_" + stat + "_Desc")) {
					this.runtime.translation.Elem_SetTranslateKey_ToHTML(statDesc, "STAT_" + stat + "_Desc")
				} else {
					this.runtime.translation.Elem_SetTranslateKey_ToHTML(statDesc, "No_Description")
				}

				text = statDesc.textContent.replace("{0}", myStatObj.GetColorBBCode_Current(myStatObj.GetDisplayValue_Text(true)))
			}

			if (myStatObj.HasMin) {
				let addTr = this.runtime.translation.Get("StatDesc_Min")
				let minDisplay = myStatObj.DisplayActualValue ? myStatObj.Min : myStatObj.Min - myStatObj.Start
				if (myStatObj.IsPercent) minDisplay += "%"
				addTr = addTr.replace("{min}", minDisplay)
				text += " " + addTr
			}

			if (myStatObj.HasMax) {
				let addTr = this.runtime.translation.Get("StatDesc_Max")
				let maxDisplay = myStatObj.DisplayActualValue ? myStatObj.Max : myStatObj.Max - myStatObj.Start
				if (myStatObj.IsPercent) maxDisplay += "%"
				addTr = addTr.replace("{max}", maxDisplay)
				text += " " + addTr
			}

			/*
			if (stat === "Damage") {
				text = text.replace("{1}", 0)
			}*/

			text = Utils.parseBBCode(text)
			statDesc.innerHTML = text

			//this.statTooltip.style.display = "block"

			await Utils.Elem_FloatingUI(statContainer, this.statTooltip, null, {
				placement: "top",
				middleware: [FloatingUI.offset(10), FloatingUI.flip(), FloatingUI.shift()],
			})
		}

		const unfocus = () => {
			this.statTooltip.style.display = "none"
		}

		Utils.Elem_Focusable(statContainer, focus, unfocus, false)
		Utils.Elem_FocusableOutline(statContainer)

		//ease singleplayer shop navigation

		if (this.player.playerIndex === 0) {
			statContainer.move_left = () => {
				if (this.runtime.menu.CurMenuName() === "shopMenu") {
					return this.player.shop.MoveToShopItem("left")
				}
				return null
			}

			statContainer.move_right = () => {
				if (this.runtime.menu.CurMenuName() === "shopMenu") {
					return this.player.shop.MoveToShopItem("right")
				}
				return null
			}
		}

		const statNameAndImg = document.createElement("div")
		statNameAndImg.classList.add("horizontal", "items_center")

		//add icon if needed

		const statImgUrl = this.runtime.dataManager.statsData[stat].Img

		if (statImgUrl) {
			const statImg = document.createElement("img")
			statImg.src = statImgUrl
			//if src error, use default image
			statImg.onerror = () => {
				statImg.src = "random_icon.png"
			}
			statImg.style.height = "1em"
			statImg.style.marginRight = Utils.px(3)
			statNameAndImg.appendChild(statImg)
		}

		//add statName
		const statName = document.createElement("span")
		statName.classList.add("statName")

		this.runtime.translation.Elem_SetTranslateKey(statName, "STAT_" + stat)
		statNameAndImg.appendChild(statName)

		//add percent symbol if needed

		if (myStat.IsPercent) {
			const percentText = document.createElement("span")
			percentText.innerText = "%"
			percentText.style.fontSize = Utils.px(3)
			percentText.style.marginLeft = Utils.px(1)
			percentText.style.color = "#bdbdbd"
			statNameAndImg.appendChild(percentText)
		}

		//add statValue
		const statValue = document.createElement("span")
		statValue.classList.add("statValue", "noBreak")
		statValue.style.marginLeft = Utils.px(5)

		statContainer.appendChild(statNameAndImg)
		statContainer.appendChild(statValue)

		//add stat Container
		this.statsContaiers[stat] = {
			statContainer: statContainer,
			statValue: statValue,
		}
	}

	RemapStatContainersEvent() {
		for (let [stat, data] of Object.entries(this.statsContaiers)) {
			const myStat = this.GetStat(stat)

			const update = (myStat) => {
				data.statValue.innerText = myStat.GetDisplayValueWithLimit(true)
				//if (myStat.IsPercent) statValue.innerText += "%"
				data.statContainer.style.color = myStat.GetColor_Current()
			}
			update(myStat)

			this.addEventListener(stat, (event) => {
				//console.error("Stat_Update", event)
				update(event.myStat)
			})
		}
	}
}

class Stat {
	constructor(stats, statName, statData) {
		this.Stats = stats
		this.runtime = stats.runtime
		this.Name = statName
		this.Value = 0
		this.Value_previous = 0
		this.Value_actual = 0

		this.Value_override = 0

		this.Start = 0
		//this.Max = 0
		//this.Min = 0
		this.IsPercent = false
		this.IsMalus = false
		this.DisplayActualValue = false
		this.Modifs_Perma = 0
		this.Modifs_Temp = 0
		this.Multiplier = 1

		this.DisplayLimit = "Max"

		this.lastIncrement = 0

		this.ScaledModifs = new Set()

		this.ScaledBonus = {}

		this.Init(statData)
	}

	get Value_Processed() {
		const value = Math.round(this.Value)
		return this.IsPercent ? value / 100 : value
	}

	GetDisplayValue() {
		return this.DisplayActualValue ? this.Value : this.Value - this.Start
	}

	GetDisplayValue_Text(RemoveMinus = false) {
		let text = this.DisplayActualValue ? this.Value : this.Value - this.Start
		if (RemoveMinus && text < 0) text = -text
		if (this.IsPercent) text += "%"
		return text
	}

	GetDisplayValueWithLimit() {
		let displayValue = this.DisplayActualValue ? this.Value_actual : this.Value_actual - this.Start

		let displayText = displayValue

		if (this.Value_actual > this.Max) {
			let maxDisplay = this.DisplayActualValue ? this.Max : this.Max - this.Start
			//displayText = `${maxDisplay} (${displayValue})`
			displayText = ` ${displayValue}|${maxDisplay}`
		} else if (this.Value_actual < this.Min) {
			let minDisplay = this.DisplayActualValue ? this.Min : this.Min - this.Start
			//displayValue = `${minDisplay} (${displayValue})`
			displayText = ` ${displayValue}|${minDisplay}`
		}

		return displayText
	}

	//! old: show limite sometimes directly
	GetDisplayValueWithLimit_Old() {
		let displayValue = this.GetDisplayValue()

		if (this.HasMax && this.DisplayLimit === "Max") {
			let maxDisplay = this.DisplayActualValue ? this.Max : this.Max - this.Start
			displayValue += " | " + maxDisplay
		} else if (this.HasMin && this.DisplayLimit === "Min") {
			let minDisplay = this.DisplayActualValue ? this.Min : this.Min - this.Start
			displayValue += " | " + minDisplay
		}

		return displayValue
	}

	/*
	GetDisplayValueColor() {
		return this.GetColored(this.GetDisplayValue(), this.Value, this.Start)
	}*/

	GetColor_Current() {
		let color = this.GetColor(this.Value_actual, this.Start) || "white"
		return color
	}

	GetColorBBCode_Current(text) {
		const getColor = this.GetColor(this.Value, this.Start)
		if (!getColor) return text
		return "[color=" + getColor + "]" + text + "[/color]"
	}

	GetColor(value, compareTo = 0) {
		let color = 0

		if (this.Color) return this.Color

		if (value === compareTo) color = 0
		else if (value > compareTo) color = 1
		else if (value < compareTo) color = -1

		if (this.IsMalus) {
			color *= -1
			//debug Cooldown
			/*if (value !== 100) {
				window.alert("Malus " + this.Name + " " + value + " " + compareTo)
			}*/
		}

		if (color === 0) return null
		else if (color === 1) return "#00ff00"
		else if (color === -1) return "#ff0000"
	}

	GetColorBBCode(text, value, compareTo = 0) {
		const getColor = this.GetColor(value, compareTo)
		if (!getColor) return text
		return "[color=" + getColor + "]" + text + "[/color]"
	}

	Init(statData) {
		for (let [key, value] of Object.entries(statData)) {
			this[key] = value
		}

		//percent
		if (this.Start && typeof this.Start === "string" && this.Start.includes("%")) {
			const startValue = parseFloat(this.Start.replace("%", ""))
			if (isNaN(startValue)) {
				console.error("Stat", statName, "Invalid start value for stat: ", this.Start)
				return
			}
			this.Start = startValue
			this.IsPercent = true
		}

		if (this.Max && typeof this.Max === "string" && this.Max.includes("%")) {
			const maxValue = parseFloat(this.Max.replace("%", ""))
			if (isNaN(maxValue)) {
				console.error("Stat", statName, "Invalid max value for stat: ", this.Max)
				return
			}
			this.Max = maxValue
		}

		if (this.Min && typeof this.Min === "string" && this.Min.includes("%")) {
			const minValue = parseFloat(this.Min.replace("%", ""))
			if (isNaN(minValue)) {
				console.error("Stat", statName, "Invalid min value for stat: ", this.Min)
				return
			}
			this.Min = minValue
		}

		if (this.Max !== undefined && this.Max !== null) {
			this.HasMax = true
		}

		if (this.Min !== undefined && this.Min !== null) {
			this.HasMin = true
		}

		if (!this.Start) {
			this.Start = 0
		}

		//just to remember the default Start
		this.InitStart = this.Start

		this.Value = 0
		this.Value_previous = 0
		this.Multiplier = 1

		this.Stat_UpdateValue()
	}

	Stat_AddValue(value, isPerma = true) {
		if (isPerma) this.Modifs_Perma += value
		else this.Modifs_Temp += value

		this.Stat_UpdateValue()
	}

	Stat_UpdateValue() {
		this.Value_previous = this.Value

		this.Value_actual = this.Start + this.Multiplier * (this.Modifs_Perma + this.Modifs_Temp)

		//bonus from other stats
		//! careful for now, scaled bonus aren't affected by multiplier
		//console.error("this.ScaledBonus", this.ScaledBonus, this)
		for (const bonus of Object.values(this.ScaledBonus)) {
			this.Value_actual += bonus
		}

		this.Value_actual = Math.round(this.Value_actual)

		this.Value = this.Value_actual
		if (this.HasMax) this.Value = Math.min(this.Value, this.Max)
		if (this.HasMin) this.Value = Math.max(this.Value, this.Min)

		this.lastIncrement = this.Value - this.Value_previous

		// bonus to other stats (looping through Effects)
		//first reset all scaled bonus

		//!avoid infinite loops
		if (!this.isUpdating) {
			this.isUpdating = true
			for (let modif of this.ScaledModifs) {
				const ScaledStat = this.Stats.GetStat(modif.Stat_To)
				ScaledStat.ScaledBonus[this.Name] = 0
			}

			for (let modif of this.ScaledModifs) {
				const ScaledStat = this.Stats.GetStat(modif.Stat_To)

				const count = Utils.Floor(this.GetDisplayValue() / modif.ForEach)

				modif.currentBonus = count * modif.Value_Give

				if (modif.Max) {
					const MaxAbs = Math.abs(modif.Max)
					if (modif.currentBonus > 0) {
						modif.MaxSign = MaxAbs
						modif.currentBonus = Math.min(modif.currentBonus, modif.MaxSign)
					} else if (modif.currentBonus < 0) {
						modif.MaxSign = MaxAbs * -1
						modif.currentBonus = Math.max(modif.currentBonus, modif.MaxSign)
					}
				}

				ScaledStat.ScaledBonus[this.Name] += modif.currentBonus

				console.error("ScaledStat", modif.Stat_To, ScaledStat.ScaledBonus[this.Name])

				ScaledStat.Stat_UpdateValue()
			}
		}

		this.Stats.Stat_Update(this)

		this.isUpdating = false
	}

	ChangeBase(value) {
		this.Start = value
		this.Stat_UpdateValue()
	}

	SetValue(value) {
		this.Start = 0
		this.Modifs_Perma = value
		this.Modifs_Temp = 0
		this.Stat_UpdateValue()
	}

	SetMax(max, override = false, overrideWhat = "Start") {
		if (override) {
			this.Start = max
		}

		this.Max = max
		this.HasMax = true
		this.Stat_UpdateValue()
	}
}
