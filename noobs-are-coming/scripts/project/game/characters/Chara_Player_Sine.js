export class Chara_Player_Sine extends C4.Charas.Player {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			VARS: {
				MAIN: {
					WalkType: "Sine",
				},
			},
		})
	}
}
