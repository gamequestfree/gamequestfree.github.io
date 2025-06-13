export class Action_OverboyChoose extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)

		this.SetVars({
			Desc: 1,
			Value: "value",
		})
	}

	OnAction() {
		if (typeof this.Value !== "number") {
			this.Value = -1
		}
		this.player.shopStats.overboyChoice.push(this.Value)
	}

	GetInfo() {
		if (typeof this.Value !== "number") {
			this.Value = -1
		}
		this.translateKey = "Action_OverboyChoose"

		if (this.Desc === "Long") {
			this.translateKey = "Action_OverboyChoose_Long"
		}

		if (this.Value > 0) {
			this.translateKey = "Action_OverboyChoose_X"
		}

		this.text = this.TranslateKey()

		console.error("OverboyChoose", this.Value), this

		this.ReplaceColor("x", this.Value, "green")

		return this.text
	}
}
