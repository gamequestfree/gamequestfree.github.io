export class Action_Heal extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)

		this.SetVars({
			Heal: "value",
		})

		this.translateKey = "Action_Heal"
	}

	OnAction() {
		this.player.unit.Heal(this.Heal)
	}
	GetInfo() {
		//console.error("Action_Heal", this)
		this.text = this.TranslateKey()
		this.ReplaceColor("DMG", this.Heal, "green")

		return this.text
	}
}
