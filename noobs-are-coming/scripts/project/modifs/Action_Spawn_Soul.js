export class Action_Spawn_Soul extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)

		this.SetVars({
			Count: "value",
		})

		if (!this.Count) {
			this.Count = 1
		}

		this.gained = 0
	}

	OnAdded() {
		for (let i = 0; i < this.Count; i++) {
			this.runtime.spawnManager.SpawnCoin(this.player.inst.x, this.player.inst.y)

			this.gained++
		}
	}

	GetInfo() {
		this.translateKey = "Action_Spawn"
		this.text = this.TranslateKey()

		this.ReplaceColor("0", this.Count, "green")

		let key = this.Count > 1 ? "Souls" : "Soul"
		key = this.runtime.translation.Get(key)

		this.Replace("1", key)

		if (this.gained !== 0) {
			let gainedText = " " + this.Translate("Gained")
			gainedText = this.Color(gainedText, "gray")

			this.text += gainedText
			let gainedColor = this.gained > 0 ? "green" : "red"
			let gainedValue = this.gained > 0 ? "+" + this.gained : this.gained
			//this.Replace("gained", gainedValue)
			this.ReplaceColor("gained", gainedValue, gainedColor)
		}

		return this.text
	}
}
