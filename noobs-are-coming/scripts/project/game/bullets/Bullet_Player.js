export class Bullet_Player extends C4.Units.Bullet {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}
	SetData() {
		super.SetData()
		this.OverrideData({
			AnimObject: "Bullet_Base_Player",
		})
	}
}
