export class Trap_Ballista extends C4.Units.Weapon {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			AnimObject: "Wep_Ballista",

			ITEM: {
				Synergies: "Trap, Turret, Bow",

				Effects: {
					Desc_Shoot_Nearest: null,
				},
			},

			VARS: {
				MAIN: {
					WepTrigger: "WaveStart",

					//* For MinionWep
					Range: 200,
					Cooldown: 0.8,
					Size_Affected: true,
				},
				WEP: {
					ShootWhere: "RandomInArea",
					ShootWhat: "Entity",
					ShootWhich: "Turret_Ballista",

					MinionWep: true,

					Bullet_Amount: "1:8/1:7/1:7/1:6",
				},
				HAND: {
					HandType: "Inactive",
				},
			},

			BULLET: {
				AnimObject: "Bullet_Arrow",
				DAMAGE: {
					Dmg: "10/13/16/20",
					"_StatBonus|Damage_Dex": "80/85/90/100",
					Knockback: 4,
					Crit_Chance: 3,
				},
				VARS: {
					MAIN: {
						Speed: 400,
						Pierce: "0/1/2/3",

						Bounce_Solid: 1,
						Bounce_Enemy: 0,

						Bullet_Outline: true,
					},
				},
			},

			MINION_WEP: {
				WepUnit: "Wep_Bow",
				AnimObject: "Wep_Bow_Ballista",
				VARS: {
					MAIN: {
						WepTrigger: "Range",

						AutoShoot: true,
					},
					WEP: {
						//pattern
						Bullet_Count: 1,
						Bullet_Amount: "",
						Bullet_Spray: 30,
						Random_Spread: false,

						hasPlugCharge: true,
						Charge_AutomaticallyShoot: true,
						Time_Preparation: 0.4,
					},
					HAND: {
						pivotImagePoint: "Wep",
						MaxHoldDist: 0,
					},
				},
			},
		})
	}
}

export class Turret_Ballista extends C4.Units.Character {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			AnimObject: "Wep_Ballista_Base",
			UnitTags: ["Turret"],
			VARS: {
				MAIN: {
					FactionID: "Player",

					HP_Max: 1000,
					HP_PerWave: 0,

					Speed_Walk: 0,

					WalkType: "Sine",

					FollowTargetMove: false,
				},
			},
		})
	}
}
