export default class Event_Every_Seconds extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)

		this.SetVars({
			Every: 1,
		})

		this.timer = this.Every

		this.DataToEffects(effectData)

		this.stackName = "Every_Seconds"
	}

	/*OnAdded() {
		window.alert("Event_Every_Seconds.OnAdded()")
	}*/

	Tick() {
		this.timer -= this.runtime.dt

		if (this.timer <= 0) {
			this.timer = this.Every
			this.ActivateEffects()
		}
	}

	Reset() {
		this.timer = this.Every
	}

	GetInfo() {
		this.text = this.Every === 1 ? this.Translate("Event_Every_Second") : this.Translate("Event_Every_Second_X")
		this.Replace("0", this.Every)
		this.text = this.Color("► " + this.text, "yellow")

		return this.text
	}
}
