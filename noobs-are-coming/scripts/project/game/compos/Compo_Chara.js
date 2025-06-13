export class Compo_Chara extends C4.Component {
	constructor(unit, data = null) {
		super(unit, data)

		//*=============== RUNTIME ===============*//

		this.created = false

		this.angle_aim = 0

		this.recoil_value = 0
		this.recoil_angle = 0
		this.recoil_duration = 0

		this.targetX = 0
		this.targetY = 0
		this.targetUID = 0
	}

	get isFacingRight() {
		return this.anim.width > 0
	}

	get anim() {
		return this.unit.anim
	}

	PostCreate() {
		//
	}

	LOS_ToObject(fromPoint, toObject, toPoint) {
		//
	}

	//* Target

	get targetInst() {
		const targetInst = this.runtime.getInstanceByUid(this.targetUID)
		if (!targetInst) this.targetUID = 0
		return targetInst
	}

	get targetUnit() {
		const targetUnit = this.runtime.getUnitByUID(this.targetUID)
		if (!targetUnit) this.targetUID = 0
		return targetUnit
	}

	TargetXYFromUID() {
		const inst = this.targetInst
		if (!inst) return [0, 0]
		return [inst.x, inst.y]
	}

	HasTarget() {
		if (this.targetUID === 0) return false
		const inst = this.targetInst
		if (this.targetUID === 0) return false
		return true
	}

	Set_TargetXY(x, y) {
		this.targetX = x
		this.targetY = y
	}

	Set_TargetXY_ToUID(offsetX = 0, offsetY = 0) {
		if (this.targetUID === 0) return
		const inst = this.targetInst
		if (!inst) {
			this.targetUID = 0
			return
		}
		this.targetX = inst.x + offsetX
		this.targetY = inst.y + offsetY
	}

	Set_TargetXY_ByAngle(from, angle, dist) {
		//origin
		if (from === "origin") {
			this.targetX = this.inst.x + Math.cos(C3.toRadians(angle)) * dist
			this.targetY = this.inst.y + Math.sin(C3.toRadians(angle)) * dist
		}
		//bbox
		else {
			const bbox = this.inst.getBoundingBox()
			const midX = (bbox.left + bbox.right) / 2
			const midY = (bbox.top + bbox.bottom) / 2
			this.targetX = midX + Math.cos(C3.toRadians(angle)) * dist
			this.targetY = midY + Math.sin(C3.toRadians(angle)) * dist
		}
	}

	Angle_OriginToTarget() {
		return C3.toDegrees(C3.angleTo(this.inst.x, this.inst.y, this.targetX, this.targetY))
	}
	Angle_BboxMidToTarget() {
		const bbox = this.inst.getBoundingBox()
		const midX = (bbox.left + bbox.right) / 2
		const midY = (bbox.top + bbox.bottom) / 2
		const angle = C3.toDegrees(C3.angleTo(midX, midY, this.targetX, this.targetY))

		console.error("Angle_BboxMidToTarget", angle)
		return angle
	}

	DistanceToTarget() {
		return C3.distanceTo(this.inst.x, this.inst.y, this.targetX, this.targetY)
	}

	Set_Angle_Aim(angle) {
		this.angle_aim = Utils.angle360(angle)
	}

	Angle_Aim() {
		return this.angle_aim
	}

	Call_OnRecoil(type = 0, angle, value, duration = 0.3) {
		this.recoil_angle = angle
		this.recoil_value = value
		this.recoil_duration = duration

		if (type === 0) {
			this.Trigger("OnRecoil")
		}
		if (type === 1) {
			this.Trigger("OnKnockback")
		}
	}

	OnRecoil() {
		return true
	}

	OnKnockback() {
		return true
	}

	//======== INIT ========

	CallCreated() {
		this.Trigger("OnCreated")
		this.created = true
	}

	CallDestroyed() {
		this.Trigger("OnDestroyed")
	}

	OnCreated() {
		this.created = true
		return true
	}

	IsCreated() {
		return this.created
	}
}
