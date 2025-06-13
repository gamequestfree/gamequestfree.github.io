export class Effect_SynergyCount extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)

		this.SetVars({
			Syn: 1,
			ValueX: "value",
		})

		if (item) {
			console.error("SynergyCount", item)
			item.Synergies.push(this.Syn)
		}
	}

	//For Every:
	/*HP_Missing, 
    coins, 
    free weapon slot, 
    steps you take during the wave*/

	OnAdded() {
		//
	}

	OnRemoved() {
		//
	}

	GetForEveryCount() {
		//
	}

	GetInfo() {
		console.error("Effect_Scaled", this)

		this.translateKey = "Effect_SynergyCount"

		this.text = this.TranslateKey()

		this.ReplaceColor("syn", this.Syn, "yellow")

		this.ReplaceColor("x", this.ValueX, "green")

		return this.text
	}
}
