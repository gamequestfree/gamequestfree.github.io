//TODO rename Recoil_Position to Recoil_Position

export class Compo_Handle extends C4.Component {
	constructor(unit, data = null) {
		super(unit, data)
	}

	SetData() {
		this.SetVars_Default({
			HandType: "Weapon", // Weapon, Melee_Bullet, Melee_Tween, Arm, Invisible, Inactive
			Hand_SetAngle: true,

			MaxHoldDist: 20,
			AngleSpeed: 0,
			MoveSpeed: 100,
			Hand_AngleOffset: 0,
			Pos_AngleOffset: 0,
			Recoil_Angle: 0,
			Recoil_Position: 3,

			Tween_AngleSpeed: 70,

			Sweep_DurationRecoil: 0.1,
			Sweep_Duration: 0.4,

			Thrust_DurationArr: [0.2, 0, 0.2], // [in, pause, out]

			TweenMode: "No", // No, Sweep, Thrust, Alternate
		})
	}

	SetInternals() {
		//Debug

		this.UID_Entity = 0
		this.unitChara = null

		//set by action
		this.angle_aim = 0
		this.angleIsEntityAim = true

		this.isActive = false //is currently selected

		this.isTweening = false
		this._mirroredMod = 0

		this.isArm = false

		this._meleeFlip_Mod = 1

		this._pivotDist_current = 0

		//PROCANIM

		this.BASE_ATK_DURATION = 0.2
		this.rangeFactor = 0

		this.iBeh_tween = this.inst.behaviors["Tween"]

		this.pivotParent = false

		this.pivotOffsetX = 0
		this.pivotOffsetY = 0

		this.pivotImagePoint = null

		this.pivotOverride_Mod = "offset" // offset, absolute
		this.pivotOverride = null
	}

	Init() {
		if (this.HandType === "Invisible") {
			this.unit.anim.isVisible = false
		}

		this.TweenMode_Actual = this.TweenMode === "Alternate" ? "Sweep" : this.TweenMode

		this.Try_StartTicking()
	}

	Try_StartTicking() {
		if (!this.charaComp) return
		if (this.HandType === "Inactive") return
		this._SetTicking(true)
	}

	PostCreate() {
		this.juiceComp = this.unit.GetComponent("Juice")
		this.wep = this.unit.GetComponent("WEP")
	}

	ReleaseComp() {
		this.UID_Entity = 0
		this.charaComp = null
		this.unitChara = null
		this.iBeh_tween = null
		this.juiceComp = null
		this.wep = null
	}

	get inst_Anim() {
		return this.unitChara.anim
	}

	//utils

	//

	Tick() {
		this.dt = this.inst.dt
		//Is Melee Tweening
		if (this.tweenSweep_x) {
			const angleAim = this.GetAngleAim()
			const anglePerpendicular = angleAim + 90
			const pivots = this.GetPivotXY()
			let x = pivots[0] + Utils.cosDeg(angleAim) * (this.tweenSweep_x.value + this.MaxHoldDist)
			let y = pivots[1] + Utils.sinDeg(angleAim) * (this.tweenSweep_x.value + this.MaxHoldDist)
			x += Utils.cosDeg(anglePerpendicular) * this.tweenSweep_y.value
			y += Utils.sinDeg(anglePerpendicular) * this.tweenSweep_y.value
			this.inst.angle = C3.toRadians(angleAim) + this.tweenSweep_a.value
			this.inst.setPosition(x, y)
		} else {
			this.Tick_Angle()
			this.Tick_Position()

			/*
			if (this.juiceComp) {
				this.juiceComp.overridePos = [true, true]
			}*/
		}
	}

	Set_EntityUID(UID_Entity) {
		//this.Init() //would create infinite loop ?

		this.UID_Entity = UID_Entity

		this.unitChara = this.runtime.getUnitByUID(UID_Entity)
		this.charaComp = this.unitChara.GetComponent("Character")

		this.Try_StartTicking()
	}

	//TODO : multiplier x 0.8 for pivotDistance on Entity Roll,
	//TODO : Weapon ZOrder

	GetPivotXY() {
		let pivotX
		let pivotY

		if (this.pivotOverride) {
			if (this.pivotOverride_Mod === "offset") {
				pivotX = this.unitChara.bboxMidX
				pivotY = this.unitChara.bboxMidY
				pivotX += this.pivotOverride[0]
				pivotY += this.pivotOverride[1]
			} else if (this.pivotOverride_Mod === "absolute") {
				pivotX = this.pivotOverride[0]
				pivotY = this.pivotOverride[1]
			}
		} else if (this.pivotParent && this.inst.getParent()) {
			const parent = this.inst.getParent()
			pivotX = parent.x
			pivotY = parent.y
		} else if (this.pivotImagePoint && this.inst_Anim) {
			const ip = this.inst_Anim.getImagePoint(this.pivotImagePoint)
			pivotX = ip[0]
			pivotY = ip[1]
		} else if (this.unitChara) {
			pivotX = this.unitChara.bboxMidX
			pivotY = this.unitChara.bboxMidY
		} else {
			pivotX = this.inst.x
			pivotY = this.inst.y
		}
		pivotX += this.pivotOffsetX
		pivotY += this.pivotOffsetY
		return [pivotX, pivotY]
	}

	Tick_Position() {
		if (this.HandType === "Invisible") {
			if (this.unitChara) {
				let x = this.unitChara.bboxMidX
				let y = this.unitChara.bboxMidY
				this.inst.setPosition(x, y)
			}
		} else {
			const pivots = this.GetPivotXY()
			//this.inst.setPosition(pivots[0], pivots[1])

			const angle = this.inst.angleDegrees // this.charaComp.Angle_Aim()

			this._pivotDist_current = C3.lerp(this._pivotDist_current, this.MaxHoldDist, this.MoveSpeed * this.dt)

			//parent is Weapon_Point
			if (false) {
				//pivot_point
			} else if (this.charaComp) {
				const pivots = this.GetPivotXY()

				let x = pivots[0] + Utils.cosDeg(angle + this.Pos_AngleOffset) * this._pivotDist_current
				let y = pivots[1] + Utils.sinDeg(angle + this.Pos_AngleOffset) * this._pivotDist_current

				if (this.thrustTween) {
					x = pivots[0] + Utils.cosDeg(angle) * (this.thrustTween.value + this.MaxHoldDist)
					y = pivots[1] + Utils.sinDeg(angle) * (this.thrustTween.value + this.MaxHoldDist)
				}

				this.inst.setPosition(x, y)
			}
		}
	}

	GetAngleAim() {
		return this.angleIsEntityAim ? this.charaComp.Angle_Aim() : this.angle_aim
	}

	Tick_Angle() {
		//!ToFix ()
		const angleAim = this.GetAngleAim()

		//if (!this.IsCustomType()) //? ToCheck which is the right condition

		if (!this.Hand_SetAngle) return

		if (this.HandType === "Invisible" || this.AngleSpeed <= 0) {
			this.inst.angleDegrees = angleAim
		} else {
			let targetAngle = angleAim + this.Hand_AngleOffset * this._mirroredMod * this._meleeFlip_Mod
			targetAngle = C3.angleLerp(this.inst.angle, C3.toRadians(targetAngle), this.AngleSpeed * this.dt)
			//radians
			this.inst.angle = targetAngle
		}

		//if (this.unit.anim) this.unit.anim.angle = this.inst.angle

		this._Check_Flipped()
	}

	_Check_Flipped() {
		const angleDegrees = this.inst.angleDegrees
		//TODO (check if this is correct and angle360)
		if (angleDegrees <= 270 && angleDegrees >= 90) {
			this._Set_Flipped(true)
		} else {
			this._Set_Flipped(false)
		}
	}

	_Set_Flipped(bool) {
		const oldH = this.inst.height
		this._mirroredMod = bool ? -1 : 1
		const newH = Math.abs(oldH) * this._mirroredMod
		if (oldH === newH) return

		this.inst.height = newH
		if (this.unit.anim) this.unit.anim.height = this.inst.height
	}

	Override_Angle_Aim(aimAngle) {
		//override
		this.angleIsEntityAim = false
		this.angle_aim = aimAngle
	}

	Override_Angle_Aim_Stop() {
		this.angleIsEntityAim = true
	}

	IsCustomType() {
		return this.HandType === "Custom" || this.HandType === "Melee_Tween"
	}

	UseHand() {
		if (!this.IsCustomType()) {
			//window.alert("Use_Hand " + this.Recoil_Angle)
			//Handling recoil position
			const pivotCurrent = this._pivotDist_current - this.Recoil_Position
			if (this.HandType === "Melee") {
				this._pivotDist_current = Utils.clamp(pivotCurrent, -this.MaxHoldDist * 1.5, this.MaxHoldDist * 1.5)
			} else {
				this._pivotDist_current = Utils.clamp(pivotCurrent, -this.MaxHoldDist, this.MaxHoldDist)
			}

			//Handling recoil angle
			//this.inst.angleDegrees = this.inst.angleDegrees - this.Recoil_Angle * Math.sign(this.inst.height)

			/*
			if (this.Recoil_Angle !== 0) {
				//window.alert("Recoil_Angle " + this.Recoil_Angle)
				this.unit.juice.Spring_StartOffset("angle", {
					name: "Hand_AngleRecoil",
					pos: [this.Recoil_Angle],
					//destroyOnStable: false,
				})
			}*/
		} else {
			const allMeleeAlternates = this?.unit?.player?.effects?.GetBool("Melee_AllAlternates")

			if (allMeleeAlternates || this.TweenMode === "Alternate") {
				if (this.TweenMode_Actual === "Sweep") {
					this.TweenMode_Actual = "Thrust"
				} else if (this.TweenMode_Actual === "Thrust") {
					this.TweenMode_Actual = "Sweep"
				}
			}

			if (!this.wep.Hitbox) {
				window.alert("No Hitbox")
				return
			}

			const range = this.unit.GetRange_Value()

			if (this.TweenMode_Actual === "Sweep") {
				this.Sweep(range)
			} else if (this.TweenMode_Actual === "Thrust") {
				this.Thrust(range, "out-bounce", "in-quartic", this.Thrust_DurationArr)
			}
		}

		//Set Entity Animation ?? (wasn't implemented yet)
	}

	async Thrust(distance, easeIn, easeOut, durationArr) {
		this.unit.tween_startAngle = this.unit.angleDegrees

		const durationIn = durationArr[0] || 0.2
		const durationPause = durationArr[1] || 0
		const durationOut = durationArr[2] || durationIn

		if (!this.iBeh_tween || this.tweenSweep_x || this.thrustTween) return

		//"out-exponential"
		easeIn = "out-bounce"
		easeOut = "out-quartic"

		//start
		this.isTweening = true

		this.thrustTween = this.iBeh_tween.startTween("value", distance, durationIn, easeIn)

		this.wep.Hitbox_Toggle(true)

		this.unit.Trigger("Thrust_Start")

		await this.thrustTween.finished

		//pause
		this.thrustTween = this.iBeh_tween.startTween("value", distance, durationOut, easeOut, {
			startValue: distance,
		})

		await this.thrustTween.finished

		this.wep.Hitbox_Toggle(false)

		//end
		this.thrustTween = this.iBeh_tween.startTween("value", 0, durationOut, easeOut, {
			startValue: distance,
		})

		await this.thrustTween.finished

		this.thrustTween = null
		this.isTweening = false
	}

	async Sweep(distance) {
		if (!this.iBeh_tween || this.thrustTween) return
		if (this.sweepStep && this.sweepStep !== "end") return

		//for sweep with high range accuracy
		if (this.unit.distEnemyInRange) {
			distance = Math.min(distance, this.unit.distEnemyInRange)
			distance = Math.max(distance, this.unit.GetRangeBase_Value())
		}

		this.unit.tween_startAngle = this.unit.angleDegrees

		this.isTweening = true

		const MIN_SWEEP_DISTANCE = 50

		if (!this.tweenCount) this.tweenCount = 0
		this.tweenCount++
		const tweenCount = this.tweenCount

		const recoil = 25
		let durationRecoil = this.Sweep_DurationRecoil

		const side_range = distance / 2
		const sweep_angle = 0.9 * Math.PI
		const sweep_duration = this.Sweep_Duration

		if (!this.modSweep) this.modSweep = 1
		this.modSweep = -this.modSweep

		const side_a = side_range * this.modSweep
		const side_b = -side_range * this.modSweep
		const angle_a = sweep_angle * this.modSweep
		const angle_b = -sweep_angle * this.modSweep

		/*const easeRecoil = "out-sine"
		const easeSweep = "in-sine"
		const easeEnd = "out-sine"*/

		const easeRecoil = "linear"
		const easeSweep = "linear"
		const easeEnd = "linear"

		let startX = 0
		let startY = 0
		let startA = 0

		//interrupt, need to fix await

		if (this.sweepStep === "end") {
			startX = this.tweenSweep_x.value
			//durationRecoil = durationRecoil * (1 - this.tweenSweep_x.progress)
			startY = this.tweenSweep_y.value
			startA = this.tweenSweep_a.value
			/*
				this.tweenSweep_x.stop()
				this.tweenSweep_y.stop()
				this.tweenSweep_a.stop()
				
				this.tweenSweep_x = this.iBeh_tween.startTween("value", -recoil, durationRecoil, easeRecoil, {
					tags: "sweepX",
					startValue: startX
				})*/
		}

		//recoil
		this.sweepStep = "recoil"

		this.tweenSweep_x = this.iBeh_tween.startTween("value", -recoil, durationRecoil, easeRecoil, {
			tags: "sweepX",
			startValue: startX,
		})
		this.tweenSweep_y = this.iBeh_tween.startTween("value", side_a, durationRecoil, easeRecoil, {
			tags: "sweepY",
			startValue: startY,
		})
		this.tweenSweep_a = this.iBeh_tween.startTween("value", angle_a, durationRecoil, easeRecoil, {
			tags: "sweepA",
			startValue: startA,
		})

		await this.tweenSweep_x.finished
		if (this.tweenCount !== tweenCount) return

		//Play Sweep SFX
		//Enable Hitbox

		this.wep.Hitbox_Toggle(true)

		this.unit.Trigger("Sweep_Start")

		//sweep
		this.sweepStep = "sweep"

		//x from -recoil to distance
		this.tweenSweep_x = this.iBeh_tween.startTween("value", distance, sweep_duration / 2, easeSweep, {
			tags: "sweepX",
			startValue: -recoil,
			pingPong: true,
		})
		//y from side_range to -side_range
		this.tweenSweep_y = this.iBeh_tween.startTween("value", side_b, sweep_duration, easeSweep, {
			tags: "sweepY",
			startValue: side_a,
		})
		//a from sweep_angle to -sweep_angle
		this.tweenSweep_a = this.iBeh_tween.startTween("value", angle_b, sweep_duration, easeSweep, {
			tags: "sweepA",
			startValue: angle_a,
		})

		await this.tweenSweep_y.finished

		this.wep.Hitbox_Toggle(false)

		//end
		this.sweepStep = "end"

		this.tweenSweep_x = this.iBeh_tween.startTween("value", 0, durationRecoil, easeEnd, {
			tags: "sweepX",
			startValue: -recoil,
		})
		this.tweenSweep_y = this.iBeh_tween.startTween("value", 0, durationRecoil, easeEnd, {
			tags: "sweepY",
			startValue: side_b,
		})
		this.tweenSweep_a = this.iBeh_tween.startTween("value", 0, durationRecoil, easeEnd, {
			tags: "sweepA",
			startValue: angle_b,
		})

		/*
			const endTweenX = this.tweenSweep_x
			await endTweenX*/

		await this.tweenSweep_x.finished
		if (this.tweenCount !== tweenCount) return

		this.sweepStep = null
		this.tweenSweep_x = null

		this.isTweening = false
	}

	/*

        this.tweenSweep_x = this.iBeh_tween.startTween("value", distance, sweep_half_duration, "linear", {
				startValue: recoil
			})
			this.tweenSweep_y = this.iBeh_tween.startTween("value", 0, sweep_half_duration, "linear", {
				startValue: side_a
			})
			this.tweenSweep_a = this.iBeh_tween.startTween("value", 0, sweep_half_duration, "linear", {
				startValue: recoil
			})

			await this.tweenSweep_x

			//sweep out

			this.tweenSweep_x = this.iBeh_tween.startTween("value", -recoil, sweep_half_duration, "linear", {
				startValue: distance
			})
			this.tweenSweep_y = this.iBeh_tween.startTween("value", side_b, sweep_half_duration, "linear", {
				startValue: 0
			})
			this.tweenSweep_a = this.iBeh_tween.startTween("value", angle_b, sweep_half_duration, "linear", {
				startValue: 0
			})

        */

	//* TWEEN

	/*
		Get_RangeFactor(distance) {
			const rangefactor = distance / Utils.clamp(70 * (1 + this.atkSpeed / 3), 70, 120)
			return Math.max(0, rangefactor)
		}

		Get_AtkDuration() {
			let atkDuration = this.BASE_ATK_DURATION - this.atkSpeed / 10
			atkDuration = Math.max(0.01, atkDuration)
			atkDuration += this.rangeFactor * 0.15
			return atkDuration
		}

		Get_TweeningTotalDuration() {
			return this.atkDuration / 2 + this.backDuration + this.recoilDuration
		}

		Update_AtkDuration(distance) {
			this.rangeFactor = this.Get_RangeFactor(distance)
			this.atkDuration = this.Get_AtkDuration()
		}*/

	OnTween_Prepared() {
		return true
	}

	OnTween_StartReturn() {
		return true
	}

	OnTween_Returned() {
		return true
	}
}
