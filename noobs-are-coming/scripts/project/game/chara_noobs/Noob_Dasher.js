export class Noob_Dasher extends C4.Chara_Noob {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()

		this.OverrideData({
			VARS: {
				MAIN: {
					Lvl: 6,

					HP_Max: 4,
					HP_PerWave: 6,
					Speed_Walk: 80,

					Damage: 7,
					Damage_Enemy: [
						[4, 1],
						[5, 10],
						[6, 20],
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
				Speed_Override: 250,

				//shared
				Priority: 10,
				Range: 50,
				CanBeInterrupted: false,

				Timer_Cooldown: "2.5-3.5",
				Timer_Prepare1: 0.5,
				Timer_Prepare2: 0.2,
				Timer_Execute: 0.4,
				Timer_Recover: 0,

				onStart: () => {
					this.juice.Shake()
					this.PlaySound("CuteMob_Prepare", 0.65, Utils.random(0.9, 1.1))
					this.OutlineStrong(true)
				},

				onExecute: () => {
					this.PlaySound("CuteMob_ATK_1", 0.65, Utils.random(0.9, 1.1))
				},

				onRecover: () => {
					this.OutlineStrong(false)
				},
			},
		})
	}
}
