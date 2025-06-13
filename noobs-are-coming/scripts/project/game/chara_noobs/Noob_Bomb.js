export class Noob_Bomb extends C4.Chara_Noob {
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
					HP_PerWave: 7,
					Speed_Walk: "40-50",

					Damage_Enemy: [
						[3, 1],
						[5, 10],
						[9, 20],
					],
				},
			},
		})
	}
}
