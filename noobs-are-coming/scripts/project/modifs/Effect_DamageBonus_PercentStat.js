export class Effect_DamageBonus_PercentStat extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)

		this.SetVars({
			Percent: "value",
			Stat: 1,
		})

		this.stackName = "DamageBonus_PercentStat"
	}

	GetInfo() {
		this.translateKey = "Effect_DamageBonus_PercentStat"

		this.text = this.TranslateKey()

		const statName = this.TranslateStat(this.Stat)

		this.ReplaceColor("0", this.Percent + "% " + statName, "green")

		return this.text
	}
}
