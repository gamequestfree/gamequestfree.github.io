export class Action_DestroyAllAttacks extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)
	}

	OnAction() {
		const wepItems = [...this.player.inventoryWeps.items]

		for (const wepItem of wepItems) {
			this.player.inventoryWeps.RemoveItem(wepItem)
		}
	}

	GetInfo() {
		this.text = this.Translate("Action_DestroyAllAttacks")
		return this.text
	}
}
