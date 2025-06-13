export class Noob_Rogue extends C4.Chara_Noob {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			VARS: {
				MAIN: {
					Lvl: 5,

					HP_Max: 3,
					HP_PerWave: 10,
					Speed_Walk: 0,

					Damage_Enemy: [
						[5, 1],
						[6, 10],
						[12, 20],
					],
				},
			},
		})

		this.SetAbis({
			Pursuit: {
				Type: "Move_Rectiligne",
				MovementType: "Follow",
				Speed_Override: 50,
				Speed_Acceleration: 10,
				Speed_Max: 170,

				Priority: 10,
				Range: -1,
				CanBeInterrupted: true,

				Timer_Execute: 7,
			},
		})
	}
}
