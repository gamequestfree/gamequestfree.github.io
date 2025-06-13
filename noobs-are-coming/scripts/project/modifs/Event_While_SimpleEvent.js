C4.Modifs.Event_While_SimpleEvent = class Event_While_SimpleEvent extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)
		this.effectType = "Event"

		this.DataToEffects(effectData)

		this.name = effectName
		this.translateKey = this.name

		this.simpleEventData = this.runtime.itemManager.simpleEvents[this.name]

		this.stackName = this.name
	}

	OnAdded() {
		//this.rundata.AddEventListener(this.name, this)
	}

	OnRemoved() {
		//this.rundata.AddEventListener(this.name, this)
	}

	GetInfo() {
		this.text = this.TranslateKey()
		this.text = this.Color("► " + this.text, "yellow")
		return this.text
	}
}
