C4.Javelin = class WepType_Javelin extends C4.Units.Weapon {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			AnimObject: "Wep_Javelin",

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
				AnimObject: "Wep_Javelin",
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

		this.juice.Spring_StartOffset("pos2D")
	}

	Tick() {
		super.Tick()

		//this.anim.angle = this.inst.angle

		const charge = this.wepComp.Charge_Progress

		const weaponPoint = this.inst.getParent()

		const angle = this.anim.angle + Math.PI

		const javelinX = weaponPoint.x + charge * Math.cos(angle) * 20
		const javelinY = weaponPoint.y + charge * Math.sin(angle) * 20

		this.inst.setPosition(javelinX, javelinY)
		this.anim.setPosition(javelinX, javelinY)

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
		this.PlaySound("Wep_Bow_Shoot")
		//Utils.debugText("OnShoot")

		this.juice.currentSpring.SetCosAngle("Pos", this.anim.angleDegrees, 10)

		//this.unitChara.juice.Roll()
	}
}
