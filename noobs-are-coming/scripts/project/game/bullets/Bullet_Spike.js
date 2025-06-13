export class Bullet_Spike extends C4.Units.Bullet {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}
	SetData() {
		super.SetData()

		this.OverrideData({
			AnimObject: "Bullet_Earth_Spikes",
			VARS: {
				MAIN: {
					JustHitbox: true,
				},
			},
		})
	}

	Init() {
		super.Init()
		this.PopUp()
	}

	Tick() {
		super.Tick()
	}

	async PopUp() {
		this.anim.setSize(0, 0)

		const tweenBeh = this.anim.behaviors?.["Tween"]

		let tweenPop = tweenBeh.startTween("size", [15, 20], 0.5, "out-elastic")

		await tweenPop.finished

		tweenPop = tweenBeh.startTween("size", [0, 0], 0.3, "in-back")

		await tweenPop.finished

		this.DestroyUnit()
	}
}
