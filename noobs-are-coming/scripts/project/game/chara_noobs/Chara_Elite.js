C4.Chara_Elite = class Chara_Elite extends C4.Chara_Noob {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}
	SetData() {
		super.SetData()
		this.OverrideData({
			VARS: {
				MAIN: {
					IsElite: true,

					HP_Max: 120,
					HP_PerWave: 10,
					Speed_Walk: 50,
					Has_Healthbar: true,

					Drop_Souls: 4,

					Knockback_Mult: 0.6,
				},
			},
		})
	}

	Init() {
		super.Init()
		this.RemoveTags("Noob")
		this.AddTags("Elite")
	}
}
