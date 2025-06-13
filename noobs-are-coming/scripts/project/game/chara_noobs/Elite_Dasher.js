export class Elite_Dasher extends C4.Chara_Elite {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()

		this.OverrideData({
			VARS: {
				MAIN: {
					Lvl: 10,

					HP_Max: 1,
					HP_PerWave: 30,
					Speed_Walk: 100,

					Damage_Enemy: [
						[5, 1],
						[7, 10],
						[8, 20],
					],

					WalkType: "Jump",
					WalkJump_HeightMax: 5,
					WalkJump_AngleMax: 0,
					WalkJump_StepSS: false,
				},
			},
		})

		this.SetAbis({
			Charge: {
				Type: "Move_Rectiligne",
				//specific
				MovementType: "Recti_Target",
				Speed_Override: 350,

				//shared
				Priority: 10,
				Range: 80,
				CanBeInterrupted: false,

				Timer_Cooldown: "1.3-1.8",
				Timer_Prepare1: 0.5,
				Timer_Prepare2: 0.2,
				Timer_Execute: 0.6,
				Timer_Recover: 0,

				onStart: () => {
					this.juice.Shake()
					this.PlaySound("Dasher_Prepare", 1, Utils.random(0.9, 1.1))
					this.OutlineStrong(true)
				},

				onExecute: () => {
					this.PlaySound("Dasher_Dash_02", 0.9, Utils.random(0.9, 1.1))
				},

				onRecover: () => {
					this.OutlineStrong(false)
				},
			},
		})
	}
}
