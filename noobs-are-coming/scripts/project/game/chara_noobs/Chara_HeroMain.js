C4.Chara_HeroMain = class Chara_HeroMain extends C4.Chara_Hero {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}
	SetData() {
		super.SetData()
		this.OverrideData({
			VARS: {
				MAIN: {
					IsHeroMain: true,

					Drop_Loot: {
						Chest: 1,
						Soul_Golden: 1,
					},
				},
			},
		})

		this.heroFriends = []
	}

	Init() {
		super.Init()

		this.runtime.hero.Crew_CreateFromHeroMain(this)
	}
}
