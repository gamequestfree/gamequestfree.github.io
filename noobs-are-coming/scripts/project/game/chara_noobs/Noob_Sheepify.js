//!dog scares sheep?

export class Noob_Sheepify extends C4.Chara_Noob {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()

		this.OverrideData({
			VARS: {
				MAIN: {
					Lvl: 1,

					Damage: 0,
					Damage_PerWave: 0,

					HP_Max: 5,
					HP_PerWave: 5,
					Speed_Walk: "60-65",

					CanPseudo: false,
				},
			},
		})
	}

	Init() {
		super.Init()

		this.sheepUnit = true
	}

	OnDestroyed_Callback() {
		//
	}
}
