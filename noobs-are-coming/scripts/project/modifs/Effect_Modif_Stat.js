export class Effect_Modif_Stat extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)

		//Modif_Stat|Damage_Dex: 50
		const data = effectName.split("|")

		if (data.length != 2) {
			console.error("Effect_Scaled: invalid data:", effectName, "It should be in the format: Modif_Stat|Damage_Dex: 50")
		}

		this.Stat = data[1]
		this.ModifPercent = effectData
	}

	OnAddRemove(bool) {
		let modifPercent = bool ? this.ModifPercent : -this.ModifPercent
		modifPercent = modifPercent / 100

		const myStat = this.player.stats.GetStat(this.Stat)
		myStat.Multiplier += modifPercent
		myStat.Stat_UpdateValue()
	}

	GetInfo() {
		this.text = this.ModifPercent >= 0 ? this.Translate("Effect_Modif_Stat_Bonus") : this.Translate("Effect_Modif_Stat_Malus")
		let statText = this.TranslateStat(this.Stat)
		statText = this.ModifPercent > 0 ? "[c=#00FF00]" + statText + "[/c]" : "[c=#FF0000]" + statText + "[/c]"
		let modifText = Math.abs(this.ModifPercent) + "%"
		modifText = this.ModifPercent > 0 ? "[c=#00FF00]" + modifText + "[/c]" : "[c=#FF0000]" + modifText + "[/c]"
		this.Replace("0", statText)
		this.Replace("1", modifText)

		return this.text
	}
}
