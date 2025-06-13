C4.Item_Effect = class Item_Effect {
	constructor(item, effectName, effectData, parent) {
		this.name = this.constructor.name

		this.parent = parent

		this.effectType = ""
		this.item = item
		this.runtime = item.runtime
		this.globalEvents = this.runtime.events

		this.text = ""

		this.effectName = effectName
		this.effectData = effectData

		this.translateKey = this.name

		this.stackCount = 1

		this.activateEffects = this.ActivateEffects.bind(this)
		this.desactivateEffects = this.DesactivateEffects.bind(this)
		this.active = false

		this.activations_total = 0
		this.activations_current = 0

		this.stackName = ""

		this.triggerOnce = false
		this.fakeParent = false
	}

	get player() {
		return this.item.player || this.item.tempPlayer
	}

	get stats() {
		return this.item.player.stats
	}

	get events() {
		return this.item.player.events
	}

	IsPermanent() {
		let parent = this.parent
		if (!parent) return true
		if (parent.triggerOnce) return false
		return true
	}

	/*
	IsPermanent() {
		let parent = this.parent
		if (!parent) return true
		console.error("parent", parent)
		while (!parent && parent.fakeParent) {
			parent = parent.parent
		}
		if (parent.triggerOnce) return false
		return true
	}*/

	StatIsPercent(stat) {
		return this.stats.GetStat(stat)?.IsPercent
	}

	SetVars(vars) {
		this.Vars = vars
		const nameData = this.effectName.split("|")

		if (this.Vars) {
			for (let [key, value] of Object.entries(this.Vars)) {
				if (key.startsWith("?")) {
					key = key.replace("?", "")
				}
				if (value === "") {
					this[key] = this.effectData[key]
				}
				if (value === "value") {
					this[key] = this.effectData
				}
				if (typeof value === "number") {
					this[key] = nameData[value]
				}
			}
		}
	}

	Error(error) {
		console.error(this.name + ": " + error)
	}

	ErrorFormat() {
		console.error(this.name + ": invalid data: " + effectName)
		console.error("It should be in the format:")
	}

	OnAdded_() {
		//console.error("👿", "OnEffectAdded", this.name, this)
		if (this.effectType === "Event") {
			//
		}
		this.player.effects.PlayerStack_Add(this.stackName, this)

		this.activations_current++

		this.activations_total++

		this.OnAction()
		this.OnAdded()
		this.OnAddRemove(true)
	}
	OnRemoved_() {
		this.player.effects.PlayerStack_Remove(this.stackName, this)

		for (let i = 0; i < this.activations_current; i++) {
			this.OnRemoved()
			this.OnAddRemove(false)
		}

		this.activations_current = 0
	}

	GetStack() {
		this.player.effects.GetStack(this.stackName)
	}

	GetStackCount() {
		this.player.effects.GetStackCount(this.stackName)
	}

	UpdateStack() {}

	OnAddRemove(bool) {}

	OnAdded() {}
	OnRemoved() {}

	OnAction() {
		//
	}

	AjustKey(key, value) {
		if (typeof value === "number") key = key.toString()
		//make sure to remove all { and }
		else key = key.replace(/[{}]/g, "")

		key = "{" + key + "}"
		if (value === "") key = " " + key
		return key
	}

	ReplaceColor(key, value, color = null) {
		if (!color) {
			this.Replace(key, value)
		} else {
			if (color === "green") color = "#00FF00"
			else if (color === "red") color = "#FF0000"
			else if (color === "blue") color = "#0000FF"
			key = this.AjustKey(key, value)
			this.text = this.text.replace(key, this.Color(value, color))
		}
	}

	Replace(key, value) {
		key = this.AjustKey(key, value)
		this.text = this.text.replace(key, value)
	}

	Color(text, color) {
		if (text === "") return ""
		return "[c=" + color + "]" + text + "[/c]"
	}

	GetKind(kind) {
		let text = this.item.GetTagsLoc(kind)
		return text
	}

	GetItem(item) {
		item = item.replace(/_/g, " ")
		let text = this.Translate(item)
		text = this.Color(text, "yellow")
		return text
	}

	GetItemImg(item) {
		item = item.replace(/ /g, "_")
		const itemNameEvo = Utils.GetNameEvo(item, 0)
		const itemInst = this.runtime.dataInstances["Items"].get(itemNameEvo)
		if (!itemInst) {
			window.alert("Item not found: " + itemNameEvo)
			return ""
		}
		return /*html*/ `<img src="${itemInst.img}" style="max-width: 1em; max-height: 1em; vertical-align: middle;"/>`
	}

	GetTagsLoc(...args) {
		let text = this.item.GetTagsLoc(...args)
		text = this.Color(text, "yellow")
		return text
	}

	GetForEveryCount() {
		return 0
	}

	GetForEveryCountText() {
		const count = this.GetForEveryCount()
		let text = "[" + count + "]"
		text = this.Color(text, "yellow")
		return text
	}

	TranslateKey() {
		return this.Translate(this.translateKey)
	}

	Translate(key) {
		return this.runtime.translation.Get(key)
	}

	TranslateStat(key, suffix = "") {
		if (suffix && this.runtime.translation.HasKey("STAT_" + key + suffix)) {
			return this.runtime.translation.Get("STAT_" + key + suffix)
		}
		if (this.runtime.translation.HasKey("STAT_" + key + "_LONG")) {
			return this.runtime.translation.Get("STAT_" + key + "_LONG")
		}
		return this.runtime.translation.Get("STAT_" + key)
	}

	DataToEffects(effectsData) {
		this.runtime.itemManager.DataToEffects(this, effectsData, true)
	}

	GetStatValue(stat) {
		return this.player.stats.GetStatValue(stat) || 0
	}

	/*
    GetInfo_(tooltip) {

		const div = document.createElement("div")
		div.innerHTML = text
		tooltip.appendChild(div)
	}*/

	GetHTMLInfo(tooltip) {
		if (this.isSeparator) {
			Utils.Elem_AddSeparator(tooltip)
			return
		}

		const htmlString = this.GetEffectInfo()

		if (!htmlString) return

		const ul = document.createElement("ul") // Create the main unordered list
		const li = document.createElement("li") // Create the main effect's list item
		ul.appendChild(li)
		tooltip.appendChild(ul)

		li.innerHTML = htmlString

		// Append the main effect's list item to the unordered list

		// If there are nested effects, recursively process them
		if (this.effects && this.effects.length > 0) {
			const nestedUl = document.createElement("ul") // Create a nested <ul> for child effects
			this.effects.forEach((nestedEffect) => {
				if (nestedEffect.isSeparator) {
					Utils.Elem_AddSeparator(nestedUl)
					return
				}
				nestedUl.appendChild(nestedEffect.GetNestedEffectHTML()) // Recursively add child effects
			})
			li.appendChild(nestedUl) // Append the nested <ul> to the current effect's <li>
		}
	}

	GetAffectedUnit() {
		return this.runtime.getUnitByUID(this.player.UID_AffectedUnit)

		/*
		if (this.UID_AffectedUnit) return this.runtime.getUnitByUID(this.UID_AffectedUnit)
		if (this.parent) return this.parent.GetAffectedUnit()
		return null*/
	}

	GetInfo() {
		this.text = this.TranslateKey()
		return this.text
	}

	GetEffectInfo() {
		let text = this.GetInfo()
		if (!text) return null
		text = Utils.parseBBCode(text)

		return text
	}

	// Helper function to recursively generate nested <li> for nested effects
	GetNestedEffectHTML() {
		const htmlString = this.GetEffectInfo()
		if (!htmlString) return

		const li = document.createElement("li")

		li.innerHTML = htmlString

		// If there are nested effects, recursively process them
		if (this.effects && this.effects.length > 0) {
			const nestedUl = document.createElement("ul") // Create a nested <ul> for child effects
			this.effects.forEach((nestedEffect) => {
				if (nestedEffect.isSeparator) {
					Utils.Elem_AddSeparator(nestedUl)
					return
				}
				nestedUl.appendChild(nestedEffect.GetNestedEffectHTML()) // Recursively add child effects
			})
			li.appendChild(nestedUl) // Append the nested <ul> to the current effect's <li>
		}

		return li // Return the <li> element for this nested effect
	}

	//*EVENTS ONLY

	ActivateEffects() {
		if (this.triggerOnce) {
			if (this.active) return
			this.active = true
		}
		for (const effect of this.effects) {
			//! it takes quantity into account
			for (let i = 0; i < this.item.quantity; i++) {
				effect.OnAdded_()
			}
			//effect.OnAdded_()
		}
	}

	DesactivateEffects() {
		if (this.triggerOnce) {
			if (!this.active) return
			this.active = false
		}
		for (const effect of this.effects) {
			//! on removed handles the quantity
			effect.OnRemoved_()
		}
	}

	//

	ProcessNumber(value) {
		const evo = this.item.evolution
		return Utils.ProcessEvoNumber(value, evo)
	}
}
