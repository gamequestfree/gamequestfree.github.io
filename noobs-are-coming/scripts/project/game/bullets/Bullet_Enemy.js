export class Bullet_Enemy extends C4.Units.Bullet {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}
	SetData() {
		super.SetData()
		this.OverrideData({
			AnimObject: "Bullet_Base_Enemy",

			VARS: {
				MAIN: {
					Pierce: 0,
					Bounce_Solid: 0,
					Bounce_Enemy: 0,
				},
			},
		})
	}
}
