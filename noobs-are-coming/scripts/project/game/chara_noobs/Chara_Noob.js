C4.Chara_Noob = class Chara_Noob extends C4.Units.Character {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}
	SetData() {
		super.SetData()
		this.OverrideData({
			UnitTags: ["Enemy"],
			EnemyTags: ["Tank"],

			VARS: {
				MAIN: {
					Lvl: 3,
					IsEnemy: true,
					FollowTargetMove: true,

					Damage: 3,
					Damage_PerWave: 0.3,

					Drop_Souls: 1,
					Drop_Scale: 1,
				},
			},
		})
	}

	InitData_Unit() {
		super.InitData_Unit()

		this.IsNoob = true

		if (this.AnimObject === "Anim") {
			this.AnimObject = this.name
		}
	}

	Init() {
		super.Init()
		this.AddTags("Noob")
	}
}
