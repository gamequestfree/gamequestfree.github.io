export class Noob_Nymph extends C4.Chara_Noob {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	Init() {
		super.Init()
		this.OverrideData({
			VARS: {
				MAIN: {
					Lvl: 4,

					HP_Max: 50,
					HP_PerWave: 3,
					Speed_Walk: 50,
				},
			},
		})

		this.SetAbis({
			RandomPatrol: {
				Type: "Move_RectiRandom",
				//specific
				Timer_Execute: "1-2",
			},
		})
	}
}
