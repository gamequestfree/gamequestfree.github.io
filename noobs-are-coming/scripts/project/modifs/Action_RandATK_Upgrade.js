export class Action_RandATK extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)

		this.SetVars({
			ActualFX: 1,
		})

		if (this.ActualFX === "Upgrade") {
			this.translateKey = "Action_RandATK_Upgrade"
		}
		if (this.ActualFX === "Downgrade") {
			this.translateKey = "Action_RandATK_Downgrade"
		}
	}

	OnAction() {
		const inventoryWeps = this.item.player.inventoryWeps
		let attacks = inventoryWeps.items

		if (this.ActualFX === "Upgrade") {
			attacks = attacks.filter((item) => !item.isEvoMax)
		}
		if (this.ActualFX === "Downgrade") {
			attacks = attacks.filter((item) => !item.isEvoMin)
		}

		const randAttack = Utils.Array_Random(attacks)
		if (randAttack) {
			if (this.ActualFX === "Upgrade") {
				inventoryWeps.ATK_Upgrade(randAttack, "Upgrade")
			}
			if (this.ActualFX === "Downgrade") {
				inventoryWeps.ATK_Upgrade(randAttack, "Downgrade")
			}
		}
	}
	GetInfo() {
		//console.error("Action_Heal", this)
		this.text = this.TranslateKey()

		if (this.ActualFX === "Downgrade") {
			this.text = `[c=${this.runtime.colorsText.Effect_Neg}]` + this.text + "[/c]"
		}

		return this.text
	}
}
