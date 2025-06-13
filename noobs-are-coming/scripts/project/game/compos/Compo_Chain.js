export class Compo_Chain extends C4.Component {
	constructor(unit, data = null) {
		super(unit, data)
	}

	SetData() {
		this.SetVars_Default({
			LinkCount: 14,
			LinkAnim: "Chain_Link",
			Rope_MinYOffset: -10,

			TargetPoint: "BBoxMid", // "BBoxMid", "BBoxBottom"

			Dist_Min: 50,
			Dist_Max: 100,

			Chain_Force: true,
			Stiffness: 20,
			Damping: 1.5,
			Dist_Rest: 60,

			Force: 50,
		})
	}

	Init() {
		for (let i = 0; i < this.LinkCount; i++) {
			const linkInst = Utils.createAnim(this.LinkAnim, this.inst.x, this.inst.y)
			this.linksInst.push(linkInst)

			const scale = this.unit.scaleProcesed
			linkInst.setSize(linkInst.width * scale, linkInst.height * scale)
		}

		this.Dist_Rest = this.Dist_Rest * Utils.random(0.95, 1.05)

		this._SetTicking(true)
	}

	ReleaseComp() {
		super.ReleaseComp()
		for (const linkInst of this.linksInst) {
			linkInst.destroy()
		}
		this.linksInst = null
	}

	SetInternals() {
		this.chainTargetsUID = []

		this.chainTargetUID = null

		this.linksInst = []
	}

	Tick() {
		super.Tick()

		const targetUnit = this.runtime.getUnitByUID(this.chainTargetUID)
		if (!targetUnit) {
			for (let i = 0; i < this.LinkCount; i++) {
				const linkInst = this.linksInst[i]
				if (linkInst) {
					linkInst.isVisible = false
				}
			}
			return
		}

		let targetX = targetUnit.inst.x
		let targetY = targetUnit.inst.y

		if (this.TargetPoint === "BBoxMid") {
			targetX = targetUnit.bboxMidX
			targetY = targetUnit.bboxMidY
		}

		if (this.Chain_Force) {
			this.unit.moveComp.ApplyElasticForce(targetX, targetY, this.Stiffness, this.Damping, this.Dist_Rest)
		}

		let chainedX = this.inst.x
		let chainedY = this.inst.y

		this.chainAngle = C3.angleTo(targetX, targetY, chainedX, chainedY)

		const midX = (chainedX + targetX) / 2
		const midY = (chainedY + targetY) / 2

		let x = 0
		let y = 0

		for (let i = 0; i < this.LinkCount; i++) {
			const linkInst = this.linksInst[i]
			linkInst.isVisible = true

			x = C3.lerp(chainedX, targetX, i / this.LinkCount)
			y = C3.lerp(chainedY, targetY, i / this.LinkCount)
			linkInst.setPosition(x, y)
		}
	}
}
