C4.Chara_Hero = class Chara_Hero extends C4.Chara_Noob {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}
	SetData() {
		super.SetData()
		this.OverrideData({
			VARS: {
				MAIN: {
					IsHero: true,

					HP_Max: 0,
					HP_PerWave: 300,
					Speed_Walk: "80-90",

					HP_HeroScale: 1,

					WalkType: "Jump",
					WalkJump_HeightMax: 5,

					Knockback_Mult: 0.5,

					Drop_Souls: 7,
				},
			},
		})

		this.sepDist = 80
		this.sepStrength = 300
	}

	Init() {
		super.Init()
		this.RemoveTags("Noob")
		this.AddTags("Hero")
		const newHP = this.healthComp.max * this.HP_HeroScale
		//console.error("💑 Hero HP", this.name, newHP, this.healthComp.max, this.HP_HeroScale)
		this.healthComp.SetCurrentToMax(newHP)
	}
}
