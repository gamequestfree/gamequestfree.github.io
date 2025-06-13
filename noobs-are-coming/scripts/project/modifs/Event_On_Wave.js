export default class Event_On_Wave extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)
		this.effectType = "Event"

		this.DataToEffects(effectData)

		this.SetVars({
			Wave: 1,
			Type: 2,
		})

		this.WaveParam = this.Wave
		this.Wave_Init()
	}

	Wave_Init() {
		if (this.isWaveNowFixed) return

		if (this.WaveParam === "Next") {
			this.Wave = this.runtime.waveManager.waveCount + 1
		}

		if (this.Type === "At") {
			this.name = "On_Wave_Start_" + this.Wave
			this.translateKey = "On_Wave_At_X"
		}
		if (this.Type === "Start") {
			this.name = "On_Wave_Start_" + this.Wave
			this.translateKey = "On_Wave_Start_X"
		}
		if (this.Type === "End") {
			this.name = "On_Wave_End_" + this.Wave
			this.translateKey = "On_Wave_End_X"
		}
	}

	OnAdded() {
		this.Wave_Init()
		this.isWaveNowFixed = true
		this.events.addEventListener(this.name, this.activateEffects)
	}

	OnRemoved() {
		this.events.removeEventListener(this.name, this.activateEffects)
	}

	//this.events.addEventListener(this.name, () => window.alert("Simple_On: OnAdded " + this.name))

	GetInfo() {
		this.Wave_Init()
		this.text = this.TranslateKey()
		this.text = this.Color("► " + this.text, "yellow")
		this.Replace("x", this.Wave)
		return this.text
	}
}
