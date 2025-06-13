export class Wep_Whip extends C4.Units.Weapon {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			AnimObject: "Wep_Whip",

			ITEM: {
				Synergies: "Melee, Minion",
				Effects: {
					Desc_ATK_FixedDirection: null,
				},
			},

			VARS: {
				MAIN: {
					WepTrigger: "Cooldown",

					Cooldown: "1/0.9/0.8/0.7",
					Direction: "Outside",
					Size_Affected: true,
				},
				WEP: {
					//pattern
					Bullet_Count: "1/1/2/3",
					Bullet_Spray: 30,
					Random_Spread: false,

					hasPlugCharge: true,
					Charge_AutomaticallyShoot: true,
					Time_Preparation: 0.5,
				},
				HAND: {
					HandType: "Inactive",
					Hand_SetAngle: false,
				},
			},

			BULLET: {
				AnimObject: "Bullet_Whip",
				DAMAGE: {
					Dmg: "15/25/35/50",
					"_StatBonus|Damage_Minions": "100",
					Crit_Chance: 20,
					Knockback: 8,
				},
				VARS: {
					MAIN: {
						Speed: 50,

						JustHitbox: true,

						Lifetime: 0.5,

						SFX_Hit: "Wep_Whip_Hit",
					},
				},
			},
		})
	}

	Init() {
		super.Init()

		this.juice.Spring_StartOffset("pos2D", {
			name: "pos2D_offset",
		})
		this.juice.Spring_StartOffset("angle", {
			name: "angle_offset",
		})
	}

	Tick() {
		super.Tick()

		this.angleDegrees = this.GetDirection_Outside()
	}

	OnPrepare_Cancel() {
		//
	}

	OnShoot() {
		this.PlaySound("Wep_Whip_Hit")

		const springPos = this.juice.GetSpring("pos2D_offset")
		const springAngle = this.juice.GetSpring("angle_offset")

		this.juice.currentSpring.SetCosAngle("Pos", this.anim.angleDegrees, 10)

		//this.unitChara.juice.Roll()
	}

	OnBulletSpawn(bulletUnit) {
		const bulletInst = bulletUnit.inst
		bulletInst.angleDegrees = this.angleDegrees
		bulletInst.isVisible = true
		//Utils.World_SetLayer(bulletInst, "FX_Ahead")
		this.anim.addChild(bulletUnit.inst, {
			transformX: true,
			transformY: true,
		})
	}
}
