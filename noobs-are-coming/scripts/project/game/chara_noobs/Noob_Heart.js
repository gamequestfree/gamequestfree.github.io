export class Noob_Heart extends C4.Chara_Noob {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}
	SetData() {
		super.SetData()
		this.OverrideData({
			VARS: {
				MAIN: {
					Lvl: 5,

					HP_Max: 20,
					HP_PerWave: 2,
					Speed_Walk: "50",
					Damage: 4,
				},
			},
		})
	}
}
