export class Noob_Archer extends C4.Chara_Noob {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	Init() {
		super.Init()
		this.OverrideData({
			VARS: {
				MAIN: {
					Lvl: 4,

					HP_Max: 3,
					HP_PerWave: 5,
					Speed_Walk: 40,
				},
			},
		})

		this.SetAbis({
			Archer_RandomPatrol: {
				Type: "Move_RectiRandom",
				//specific
				Timer_Execute: "1-2",
			},
		})

		this.SetWeapon("Wep_NPC_Bow", 0, {
			AnimObject: "Wep_Bow_Ballista",
			VARS: {
				MAIN: {
					AutoShoot: true,
					AimMode: "Movement",

					Range: 100,
					Cooldown: 2,
				},
				WEP: {
					//pattern
					Bullet_Count: 1,
					Bullet_Spray: 30,
					Random_Spread: false,

					hasPlugCharge: true,
					Charge_AutomaticallyShoot: true,
					Time_Preparation: 0.5,
				},
				HAND: {
					pivotImagePoint: "Wep",
					MaxHoldDist: 0,
				},
			},

			BULLET: {
				BulletUnit: "Enemy",
				AnimObject: "Bullet_Arrow_Enemy",
				DAMAGE: {
					Damage_Enemy: [
						[3, 7],
						[5, 12],
					],
				},
				VARS: {
					MAIN: {
						Speed: 130,
						Pierce: 0,

						Bounce_Solid: 1,
					},
				},
			},
		})
	}
}
