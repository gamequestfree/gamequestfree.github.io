export class Action_Attack extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)

		this.AtkType = effectData.AtkType

		//Apply
		this.Target = effectData.TARGET

		this.Direction = effectData.Direction
		this.Count = effectData.Count

		this.TrKey = effectData.TrKey

		this.SetVars({})

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

		const targets = this.GetTarget()
		//*Shoot
		if (this.AtkType === "Shoot") {
			this.Shoot_Spread(this.unit.x, this.unit.y, angle)
		}
		//*Apply
		else if (this.AtkType === "Apply") {
			console.error("Action_Attack", this.Damage)
			for (let target of targets) {
				this.Damage.DealDamage(target)
			}
		}
	}

	GetTarget() {
		if (!this.Target) return null

		const targetTags = this.Target.TargetTags || ["Enemy"]
		const charas = this.runtime.units.GetUnitsByTags(targetTags, "Chara")

		const TargetMode = this.Target.TargetMode || "Random"
		let TargetCount = this.Target.TargetCount || 1

		let targets = []

		if (TargetMode === "Random") {
			targets = Utils.Array_Random(charas, TargetCount)
		} else if (TargetMode === "Within") {
			const charasInRange = Utils.GetInCircle(charas, this.unit.x, this.unit.y, this.TARGET.Range, false)
			targets = Utils.Array_Random(charasInRange, TargetCount)
		} else if (TargetMode === "Beyond") {
			const charasInRange = Utils.GetInCircle(charas, this.unit.x, this.unit.y, this.TARGET.Range, true)
			targets = Utils.Array_Random(charasInRange, TargetCount)
		} else if (TargetMode === "Closest") {
			const charaSorted = Utils.SortByDistance(charas, this.unit.x, this.unit.y)
			if (TargetCount === -1) {
				targets = charaSorted
			} else {
				if (typeof TargetCount === "string" && TargetCount.includes("%")) {
					let percentage = parseFloat(x) / 100
					TargetCount = Math.round(charas.length * percentage)
				}

				targets = charaSorted.slice(0, TargetCount)
			}
		}
		if (!Array.isArray(targets)) targets = [targets]
		return targets
	}

	GetInfo() {
		//! Force TrKey

		if (this.TrKey) {
			this.text = "► " + this.Translate(this.TrKey)

			this.Replace("DMG", this.Damage.GetDamage_Info(this.player))
			this.Replace("x", this?.Target?.TargetCount)
		}

		//! ELSE procedural description
		else {
			this.text = "► " + this.Translate("Action_Attack_" + this.AtkType)

			if (this.AtkType === "Apply") {
				this.text += " " + this.Translate("Target_" + this.Target)
			} else if (this.AtkType === "Shoot") {
				this.Replace("0", this.Count)
				this.text += "<br>" + this.Translate("INFO_Direction") + ": " + this.Translate("Direction_" + this.Direction)
			}
		}

		//this.Damage.GetDamage_Info()

		return this.text
	}

	//* Shoot Logic (shared with Abi_Projectile)

	Shoot_Spread(x, y, angle_base, bulletType = "") {
		//do this in JS round(random(Sub_Bullet.Bullet_Count_, Sub_Bullet.Bullet_Count_Max_))

		let Bullet_Count = this.Bullet_Count
		let Bullet_AccuracyOffset = this.Bullet_AccuracyOffset
		let Bullet_Spray = this.Bullet_Spray
		let Random_Spread = this.Random_Spread

		//TODO subbullet
		//if subbullet, override
		if (bulletType !== "") {
			//
		}

		if (Bullet_Count <= 1) {
			this.Bullet_Spawn(x, y, angle_base, 0, bulletType)
		} else {
			for (let i = 0; i < Bullet_Count; i++) {
				//random(-IndividualSpray/2,IndividualSpray/2)
				//angle_offset is first set to per bullet accuray
				let angle_offset = Math.random() * Bullet_AccuracyOffset - Bullet_AccuracyOffset / 2
				if (this.Random_Spread) {
					angle_offset += Math.random() * Bullet_Spray - Bullet_Spray / 2
				} else {
					if (this.Bullet_Spray === 360) {
						angle_offset += (360 / Bullet_Count) * i
					} else {
						angle_offset += -Bullet_Spray / 2 + (Bullet_Spray / Bullet_Count) * i
					}
				}
				//

				this.Bullet_Spawn(x, y, angle_base, angle_offset, bulletType)
			}
		}
	}

	Bullet_Spawn(x, y, angle_base = 0, angle_offset = 0, bulletType = "", canBePattern = false) {
		angle_base = angle_base + angle_offset

		if (this.Bullet_Unit) {
			const bulletUnit = this.runtime.spawnManager.SpawnBullet(this.Bullet_Unit, x, y, this.BULLET)

			if (!bulletUnit) {
				console.error("Failed to spawn bullet", this.Bullet_Unit)
			} else {
				if (this.Bullet_Dmg > 0) {
					bulletUnit.Damage.damageAmount = this.Bullet_Dmg
				}

				bulletUnit.SetBulletAbi(this)

				bulletUnit.angleBaseTotal = angle_base
				bulletUnit.angleOffset = angle_offset

				bulletUnit.OnShot_Init()
				bulletUnit.OnCreated()
			}
		}
	}
}
