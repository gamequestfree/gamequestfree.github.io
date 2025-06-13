/*
MaxDamagePerHit
*/

export default class Effect_Stat_Set extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)

		this.SetVars({
			Stat: 1,
			Value: "value",
		})
	}

	OnAdded() {
		const statObj = this.player.stats.GetStat(this.Stat)

		statObj.SetValue(this.Value)
	}

	OnRemoved() {
		//! Too
	}

	//! the effect dynamically changes its string when equipped and current is defined

	GetInfo() {
		this.translateKey = "Effect_Stat_Set"
		const statObj = this.player.stats.GetStat(this.Stat)

		if (statObj.Desc_Set) {
			this.translateKey = "STAT_" + this.Stat + "_Set"
		}
		this.text = this.TranslateKey()

		this.ReplaceColor("stat", this.TranslateStat(this.Stat), "yellow")

		let color = statObj.GetColor(this.Value, this.Start)

		this.ReplaceColor("x", this.Value, color)
		this.ReplaceColor("1", this.Value, color)

		return this.text
	}
}
