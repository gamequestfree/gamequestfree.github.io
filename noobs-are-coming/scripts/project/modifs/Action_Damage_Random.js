export class Action_Damage_Random extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)

		this.Damage = new C4.Damage(this.runtime)
		this.Damage.SetDamageFromData(effectData.Damage)

		this.SetVars({})
	}

	OnAction() {
		//
	}

	GetInfo() {
		this.text = "► " + this.Translate("Action_Damage_Random_1")

		if (this.AtkType === "Apply") {
			this.text += " " + this.Translate("Target_" + this.Target)
		} else if (this.AtkType === "Shoot") {
			this.Replace("0", this.Count)
			this.text += "<br>" + this.Translate("INFO_Direction") + ": " + this.Translate("Direction_" + this.Direction)
		}

		//this.Damage.GetDamage_Info()

		return this.text
	}
}
