export default class Event_During extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)

		this.SetVars({
			Duration: 1,
		})

		this.timer = this.Duration

		this.active = false

		this.triggerOnce = true

		this.DataToEffects(effectData)

		this.stackName = "During"
	}

	Tick() {
		//console.error("During tick", this.timer)
		this.timer -= this.runtime.dt
		if (this.timer <= 0) {
			this.OnRemoved_()
		}
	}

	OnAdded() {
		this.timer = this.Duration

		this.ActivateEffects()
	}

	OnRemoved() {
		this.DesactivateEffects()
	}

	GetInfo() {
		this.text = this.Translate("Event_During")
		this.text = this.Color("↺ " + this.text, "yellow")
		this.Replace("0", this.Duration)

		return this.text
	}
}
