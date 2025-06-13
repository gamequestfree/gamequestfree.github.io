export class Effect_Type_Mod extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)

		//Type_Mod|Fire|Damage: 200
		//Type_Mod|Minion|Cooldown: 200
		//Type_Mod|Medical|ATK_Speed: 200
		//Type_Mod|Trap|ATK_Speed: 200
		//! Structures too ?

		this.SetVars({
			tag: 1,
			Stat: 2,
			Value: "value",
		})

		this.stackName = "Type_Mod"

		this.allTags = [this.tag]
	}

	UpdateStack() {
		if (this.player) {
			this.player.effects.Update_Type_Mod()
		}
	}

	GetInfo() {
		this.text = this.Translate("Effect_Type_Mod")

		const statData = this.stats.GetStat(this.Stat)

		if (!statData) {
			return ""
		}

		let valueText = this.Value > 0 ? "+" + this.Value : this.Value
		valueText = this.StatIsPercent(this.Stat) ? valueText + "%" : valueText
		valueText = this.player.stats.Stat_Color(this.Stat, valueText, this.Value)
		valueText = valueText + " " + this.TranslateStat(this.Stat)

		this.Replace("0", valueText)

		this.Replace("tag", this.GetTagsLoc(this.tag))

		return this.text
	}
}
