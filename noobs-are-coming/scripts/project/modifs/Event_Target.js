export class Event_Target extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)
		this.DataToEffects(effectData)
	}

	//"Target|Enemy|Random": 0

	OnAdded() {
		//
	}

	OnRemoved() {
		//
	}

	GetInfo() {
		let text = "[color=pink]" + "► Target: " + "Random Enemy" + "[/color]"

		return text
	}
}
