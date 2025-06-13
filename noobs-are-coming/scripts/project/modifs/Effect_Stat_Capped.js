export default class Effect_Stat_Capped extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)

		this.SetVars({
			Stat: 1,
			"?Override": 2,
			Value: "value",
		})

		//this.Value = this.ProcessNumber(this.Value)

		this.item.AddTags(this.Stat + "_Neg")
	}

	OnAdded() {
		const statObj = this.player.stats.GetStat(this.Stat)

		if (this.Value === "Current") {
			const currentValue = this.player.stats.GetStatValue(this.Stat)
			this.Value = currentValue
		}

		let override = false
		let override_what = ""

		if (this.Override === "Override") {
			override = true
		}

		statObj.SetMax(this.Value, override, override_what)
	}

	OnRemoved() {
		//! Too
	}

	//! the effect dynamically changes its string when equipped and current is defined

	GetInfo() {
		this.translateKey = "Effect_Stat_Capped"
		if (this.Value === "Current") {
			this.translateKey = "Effect_Stat_Capped_Current"
		}
		this.text = this.TranslateKey()

		this.ReplaceColor("0", this.TranslateStat(this.Stat), "yellow")

		//current value
		this.ReplaceColor("x", this.Value, "red")

		//actual cap value
		this.ReplaceColor("1", this.Value, "red")

		return this.text
	}
}
