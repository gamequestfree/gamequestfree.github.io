export class Wep_Totem extends C4.Units.Weapon {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			AnimObject: "Anim_Totem",
			WepAnimSize: 16,

			ITEM: {
				Synergies: "Turret, Shaman",

				Effects: {
					Desc_Shoot_Around: null,
				},
			},

			VARS: {
				MAIN: {
					WepTrigger: "WaveStart",

					//* For MinionWep
					Cooldown: 1.1,
					Size_Affected: true,
				},
				WEP: {
					ShootWhere: "RandomInArea",
					ShootWhat: "Entity",
					ShootWhich: "Totem_1",

					MinionWep: true,

					Bullet_Amount: "1:7/1:7/1:7/1:6",
				},
				HAND: {
					HandType: "Inactive",
				},
			},

			BULLET: {
				AnimObject: "Bullet_Base_Player",
				DAMAGE: {
					Dmg: "6/11/15/20",
					"_StatBonus|Damage_Arcane": "80/85/90/100",
					Knockback: 0,
					Crit_Chance: 3,
				},
				VARS: {
					MAIN: {
						Speed: 200,
						Pierce: "0",
						Bounce_Solid: 0,
						Bounce_Enemy: 0,

						Bullet_Outline: true,
					},
				},
			},

			MINION_WEP: {
				WepUnit: "Wep_Minion_Base",
				//AnimObject: "Wep_Bow_Ballista",
				VARS: {
					MAIN: {
						WepTrigger: "Cooldown",

						AutoShoot: true,
					},
					WEP: {
						//pattern
						Bullet_Count: 4,
						Bullet_Spray: 360,
						Random_Spread: false,
					},
					HAND: {
						pivotImagePoint: "Wep",
						MaxHoldDist: 0,

						HandType: "Invisible",
						Hand_SetAngle: false,
					},
				},
			},
		})
	}
}

export class Totem_1 extends C4.Units.Character {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			AnimObject: "Anim_Totem",
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

	InitData() {
		super.InitData()
	}
}
