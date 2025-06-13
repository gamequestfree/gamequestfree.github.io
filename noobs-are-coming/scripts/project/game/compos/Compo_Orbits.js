export class Compo_Orbits extends C4.Component {
	constructor(unit, data = null) {
		super(unit, data)

		//init only once for all overboy_orbits instances
		if (!globalThis.orbitingInstances) {
			globalThis.orbitingInstances = new Map()
			this.runtime.addEventListener("instancedestroy", (e) => {
				const inst = e.instance
				if (!globalThis.orbitingInstances.has(inst)) return
				const orbiting = globalThis.orbitingInstances.get(inst)
				orbiting.orbit.RemoveInstances([inst])
				globalThis.orbitingInstances.delete(inst)
			})
		}

		this.currentOrbit = null

		this.orbits = new Map()
	}

	Init() {
		this._SetTicking(true)
	}

	Tick() {
		const dt = this.inst.dt
		if (dt === 0) return
		for (const orbit of this.orbits.values()) {
			orbit.Update(dt)
		}
	}

	GetOrbit(tag) {
		return tag === "" ? this.currentOrbit : this.orbits.get(tag.toLowerCase())
	}

	GetOrbiting(uid) {
		return globalThis.orbitingInstances.get(this.runtime.getInstanceByUid(uid))
	}

	Orbit_Create(tag, radiusX, radiusY, offsetAngle) {
		const orbit = new Orbit(this)
		orbit.tag = tag
		orbit.minorAxis = radiusX
		orbit.majorAxis = radiusY === -1 ? radiusX : radiusY
		orbit.offsetAngle = C3.toRadians(offsetAngle)
		this.orbits.set(tag.toLowerCase(), orbit)
		this.currentOrbit = orbit
		return orbit
	}

	Orbit_SetSize(tag, radiusX, radiusY = -1) {
		const orbit = tag === "" ? this.currentOrbit : this.orbits.get(tag.toLowerCase())
		if (!orbit) return

		orbit.minorAxis = radiusX
		orbit.majorAxis = radiusY === -1 ? radiusX : radiusY
	}

	Orbit_AddInstances(tag, objInstances) {
		const orbit = tag === "" ? this.currentOrbit : this.orbits.get(tag.toLowerCase())
		if (!orbit) return

		orbit.AddInstances(objInstances)
	}

	Orbit_RemoveInstances(tag, objInstances) {
		const orbit = tag === "" ? this.currentOrbit : this.orbits.get(tag.toLowerCase())
		if (!orbit) return

		orbit.RemoveInstances(objInstances)
	}

	// Expressions

	Orbiting_OffsetAngle(uid) {
		const orbiting = globalThis.orbitingInstances.get(this.runtime.getInstanceByUid(uid))
		if (!orbiting) return 0
		return C3.toDegrees(orbiting.offset)
	}
}

class Orbiting {
	constructor(orbit, inst) {
		this.orbitComp = orbit.orbitComp
		this.orbit = orbit
		this.inst = inst

		this.justAdded = true
		this.lerping = false
		this.offset = 0
		this.offsetTarget = 0

		this.currentTotalAngle = 0

		globalThis.orbitingInstances.set(inst, this)
	}
}

class Orbit {
	constructor(orbitComp) {
		this.tag = ""
		this.orbitComp = orbitComp

		console.error("Orbit", this.tag, this)

		this.enabled = true

		this.speed = 0
		this.acceleration = 0

		this.minorAxis = 0
		this.majorAxis = 0
		this.offsetAngle = 0

		this.rotation = 0
		this.totalRotation = 0
		this.totalAbsoluteRotation = 0

		this.maxSpeed = Infinity
		this.minSpeed = -Infinity

		this.orbitings = []

		this.matchRotation = false
		this.targetX = 0
		this.targetY = 0
		this.targetInst = orbitComp.inst
		this.targetUnit = orbitComp.unit
		this.targetUid = -1

		this.lerping = false
		this.lerp_target = 0
		this.lerp_speed = 0

		this.previousRotation
		this.needToUpdate = true

		//this.Reset()
	}

	Reset() {}

	UpdateTarget() {
		if (!this.targetInst) return

		/*const newTargetX = this.targetUnit.bboxMidX
		const newTargetY = this.targetUnit.bboxMidY*/

		const newTargetX = this.targetUnit.animBboxMidX
		const newTargetY = this.targetUnit.animBboxMidY

		if (this.targetX === newTargetX && this.targetY === newTargetY) return

		this.targetX = newTargetX
		this.targetY = newTargetY
		this.needToUpdate = true
	}

	Update(dt) {
		if (this.lerping) {
			this.rotation = C3.angleLerp(this.rotation, this.lerp_target, this.lerp_speed * dt)
			if (Math.abs(this.rotation - this.lerp_target) < 0.1) {
				this.rotation = this.lerp_target

				this.lerping = false
			}
		} else {
			if (this.acceleration !== 0) {
				this.speed += this.acceleration * dt
				if (this.speed > this.maxSpeed) {
					this.speed = this.maxSpeed
				} else if (this.speed < this.minSpeed) {
					this.speed = this.minSpeed
				}
			}

			const delta = this.speed * dt

			this.rotation = C3.clampAngle(this.rotation + delta)
		}

		let orbitingIsLerping = false

		for (const orbiting of this.orbitings) {
			if (orbiting.lerping) {
				orbitingIsLerping = true
				break
			}
		}

		this.UpdateTarget()

		if (!orbitingIsLerping && !this.needToUpdate && this.rotation === this.previousRotation) {
			return
		}

		this.needToUpdate = false
		this.previousRotation = this.rotation

		/* //useless ?
		this.totalRotation += delta
		this.totalAbsoluteRotation += Math.abs(delta)*/

		const cos = Math.cos(this.offsetAngle)
		const sin = Math.sin(this.offsetAngle)

		for (const orbiting of this.orbitings) {
			if (orbiting.lerping) {
				orbiting.offset = C3.lerp(orbiting.offset, orbiting.offsetTarget, 20 * dt)
				if (Math.abs(orbiting.offset - orbiting.offsetTarget) < 0.1) {
					orbiting.offset = orbiting.offsetTarget
					orbiting.lerping = false
				}
			}

			const inst = orbiting.inst
			const rotation = this.rotation + orbiting.offset
			const x = this.minorAxis * Math.cos(rotation)
			const y = this.majorAxis * Math.sin(rotation)
			inst.setPosition(this.targetX + (x * cos - y * sin), this.targetY + (x * sin + y * cos))

			orbiting.currentTotalAngle = rotation + this.offsetAngle

			orbiting.inst.orbitingAngle = orbiting.currentTotalAngle

			if (this.matchRotation) {
				inst.angleDegrees = orbiting.currentTotalAngle
			}
		}
	}

	Distribute() {
		// set the offset of each orbiting to 360 / orbitings.length
		const orbitingCount = this.orbitings.length
		for (let i = 0; i < orbitingCount; i++) {
			if (this.orbitings[i].justAdded) {
				this.orbitings[i].offset = (360 / orbitingCount) * i * (Math.PI / 180)
				this.orbitings[i].offsetTarget = this.orbitings[i].offset
				this.orbitings[i].lerping = false
				this.orbitings[i].justAdded = false
			} else {
				this.orbitings[i].offsetTarget = (360 / orbitingCount) * i * (Math.PI / 180)
				this.orbitings[i].lerping = true
			}
		}

		this.needToUpdate = true
	}

	AddInstances(instances) {
		if (!Array.isArray(instances)) instances = [instances]
		for (const inst of instances) {
			let orbiting
			//if already orbiting, remove from old orbit
			if (globalThis.orbitingInstances.has(inst)) {
				orbiting = globalThis.orbitingInstances.get(inst)
				orbiting.orbit.RemoveInstances([inst])
			}
			//else create new orbiting
			else {
				orbiting = new Orbiting(this, inst)
			}
			orbiting.justAdded = true
			this.orbitings.push(orbiting)
		}
		this.Distribute()
	}

	RemoveInstances(instances) {
		if (!Array.isArray(instances)) instances = [instances]
		let actuallyRemoved = false
		for (const inst of instances) {
			const orbiting = globalThis.orbitingInstances.get(inst)
			if (orbiting) {
				this.orbitings.splice(this.orbitings.indexOf(orbiting), 1)
				actuallyRemoved = true
			}
		}
		if (actuallyRemoved) {
			this.Distribute()
		}
	}

	RemoveAllInstances() {
		for (const orbiting of this.orbitings) {
			globalThis.orbitingInstances.delete(orbiting.inst)
		}
		this.orbitings = []
		this.Distribute()
	}

	SetSpeed(speed, acc = 0, limit = undefined) {
		this.speed = C3.toRadians(speed)
		this.acceleration = C3.toRadians(acc)
		//Max
		if (limit) {
			if (acc > 0) {
				this.maxSpeed = C3.toRadians(limit)
			}
			//Min
			else if (acc < 0) {
				this.minSpeed = C3.toRadians(limit)
			}
		}
	}

	Lerp(target, lerpSpeed) {
		this.lerp_target = C3.toRadians(target)
		this.lerp_speed = lerpSpeed
		this.lerping = true
	}
}
