export class Abi_Projectile extends C4.Abi {
	constructor(unit, abiName, abiData) {
		super(unit, abiName, abiData)
	}

	Init_Data() {
		super.Init_Data()
		this.SetVars_Default({
			ShootDirection: "Target", //Target, Random, Fixed
			ShootFixedAngle: 0,

			Bullet_Unit: "Enemy",

			BULLET: {},

			Bullet_Count: 1, //[1,3]
			Bullet_Spray: 30,
			Random_Spread: true,
			Bullet_AccuracyOffset: 0,
			Entity_Recoil: 1,

			onBulletSpawn: (bulletUnit) => {},
		})
	}

	//*========== CONFIG ====================

	SetAbiInternals() {
		super.SetAbiInternals()
	}

	Step_Execute() {
		let angle = 0
		if (this.ShootDirection === "Target") {
			angle = this.Angle_OriginToTarget()
		} else if (this.ShootDirection === "Random") {
			angle = Math.random() * 360
		} else if (this.ShootDirection === "Fixed") {
			angle = this.ShootFixedAngle
		}

		this.Shoot_Spread(this.unit.x, this.unit.y, angle)
	}

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

				this.Trigger("onBulletSpawn", bulletUnit)

				if (this.unit.IsCharmed) Utils.Bullet_Charmed(bulletUnit)
			}
		}
	}
}
