C4.Bow = class WepType_Bow extends C4.Units.Weapon {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			AnimObject: "Wep_Bow",

			VARS: {
				MAIN: {
					Range: 100,
					Cooldown: "1",
				},
				WEP: {
					//pattern
					Bullet_Count: "1",
					Bullet_Amount: "",
					Bullet_Spray: 30,
					Random_Spread: false,

					hasPlugCharge: true,
					Charge_AutomaticallyShoot: true,
					Time_Preparation: 0.5,
				},
				HAND: {
					//
				},
			},

			BULLET: {
				AnimObject: "Bullet_Arrow",
				DAMAGE: {
					Dmg: "1",
					Knockback: 3,
				},
				VARS: {
					MAIN: {
						Speed: 400,
						Pierce: 0,
						Bounce_Solid: 0,
						Bounce_Enemy: 0,
					},
				},
			},
		})
	}

	Init() {
		super.Init()

		/*
		this.anim.removeFromParent()
		this.inst.addChild(this.anim, {
			transformX: true,
			transformY: true,
			destroyWithParent: true,
		})*/

		this.defaultWidth = this.anim.width
		this.defaultHeight = this.anim.height

		const lineObject = this.runtime.objects["Line"]
		const circleObject = this.runtime.objects["Circle"]
		const thickness = 1

		this.rope1 = lineObject.createInstance("Objects", 0, 0)
		this.rope2 = lineObject.createInstance("Objects", 0, 0)

		this.rope1.height = thickness
		this.rope2.height = thickness

		this.ropePoint = circleObject.createInstance("Objects", 0, 0)
		this.ropePoint.setSize(thickness, thickness)
		this.ropePoint.colorRgb = [1, 0, 0]

		const zOrder = this.runtime.zOrder
		zOrder.LinkTo(this.rope1, this.anim, -1)
		zOrder.LinkTo(this.rope2, this.anim, -1)
		zOrder.LinkTo(this.ropePoint, this.anim, -1)

		this.anim.addChild(this.rope1, {
			transformVisibility: true,
			destroyWithParent: true,
		})

		this.anim.addChild(this.rope2, {
			transformVisibility: true,
			destroyWithParent: true,
		})

		this.anim.addChild(this.ropePoint, {
			transformVisibility: true,
			destroyWithParent: true,
		})

		//this.juice.Spring_SetProp("pos2D")

		this.juice.Spring_StartOffset("pos2D")
		//console.error("Wep_Bow", "Spring_StartOffset", this.juice.currentSpring)
	}

	Tick() {
		super.Tick()

		//this.anim.angle = this.inst.angle

		const charge = this.wepComp.Charge_Progress

		const rope1_pos = this.anim.getImagePoint("Rope1")
		const rope2_pos = this.anim.getImagePoint("Rope2")

		this.rope1.setPosition(rope1_pos[0], rope1_pos[1])
		this.rope2.setPosition(rope2_pos[0], rope2_pos[1])

		const angle = this.anim.angle + Math.PI

		let ropeX = (rope1_pos[0] + rope2_pos[0]) / 2
		let ropeY = (rope1_pos[1] + rope2_pos[1]) / 2

		ropeX = ropeX + charge * Math.cos(angle) * 10
		ropeY = ropeY + charge * Math.sin(angle) * 10

		this.ropePoint.setPosition(ropeX, ropeY)

		this.rope1.width = C3.distanceTo(this.rope1.x, this.rope1.y, this.ropePoint.x, this.ropePoint.y)
		this.rope1.angle = C3.angleTo(this.rope1.x, this.rope1.y, this.ropePoint.x, this.ropePoint.y)
		this.rope2.width = C3.distanceTo(this.rope2.x, this.rope2.y, this.ropePoint.x, this.ropePoint.y)
		this.rope2.angle = C3.angleTo(this.rope2.x, this.rope2.y, this.ropePoint.x, this.ropePoint.y)

		this.anim.width = this.defaultWidth * (1 + charge * 0.5)
		this.anim.height = this.defaultHeight * (1 - charge * 0.5)

		//Utils.debugText("Charge_Progress: " + this.Charge_Progress)
	}

	OnPrepare_Cancel() {
		//
	}

	OnPrepare_Start() {
		this.sfxPrepare = this.PlaySound("Wep_Bow_Draw")
		//Utils.debugText("OnPrepare_Start")
	}

	OnPrepare_End() {
		this.StopSound(this.sfxPrepare)
	}

	OnShoot() {
		this.anim.width = this.defaultWidth
		this.anim.height = this.defaultHeight
		this.PlaySound("Wep_Bow_Shoot")
		//Utils.debugText("OnShoot")

		this.juice.currentSpring.SetCosAngle("Pos", this.anim.angleDegrees, 10)

		//this.unitChara.juice.Roll()
	}

	OnApex_StartTimer() {
		//this.PlaySound("Neophyte_StormSpearChargeFull")
	}

	OnApex_Shoot() {
		//this.PlaySound("Neophyte_StormSpearReleaseApex")
	}
}
