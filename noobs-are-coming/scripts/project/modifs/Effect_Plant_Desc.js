export class Effect_Plant_Desc extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)
	}

	OnAdded() {
		//
	}

	OnRemoved() {
		//
	}

	GetInfo() {
		//Effect_Plant
		//Desc Autoget (gray)

		this.text = `[c=orange]${this.Translate("Plant")}:[/c] ${this.Translate("Effect_Plant_Desc")}`

		let waterAtks = this.item?.player?.inventoryWeps?.items?.filter((item) => item.Synergies.includes("Water"))
		if (waterAtks && waterAtks.length === 0) {
			let watercanLine = `[br][c=gray]${this.Translate("Effect_Autoget")}[/c]`
			watercanLine = watercanLine.replace("{item}", this.Translate("Watercan"))

			this.text += watercanLine
		}

		return this.text
	}
}
