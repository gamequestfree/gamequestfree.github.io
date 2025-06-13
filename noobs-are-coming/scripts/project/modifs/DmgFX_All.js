export class DmgFX_All extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)
	}

	GetInfo() {
		//
		this.text = ""
		const bulletDataInst = this.item.wepDataInst.BulletDataInst
		const Damage = bulletDataInst.Damage

		//console.error("DmgFX_All bulletDataInst", bulletDataInst)

		Damage.DamageEffects_GetText(this, this.player)

		return this.text
	}
}
