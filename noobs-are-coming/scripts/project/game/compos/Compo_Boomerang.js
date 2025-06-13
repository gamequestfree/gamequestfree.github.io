export class Compo_Boomerang extends C4.Component {
	constructor(unit, data = null) {
		super(unit, data)
	}

	SetData() {
		this.SetVars_Default({})
	}

	Init() {
		this._SetTicking(true)
	}

	ReleaseComp() {
		super.ReleaseComp()
	}

	SetInternals() {}

	Tick() {
		super.Tick()
	}
}
