const dispatchers = new WeakMap()

function GetDispatcher(manager) {
	let dispatcher = dispatchers.get(manager)
	if (dispatcher) return dispatcher
	dispatcher = C3.New(C3.Event.Dispatcher)
	dispatchers.set(manager, dispatcher)
	return dispatcher
}

C4.Unit = class Unit {
	static unitType = "Unit"

	constructor(runtime, inst, evolution = 0, data = null) {
		this.runtime = runtime
		this.name = this.constructor.name

		this.evolution = evolution
		this.evoMin = 0
		if (Array.isArray(evolution)) {
			this.evolution = evolution[0]
			this.evoMin = evolution[1] || 0

			//console.error("⛔ Unit with evoArray", this.name, this.evolution, evolution, this.evoMin)
		}

		this.nameEvo = Utils.GetNameEvo(this.name, this.evolution)

		//if (this.evoMin > 0) console.error("Unit with evoMin", this.nameEvo)

		this.unit = this

		this.data = {}
		this.dataLoaded = data

		this.flags = {}

		this.unitManager = this.runtime.units

		if (inst) {
			inst.unit = this
			this.inst = inst
			this.runtime = inst.runtime
			this._inst = sdk_runtime.GetInstanceByUID(inst.uid)
			this.uid = inst.uid
			this.tweenBeh = this.inst.behaviors?.["Tween"]

			if (!this.tweenBeh) {
				console.error("⛔ Tween not found in", this.nameEvo, this)
			}
			this._willTick = true
			this._isTicking = false

			this.AddUnitToInstanceFuncs()

			this.unitManager.CreateUnit(this)

			this.loopingSounds = new Set()

			this.globalEventListeners = []
		} else {
			this.inst = null
		}

		this.tags = new Set()
		this.components = {}

		this.damages = new Set()

		this._defaultVars = {}
		this.varsToProcess = []

		this.unit_isVisible = true

		this.AnimLayer = "Objects"
		this.NoSeperateAnim = false
		this.mirroredMod = 1

		this.unit_timeScale = 1

		this.uidsToDestroy = new Set()

		this.unitScale = 1
		if (data) {
			this.unitScale = data.UnitScale || 1
			this.DoppelSize = data.DoppelSize || 1
		}

		this.SetData_Unit()
		this.SetData() //AddComponents, SetVars_Default
		for (const comp of Object.values(this.components)) {
			comp.SetData()
			//!CAREFUL EXEC ORDER (SetVarsComp)
			comp.SetVarsComp()
		}
		this.OverrideData(this.dataLoaded) //For Factory, load Data from Yaml
		this.InitData_Unit() //AddTags, SetVars, SetCompVars

		this.InitData()

		this.SetInternals()
		this.ProcessVars()

		if (inst) {
			this.Init_Unit()
			this.Init()
			for (const comp of Object.values(this.components)) {
				comp.ActivateComp()
				/*comp.SetInternals()
				comp.ProcessVars()
				comp.Init()
				comp.PostCreate() //maybe useless now ?
                */
			}
			this.activateComps = true
			this.InitAfterComponents()
			this._SetTicking(this._willTick)
		}
		//data only
		else {
			for (const comp of Object.values(this.components)) {
				comp.ProcessVars()
			}
		}
	}

	Set_Unit_TimeScale(scale) {
		this.unit_timeScale = scale
	}

	GetUnitType() {
		return this.constructor.unitType
	}

	SetData_Unit() {
		this.timerComp = this.AddComponent(C4.Compos.Compo_Timer, "Timer")
	}

	InitData_Unit() {
		//*Anim

		this.AnimObject = this.data?.AnimObject

		this.AddTags(this.data?.UnitTags)

		if (this.data.VARS) {
			for (const [compName, compData] of Object.entries(this.data.VARS)) {
				if (compName === "MAIN") {
					this.SetVars(compData)
					continue
				}

				this.SetCompVars(compName, compData)
			}
		}
	}

	Init_Unit() {
		this.visu = null
		if (this.NoSeperateAnim) {
			this.visu = this.inst
		} else {
			this.anim = this.runtime.objects["Anim"].createInstance("Objects", this.inst.x, this.inst.y)
			this.anim.unit = this

			this.visu = this.anim
		}

		this.juice = this.AddComponent(C4.Compos.Compo_Juice, "Juice")
		this.juice.inst = this.visu
		//Todo: add the outline effect dynamically (+ don't rely on Zorder for Family)

		this.SetAnimObject()
	}

	//*================= DAMAGE ==================

	CreateDamage(data) {
		const Damage = new C4.Damage(this.runtime)
		Damage.SetDamageFromData(data)
		Damage.charaUnit = this
		//if (!name) name = Utils.generateUID()

		this.damages.add(Damage)
		return Damage
	}

	RemoveDamage(Damage) {
		Damage.ReleaseDamage()
		this.damages.delete(Damage)
	}

	Knockback_Shockwave(range, knockback) {
		const enemies = this.runtime.units.GetUnitsByTags(["Enemy"], "Chara")
		const unitsInRange = Utils.GetInCircle(enemies, this.inst.x, this.inst.y, range, false)
		const knockbackDamage = this.CreateDamage({
			Dmg: 0,
			Knockback: knockback,
			Knockback_NoStat: true,
			Angle_Hit: "FromEntity",
			No_Damage: true,
		})
		for (const unit of unitsInRange) {
			knockbackDamage.DealDamage(unit)
		}

		this.RemoveDamage(knockbackDamage)
	}

	get scaleProcessed() {
		let scale = this.unitScale
		if (this.DoppelSize) scale = scale * this.DoppelSize
		return scale
	}

	//*================= UTILS ==================

	SetAnimObject(OverrideAnim = null, onlyTemp = false) {
		const scale = this.scaleProcessed

		if (OverrideAnim && !onlyTemp) this.AnimObject = OverrideAnim

		let animObject = this.AnimObject

		if (OverrideAnim && onlyTemp) animObject = OverrideAnim

		if (!animObject) return

		if (this.anim) this.anim.removeFromParent()

		let templateData = this.runtime.dataManager.templatesData[animObject]

		//* there should always be a Template Data
		if (!templateData) {
			console.error("⛔ Template Data not found for", animObject)
			templateData = {
				_Internal: false,
				AnimInfo: {
					//IconURL: "MAIN/anim_carrot-default-000.webp",
					Width: 20,
					Height: 20,
					Angle: 0,
					Anim: ["Default", 0],
					Color: [1, 1, 1, 1],
				},
			}
		}

		/*
		const example = {
			_Internal: false,
				AnimInfo: {
					IconURL: "MAIN/anim_carrot-default-000.webp",
					Width: 24.693519801828707,
					Height: 49.38703960365741,
					Angle: 0,
					Anim: ["Default", 0],
					Color: [1, 1, 1, 1],
			},
			Collision: {
				Type: "Hitbox",
				Width: 31.95203893952572,
				Height: 16.01415683757574,
				Angle: 0,
				Anim: ["Default", 0],
				Offset: [-0.15842401885151958, 0.6409038405583942],
			},
		}*/

		const animData = templateData.AnimInfo
		const collData = templateData.Collision
		const meleeHitboxData = templateData.MeleeHitbox

		//anim size/angle/anim/frame

		this.ApplyWorldData(this.visu, animData)

		if (!this.NoSeperateAnim) {
			//collision
			if (collData) {
				this.ApplyWorldData(this.inst, collData)
			} else {
				this.inst.setSize(animData.Width * scale, animData.Height * scale)
			}

			//melee hitbox
			if (meleeHitboxData) {
				let meleeHitboxType = meleeHitboxData.Type
				meleeHitboxType = this.runtime.objects[meleeHitboxType] || this.runtime.objects["Hitbox"]
				this.meleeHitbox = meleeHitboxType.createInstance("Objects", this.inst.x, this.inst.y)
				this.ApplyWorldData(this.meleeHitbox, meleeHitboxData)
				this.inst.addChild(this.meleeHitbox, {
					transformX: true,
					transformY: true,
					transformAngle: true,
					transformWidth: true,
					transformHeight: true,
					destroyWithParent: true,
				})
				this.meleeHitbox.isVisible = true
			}

			this.inst.addChild(this.anim, {
				transformX: true,
				transformY: true,
				transformAngle: true,
				destroyWithParent: true,
			})
		}
	}

	SetSize(size) {
		//
	}

	ApplyWorldData(inst, data) {
		//console.error("⛔ ApplyWorldData objectType", inst.objectType.name)
		//console.error("⛔ ApplyWorldData", data.Anim[0], data)
		inst.setAnimation(data.Anim[0])
		inst.animationFrame = data.Anim[1]

		const scale = this.scaleProcessed

		inst.setSize(data.Width * scale, data.Height * scale)
		inst.angle = data.Angle

		//if (data.Offset) this.inst.offsetPosition(data.Offset[0], data.Offset[1])
	}

	//*================ VISUAL ==================

	SetMirroredToMotion() {
		this.Set_Anim_Mirrored_FromAngle(this.moveComp.AngleOfMotion())
	}

	Set_Anim_Mirrored_FromAngle(angle) {
		if (!this.anim) return
		angle = Utils.angle360(angle)

		if (this.unit.player) {
			//Utils.debugText("Player MoveAngle:" + angle)
		}

		// Tolerance for vertical angles
		const verticalThreshold = 5
		const isVertical = Math.abs(angle - 90) <= verticalThreshold || Math.abs(angle - 270) <= verticalThreshold
		if (isVertical) return

		this.unit.mirroredMod = angle > 90 && angle < 270 ? -1 : 1

		const oldW = this.anim.width
		const newW = Math.abs(oldW) * this.unit.mirroredMod
		if (oldW !== newW) this.anim.width = newW
	}

	SetOutline(color) {
		const colorParam = color
		if (!this.outline) {
			this.outline = this.visu.effects.find((effect) => effect.name == "BetterOutline" || effect.name == "Outline")
			if (!this.outline) return
		}

		if (color === false) {
			this.outline.isActive = false
			return
		}

		if (typeof color === "string" && color.startsWith("#")) color = this.runtime.colorUtils.ColorToRGBArray(color)

		if (!Array.isArray(color)) {
			console.error("⛔ SetOutline, color need to be [r, g, b]", colorParam, color)
			return
		}

		this.outlineColor = color

		this.outline.isActive = true
		this.outline.setParameter(0, color)
	}

	SetColorOverlay(color, percent = 100) {
		const colorParam = color
		if (!this.colorOverlay) {
			this.colorOverlay = this.visu.effects.find((effect) => effect.name == "OverlayColor")
			if (!this.colorOverlay) return
		}

		if (color === false) {
			this.colorOverlay.isActive = false
			return
		}

		if (typeof color === "string" && color.startsWith("#")) color = this.runtime.colorUtils.ColorToRGBArray(color)

		if (!Array.isArray(color)) {
			console.error("⛔ SetOutline, color need to be [r, g, b]", colorParam, color)
			return
		}

		this.colorOverlay.isActive = true
		this.colorOverlay.setParameter(0, color)
		this.colorOverlay.setParameter(1, percent / 100)
	}

	OutlineStrong(bool) {
		if (this.IsCharmed) return

		if (bool) {
			this.unit.SetOutline([1, 0, 0])
		} else this.unit.SetOutline(false)
	}

	SetUnitVisible(bool) {
		/*if (this.inst) this.inst.isCollisionEnabled = bool*/

		if (this.unit_isVisible === bool) return

		this.unit_isVisible = bool
		if (this.anim) this.anim.isVisible = bool
		for (const comp of Object.values(this.components)) {
			comp.SetCompVisible(bool)
		}
	}

	PickNearest(unitsArray, x, y) {
		if (!unitsArray) return null
		if (unitsArray.length === 0) return null

		let nearestUnit = null
		let nearestDist = 999999

		for (let i = 0; i < unitsArray.length; i++) {
			const unit = unitsArray[i]
			const dist = C3.distanceSquared(x, y, unit.inst.x, unit.inst.y)
			if (dist < nearestDist) {
				nearestDist = dist
				nearestUnit = unit
			}
		}

		return nearestUnit
	}

	//* GAMEPLAY

	On_Wave_Start() {
		this.ATK_Stats_ThisWave = {}
	}

	On_Wave_End() {
		//
	}

	//!todo call potential On_ATK_ Functions on the Entity?
	ATK_Stat(stat, value, hitUnit = null) {
		if (!this.ATK_Stats) {
			this.ATK_Stats = {}
			this.ATK_Stats_ThisWave = {}
		}

		if (this.ATK_Stats[stat] === undefined) this.ATK_Stats[stat] = 0
		if (this.ATK_Stats_ThisWave[stat] === undefined) this.ATK_Stats_ThisWave[stat] = 0

		this.ATK_Stats[stat] += value
		this.ATK_Stats_ThisWave[stat] += value

		this.ATK_Stats[stat] = Math.round(this.ATK_Stats[stat])
		this.ATK_Stats_ThisWave[stat] = Math.round(this.ATK_Stats_ThisWave[stat])

		//this.dispatchEventString("On_ATK_" + stat)
	}

	Get_ATK_Stat(stat) {
		return this?.ATK_Stats?.[stat] || 0
	}

	Get_ATK_Stat_ThisWave(stat) {
		return this?.ATK_Stats_ThisWave?.[stat] || 0
	}

	//*================= SFX ==================

	PlaySound(...args) {
		return this.runtime.audio.PlaySound(...args)
	}

	PlaySound_Loop(...args) {
		const sound = this.runtime.audio.PlaySound_Loop(...args)
		this.loopingSounds.add(sound)
		return sound
	}

	StopSound(soundUid) {
		this.runtime.audio.StopSound(soundUid)
		this.loopingSounds.delete(soundUid)
	}

	//*================= OTHER ==================

	Tick() {
		//window.alert("Unit Tick")
	}

	_SetTicking(bool) {
		if (this._isTicking === bool) return
		this.unitManager._CompSetTicking(this, bool)
		this._isTicking = bool
	}

	AddComponent(COMPO_CLASS, name, data = null) {
		if (this.components[name]) {
			console.error("⛔ Component " + name + " already exists in", this.nameEvo, this.components[name])
			return this.components[name]
		}
		const component = new COMPO_CLASS(this, data)
		this.components[name] = component
		component.name = name
		//* Only Data
		if (!this.inst) {
			//
		}

		//* activate the componenet if needed
		if (this.activateComps) {
			component.ActivateComp_Dynamically()
		}

		return component
	}

	GetComponent(name) {
		return this.components[name]
	}

	SetCompVars(compName, data) {
		if (!data) return
		const comp = this.GetComponent(compName)
		if (!comp) {
			console.error("Component " + compName + " not found")
			return
		}
		comp.SetVars(data)
	}

	//*================= TAGS ==================

	HasTag(tag) {
		return this.tags.has(tag)
	}

	HasTags_All(tags) {
		const tagsArray = Utils.TagsParamToArray(tags)
		for (const tag of tagsArray) {
			if (!this.tags.has(tag)) return false
		}
		return true
	}

	HasTags_Any(tags) {
		const tagsArray = Utils.TagsParamToArray(tags)
		for (const tag of tagsArray) {
			if (this.tags.has(tag)) return true
		}
		return false
	}

	AddTags(tags) {
		const tagsArray = Utils.TagsParamToArray(tags)
		for (const tag of tagsArray) {
			this.tags.add(tag)
			if (Array.isArray(tag)) {
				console.error("⛔⛔ AddTags", tag, tags)
			}
			if (this.inst) this.unitManager.Tag_AddUnit(tag, this)
		}
	}

	RemoveTags(tags) {
		const tagsArray = Utils.TagsParamToArray(tags)
		for (const tag of tagsArray) {
			this.tags.delete(tag)
			if (this.inst) this.unitManager.Tag_RemoveUnit(tag, this)
		}
	}

	//*================= FLAGS ==================

	Flag_Add(flag, source) {
		if (!this.flags[flag]) {
			this.flags[flag] = new Set()
		}
		this.flags[flag].add(source)
	}

	Flag_Remove(flag, source) {
		if (this.flags[flag]) {
			this.flags[flag].delete(source)
		}
	}

	Flag_Has(flag, source = null) {
		if (source) {
			return !!this.flags[flag]?.has(source)
		}
		return !!this.flags[flag] && this.flags[flag].size > 0 // Ensure it checks for at least one element
	}

	//*=======================================

	DestroyUnit() {
		//* store some stuff

		this.destroyed = true

		if (this.inst && this.GetUnitType() === "Chara") {
			this.UnlinkFromInstance()
		}

		//* actually destroy/release

		for (const uid of this.uidsToDestroy) {
			const unit = this.runtime.getUnitByUID(uid)
			if (unit) {
				unit.DestroyUnit()
				continue
			}
			const inst = this.runtime.getInstanceByUid(uid)
			if (inst) inst.destroy()
		}

		this.timerComp = null
		this.unit = null
		this._SetTicking(false)
		for (const comp of Object.values(this.components)) {
			comp.DestroyComp()
		}
		this.ReleaseUnit()

		for (const sfx of this.loopingSounds) {
			this.StopSound(sfx)
		}

		this.juice = null
		this.unitManager.DestroyUnit(this)

		//! TOFIX
		if (this?.inst) {
			this.inst.unit = null
			this.inst.destroy()
		} else {
			//console.error("⛔ DestroyUnit no inst", this.nameEvo, this)
		}

		this.tweenBeh = null

		this.inst = null
		this.components = {} //null ?
	}

	//*============ MODULARITY ============

	SetData() {}

	InitData() {}

	PopulateStats(data) {
		//
	}

	SetInternals() {}

	Init() {}

	AddCompos() {}

	OverrideData(data) {
		if (!data) return
		if (data === {}) return
		this.data = Utils.deepMerge(this.data, data)
	}

	InitAfterComponents() {}

	ReleaseUnit() {}

	SetVars_Default(data) {
		Utils.SetVars_Default(this, data)
	}

	SetVars_AddTypes(data) {
		Utils.SetVars_AddTypes(this, data)
	}

	SetVars(data) {
		Utils.SetVars(this, data)
	}

	ProcessVars() {
		Utils.ProcessVars(this)
	}

	Trigger(name, ...args) {
		if (this[name] && typeof this[name] === "function") {
			this[name](...args) // Pass the arguments to the function
		}
	}

	TriggerWithEvent(name, ...args) {
		this.Trigger(name, ...args)
		const e = new C3.Event(name, true, ...args)

		//! weirdCheck
		this.inst?.dispatchEvent(e)
	}

	//#region Unit to Instance

	UnlinkFromInstance() {
		const props = ["x", "y", "angle", "angleDegrees", "bboxMidX", "bboxMidY", "animBboxMidX", "animBboxMidY"]
		for (const prop of props) {
			const currentValue = this[prop]
			Object.defineProperty(this, prop, {
				value: currentValue,
				writable: true,
				configurable: true,
				enumerable: true,
			})
		}
	}

	AddUnitToInstanceFuncs() {
		this.setPosition = function (x, y) {
			this.inst.setPosition(x, y)
		}

		Object.defineProperty(this, "x", {
			get() {
				return this.inst.x
			},
			set(value) {
				this.inst.x = value
			},
			configurable: true,
		})

		Object.defineProperty(this, "y", {
			get() {
				return this.inst.y
			},
			set(value) {
				this.inst.y = value
			},
			configurable: true,
		})

		Object.defineProperty(this, "angle", {
			get() {
				return this.inst.angle
			},
			set(value) {
				this.inst.angle = value
			},
			configurable: true,
		})

		Object.defineProperty(this, "angleDegrees", {
			get() {
				return this.inst.angleDegrees
			},
			set(value) {
				this.inst.angleDegrees = value
			},
			configurable: true,
		})

		Object.defineProperty(this, "bboxMidX", {
			get() {
				const bbox = this.inst.getBoundingBox()
				return (bbox.left + bbox.right) / 2
			},
			configurable: true,
		})

		Object.defineProperty(this, "bboxMidY", {
			get() {
				const bbox = this.inst.getBoundingBox()
				return (bbox.top + bbox.bottom) / 2
			},
			configurable: true,
		})

		Object.defineProperty(this, "animBboxMidX", {
			get() {
				const bbox = this.anim.getBoundingBox()
				return (bbox.left + bbox.right) / 2
			},
			configurable: true,
		})

		Object.defineProperty(this, "animBboxMidY", {
			get() {
				const bbox = this.anim.getBoundingBox()
				return (bbox.top + bbox.bottom) / 2
			},
			configurable: true,
		})
	}

	/*
	setPosition(x, y) {
		this.inst.setPosition(x, y)
	}

	get x() {
		return this.inst.x
	}
	set x(value) {
		this.inst.x = value
	}

	get y() {
		return this.inst.y
	}
	set y(value) {
		this.inst.y = value
	}

	get bboxMidX() {
		const bbox = this.inst.getBoundingBox()
		return (bbox.left + bbox.right) / 2
	}

	get bboxMidY() {
		const bbox = this.inst.getBoundingBox()
		return (bbox.top + bbox.bottom) / 2
	}*/

	//#endregion

	//#region Event Dispatcher

	addEventListener(type, func, capture) {
		C3X.RequireString(type)
		C3X.RequireFunction(func)
		GetDispatcher(this).addEventListener(type, func, capture)
	}
	removeEventListener(type, func, capture) {
		C3X.RequireString(type)
		C3X.RequireFunction(func)
		GetDispatcher(this).removeEventListener(type, func, capture)
	}

	dispatchEventString(name) {
		const e = new C3.Event(name, true)
		this.dispatchEvent(e)
	}

	dispatchEvent(e) {
		GetDispatcher(this).dispatchEvent(e)
	}

	//#endregion
}
