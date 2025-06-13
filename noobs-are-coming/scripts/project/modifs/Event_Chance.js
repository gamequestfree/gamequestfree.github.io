const colors = {
	chanceBase: "#40E0D0",
	chanceBonus: "#298F85",
}

export class Event_Chance extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)
		this.effectType = "Event"

		/*const data = effectName.split("|")
		if (data.length != 2) {
			console.error("Event_Chance: invalid data:", effectName, "It should be in the format: Chance|50")
		}*/

		this.SetVars({
			chanceBase: 1,
			"?StatName": 2,
			"?StatValue": 3,
		})

		//chanceBase to number
		this.chanceBase = parseFloat(this.chanceBase)

		this.Value = effectData

		this.StatBonuses = []
		if (this.StatName && this.StatValue) {
			this.StatBonuses.push({ stat: this.StatName, value: this.StatValue })
		}

		this.DataToEffects(effectData)

		this.fakeParent = true
	}

	Validate(effectName, effectData) {}

	OnAdded() {
		const willTrigger = Math.random() * 100 < this.GetChance_Value()
		if (willTrigger) {
			//window.alert("Event_Chance: OnAdded")
			this.ActivateEffects()
		}
	}

	OnRemoved() {
		//
	}

	GetChance_Value() {
		let chanceValue = this.chanceBase

		for (const bonus of this.StatBonuses) {
			const statName = bonus.stat
			const statValue = this.GetStatValue(statName)
			if (statValue) {
				let chanceBonus = statValue * bonus.value
				if (!this.StatIsPercent(statName)) chanceBonus = chanceBonus / 100
				chanceValue += chanceBonus

				console.error("Event_Chance: ChanceBonus", this, statName, statValue, chanceBonus, chanceValue)
			}
		}

		chanceValue = Math.round(chanceValue)
		chanceValue = Math.min(100, chanceValue)
		chanceValue = Math.max(0, chanceValue)

		return chanceValue
	}

	GetInfo() {
		const chanceCurrent = this.GetChance_Value()

		let chanceText = this.Translate("CHANCE").replace("{0}", chanceCurrent)

		let text = `[color=${colors.chanceBase}]► ${chanceText}[/color]`

		if (this.StatBonuses.length > 0) {
			text += ` [color=${colors.chanceBonus}][` + this.chanceBase + "[/c]"
			text += `[color=${colors.chanceBonus}]`
			for (const bonus of this.StatBonuses) {
				const value = bonus.value
				//text += ""
				text += value > 0 ? "+" + value : value
				text += "%"
				//text += ""
				text += Utils.GetStatImg(bonus.stat)
			}
			text += "[/c]"
			text += `[color=${colors.chanceBonus}]][/c]`
		}

		return text
	}
}
