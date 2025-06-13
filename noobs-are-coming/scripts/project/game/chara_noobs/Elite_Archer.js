export class Elite_Archer extends C4.Chara_Elite {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	Init() {
		super.Init()
		this.OverrideData({
			VARS: {
				MAIN: {
					Lvl: 4,

					HP_Max: 20,
					HP_PerWave: 10,
					Speed_Walk: "60-70",

					WalkType: "Jump",
					WalkJump_HeightMax: 4,
					WalkJump_AngleMax: 0,
					WalkJump_StepSS: false,
				},
			},
		})

		this.SetAbis({
			Flee: {
				Type: "Move_KeepDistance",
				Flee_KeepDist: 80,

				//shared
				Priority: 0,
				Range: -1,
				CanBeInterrupted: true,
			},
		})

		this.SetWeapon("Wep_NPC_Bow", 0, {
			AnimObject: "Wep_Bow_Ballista",
			VARS: {
				MAIN: {
					AutoShoot: true,
					AimMode: "Auto",

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
						[3, 1],
						[5, 12],
					],
				},
				VARS: {
					MAIN: {
						Speed: 170,
						Pierce: 0,

						Bounce_Solid: 1,
					},
				},
			},
		})
	}
}
