export class Effect_Scaled extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)

		this.SetVars({
			Value_Give: 1,
			Stat_To: 2,
			ForEach: 3,
			Stat_From: 4,
			"?Max": 5,
			Type: "value",
		})

		this.currentBonus = 0
	}

	//For Every:
	/*HP_Missing, 
    coins, 
    free weapon slot, 
    steps you take during the wave*/

	OnAddRemove(bool) {
		const myStatFrom = this.player.stats.GetStat(this.Stat_From)

		if (bool) {
			myStatFrom.ScaledModifs.add(this)
		} else {
			myStatFrom.ScaledModifs.delete(this)
		}

		myStatFrom.Stat_UpdateValue()
	}

	GetForEveryCount() {
		//
	}

	GetInfo() {
		//console.error("Effect_Scaled", this)

		this.translateKey = "Effect_Scaled"
		if (this.Type === "Long") this.translateKey = "Effect_Scaled_Long"
		if (this.Type === "Permanent") this.translateKey = "Effect_Scaled_Permanent"

		this.text = this.TranslateKey()

		let valueGiveTxt = this.Value_Give > 0 ? "+" + this.Value_Give : this.Value_Give
		valueGiveTxt = this.StatIsPercent(this.Stat_To) ? valueGiveTxt + "%" : valueGiveTxt
		valueGiveTxt = valueGiveTxt + " " + this.TranslateStat(this.Stat_To, "_Short")
		valueGiveTxt = this.player.stats.Stat_Color(this.Stat_To, valueGiveTxt, this.Value_Give)

		if (this.item.itemType !== "Synergy" && Utils.HasStatImg(this.Stat_To)) {
			valueGiveTxt = valueGiveTxt + " " + Utils.GetStatImg(this.Stat_To)
		}

		this.Replace("0", valueGiveTxt)

		//no "+"
		let forEachText = this.ForEach
		forEachText = this.StatIsPercent(this.Stat_From) ? forEachText + "%" : forEachText
		forEachText = forEachText + " " + this.TranslateStat(this.Stat_From, "_Short")
		forEachText = this.player.stats.Stat_Color(this.Stat_From, forEachText, this.ForEach)

		if (this.item.itemType !== "Synergy" && Utils.HasStatImg(this.Stat_From)) {
			forEachText = forEachText + " " + Utils.GetStatImg(this.Stat_From)
		}

		this.Replace("1", forEachText)

		if (this.currentBonus === 0) {
			this.Replace("x", "")
		} else {
			let currentBonusText = this.currentBonus > 0 ? "+" + this.currentBonus : this.currentBonus
			currentBonusText = this.StatIsPercent(this.Stat_To) ? currentBonusText + "%" : currentBonusText
			//set number color
			currentBonusText = this.player.stats.Stat_Color(this.Stat_To, currentBonusText, this.currentBonus)

			currentBonusText = currentBonusText + " " + this.TranslateStat(this.Stat_To)

			currentBonusText = "(" + currentBonusText + ")"

			this.ReplaceColor("x", currentBonusText, "gray")
		}

		if (this.Max) {
			let maxNumber = this.MaxSign || this.Max

			//let maxKey = maxNumber >= 0 ? "Max" : "Min"

			let maxText = ` [c=gray]${this.Translate("Max")}[/c]`.replace("{0}", maxNumber)
			this.text += maxText
		}

		return this.text
	}
}
