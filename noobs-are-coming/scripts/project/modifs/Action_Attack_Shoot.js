export class Action_Attack_Shoot extends C4.Item_Effect {
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
		this.text = this.TranslateKey("Attack_Shoot")
		return this.text
	}
}
