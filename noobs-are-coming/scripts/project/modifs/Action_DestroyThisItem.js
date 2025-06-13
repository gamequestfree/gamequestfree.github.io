//!revertable ?

export class Action_DestroyThisItem extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)
	}

	OnAdded() {
		//
	}

	GetInfo() {
		this.text = this.TranslateKey()
		return this.text
	}
}
