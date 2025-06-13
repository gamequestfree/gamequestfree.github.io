//!not used anymore
export class Chara_Player_Spider extends C4.Charas.Player {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.spiderComp = this.AddComponent(C4.Compos.Compo_Spider, "Spider")
		this.OverrideData({
			AnimObject: "Play_Spider",
			VARS: {
				MAIN: {
					WalkType: "Spider",
				},
			},
		})
	}

	Init() {
		super.Init()
		//window.alert("Init Spider WalkType " + this.WalkType)
	}
}
