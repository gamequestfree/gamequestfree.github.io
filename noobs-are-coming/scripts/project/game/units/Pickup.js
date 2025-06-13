C4.Units.Pickup = class Pickup extends C4.Unit {
	static unitType = "Pickup"
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	//*========== CONFIG ====================

	SetData() {
		super.SetData()

		this.moveComp = this.AddComponent(C4.Compos.Compo_Move, "Move")
		this.moveComp.enabled = false

		this.SetVars_Default({})

		this.PlayerIndex = -1
		this.UID_Entity = null
	}

	ReleaseUnit() {
		this.moveComp = null
	}

	Init() {
		//*Anim

		this.OnCreated()

		const random = Math.random()
		this.juice.Sine_Start("Vertical", 1, random, 1)
	}

	OnCreated() {
		//add shadow
		this.shadow = this.runtime.pool.CreateInstance("Shadow", "Shadows", this.inst.x, this.inst.y)
		this.shadow.setSize(this.inst.width * 1.2, this.inst.width * 0.4)
		this.inst.addChild(this.shadow, {
			transformX: true,
			transformY: true,
			destroyWithParent: true,
		})
	}
}
