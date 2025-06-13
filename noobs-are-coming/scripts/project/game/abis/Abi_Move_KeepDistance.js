export class Abi_Move_KeepDistance extends C4.Abi_Move {
	constructor(unit, abiName, abiData) {
		super(unit, abiName, abiData)
	}

	Init_Data() {
		super.Init_Data()
		this.SetVars_Default({
			Flee_KeepDist: 100,
			Flee_Margin: 40,

			Flee_Speed_Override: 0,
			Flee_Speed_Acceleration: 0,
			Flee_Speed_Max: 0,

			Flee_LookThreat: false,

			KeepDist_TurnAround: false,
			KeepDist_Speed_Override: 0,
			KeepDist_Speed_Acceleration: 0,
			KeepDist_Speed_Max: 0,

			KeepDist_TurnChange: "1-3",
			KeepDist_DesiredAngle: 0.001,

			//*Abi_Move override
			MovementType: "Follow",

			TargetOverride: [],

			//*common override
			Priority: 0,
			Timer_Cooldown: 0,
			Timer_Prepare1: 0,
			Timer_Prepare2: 0,
			Timer_Execute: -2,
			Timer_Recover: 0,

			Move_RegularAnim: true,
		})
	}

	//*========== CONFIG ====================

	SetAbiInternals() {
		super.SetAbiInternals()

		this.fleeState = "Follow" // Follow/Flee/KeepDist

		this.keepDist = 0

		this.turnAroundMod = Utils.choose(-1, 1)
	}

	Init() {
		super.Init()
		if (this.KeepDist_TurnAround) {
			this.TurnChangeTimer()
		}
	}

	TurnChangeTimer() {
		const duration = Utils.ProcessInterval(this.KeepDist_TurnChange)

		this.timerComp.Timer_Start("TurnChange", duration, () => {
			this.turnAroundMod *= -1
			this.TurnChangeTimer()
		})
	}

	Step_Cancel() {
		super.Step_Cancel()
		this.fleeState = ""
	}

	Tick() {
		this.Tick_UpdateTarget()

		const target = this.targetUnit

		//! BUG TO FIX
		if (!target) {
			this.Tick_Abi_Move()
			return
		}

		const distToTarget = C3.distanceTo(this.unit.x, this.unit.y, target.x, target.y)

		if (distToTarget > this.Flee_KeepDist + this.Flee_Margin) {
			if (this.fleeState !== "Follow") {
				this.fleeState = "Follow"
				this.keepDist = this.Flee_KeepDist + this.Flee_Margin / 2
			}
		} else if (distToTarget < this.Flee_KeepDist) {
			if (this.fleeState !== "Flee") {
				this.fleeState = "Flee"
				this.keepDist = this.Flee_KeepDist + this.Flee_Margin / 2
			}
		}

		//* Regular Follow logic
		if (this.fleeState === "Follow") {
			if (distToTarget < this.keepDist) {
				this.fleeState = "KeepDist_JustNow"
			} else {
				this.Tick_Abi_Move()
			}
		}

		if (this.fleeState !== "Follow") {
			let angleLook = this.Angle_OriginToTarget()
			if (this.fleeState === "Flee") {
				if (distToTarget > this.keepDist) {
					this.fleeState = "KeepDist_JustNow"
				} else {
					this.Tick_Flee()
					if (!this.Flee_LookThreat) {
						angleLook = this.unit.moveComp.AngleOfMotion()
					}
				}
			}
			if (this.fleeState === "KeepDist_JustNow") {
				this.fleeState = "KeepDist"
				this.unit.moveComp.Set_Speed(0)
			}

			if (this.fleeState === "KeepDist") {
				if (this.KeepDist_TurnAround) {
					this.Tick_TurnAroud()
				}
			}

			this.unit.Set_Anim_Mirrored_FromAngle(angleLook)
		}
	}

	Tick_TurnAroud() {
		const dt = this.inst.dt

		if (this.KeepDist_DesiredAngle !== 0.001) {
			const angleFromTarget = this.Angle_OriginToTarget() + 180
			const angleDiff = Utils.angleDiffDeg(this.KeepDist_DesiredAngle, angleFromTarget)

			if (Math.abs(angleDiff) > 12) {
				this.turnAroundMod = Math.sign(angleDiff)
			} else {
				return
			}
		}
		let turnAngle = this.Angle_OriginToTarget() + 90 * this.turnAroundMod
		this.unit.moveComp.Set_AngleOfMotion(turnAngle)

		if (!this.KeepDist_Speed_Override) {
			this.Update_Abi_Move_Speed()
		} else {
			this.unit.Speed_Current = this.unit.Speed_Current + this.KeepDist_Speed_Acceleration * dt
			if (this.KeepDist_Speed_Max > 0) {
				this.unit.Speed_Current = Math.min(this.unit.Speed_Current, this.KeepDist_Speed_Max)
			}
			this.unit.moveComp.Set_Speed(this.unit.Speed_Current)
		}
	}

	Tick_Flee() {
		const dt = this.inst.dt

		this.Set_TargetXY_ToUID()

		const fleeAngle = this.Angle_OriginToTarget() + 180

		//check corners

		const area = this.runtime.objects["Area_Spawn"].getFirstInstance()
		const areaBbox = area.getBoundingBox()
		const instBbox = this.inst.getBoundingBox()

		const padding = 75

		const left = instBbox.left - areaBbox.left < padding
		const right = areaBbox.right - instBbox.right < padding
		const top = instBbox.top - areaBbox.top < padding
		const bottom = areaBbox.bottom - instBbox.bottom < padding
		let nearCorner = false

		let correctedAngle = fleeAngle

		if (left) correctedAngle = 0
		if (right) correctedAngle = 180
		if (top) correctedAngle = 90
		if (bottom) correctedAngle = 270
		if (left && top) {
			correctedAngle = 45
			nearCorner = true
		}
		if (left && bottom) {
			correctedAngle = 315
			nearCorner = true
		}
		if (right && top) {
			correctedAngle = 135
			nearCorner = true
		}
		if (right && bottom) {
			correctedAngle = 225
			nearCorner = true
		}

		//correctedAngle += Utils.random(-10, 10)

		const lerpedAngle = Utils.angleLerpDeg(fleeAngle, correctedAngle, 20 * dt)
		this.unit.moveComp.Set_AngleOfMotion(lerpedAngle)

		if (!this.Flee_Speed_Override) {
			this.Update_Abi_Move_Speed()
		} else {
			this.unit.Speed_Current = this.unit.Speed_Current + this.Flee_Speed_Acceleration * dt
			if (this.Flee_Speed_Max > 0) {
				this.unit.Speed_Current = Math.min(this.unit.Speed_Current, this.Flee_Speed_Max)
			}
			this.unit.moveComp.Set_Speed(this.unit.Speed_Current)
		}
	}

	/*
    IsInCorner(padding) {
        const area = this.runtime.objects["Area_Spawn"].getFirstInstance()
        const areaBbox = area.getBoundingBox()

        const instBbox = this.inst.getBoundingBox()

        const left = instBbox.left - areaBbox.left < padding
        const right = areaBbox.right - instBbox.right < padding
        const top = instBbox.top - areaBbox.top < padding
        const bottom = areaBbox.bottom - instBbox.bottom < padding

    }*/
}
