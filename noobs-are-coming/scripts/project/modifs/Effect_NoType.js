export class Effect_For_Every extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)

		const data = effectName.split("|")
	}

	OnAdded() {
		//
	}

	OnRemoved() {
		//
	}

	GetInfo() {
		return "placeholder"
	}
}
