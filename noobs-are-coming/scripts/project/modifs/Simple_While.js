C4.Modifs.Simple_While = class Simple_While extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)
		const itemManager = this.runtime.itemManager

		this.DataToEffects(effectData)

		this.name = effectName
		this.translateKey = this.name
		this.stackName = this.name
		this.triggerOnce = true
	}

	ActivateEffects() {
		super.ActivateEffects()
		//window.alert("ActivateEffects", this.name)
	}

	OnAdded() {
		//
	}

	OnRemoved() {
		//
	}

	GetInfo() {
		this.text = this.TranslateKey()
		this.text = this.Color("► " + this.text, "yellow")
		return this.text
	}
}
