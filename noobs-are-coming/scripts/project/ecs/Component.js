C4.Component = class Component {
	constructor(unit, data = null) {
		this.unit = unit
		this.runtime = unit.runtime
		this.unitManager = this.runtime.units

		this.dataLoaded = data

		if (unit.inst) {
			this.inst = unit.inst
			this.uid = unit.uid
			this._inst = unit._inst
			this._isTicking = false
			this._isTicking2 = false
			this._isPostTicking = false
		}
		this.name = ""
		this.unitName = unit.name

		this.varsToProcess = []

		//!Careful
		//this.SetInternals()
		//this.ProcessVars()
		//this.Init()

		//PostCreate() is called from unit
	}

	get timerComp() {
		return this.unit.timerComp
	}

	get juice() {
		return this.unit.juice
	}

	ActivateComp_Dynamically() {
		this.SetData()
		//!CAREFUL EXEC ORDER (SetVarsComp)
		this.SetVarsComp()
		this.ActivateComp()
	}

	ActivateComp() {
		this.SetInternals()
		this.ProcessVars()
		this.Init()
		this.PostCreate() //maybe useless now ?
	}

	PostCreate() {}

	Tick() {}

	Tick2() {}

	PostTick() {}

	ReleaseComp() {}

	DestroyComp() {
		this._SetTicking(false)
		this._SetTicking2(false)
		this._SetPostTicking(false)
		this.ReleaseComp()
		this.inst = null
		this.unit = null
		this._inst = null
	}

	DestroyUnit() {
		this.unit.DestroyUnit()
	}

	_SetTicking(bool) {
		if (this._isTicking === bool) return
		this.unitManager._CompSetTicking(this, bool)
		this._isTicking = bool
	}

	_SetTicking2(bool) {
		if (this._isTicking2 === bool) return
		this.unitManager._CompSetTicking2(this, bool)
		this._isTicking2 = bool
	}

	_SetPostTicking(bool) {
		if (this._isPostTicking === bool) return
		this.unitManager._CompSetPostTicking(this, bool)
		this._isPostTicking = bool
	}

	GetComponent(name) {
		this.inst.GetComponent(name)
	}

	Trigger(name, ...args) {
		this.unit.Trigger(name, ...args)
	}

	TriggerWithEvent(name, ...args) {
		this.unit.TriggerWithEvent(name, ...args)
	}

	//*============ BRIDGE UNIT ============

	AddTags(...tags) {
		this.unit.AddTags(...tags)
	}

	AddComponent(...args) {
		return this.unit.AddComponent(...args)
	}

	//*============ MODULARITY ============

	SetData() {}

	SetInternals() {}

	Init() {}

	SetVars_Default(data) {
		Utils.SetVars_Default(this, data)
	}

	SetVars(data) {
		Utils.SetVars(this, data)
	}

	//!CAREFUL EXEC ORDER (SetVarsComp)
	SetVarsComp() {
		if (!this.dataLoaded) return
		Utils.SetVars(this, this.dataLoaded)
	}

	ProcessVars() {
		Utils.ProcessVars(this)
	}

	//*============ UTILS ============

	SetCompVisible(bool) {}
}
