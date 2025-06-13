C4.Modifs.Simple_On_HitData = class Simple_On_HitData extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)
		this.effectType = "Event"

		this.DataToEffects(effectData)

		this.name = effectName
		this.translateKey = this.name
	}

	OnAdded() {
		this.events.addEventListener(this.name, this.activateEffects)
	}

	OnRemoved() {
		this.events.removeEventListener(this.name, this.activateEffects)
	}

	//this.events.addEventListener(this.name, () => window.alert("Simple_On: OnAdded " + this.name))

	GetInfo() {
		this.text = this.TranslateKey()
		this.text = this.Color("► " + this.text, "yellow")
		return this.text
	}
}
