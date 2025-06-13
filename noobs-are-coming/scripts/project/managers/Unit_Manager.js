export class Unit_Manager {
	constructor(runtime) {
		this.runtime = runtime
		this.units = new Map()
		this.instToUnit = new Map()

		this.tags = new Map()

		this.runtime.CreateUnit = this.CreateUnit.bind(this)
		this.runtime.getUnitByUID = this.get.bind(this)
		this.runtime.InstToUnit = this.InstToUnit.bind(this)

		this._compToTick = new Set()
		this._compToTick2 = new Set()
		this._compToPostTick = new Set()

		this.runtime.addEventListener("tick", (e) => this._Tick())
		const rt = sdk_runtime.Dispatcher()
		rt.addEventListener("tick2", (e) => this._Tick2())
		//rt.addEventListener("postTick", (e) => this.PostTick())

		this.runtime.addEventListener("beforeanylayoutstart", (e) => this.OnBeforeAnyLayoutStart())
		this.runtime.addEventListener("beforeanylayoutend", (e) => this.OnBeforeAnyLayoutEnd())

		this._unitsToDestroy = new Map()
	}

	OnBeforeAnyLayoutStart() {
		console.error("Unit_Manager", this)
	}

	OnBeforeAnyLayoutEnd() {
		//window.alert("OnBeforeAnyLayoutEnd")
		for (const unit of this.units.values()) {
			unit.DestroyUnit()
		}
		this.units = new Map()
		this.instToUnit = new Map()
		this.tags = new Map()
		this._compToTick = new Set()
		this._compToTick2 = new Set()
		this._compToPostTick = new Set()
	}

	DestroyUnit(unit) {
		if (this.units.has(unit.uid)) {
			this.units.delete(unit.uid)
			this.instToUnit.delete(unit.inst)
			const instTags = unit.tags

			if (instTags) {
				for (const tag of instTags) {
					this.tags.get(tag).delete(unit)
					//if (tag === "Tank") window.alert("Remove Tank")
				}
			}
		}
	}

	Tag_AddUnit(tag, unit) {
		if (!this.tags.has(tag)) {
			this.tags.set(tag, new Set())
		}
		this.tags.get(tag).add(unit)

		/*
		if (tag === "Tank") {
			console.error("Tag_AddUnit", tag, this.tags.get(tag))
		}*/
	}

	Tag_RemoveUnit(tag, unit) {
		if (this.tags.has(tag)) {
			this.tags.get(tag).delete(unit)
		}
	}

	GetUnitsByTag(tag, unitType = "Chara") {
		const tagMap = this.tags.get(tag)
		if (!tagMap) {
			return []
		}

		let arr = Array.from(tagMap)

		if (unitType) arr = arr.filter((unit) => unit.GetUnitType() === unitType)
		if (!unitType) arr = arr.filter((unit) => unit.GetUnitType() === "Chara" || unit.GetUnitType() === "Bullet")

		return arr
	}

	GetUnitsByTagsOverlap(tags, unitType = "Chara") {
		let units = this.GetUnitsByTag(tags[0], unitType)
		for (let i = 1; i < tags.length; i++) {
			units = units.filter((unit) => unit.tags.has(tags[i]))
		}

		return units
	}

	GetUnitsByTags(tags, unitType = "Chara") {
		if (typeof tags === "string") {
			tags = tags.split(" ")
		} else if (tags instanceof Set) {
			tags = Array.from(tags)
		}
		let units = this.GetUnitsByTag(tags[0], unitType)
		for (let i = 1; i < tags.length; i++) {
			units = units.concat(this.GetUnitsByTag(tags[i], unitType))
		}
		//console.error("⛔GetUnitsByTags", tags, units)
		return units
	}

	CreateUnit(unit) {
		this.units.set(unit.uid, unit)
		this.instToUnit.set(unit.inst, unit)
	}

	InstToUnit(inst) {
		return this.instToUnit.get(inst)
	}

	get(uid) {
		return this.units.get(uid)
	}

	_Tick() {
		this.runtime.events.dispatchEventString("preTick")
		for (const comp of this._compToTick) {
			/*
			if (!comp.inst) {
				comp.DestroyUnit()
				window.alert("WTF")
			}*/
			comp.Tick()
		}
		for (const comp of this._compToPostTick) {
			comp.PostTick()
		}
		this.runtime.events.dispatchEventString("postTick")
	}

	_Tick2() {
		for (const comp of this._compToTick2) {
			comp.Tick2()
		}

		//! HERE Actually Destroy units
		for (const [unit, justDepop] of this._unitsToDestroy) {
			unit.OnDestroyed_Actual(justDepop)
		}
		this._unitsToDestroy.clear()
	}

	_CompSetTicking(comp, bool) {
		if (bool) {
			this._compToTick.add(comp)
		} else {
			this._compToTick.delete(comp)
		}
	}

	_CompSetTicking2(comp, bool) {
		if (bool) {
			this._compToTick2.add(comp)
		} else {
			this._compToTick2.delete(comp)
		}
	}

	_CompSetPostTicking(comp, bool) {
		if (bool) {
			this._compToPostTick.add(comp)
		} else {
			this._compToPostTick.delete(comp)
		}
	}
}
