C4.Abi_Move = class Abi_Move extends C4.Abi {
	constructor(unit, abiName, abiData) {
		super(unit, abiName, abiData)
	}

	Init_Data() {
		super.Init_Data()
		this.SetVars_Default({
			MovementType: "Recti_Target", //Recti_Target, Recti_Random, Follow, "Recti"

			Speed_Override: 0,
			Speed_Acceleration: 0,
			Speed_Max: 0,
			Distance_Max: 0,
			Recti_EndOnWall: false,
			Follow_AngleSpeed: 0,
			Follow_AngleOffset: false,

			UpdateTarget: true,

			TargetOverride: [],

			Dash_SpecificHitbox: false,
			Dash_Damage: {},

			Target_OffsetDist: 0,
			Target_OffsetAngle: 0.001,
			Target_OffsetAngleSpeed: 0,

			//common
			Timer_Execute: -2,

			Move_RegularAnim: true,

			onWallImpact: () => {},
		})
	}

	//*========== CONFIG ====================

	SetAbiInternals() {
		super.SetAbiInternals()

		this.Angle_Target = 0
		this.BulletDistanceTravelledInit = 0

		/*if (this.MovementType === "Follow") {
			this.Move_RegularLogic = true
		}*/
	}

	Step_Init() {
		if (this.Dash_SpecificHitbox) {
			this.Hitbox = this.runtime.objects["Hitbox"].createInstance("Collisions", this.unit.x, this.unit.y)
			this.inst.addChild(this.Hitbox, {
				transformX: true,
				transformY: true,
				destroyWithParent: true,
			})
			this.Hitbox.Damage = new C4.Damage(this.runtime)

			this.Hitbox.Damage.SetDamageFromData({
				Angle_Hit: "EntityMotion",
			})
		}

		this.targetOffsetAngle = this.Target_OffsetAngle
		if (this.targetOffsetAngle === 0.001) this.targetOffsetAngle = Utils.random(360)
		this.targetOffsetDist = Utils.ProcessInterval(this.Target_OffsetDist)

		this.targetOffsetDist = this.Target_OffsetDist

		if (this.targetOffsetDist) {
			console.error("Move_TargetOffset", this, this.targetOffsetDist, this.targetOffsetAngle)
		}

		this.unit.inst.addEventListener("On_Solid_Hit", () => this.On_Solid_Hit())
	}

	On_Solid_Hit() {
		if (this.Recti_EndOnWall) {
			this.onWallImpact()

			//window.alert("On_Solid_Hit")
			if (this.step === "AB_Execute") {
				this.Call_Step("AB_Recover")
			}
		}
	}

	Step_Start() {
		if (this.MovementType !== "Follow") {
			this.unit.moveComp.onSolid = "Bounce"
		}
	}

	Step_Execute() {
		const moveComp = this.unit.moveComp
		const charaComp = this.unit.charaComp
		this.unit.Speed_Current = this.Speed_Override ? this.Speed_Override : this.unit.Speed_Walk
		if (this.Distance_Max > 0) {
			this.BulletDistanceTravelledInit = moveComp.DistanceTravelled
		}

		if (this.MovementType === "Recti_Target") {
			this.Angle_Target = this.Angle_OriginToTarget()
			moveComp.Set_AngleOfMotion(this.Angle_Target)
		} else if (this.MovementType === "Recti_Random") {
			this.Angle_Target = Math.random() * 360
			moveComp.Set_AngleOfMotion(this.Angle_Target)
		} else if (this.MovementType === "Ortho_Random") {
			this.Angle_Target = Utils.choose(0, 90, 180, 270)
			moveComp.Set_AngleOfMotion(this.Angle_Target)
		} else if (this.MovementType === "Follow") {
			this.Angle_Target = this.Angle_OriginToTarget()
			moveComp.Set_AngleOfMotion(this.Angle_Target)
		}
	}

	Step_Recover() {
		this.unit.Speed_Current = 0
	}

	Tick_UpdateTarget() {
		if (this.UpdateTarget) {
			this.targetUID = this.unit.targetUID

			if (this.TargetOverride.length > 0) {
				const allTargets = this.runtime.units.GetUnitsByTags(this.TargetOverride, "Chara")
				if (allTargets.length === 0) return
				const randomTarget = Utils.Array_Random(allTargets)
				this.targetUID = randomTarget.unit.uid
				//console.error("TargetOverride", randomTarget.unit.uid)
			}
		}
	}

	Update_Abi_Move_Speed() {
		const dt = this.inst.dt
		this.unit.Speed_Current = this.unit.Speed_Current + this.Speed_Acceleration * dt
		if (this.Speed_Max > 0) {
			this.unit.Speed_Current = Math.min(this.unit.Speed_Current, this.Speed_Max)
		}
		this.unit.moveComp.Set_Speed(this.unit.Speed_Current)
	}

	Move_SetTarget() {
		this.Set_TargetXY_ToUID()

		const dt = this.inst.dt

		if (this.targetOffsetDist > 0) {
			if (this.Target_OffsetAngleSpeed > 0) {
				this.targetOffsetAngle += this.Target_OffsetAngleSpeed * dt
			}

			const targetAngle = this.targetOffsetAngle
			const angleRad = C3.toRadians(targetAngle)

			const offsetX = Math.cos(angleRad) * this.targetOffsetDist
			const offsetY = Math.sin(angleRad) * this.targetOffsetDist

			//console.error("Move_TargetOffset", offsetX, offsetY)

			this.targetX += offsetX
			this.targetY += offsetY
		}
	}

	Tick_Abi_Move() {
		if (this.step === "AB_Execute") {
			const moveComp = this.unit.moveComp
			const charaComp = this.unit.charaComp

			const dt = this.inst.dt

			let move = true
			if (this.MovementType === "Follow") {
				this.Move_SetTarget() //update Target
				move = this.DistanceToTarget() > this.unit.Target_DistanceAprox1
				if (move) {
					if (this.Follow_AngleSpeed > 0) {
						const currentAngle = this.unit.moveComp.AngleOfMotion()
						const targetAngle = this.Angle_OriginToTarget()
						const lerpedAngle = Utils.angleLerpDeg(currentAngle, targetAngle, this.Follow_AngleSpeed * dt)

						this.unit.moveComp.Set_AngleOfMotion(lerpedAngle)
					} else {
						this.unit.moveComp.Set_AngleOfMotion(this.Angle_OriginToTarget())
					}
				}
			}

			//console.error("Spider", this.MovementType, this.Follow_AngleSpeed)
			else if (this.MovementType === "Recti_Target" && this.Follow_AngleSpeed > 0) {
				this.Move_SetTarget()
				const currentAngle = this.unit.moveComp.AngleOfMotion()
				const targetAngle = this.Angle_OriginToTarget()
				const newAngle = Utils.angleRotateDeg(currentAngle, targetAngle, this.Follow_AngleSpeed * dt)

				this.unit.moveComp.Set_AngleOfMotion(newAngle)

				//Utils.debugText("Spider", currentAngle.toFixed(0), targetAngle.toFixed(0), newAngle.toFixed(0))

				//this.unit.anim.colorRgb = [1, 0, 0]
			}

			/*else {
				this.unit.anim.colorRgb = [1, 1, 1]
			}*/

			this.Update_Abi_Move_Speed()

			if (!move) {
				this.unit.moveComp.Set_Speed(0)
				this.unit.Speed_Current = this.Speed_Override ? this.Speed_Override : this.unit.Speed_Walk
			}

			this.unit.Set_Anim_Mirrored_FromAngle(this.unit.moveComp.AngleOfMotion())

			//TODO distanceMax
		}
	}

	//! careful, KeepDistance depends on this
	Tick() {
		this.Tick_UpdateTarget()
		this.Tick_Abi_Move()
	}

	angleToDeg360(angle) {
		return (C3.toDegrees(angle) + 360) % 360
	}
}
