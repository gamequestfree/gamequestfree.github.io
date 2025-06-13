export class Action_ThisATK_Destroyed extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)
	}

	/*GetWepUnit() {
		return this.runtime.getUnitByUID(this.item.wepUID)
	}*/

	OnAction() {
		const inventory = this.item.inventory
		if (inventory) {
			this.item.inventory.RemoveItem(this.item)
			this.runtime.audio.PlaySound("Weapon_Broken")
		}
	}

	GetInfo() {
		this.translateKey = "Action_ThisATK_Destroyed"
		this.text = this.TranslateKey()
		return this.text
	}
}
