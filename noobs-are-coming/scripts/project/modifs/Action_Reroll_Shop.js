export class Action_Reroll_Shop extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)
	}

	OnAction() {
		const shop = this.player.shop

		shop.service.lockedIndex.clear()
		shop.service.locked_items = []

		const lockedIcons = shop.elemMulti.querySelectorAll(".lockedIcon")
		for (const icon of lockedIcons) {
			icon.syle.display = "none"
		}

		this.runtime.audio.PlaySound("Reroll")

		shop.Shop_Fill_Items()
	}

	GetInfo() {
		this.text = this.Translate("Action_Reroll_Shop")
		return this.text
	}
}
