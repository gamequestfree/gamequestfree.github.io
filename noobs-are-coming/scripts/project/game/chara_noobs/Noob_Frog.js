export class Noob_Frog extends C4.Chara_Noob {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			VARS: {
				MAIN: {
					Lvl: 6,

					HP_Max: 3,
					HP_PerWave: 5,
					Speed_Walk: 75,

					Damage_Enemy: [
						[5, 1],
						[6, 10],
					],
				},
			},
		})

		this.SetAbis({
			Frog_Jump_Target: {
				Type: "JumpArea",
				//spec
				Move_Distance: 100,
				Move_Ease: "in-out-sine",
				Jump_Dodge: true,
				Jump_RandomDirection: false,
				Jump_Area: 50,

				//shared
				Priority: 2,
				Range: 150,
				CanBeInterrupted: false,

				Timer_Cooldown: -1,
				Timer_Prepare1: 0.2,
				Timer_Prepare2: 0.2,
				Timer_Execute: 0.8,
				Timer_Recover: 0,
			},

			Frog_Jump_Random: {
				Type: "JumpArea",
				//spec
				Move_Distance: 80,
				Move_Ease: "in-out-sine",
				Jump_Dodge: true,
				Jump_RandomDirection: false,
				Jump_Area: 40,

				//shared
				Priority: 1,
				Range: -1,
				CanBeInterrupted: false,

				Timer_Cooldown: -1,
				Timer_Prepare1: 0.2,
				Timer_Prepare2: 0.2,
				Timer_Execute: 0.8,
				Timer_Recover: 0,
			},
		})
	}
}
