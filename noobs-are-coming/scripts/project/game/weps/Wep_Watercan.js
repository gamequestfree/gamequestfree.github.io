export class Wep_Watercan extends C4.Units.Weapon {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()

		this.OverrideData({
			AnimObject: "Wep_Watercan",
			ITEM: {
				Synergies: "Ranged, Water",
				Effects: {
					DmgFX_All: "",
				},
			},
			VARS: {
				MAIN: {
					Cooldown: "0.2/0.18",
					Range: "95/105",

					TargetTags_Wep: ["Enemy", "Sprout"],
				},
				WEP: {
					Is_Automatic: true,
					Beam: "Beam_ShootStart",
					Time_Preparation: 0,
				},
				HAND: {
					IsVisible: true,
					HandType: "Regular",
					MaxHoldDist: 10,
					AngleSpeed: 30,
					MoveSpeed: 5,
				},
			},

			BULLET: {
				BulletUnit: "Bullet_Watercan",
			},
		})

		this.OverrideData({})
	}

	OnBeam_Start() {
		this.beamSoundUid = this.PlaySound_Loop("Player_Water", 0.3)
	}

	OnBeam_LoopTrigger() {
		this.wepComp.Shoot()
	}

	OnBeam_End() {
		this.StopSound(this.beamSoundUid)
	}

	OnShoot() {
		this.PlaySound("Wep_Watercan", 0.7)
	}
}

export class Bullet_Watercan extends C4.Units.Bullet {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			AnimObject: "Bullet_Watercan",
			DAMAGE: {
				Dmg: "1/2/2/3",
				"_StatBonus|Damage_Elem": "30/40/50/60",
				Knockback: "4/5/6/7",
				Crit_Chance: 0,
				DmgEffects: {
					Watering: {
						Water_Amount: "20/25/30/40",
					},
				},
			},
			VARS: {
				MAIN: {
					OnMaxDistance: "Destroy",

					//Speed: 400,
					Pierce: -3,
					Bounce_Solid: 0,
					Bounce_Enemy: 0,
				},
			},
		})
	}

	Tick() {
		super.Tick()

		//this.CheckCollision_Water()
	}

	//! unused but maybe cool snippet
	CheckCollision_Water() {
		if (this.inst instanceof self.IWorldInstance === false) return
		const sprouts = this.runtime.units.GetUnitsByTags("Sprout", "Chara").map((unit) => unit.inst)

		const collidingCharas = Utils.testOverlap_All(this.inst, sprouts)
		for (const chara of collidingCharas) {
			const waterComp = chara.unit.GetComponent("Water")
			if (waterComp) {
				waterComp.addCurrent(10)
			}
		}
	}
}
