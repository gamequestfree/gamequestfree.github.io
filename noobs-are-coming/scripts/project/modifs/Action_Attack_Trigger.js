export class Action_Attack_Trigger extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)

		this.WepID = effectData
	}

	GetWepUnit() {
		return this.runtime.getUnitByUID(this.item.wepUID)
	}

	OnAction() {
		const wepUnit = this.GetWepUnit()
		if (wepUnit) {
			wepUnit.Shoot()
		}
	}

	GetInfo() {
		//const wepUnit = this.GetWepUnit()
		//this.text = wepUnit.GetWepInfo()
		this.translateKey = "Action_Attack_Trigger"
		this.text = this.TranslateKey()
		return this.text
	}
}
