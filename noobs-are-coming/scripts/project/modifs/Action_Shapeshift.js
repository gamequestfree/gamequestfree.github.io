//!revertable ?

export class Action_Shapeshift extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)

		this.Damage = effectData.Damage
	}

	OnAdded() {
		//
	}

	OnRemoved() {
		//
	}

	GetInfo() {
		let text = "► Heal: " + this.Damage

		return text
	}
}
