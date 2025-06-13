//TODO: juicy shaker spider anim works great !

export class Compo_Spider extends C4.Component {
	constructor(unit, data = null) {
		super(unit, data)
		//console.error("Compo_Spider ", this.unit.name, this)
	}

	SetData() {
		this.SetVars_Default({
			legsWidth: 2, //Utils.random(2, 3)
			legsPairs: 4,
			legsSpread: 90,

			BodySize: 25, //* hipdist = 0.48

			HipDistScale: 0.48,
			FootDistScale: 1.8,

			footRaise: 8,
			distTillMove: 18,
			fakeZ_init: 5,
		})
	}

	RandomizeSpider() {
		this.legsPairs = Utils.randomInt(2, 6)
		this.legsSpread = Math.min(160, Utils.random(15, 40) * this.legsPairs)

		/*this.hipDist = Utils.random(6, 15)
		this.footDist = this.hipDist * Utils.random(1.2, 2)*/

		this.footRaise = Utils.random(3, 10)
		this.distTillMove = Utils.random(10, 20)
		this.fakeZ_init = Utils.random(5, 8)

		this.randomFootDist = Utils.random(0.8, 2)
	}

	SetInternals() {
		this.randomFootDist = Utils.random(0.9, 1)

		this.fakeZ = 0
		this.footSpeed = 0

		this.angle = 0
		this.angleRad = 0

		this.upperLegLength = 16 //thigh
		this.lowerLegLength = 16 //shin

		this.sinFakeZ_cycle = Math.random() * 1
		this.sinFakeZ_period = Utils.random(0.3, 1)
		this.sinFakeZ_amplitude = 3

		//this.Randomize()

		this.upperLegLength = 4
		this.lowerLegLength = this.upperLegLength

		//test fakeZ 0
		this.fakeZ_init = 10
		this.sinFakeZ_amplitude = 0

		//FORCE
		//this.legsPairs = 1

		//
		this.LR = 0
		this.footH

		if (this.legsPairs === 1) this.legsSpread = 0

		this.legs = []
	}

	Init() {
		this.spiderAnim = this.unit.anim

		this.initVisu = false

		this.previousX = this.inst.x
		this.previousY = this.inst.y
		this.previousAngleRad = this.angleRad

		this.UpdateSize()

		this.GenerateLegs()

		this._SetTicking(true)
	}

	GenerateLegs() {
		this.UpdateFakeZ()
		this.legs = []
		for (let i = 1; i <= this.legsPairs; i++) {
			this.legs.push(new SpiderLeg(this, true, 90, i))
			this.legs.push(new SpiderLeg(this, false, -90, i))
		}

		this.legPaste = this.runtime.objects["Leg"].createInstance("FX_Behind", 0, 0)
		this.legPaste.isVisible = false
		this.inst.addChild(this.legPaste, {
			destroyWithParent: true,
		})
	}

	SetCompVisible(bool) {
		for (let i = 0; i < this.legs.length; i++) {
			const leg = this.legs[i]
			leg.legVisible = bool
			leg.upperLeg.isVisible = bool
			leg.lowerLeg.isVisible = bool
		}
	}

	ReleaseComp() {
		for (let i = 0; i < this.legs.length; i++) {
			//window.alert("ReleaseComp Spider")
			const leg = this.legs[i]
			//leg.upperLeg.destroy()
			//leg.lowerLeg.destroy()
			leg.upperLeg = null
			leg.lowerLeg = null
		}
		this.legPaste = null

		this.legs = null
		this.UID_Entity = 0
		this.charaComp = null
		this.unitChara = null
		this.inst_Anim = null
		this.iBeh_tween = null
		this.juiceComp = null
		this.wep = null
	}

	UpdateFakeZ() {
		this.sinFakeZ_cycle += this.runtime.dt / this.sinFakeZ_period
		this.fakeZ = -this.fakeZ_init + Math.sin(this.sinFakeZ_cycle) * this.sinFakeZ_amplitude

		this.spiderAnim.setPosition(this.inst.x, this.inst.y + this.fakeZ)
		this.spiderAnim.zOrder = this.inst.getBoundingBox().bottom
	}

	UpdateSize() {
		const bodySize = this.BodySize * this.unit.unitScale

		this.hipDist = bodySize * this.HipDistScale
		this.footDist = this.hipDist * this.FootDistScale * this.randomFootDist

		this.spiderAnim.setSize(bodySize * this.unit.mirroredMod, bodySize)
	}

	Tick() {
		this.UpdateSize()

		this.UpdateFakeZ()

		if (!this.inst?.x) {
			console.error("Compo_Spider Tick : !this.inst.x", this.inst.x, this.inst)
			//window.alert("SpiderReset")
			//this.inst.setPosition(590, 461)
			return
		}

		const drawing = this.runtime.objects["DC_Shadow"].getFirstInstance()
		drawing.fillEllipse(this.inst.x, this.inst.y, this.hipDist, this.hipDist, [0, 0, 0, 1])

		//this.angle = C3.toDegrees(this.unit.moveComp.angleOfMotion)

		this.angleTargetRad = this.unit.moveComp.angleOfMotion
		this.angleRad = C3.angleLerp(this.angleRad, this.angleTargetRad, 20 * this.inst.dt)
		this.angle = C3.toDegrees(this.angleRad)

		//Utils.debugText(this.angle)

		//max(min(0.2*distance(Self.X,Self.Y,Self.X_Previous,Self.Y_Previous) + abs(anglediff(Self.lastSpoiderDir,Self.Angle))*0.1, 0.8) + 0.1,0.1)

		const angleDiff = C3.angleDiff(this.previousAngleRad, this.angleRad)

		this.footSpeed = Math.max(
			Math.min(
				0.2 * C3.distanceTo(this.inst.x, this.inst.y, this.previousX, this.previousY) +
					Math.abs(C3.angleDiff(this.previousAngleRad, this.angle)) * 0.1,
				0.8
			) + 0.1,
			0.1
		)

		this.previousX = this.inst.x
		this.previousY = this.inst.y
		this.previousAngleRad = this.angleRad

		let fmovin0 = 0
		let fmovin1 = 0

		//update posts
		this.legs.forEach((leg) => {
			leg.UpdateHomeAndHipPos()
			const distFoot = C3.distanceTo(leg.footPos.x, leg.footPos.y, leg.homePos.x, leg.homePos.y)
			if (leg.moveSet === 0) fmovin0 = Math.max(fmovin0, distFoot)
			else if (leg.moveSet === 1) fmovin1 = Math.max(fmovin1, distFoot)
		})

		if (fmovin0 > this.distTillMove && this.LR !== 0) {
			this.LR = 0
		} else if (fmovin1 > this.distTillMove && this.LR !== 1) {
			this.LR = 1
		}

		if (this.LR === 0) {
			this.footH = -Math.max(0, Math.sin((fmovin0 / this.distTillMove) * Math.PI * 2) * this.footRaise)
			this.legs.forEach((leg) => {
				if (leg.moveSet === 0) {
					leg.footPos.x += (leg.homePos.x - leg.footPos.x) * this.footSpeed
					leg.footPos.y += (leg.homePos.y - leg.footPos.y) * this.footSpeed
				}
			})
		} else if (this.LR === 1) {
			this.footH = -Math.max(0, Math.sin((fmovin1 / this.distTillMove) * Math.PI * 2) * this.footRaise)
			this.legs.forEach((leg) => {
				if (leg.moveSet === 1) {
					leg.footPos.x += (leg.homePos.x - leg.footPos.x) * this.footSpeed
					leg.footPos.y += (leg.homePos.y - leg.footPos.y) * this.footSpeed
				}
			})
		}

		this.legs.forEach((leg) => {
			leg.CalculateKnee(), leg.DrawLeg()
		})

		this.Tick_DrawLegsOutline()
	}

	Tick_DrawLegsOutline() {
		if (!this.runtime.fxManager.drawOutlines) return

		const outlineUnit = this.unit.outline
		if (!outlineUnit || !this.unit.unit_isVisible) {
			return
		}

		this.legPaste.isVisible = true

		const outlinePaste = this.legPaste.effects[0]
		outlinePaste.isActive = true
		outlinePaste.setParameter(0, outlineUnit.getParameter(0))

		for (const leg of this.legs) {
			if (leg.legVisible) {
				this.MatchPaste_Leg(leg.upperLeg)
				this.MatchPaste_Leg(leg.lowerLeg)
			}
		}
		this.legPaste.isVisible = false
	}

	MatchPaste_Leg(glowingAnim) {
		const pasteInst = this.legPaste

		Utils.World_MatchInst(pasteInst, glowingAnim)

		this.runtime.fxManager.DC_DrawOutline(pasteInst)
	}
}

class SpiderLeg {
	constructor(spiderComp, isRight, angleOffset, pairNumber) {
		this.runtime = spiderComp.runtime
		this.spiderComp = spiderComp
		this.isRight = isRight
		this.angleOffset = angleOffset

		this.pairNumber = pairNumber
		this.moveSet = this.pairNumber % 2
		this.homePos = { x: 0, y: 0 }
		this.hipPos = { x: 0, y: 0 }
		this.footPos = { x: 0, y: 0 }
		this.kneePos = { x: 0, y: 0 }

		this.legVisible = true

		if (this.spiderComp.legsPairs === 1) {
			this.moveSet = this.isRight ? 0 : 1
			this.angleOffset = this.isRight ? 89 : -89
		}

		this.UpdateHomeAndHipPos()
		this.footPos = { x: this.homePos.x, y: this.homePos.y }

		this.upperLeg = this.runtime.objects["Leg"].createInstance("Objects", 0, 0)
		this.lowerLeg = this.runtime.objects["Leg"].createInstance("Objects", 0, 0)

		this.spiderComp.inst.addChild(this.upperLeg, {
			destroyWithParent: true,
		})
		this.spiderComp.inst.addChild(this.lowerLeg, {
			destroyWithParent: true,
		})

		this.upperLeg.height = spiderComp.legsWidth
		this.lowerLeg.height = spiderComp.legsWidth

		/*
		this.debugHip = this.runtime.objects["Debug"].createInstance("Objects", 0, 0)

		this.debugHome = this.runtime.objects["Square"].createInstance("Objects", 0, 0)
		this.debugHome.colorRgb = [1, 0, 0]

		this.debugKnee = this.runtime.objects["Square"].createInstance("Objects", 0, 0)
		this.debugKnee.colorRgb = [0, 0, 1]

		this.debugFoot = this.runtime.objects["Square"].createInstance("Objects", 0, 0)
		this.debugFoot.colorRgb = [0, 1, 0]*/
	}

	UpdateHomeAndHipPos() {
		const spider = this.spiderComp

		if (spider.legsPairs === 1) {
			this.angle = C3.toRadians(spider.angle + this.angleOffset)
		} else {
			this.angle = C3.toRadians(
				spider.angle + this.angleOffset - spider.legsSpread / 2 + ((this.pairNumber - 1) * spider.legsSpread) / (spider.legsPairs - 1)
			)
		}

		const cosAngle = Math.cos(this.angle)
		const sinAngle = Math.sin(this.angle)

		this.homePos.x = spider.inst.x + cosAngle * spider.footDist * spider.randomFootDist
		this.homePos.y = spider.inst.y + sinAngle * spider.footDist * spider.randomFootDist

		this.hipPos.x = spider.spiderAnim.x + cosAngle * spider.hipDist
		this.hipPos.y = spider.spiderAnim.y + sinAngle * spider.hipDist

		/*
		this.hipPos.x = spider.inst.x + cosAngle * spider.hipDist
		this.hipPos.y = spider.inst.y + spider.fakeZ + sinAngle * spider.hipDist*/
	}

	DrawLeg() {
		const spider = this.spiderComp
		//this.debugHip.setPosition(this.hipPos.x, this.hipPos.y)

		//this.debugHome.setPosition(this.homePos.x, this.homePos.y)
		//this.debugKnee.setPosition(this.kneePos.x, this.kneePos.y)
		//this.debugFoot.setPosition(this.footPos.x, this.footPos.y)

		this.upperLeg.setPosition(this.hipPos.x, this.hipPos.y)
		this.upperLeg.angle = C3.angleTo(this.hipPos.x, this.hipPos.y, this.kneePos.x, this.kneePos.y)
		this.upperLeg.width = C3.distanceTo(this.hipPos.x, this.hipPos.y, this.kneePos.x, this.kneePos.y)

		this.lowerLeg.setPosition(this.kneePos.x, this.kneePos.y)
		this.lowerLeg.angle = C3.angleTo(this.kneePos.x, this.kneePos.y, this.footPos.x, this.footPos.y)
		this.lowerLeg.width = C3.distanceTo(this.kneePos.x, this.kneePos.y, this.footPos.x, this.footPos.y)

		//Zorder
		const actualAngle = C3.angleTo(spider.inst.x, spider.inst.y, this.footPos.x, this.footPos.y)
		const isOrientedBottom = 0 <= actualAngle && actualAngle <= Math.PI
		if (isOrientedBottom) {
			//this.upperLeg.colorRgb = [0, 0, 0, 1]
			//this.lowerLeg.colorRgb = [0, 0, 0, 1]
			this.lowerLeg.zOrder = this.footPos.y
			this.upperLeg.zOrder = (this.footPos.y + this.hipPos.y) / 2
		} else {
			//this.upperLeg.colorRgb = [1, 0, 0, 1]
			//this.lowerLeg.colorRgb = [1, 0, 0, 1]
			this.upperLeg.zOrder = this.hipPos.y
			this.lowerLeg.zOrder = (this.footPos.y + this.hipPos.y) / 2
		}

		//Draw Shadow
		if (this.spiderComp.legVisible) {
			const drawing = this.runtime.objects["DC_Shadow"].getFirstInstance()
			drawing.line(spider.inst.x, spider.inst.y, this.footPos.x, this.footPos.y, [0, 0, 0, 1], spider.legsWidth)
		}
	}

	CalculateKnee() {
		const spider = this.spiderComp

		const footH = spider.LR === this.moveSet ? spider.footH : 0
		const footPosY = this.footPos.y + footH

		const dist = C3.distanceTo(this.hipPos.x, this.hipPos.y, this.footPos.x, footPosY)

		//overlap return
		if (dist === 0 && spider.upperLegLength === spider.lowerLegLength) {
			this.kneePos.x = this.hipPos.x
			this.kneePos.y = this.hipPos.y

			window.alert("overlap return")
			return
		}
		//no intesection
		else if (dist > spider.upperLegLength + spider.lowerLegLength) {
			this.kneePos.x = this.hipPos.x + (this.footPos.x - this.hipPos.x) * 0.5
			this.kneePos.y = this.hipPos.y + (footPosY - this.hipPos.y) * 0.5
			//window.alert("no intesection")
			return
		}
		// circle intersection calculations
		else {
			//window.alert("intesection")
			const a = spider.upperLegLength ** 2 - spider.lowerLegLength ** 2 + dist ** 2 / (2 * dist)
			let h
			if (spider.upperLegLength ** 2 - a ** 2 < 0) {
				h = Math.sqrt(spider.upperLegLength ** 2 - a ** 2)
			} else h = 0
			//return with fake z
			const cx = this.hipPos.x + (a * (this.footPos.x - this.hipPos.x)) / dist
			const cy = this.hipPos.y + (a * (footPosY - this.hipPos.y)) / dist - h
			this.kneePos.x = cx
			this.kneePos.y = cy
			return
		}
	}
}
