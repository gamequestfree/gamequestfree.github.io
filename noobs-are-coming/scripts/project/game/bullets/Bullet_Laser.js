export class Bullet_Laser extends C4.Units.Bullet {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}
	SetData() {
		super.SetData()

		//*rainbow laser
		//const color = Utils.choose([0, 1, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 0, 0], [1, 1, 0])

		this.laserComp = this.AddComponent(C4.Compos.Compo_Laser, "Laser", {
			LaserColor: [1, 0, 0],
		})

		this.OverrideData({
			AnimObject: "Bullet_Base_Player",
			VARS: {
				MAIN: {
					Speed: 0,
				},
			},
		})
	}

	/*
	BulletTick() {
		super.BulletTick()
		this.laserComp.BulletTick_Laser()
	}*/

	Init() {
		super.Init()
		this.laserComp.Damage = this.Damage
	}

	Tick() {
		super.Tick()
	}
}
