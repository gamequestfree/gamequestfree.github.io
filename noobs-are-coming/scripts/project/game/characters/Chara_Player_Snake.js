export class Chara_Player_Snake extends C4.Charas.Player {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()

		this.snakeComp = this.AddComponent(C4.Compos.Compo_Snake, "Snake", {
			Snake_DistPart: 15,
			Snake_Visu: "SnakePart",
			Snake_Visu_Size: 25,

			Snake_Parts_Min: 4,
			Snake_Parts_Add: 0,
		})

		this.OverrideData({
			VARS: {
				MAIN: {
					WalkType: "Sine",
				},
			},
		})
	}

	Init() {
		super.Init()
	}
}
