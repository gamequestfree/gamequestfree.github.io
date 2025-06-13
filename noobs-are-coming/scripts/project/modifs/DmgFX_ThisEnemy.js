export class DmgFX_ThisEnemy extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)

		this.Damage = this.item.CreateDamage()
		this.Damage.SetDamageFromData({
			DmgEffects: effectData,
			No_Damage: true,
			No_Stat_Trigger: true,
		})
	}

	OnAction() {
		const unit = this.GetAffectedUnit()
		//console.error("DmgFX_ThisEnemy", unit)
		if (unit) {
			//window.alert("Effect_DmgFX_ThisEnemy")
			this.Damage.DealDamage(unit)
		}
	}

	GetInfo() {
		this.text = ""

		const dmgEffects = Object.entries(this.Damage.damageEffects)

		if (dmgEffects.length === 0) {
			return this.text
		}

		if (dmgEffects.length === 1) {
			this.text += this.Translate("Effect_DmgFX_ThisEnemy")
		} else {
			this.text += this.Translate("Effect_DmgFX_ThisEnemy|Plural")
		}

		this.text += "<br>"

		this.Damage.DamageEffects_GetText(this, this.player)

		return this.text
	}
}
