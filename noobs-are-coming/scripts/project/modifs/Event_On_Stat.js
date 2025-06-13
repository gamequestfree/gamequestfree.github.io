//!TODO displayed value

export default class Event_On_Stat extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)
		this.effectType = "Event"

		this.DataToEffects(effectData)

		this.SetVars({
			Stat: 1,
			Value: 2,
		})

		this.triggerOnce = true

		this.activateEffects_withCheck = this.ActivateEffects_WithCheck.bind(this)
	}

	ActivateEffects_WithCheck(e) {
		const myStat = e.myStat
		if (myStat.Value >= this.Value) {
			this.ActivateEffects()
		}
	}

	OnAdded() {
		this.events.addEventListener(this.Stat, this.activateEffects_withCheck)
	}

	OnRemoved() {
		this.events.removeEventListener(this.Stat, this.activateEffects_withCheck)
	}

	//this.events.addEventListener(this.name, () => window.alert("Simple_On: OnAdded " + this.name))

	GetInfo() {
		this.text = this.TranslateKey()
		this.text = this.Color("► " + this.text, "yellow")

		let valueText = this.Value > 0 ? "+" + this.Value : this.Value
		valueText = this.StatIsPercent(this.Stat) ? valueText + "%" : valueText
		valueText = this.player.stats.Stat_Color(this.Stat, valueText, this.Value)
		valueText = valueText + " " + this.TranslateStat(this.Stat)

		this.Replace("0", valueText)
		return this.text
	}
}
