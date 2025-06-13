C4.Abi = class Abi {
	constructor(unit, abiName, abiData) {
		this.Init_Data()
		this.SetVars(abiData)

		this.unit = unit
		this.inst = unit.inst
		this.runtime = unit.runtime
		this.name = abiName

		this._tickFunction = this._Tick.bind(this)

		this.SetAbiInternals()
		this.ProcessVars()
	}

	//*========== CONFIG ====================

	Init_Data() {
		//
	}

	SetVars_Default(data) {
		const vars = {
			Name: "MyAbi",

			Priority: 1,
			Range: 9999,
			CanBeInterrupted: true,

			Timer_Cooldown: 0,
			Timer_Prepare1: 0,
			Timer_Prepare2: 0,
			Timer_Execute: 0,
			Timer_Recover: 0,

			Bar_Prepare: false,
			Bar_Execute: false,

			Repeat: 0,

			Move_RegularAnim: false,
			Move_RegularLogic: false,

			LookTarget_Prepare1: true,
			Anim_Prepare1: "",
			Anim_Execute: "",
			Anim_Recover: "",

			DamageOnContact: {},

			SubAbis: [],

			Events_Start: [],
			Events_Prepare2: [],
			Events_Execute: [],
			Events_Recover: [],
			Events_End: [],

			onInit: () => {},
			onStart: () => {},
			onPrepare1: () => {},
			onPrepare2: () => {},
			onExecute: () => {},
			onStopExecute: () => {},
			onRecover: () => {},
			onEnd: () => {},
			onCancel: () => {},
			isPrepare1: () => {},
			isPrepare2: () => {},
			isExecute: () => {},
			isRecover: () => {},
			conditionCheck: () => {
				return true
			},
		}

		data = Object.assign(vars, data)

		Utils.SetVars_Default(this, data)
	}

	SetVars(data) {
		Utils.SetVars(this, data)
	}

	ProcessVars() {
		Utils.ProcessVars(this)
	}

	SetAbiInternals() {
		//this.abiChild

		this.timer = 0
		this.activationCount = 0

		this.step = "AB_Idle"

		this.targetX = 0
		this.targetY = 0

		this.uid_entity = 0
		this.parentAbi = null
		this.brain = null
		this.init = false

		this._isTicking = false

		this.subAbis = []
	}

	_SetTicking(bool) {
		if (this._isTicking === bool) return
		//if (!bool) window.alert("Abi SetTicking false " + this.name)
		if (bool) this.runtime.addEventListener("tick", this._tickFunction)
		else this.runtime.removeEventListener("tick", this._tickFunction)
		this._isTicking = bool
	}

	PostCreate() {
		this.Timer_Prepare2 = Math.max(0, this.Timer_Prepare2)
	}

	_SetTimer(timer) {
		this.timer = timer
		if (this.timer >= 0) {
			this._SetTicking(true)
		}
	}

	ReleaseAbi() {
		//window.alert("ReleaseAbi " + this.name)
		this.unit = null
		this.inst = null
		this._SetTicking(false)
	}

	Tick() {
		/*to implement*/
	}

	_Tick() {
		if (!this._isTicking) {
			//! ToKeep: this is due to async call, the tick is called after the ability is released

			return
		}
		if (!this.unit) {
			//! TODO careful SHOULD NEVER HAPPEN, possible memory leak
			console.error("⛔ Abi Tick no unit", this.name, this)
			this.ReleaseAbi()
			return
		}
		this.Tick()
		const dt = this.runtime.dt
		this.timer = this.timer - dt

		if (this.step === "AB_Start") {
			this.isPrepare1()
		} else if (this.step === "AB_Prepare2") {
			this.isPrepare2()
		} else if (this.step === "AB_Execute") {
			this.isExecute()
		} else if (this.step === "AB_Recover") {
			this.isRecover()
		}

		//* Timer ends
		if (this.timer <= 0) {
			this.timer = 0
			//* Start -> Prepare2 -> Execute -> Recover -> End -> Idle

			//Start/Prepare1 -> Prepare2
			if (this.step === "AB_Start") {
				this.Call_Step("AB_Prepare2")
			}
			//Prepare2 -> Execute
			else if (this.step === "AB_Prepare2") {
				this.Call_Step("AB_Execute")
			}
			//Execute -> Recover
			else if (this.step === "AB_Execute") {
				this.Call_Step("AB_Recover")
			}
			//Recover -> End/Cooldown
			else if (this.step === "AB_Recover") {
				this.Call_Step("AB_End")
			}

			//End/Cooldown -> Idle
			else if (this.step === "AB_End" || this.step === "AB_Cancel") {
				this.Call_Step("AB_Idle")
			}

			//ConditionCheck -> Idle
			else if (this.step === "AB_ConditionCheck") {
				this.Call_Step("AB_Idle")
				this.timer = this.Timer_ConditionCheck
			}
		}
	}

	//* However, Set_AB_Start, allow to set the step value to start :D (useful for very specific purpose)
	//! useful for Skill_MultiDash ?
	Set_AB_Start() {
		this.step = "AB_Start"
	}

	//======== STEP ========

	Call_Step(step) {
		if (this.step === "AB_Execute" && step !== this.step) {
			this.Step_StopExecute()
			this.onStopExecute()
		}

		//!todo AB_ConditionCheck_Is_
		this.step = step

		//if (step !== "AB_Idle") this._SetTicking(true)
		switch (step) {
			case "AB_Start":
				this.timer = Utils.ProcessInterval(this.Timer_Prepare1)
				if (this.timer === -2) this.timer = Infinity
				else if (this.timer === -1) {
					//todo special case
					//this.timer = this.brain._GetAnimationLength(this.Anim_Execute)
				}

				this.Step_Start()
				this.onStart()
				break
			case "AB_Prepare2":
				this.timer = Utils.ProcessInterval(this.Timer_Prepare2)
				this.Step_Prepare2()
				this.onPrepare2()
				break
			case "AB_Execute":
				this.brain._SetAnimation(this.Anim_Execute)
				//if (this.brain.debug) console.error("EXECUUUTE", this.Anim_Execute)

				this.timer = Utils.ProcessInterval(this.Timer_Execute)

				if (this.timer === -2) this.timer = Infinity
				else if (this.timer === -1) {
					this.timer = this.brain._GetAnimationLength(this.Anim_Execute)
				}
				//if (this.brain.debug) console.error("EXECUUUTE", this.timer, this.Timer_Execute)
				if (this.name.startsWith("Bruiser")) console.error("EXECUUUTE", this.name, this.timer, this.Timer_Execute)

				this.Step_Execute()
				this.onExecute()
				break
			case "AB_Recover":
				this.brain._SetAnimation(this.Anim_Recover)

				this.timer = Utils.ProcessInterval(this.Timer_Recover)

				if (this.timer === -2) this.timer = Infinity
				else if (this.timer === -1) {
					this.timer = this.brain._GetAnimationLength(this.Anim_Recover)
				}

				if (this.brain.debug) console.error("RECOVER", this.timer, this.Timer_Recover)
				this.Step_Recover()
				this.onRecover()
				break
			case "AB_End":
				this.brain.Brain_Abi_End(this)
				this.timer = Utils.ProcessInterval(this.Timer_Cooldown)
				this.Step_End()
				this.onEnd()
				break
			case "AB_Cancel":
				this.timer = Utils.ProcessInterval(this.Timer_Cooldown)
				this.Step_Cancel()
				this.onCancel()
				break
			case "AB_Idle":
				this.timer = 0
				//this._SetTicking(false)
				break
			default:
		}

		this.ExecuteEvents(step)

		this.unit.Trigger("On_" + step)
	}

	Trigger(name, ...args) {
		if (this[name] && typeof this[name] === "function") {
			this[name](...args) // Pass the arguments to the function
		}
	}

	ExecuteEvents(step) {
		step = step.replace("AB_", "")
		const events = this["Events_" + step]
		if (!events || events.length === 0) return

		for (const [n, args] of Object.entries(events)) {
			if (n === "Shake") {
				this.unit.juice.Shake(args)
			}
			if (n === "PlaySound") {
				this.runtime.audio.PlaySound_Args(args)
			}
			if (n === "OutlineStrong") {
				this.unit.OutlineStrong(args)
			}
		}
	}

	//*Target

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
		const inst = this.targetInst
		if (!inst) return
		this.targetX = inst.x + offsetX
		this.targetY = inst.y + offsetY
	}

	DistanceToTarget() {
		return C3.distanceTo(this.inst.x, this.inst.y, this.targetX, this.targetY)
	}

	Angle_OriginToTarget() {
		if (!this.brain) return 0
		const inst = this.brain.inst

		return C3.toDegrees(C3.angleTo(inst.x, inst.y, this.targetX, this.targetY))
	}
	Angle_BboxMidToTarget() {
		if (!this.brain) return 0
		const bbox = this.brain.inst.getBoundingBox()
		//! getBoundingBox script interface careful to left(), right(), top(), bottom()
		const midX = (bbox.left + bbox.right) / 2
		const midY = (bbox.top + bbox.bottom) / 2
		return C3.toDegrees(C3.angleTo(midX, midY, this.targetX, this.targetY))
	}

	//======== STEPS ========

	Abi_Init() {
		if (this.init) return
		this.Step_Init()
		this.onInit()
		this.init = true
	}

	Step_Init() {}
	Step_Start() {}
	Step_Prepare1() {}
	Step_Prepare2() {}
	Step_Execute() {}
	Step_Recover() {}
	Step_End() {}
	Step_Cancel() {}

	Step_StopExecute() {}

	ConditionCheck() {
		return true
	}

	//======== Condition Check ========

	Is_ConditionCheck() {
		return this.ConditionCheck() && this.conditionCheck()
	}
}
