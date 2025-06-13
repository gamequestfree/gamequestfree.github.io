export class Event_ATK_Every_X extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)

		this._format = "ATK_Every_X|Kill|50|ThisWave:"

		this.SetVars({
			Type: 1,
			Every: 2,
			"?Mode": 3,
		})

		this.DataToEffects(effectData)

		this.wave_WhenLastIncrement = 0
		this.everyCount = 0
	}

	//! logic in Weapon.ATK_Stat() function

	IncrementCount(x) {
		//window.alert("Event_ATK_Every_X: IncrementCount" + x)

		const debugEffect = this.effects[0]
		if (debugEffect) {
			if (!debugEffect.parent) {
				window.alert("IsRoot")
			}
			if (!debugEffect.IsPermanent()) {
				window.alert("!IsPermanent")
			}
		}

		if (this.Mode === "ThisWave") {
			const wave = this.runtime.waveManager.waveCount
			if (wave !== this.wave_WhenLastIncrement) {
				this.everyCount = 0
				this.wave_WhenLastIncrement = wave
			}
		}

		this.everyCount += x

		if (this.everyCount >= this.Every) {
			this.everyCount -= this.Every
			this.ActivateEffects()
		}
	}

	GetInfo() {
		let translateKey = "ATK_Every_X_"
		if (this.Mode === "ThisWave") translateKey += "ThisWave"

		this.text = this.Translate(translateKey + this.Type)
		this.Replace("0", this.Every)
		this.text = this.Color("► " + this.text, "yellow")
		return this.text
	}
}
