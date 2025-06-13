export class Chara_Player extends C4.Units.Character {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)

		this.name = "Chara_Player"
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			VARS: {
				MAIN: {
					FactionID: "Player",

					HP_Max: 10,
					//HP_Max: 10,
					HP_PerWave: 0,
					Speed_Walk: 135,

					WalkType: "Jump",
					WalkJump_HeightMax: 5,

					FollowTargetMove: true,
				},
			},
		})

		this.playableName = this.dataLoaded?.PlayableName || null
		console.error("PlayableName", this.playableName)

		const funcData = this.runtime.dataManager?.funcsData?.Playables?.[this.playableName]
		if (funcData) {
			console.error("PlayableName has Func", this.playableName, funcData)
			funcData(this)
		}
	}

	InitData() {
		super.InitData()
	}

	Init() {
		super.Init()

		//this.SetWeapon("Pistol", 3)
		//this.SetWeapon("Bow", 0)

		//this.AddItemByName("Bow", 0)
		//this.AddItemByName("Bow", 0)

		//this.AddItemByName("Grimoire_Arcane", 0)
		//this.AddItemByName("Shield_Death", 0)

		//this.AddItemByName("Lava_Dagger", 0)

		//this.juice.Sine_Start("Angle", 0.5, 0.5, 10)

		requestAnimationFrame(() => {
			/*
			this.AddItemByName("Spikeball", 0)
			this.AddItemByName("Skill_Ball", 0)
			this.AddItemByName("Shield_Death", 0)
			this.AddItemByName("Minion_Spider", 0)*/
		})
	}
}
