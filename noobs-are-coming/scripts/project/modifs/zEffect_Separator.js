C4.Modifs.Effect_Separator = class Effect_Separator extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)
		const itemManager = this.runtime.itemManager

		this.isSeparator = true
	}

	OnAdded() {
		//
	}

	OnRemoved() {
		//
	}
}
