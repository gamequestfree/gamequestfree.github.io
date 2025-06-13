export class Bullet_Disk extends C4.Units.Bullet {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)

		this.diskBounce = 0
	}

	SetData() {
		super.SetData()

		this.OverrideData({
			VARS: {
				MAIN: {
					SetBulletAngle: false,
					Pierce: -3,
				},
			},
		})

		this.AddTags("Disk")
	}

	ReleaseUnit() {
		super.ReleaseUnit()
		this.kickComp = null
	}

	Kick_Func() {
		if (this.bounceSolids >= 0) {
			this.bounceSolids++
		}
	}

	On_Solid_Hit() {
		this.On_Solid_Hit_Disk()
	}

	On_Solid_Hit_Disk() {
		if (this.diskBounce === 0) {
			this.moveComp.speed = (this.moveComp.speed * 2) / 3
		}
		/*else {
			this.moveComp.speed = (this.moveComp.speed * 4) / 5
		}*/

		this.diskBounce++

		const sfx = "SFX_DiscBounce" + (Utils.randomInt(4) + 1)
		this.runtime.audio.PlaySound(sfx, 0.6, Utils.random(1.7, 3))

		const moveComp = this.unit.moveComp

		const particle = this.runtime.objects["Particle_Spark"].createInstance("FX_Ahead", moveComp.hitX, moveComp.hitY)
		particle.angleDegrees = moveComp.hit_angleNormal
	}
}
