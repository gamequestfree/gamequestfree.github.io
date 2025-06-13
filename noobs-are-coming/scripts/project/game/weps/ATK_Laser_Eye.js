export class ATK_Laser_Eye extends C4.Units.Weapon {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			AnimObject: "Wep_Laser_Eye",

			ITEM: {
				Synergies: "Skill, Wizard",
			},
			VARS: {
				MAIN: {
					WepTrigger: "Cooldown",
					Duration: 0.5,

					Direction: "Random_PerWave",
				},
				WEP: {
					Bullet_ProjectileAmount: false,
					Bullet_Count: 1,
					Bullet_Amount: "1:4",

					Range: 100,
					Cooldown: "2",

					ShootWhere: "WeaponAngle",
					ShootAngleDist: 20,
				},
				HAND: {
					HandType: "Inactive",
					Hand_SetAngle: false,
				},
			},

			BULLET: {
				BulletUnit: "Bullet_Laser",
				DAMAGE: {
					Dmg: "2/3/4/5",
					Decimal: true,
					"_StatBonus|Damage_Arcane": 100,
					Knockback: -1,
					DamageTick: 0.2,
				},
			},
		})
	}

	Init() {
		super.Init()
	}

	On_Wave_Start() {
		super.On_Wave_Start()
		this.DirectionAngle = this.GetDirection_Random()
	}

	OnBulletSpawn(bulletUnit) {
		bulletUnit.inst.isCollisionEnabled = false
		bulletUnit.anim.isVisible = false

		bulletUnit.laserComp.Range = this.Range

		bulletUnit.laserComp.angle = this.DirectionAngle

		bulletUnit.laserComp.Bounces = this.wepComp.GetBulletCount() - 1

		const atkSfx = "sci-fi_weapon_blaster_laser_boom_small_0" + Utils.randomInt(1, 4)
		this.runtime.audio.PlaySound(atkSfx, 0.2, Utils.random(0.9, 1))

		//console.error("LaserComp Bounces", bulletUnit.laserComp.Bounces, bulletUnit.laserComp)

		//! previous best
		//this.runtime.audio.PlaySound("Wep_Laser_Water", 0.45, Utils.random(0.9, 1.1))

		/*this.runtime.audio.PlaySound("Laser_Beam", 0.23, Utils.random(0.9, 1.1))*/

		//this.runtime.audio.PlaySound("Laser_Beam2", 0.6, Utils.random(0.7, 0.8))

		//Utils.createAnim("FX_AirStrike_Impact", bulletUnit.inst.x, bulletUnit.inst.y)

		bulletUnit.timerComp.Timer_Start("LaserDuration", this.GetDuration_Value(), () => {
			bulletUnit.DestroyUnit()
		})
	}
}
