export class Action_DestroyRandomAttack extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)
	}

	OnAction() {
		const wepItems = [...this.player.inventoryWeps.items]
		if (wepItems.length === 0) return

		//pick a random autowep
		const randomIndex = Math.floor(Math.random() * wepItems.length)
		const wepItem = wepItems[randomIndex]

		this.player.inventoryWeps.RemoveItem(wepItem)
	}

	GetInfo() {
		this.text = this.Translate("Action_DestroyRandomAttack")
		return this.text
	}
}
