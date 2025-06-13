export class Bullet_GroundLine extends C4.Units.Bullet {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetInternals() {
		super.SetInternals()
		this.collisionLines = []
		this.collisionLine = null
		this.circles = []

		this.ground_thickness = 15

		this.ground_color = [1, 0, 0]
		this.ground_opacity = 1

		this.ground_decos = []

		this.ground_deco_isAnim = true
		this.ground_decoObj = "GroundLine_Ice"
	}

	SetData() {
		super.SetData()

		this.OverrideData({
			AnimObject: "Bullet_Base_Player",
			VARS: {
				MAIN: {
					EntityCollide: false,
					Bullet_Visible: false,

					Knockback: -1,
				},
			},
		})
	}

	GroundLine_SetDuration(drawPhase = 1, stayPhase = 2, fade = 0.3) {
		this.isDrawing = true
		this.drawPhase = drawPhase
		this.stayPhase = stayPhase
		this.stayFade = fade

		this.Lifetime = drawPhase + stayPhase + 0.1

		this.timerComp.Timer_Start("GroundLine_DrawPhase", this.drawPhase, () => {
			this.StopDraw_StartStay()
		})

		this.timerComp.Timer_Start("Lifetime", this.Lifetime, () => {
			this.OnLifetime()
		})
	}

	StopDraw_StartStay() {
		const endPoint = this.collisionLine.getImagePoint("End")
		this.Ground_CreateCirle(endPoint[0], endPoint[1])

		this.isDrawing = false
		this.moveComp.enabled = false

		this.timerComp.Timer_Start("GroundLine_StayPhase", this.stayPhase, () => {
			this.DestroyUnit()
		})

		this.timerComp.Timer_Start("GroundLine_StayFade", Math.max(0, this.stayPhase - this.stayFade), () => {
			this.tween_groundFade = this.tweenBeh.startTween("value", 0, this.stayFade, "linear", {
				startValue: this.ground_thickness,
			})
			//console.error("this.tween_groundFade", this.ground_thickness, this.tween_groundFade.value, this.tween_groundFade)

			for (const deco of this.ground_decos) {
				deco.behaviors["Tween"].startTween("size", [0, 0], 0.3, "in-back", {
					destroyOnComplete: true,
				})
			}
			this.ground_decos = null
		})
	}

	GroudLine_SetColor(color, opacity = 1) {
		this.ground_color = color
		this.ground_opacity = opacity
		for (const line of this.collisionLines) {
			line.colorRgb = color
			line.opacity = opacity
		}
		for (const circle of this.circles) {
			circle.colorRgb = color
			circle.opacity = opacity
		}
	}

	Init() {
		super.Init()

		this.GroundLine_SetDuration()

		this.Create_NewLine()

		this.timerComp.Timer_Start_Repeat("GroundLine_Flower", 0.035, () => {
			this.Create_Flower()
		})
	}

	Tick() {
		super.Tick()

		if (this.tween_groundFade && !this.tween_groundFade.isReleased) {
			const value = this.tween_groundFade.value
			for (const line of this.collisionLines) {
				line.height = value
			}
			for (const circle of this.circles) {
				circle.setSize(value, value)
			}
		}

		this.Tick_Collision()
	}

	DestroyUnit() {
		super.DestroyUnit()

		for (const line of this.collisionLines) {
			line.destroy()
		}

		if (this.ground_decos) {
			for (const deco of this.ground_decos) {
				deco.destroy()
			}
		}

		this.collisionLines = null
		this.collisionLine = null

		this.tween_groundFade = null

		this.ground_decos = null

		this.circles = null
	}

	On_Solid_Hit() {
		this.Create_NewLine()
	}

	Create_NewLine() {
		if (!this.isDrawing) return

		if (this.collisionLine) {
			//*circle_End
			const endPoint = this.collisionLine.getImagePoint("End")
			this.Ground_CreateCirle(endPoint[0], endPoint[1])
		}

		this.collisionLine = this.runtime.objects["Line"].createInstance("Goop", this.inst.x, this.inst.y)

		this.collisionLine.isVisible = true
		this.collisionLine.colorRgb = this.ground_color
		this.collisionLine.opacity = this.ground_opacity

		this.collisionLines.push(this.collisionLine)

		//*circle_Start
		this.Ground_CreateCirle(this.inst.x, this.inst.y)
	}

	Ground_CreateCirle(x, y) {
		const circle = this.runtime.objects["Circle"].createInstance("Goop", x, y)

		circle.colorRgb = this.ground_color
		circle.opacity = this.ground_opacity

		circle.setSize(this.ground_thickness, this.ground_thickness)

		this.collisionLine.addChild(circle, {
			destroyWithParent: true,
		})

		this.circles.push(circle)
	}

	async Create_Flower() {
		if (!this.isDrawing) return
		if (!this.collisionLine) return
		if (!this.ground_decoObj) return

		const thick = this.ground_thickness * 0.5 * 0.8

		const randX = Utils.random(-thick, thick)
		const randY = Utils.random(-thick, thick)

		let groudProp = null
		if (this.ground_deco_isAnim) {
			groudProp = Utils.createAnim(this.ground_decoObj, this.inst.x + randX, this.inst.y + randY)
		} else {
			groudProp = this.runtime.objects[this.ground_decoObj].createInstance("Objects", this.inst.x + randX, this.inst.y + randY)
		}

		Utils.Sprite_SetRandomFrame(groudProp)

		let randSize = Utils.random(7, 10)

		if (this.groundDeco_size) {
			randSize = Utils.random(this.groundDeco_size[0], this.groundDeco_size[1])
		}

		groudProp.setSize(0, 0)
		groudProp.behaviors["Tween"].startTween("size", [randSize, randSize], 0.3, "out-elastic")

		this.ground_decos.push(groudProp)
	}

	Tick_Collision() {
		const Damage = this.Damage
		if (!Damage) {
			return
		}

		//last Line
		if (this.isDrawing && this.collisionLine) {
			//this.Create_Flower()

			this.collisionLine.setSize(C3.distanceTo(this.collisionLine.x, this.collisionLine.y, this.inst.x, this.inst.y), this.ground_thickness)
			this.collisionLine.angle = C3.angleTo(this.collisionLine.x, this.collisionLine.y, this.inst.x, this.inst.y)
		} else {
			this.collisionLine = null
		}

		//check all lines
		for (const line of this.collisionLines) {
			const collidingCharas = Utils.testOverlapOpti_All(line, this.runtime.objects["Chara"])
			for (const chara of collidingCharas) {
				Damage.DealDamage_Test(chara)
			}
		}
	}
}
