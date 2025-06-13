export class Layout {
	constructor(runtime, layoutName) {
		this.runtime = runtime
		this.layoutName = layoutName.toLowerCase()
		this.eventPrefix = "On" + this.layoutName.charAt(0).toUpperCase() + this.layoutName.slice(1)

		// Store the _DispatchTick function reference to add and remove it properly
		this._dispatchTickBound = this._DispatchTick.bind(this)
		this._dispatchPreTickBound = this._DispatchPreTick.bind(this)
		this._dispatchPostTickBound = this._DispartchPostTick.bind(this)

		runtime.addEventListener("beforeanylayoutstart", () => this._BeforeLayoutStart())
		runtime.addEventListener("afteranylayoutstart", () => this._AfterLayoutStart())
		runtime.addEventListener("beforeanylayoutend", () => this._BeforeLayoutEnd())

		runtime.events.addEventListener(this.eventPrefix + "Tick", () => this.Tick())
		runtime.events.addEventListener(this.eventPrefix + "PreTick", () => this.PreTick())
		runtime.events.addEventListener(this.eventPrefix + "PostTick", () => this.PostTick())
	}

	//* OnLayoutStart, OnLayoutTick, OnLayoutEnd

	_BeforeLayoutStart() {
		if (this.layoutName === this.runtime.layout.name.toLowerCase()) {
			this.Start()
			this.runtime.events.dispatchEventString(this.eventPrefix + "Start_Before")
			this.runtime.events.dispatchEventString(this.eventPrefix + "Start")
			this.runtime.addEventListener("tick", this._dispatchTickBound)
			this.runtime.events.addEventListener("preTick", this._dispatchPreTickBound)
			this.runtime.events.addEventListener("postTick", this._dispatchPostTickBound)
		}
	}
	_AfterLayoutStart() {
		if (this.layoutName === this.runtime.layout.name.toLowerCase()) {
			this.runtime.events.dispatchEventString(this.eventPrefix + "Start2")
		}
	}

	_BeforeLayoutEnd() {
		if (this.layoutName === this.runtime.layout.name.toLowerCase()) {
			this.End()
			this.runtime.events.dispatchEventString(this.eventPrefix + "End")
			this.runtime.removeEventListener("tick", this._dispatchTickBound)
			this.runtime.events.removeEventListener("preTick", this._dispatchPreTickBound)
			this.runtime.events.removeEventListener("postTick", this._dispatchPostTickBound)
		}
	}

	_DispatchTick() {
		this.runtime.events.dispatchEventString(this.eventPrefix + "Tick")
	}

	_DispartchPostTick() {
		this.runtime.events.dispatchEventString(this.eventPrefix + "PostTick")
	}

	_DispatchPreTick() {
		this.runtime.events.dispatchEventString(this.eventPrefix + "PreTick")
	}

	Start(e) {
		//
	}

	End(e) {
		//
	}

	Tick() {
		//
	}

	PreTick() {
		//
	}

	PostTick() {
		//
	}
}
