export class Action_Attack_Explode extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)

		this.SetVars({})

		this.TargetTags = effectData.TargetTags
		this.ExplodeRange = effectData.ExplodeRange
		this.ExplodeRange_Stat = effectData.ExplodeRange_Stat

		if (effectData.DAMAGE) {
			this.Damage = this.item.CreateDamage(effectData.DAMAGE)
			//! todo store references to item to display damage dealt?
		}
	}

	get unit() {
		return this.item.player.unit
	}

	OnAction() {
		console.error("Action_Attack OnAction", this)

		const targetTags = this.TargetTags || ["Enemy"]
		const charas = this.runtime.units.GetUnitsByTags(targetTags, "Chara")

		let range = this.ExplodeRange
		if (this.ExplodeRange_Stat) range += this.item.player.stats.GetStatValue("Range")

		const x = this.unit.x
		const y = this.unit.bboxMidY

		const targets = Utils.GetInCircle(charas, x, y, range, false)

		for (let target of targets) {
			this.Damage.DealDamage(target)
		}

		const explosionVisu = this.runtime.objects["FX_Explosion"].createInstance("FX_Ahead", x, y)
		explosionVisu.setSize(range, range)

		this.runtime.audio.PlaySound("Explosion_Big")

		this.runtime.camera.Screenshake({
			Mag: 1,
		})
	}

	GetInfo() {
		this.text = this.Translate("Action_Attack_Explode")
		this.Replace("DMG", this.Damage.GetDamage_Info(this.player))

		return this.text
	}
}
