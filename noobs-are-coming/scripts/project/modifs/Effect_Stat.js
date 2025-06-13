export default class Effect_Stat extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)

		const data = effectName.split("|")
		if (data.length != 2) {
			console.error("Effect_Stat: invalid data:", effectName, "It should be in the format: Stat|Armor")
		}

		this.Stat = data[1]

		this.Value = this.ProcessNumber(effectData)

		if (typeof this.Value === "string") {
			const valueSplit = this.Value.split("|")
			this.Value = parseInt(valueSplit[0])
			if (valueSplit.length > 1) {
				this.GainMax = parseInt(valueSplit[1])
			}
		}

		this.Value > 0 ? this.item.AddTags("+" + this.Stat) : this.item.AddTags("-" + this.Stat)

		this.gained = 0
	}

	HasMaxGain() {
		if (this.GainMax > 0 && this.gained >= this.GainMax) return true
		if (this.GainMax < 0 && this.gained <= this.GainMax) return true
		return false
	}

	OnAdded() {
		if (this.HasMaxGain()) return
		this.player.stats.Stat_Add(this.Stat, this.Value, this.IsPermanent())
		this.PopInfo(this.Value)
	}

	OnRemoved() {
		this.player.stats.Stat_Add(this.Stat, -this.Value, this.IsPermanent())
		this.PopInfo(-this.Value)
	}

	IsPermanentButGained() {
		if (!this.parent) return false
		if (!this.IsPermanent()) return false
		return true
	}

	PopInfo(value) {
		if (value === 0) return false
		if (!this.IsPermanentButGained()) return

		this.gained += value

		let color = ""

		if (value > 0) {
			this.runtime.audio.PlaySound("StatGained")
		}
		if (value < 0) {
			color = "red"
		}

		/*window.alert("Pop")*/

		this.runtime.pointburst.CreatePointBurst_Icon(value, this.player.inst.x, this.player.inst.y - 50, color, this.Stat)
	}

	GetInfo() {
		//!careful russian & portuguese

		this.text = ""

		/*let valueText = this.Value > 0 ? "+" + this.Value : this.Value
		valueText = this.StatIsPercent(this.Stat) ? valueText + "%" : valueText
		valueText = this.player.stats.Stat_Color(this.Stat, valueText, this.Value)*/

		let valueText = this.player.stats.GetStatValueColored(this.Stat, this.Value, true)

		this.text = valueText + " " + this.TranslateStat(this.Stat)

		if (this.item.itemType !== "Synergy" && Utils.HasStatImg(this.Stat)) {
			this.text += " " + Utils.GetStatImg(this.Stat)
		}

		if (this.IsPermanentButGained()) {
			if (this.gained !== 0) {
				let gainedText = " " + this.Translate("Gained")
				gainedText = this.Color(gainedText, "gray")

				this.text += gainedText
				let gainedColor = this.gained > 0 ? "green" : "red"
				let gainedValue = this.gained > 0 ? "+" + this.gained : this.gained
				//this.Replace("gained", gainedValue)
				this.ReplaceColor("gained", gainedValue, gainedColor)
			}

			if (this.GainMax) {
				let maxText = " " + this.Translate("StatDesc_Max")
				maxText = this.Color(maxText, "gray")
				this.text += maxText
				this.Replace("max", this.GainMax)
			}
		}

		//!todo
		/*
		if (!this.StatData?.Description) {
			text = valueText + " " + this.TranslateStat(this.Stat)
		} else if (this.StatData.Description === "Special") {
			text = this.TranslateStat(this.Stat).replace("{0}", valueText)
		}*/

		return this.text
	}
}
