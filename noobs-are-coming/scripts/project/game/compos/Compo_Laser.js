export class Compo_Laser extends C4.Component {
	constructor(unit, data = null) {
		super(unit, data)

		this.startPoint = { x: 0, y: 0 }
		this.angle = 0

		this.remainingRange = 0

		this.lasers = []

		this.Damage = null
	}

	SetData() {
		this.SetVars_Default({
			Thickness: 16,

			RangeMax: 200,
			Range: 20,

			Bounces: 2,
			AlwaysReachWall: true,

			LaserColor: [1, 0, 0],

			UID_LaserHolder: null,
		})
	}

	Init() {
		this._SetTicking(true)
	}

	/*
	BulletTick_Laser() {
		if (this.Damage) this.Damage.ResetJustHit()
		for (const laser of this.lasers) {
			if (laser.Damage) laser.Damage.ResetJustHit()
		}
	}*/

	ReleaseComp() {
		this.lasers.forEach((laser) => laser.ReleaseLaser())
		this.lasers = []
	}

	UpdateLaserCount() {
		const count = 1 + this.Bounces
		const diff = count - this.lasers.length
		for (let i = 0; i < diff; i++) {
			this.lasers.push(new Laser(this, i))
		}
		for (let i = 0; i < -diff; i++) {
			const laser = this.lasers.pop()
			laser.Release()
		}
	}

	Tick() {
		this.UpdateLaserCount()

		if (this.Range < this.RangeMax) {
			this.Range = C3.lerp(this.Range, this.RangeMax, 20 * this.inst.dt)
		}

		let unit = this.runtime.getUnitByUID(this.UID_LaserHolder)

		if (!unit) unit = this.unit.charaUnit

		let x = unit.bboxMidX
		let y = unit.bboxMidY

		this.startPoint = { x: x, y: y }
		//this.angle = unit.angle
		//this.angle = Math.PI / 4
		//this.angle = 0

		this.remainingRange = this.Range

		let _bounces = this.Bounces
		for (let i = 0; i < this.lasers.length; i++) {
			const laser = this.lasers[i]

			if (i === 0) {
				laser.startPoint = this.startPoint
				laser.angle = this.angle
			} else {
				const prevLaser = this.lasers[i - 1]
				laser.startDirection = prevLaser.collisionDirection
				laser.startPerpAngle = prevLaser.perpAngle
				laser.startPoint = prevLaser.endPoint
				laser.angle = prevLaser.reflectionAngle
				if (laser.angle === null || prevLaser.enabled === false) {
					laser.SetEnabled(false)
				} else laser.SetEnabled(true)
			}

			laser.bounceForced = false
			laser.canBounce = false
			if (_bounces > 0) {
				_bounces--
				if (this.AlwaysReachWall) laser.bounceForced = true
				else laser.canBounce = true
			}

			laser.Tick()
		}
	}
}

export class Laser {
	constructor(laserHolder, index) {
		this.laserHolder = laserHolder
		this.runtime = laserHolder.runtime

		this.laserIndex = index

		this.laserColor = laserHolder.LaserColor

		// Initialize properties with default values

		this.enabled = true

		this.bounceForced = false
		this.canBounce = false

		this.friction = 0.3

		this.pointCount = 8

		this.shake = 1
		this.thickness_base = laserHolder.Thickness

		this.points = []

		this.pointObjectName = null //"Debug", null
		this.debugPoints = []
		this.lines = []

		this.angle = 0
		this.startPoint = { x: 0, y: 0 }
		this.endPoint = { x: 200, y: 0 }

		this.Damage = null

		this.initPoints()
	}

	get thickness() {
		return this.thickness_base * this.laserHolder.unit.scaleProcessed
	}

	ReleaseLaser() {
		this.meshTiledBG.destroy()
		this.endFX.destroy()
		if (this.startFX) this.startFX.destroy()
		this.debugPoints.forEach((point) => point.destroy())
		this.lines.forEach((line) => line.destroy())
		this.collision.destroy()

		this.points = []
		this.debugPoints = []
		this.lines = []
		this.meshTiledBG = null
		this.endFX = null
		this.startFX = null
		this.collision = null
	}

	Release() {
		this.meshTiledBG.destroy()
	}

	initPoints() {
		// Initialize points and velocities arrays

		this.meshTiledBG = this.runtime.objects["Beam_Laser"].createInstance("FX_Behind", 0, 0)
		this.meshTiledBG.InitLeft = this.meshTiledBG.getBoundingBox().left
		this.meshTiledBG.InitTop = this.meshTiledBG.getBoundingBox().top
		this.meshTiledBG.InitRight = this.meshTiledBG.getBoundingBox().right
		this.meshTiledBG.InitBottom = this.meshTiledBG.getBoundingBox().bottom
		this.meshTiledBG.createMesh(this.pointCount, 2)

		//console.error("this.meshTiledBG", this.meshTiledBG)

		this.endFX = this.runtime.objects["Beam_Laser_End"].createInstance("FX_Behind", 0, 0)

		/*this.meshTiledBG.colorRgb = this.laserColor
		this.endFX.colorRgb = this.laserColor*/

		this.meshTiledBG.glowColor = this.laserColor
		this.endFX.glowColor = this.laserColor

		this.runtime.fxManager.Add_GlowClone(this.meshTiledBG)
		this.runtime.fxManager.Add_GlowClone(this.endFX)

		//startFX
		//if (this.laserIndex === 0) this.startFX = this.runtime.objects["Beam_Laser_End"].createInstance("Objects", 0, 0)

		for (let i = 0; i < this.pointCount; i++) {
			this.points.push({ x: 0, y: 0, px: 0, py: 0, vx: 0, vy: 0, end: 0 })
			const point = this.points[i]

			if (i === 0 || i === this.pointCount - 1) {
				point.end = 1
			}

			if (this.pointObjectName) {
				this.debugPoints.push(this.runtime.objects[this.pointObjectName].createInstance("FX_Behind", 0, 0))
			}

			if (i !== 0) {
				const line = this.runtime.objects["Line"].createInstance("FX_Behind", 0, 0)
				line.isVisible = false
				this.lines.push(line)
			}
		}

		this.collision = this.runtime.objects["Line"].createInstance("FX_Behind", 0, 0)
		this.collision.isVisible = false
		this.collision.height = this.thickness

		this.refreshLineRenderer()
	}

	SetEnabled(bool) {
		if (bool === this.enabled) return
		this.enabled = bool
		if (this.enabled) {
			this.endFX.isVisible = true
			this.meshTiledBG.isVisible = true
			this.debugPoints.forEach((point) => (point.isVisible = true))
			//this.lines.forEach((line) => (line.isVisible = true))
			for (let i = 0; i < this.points.length; i++) {
				this.points[i].x = this.startPoint.x
				this.points[i].y = this.startPoint.y
			}
		}
		//Disable
		else {
			this.endFX.isVisible = false
			this.meshTiledBG.isVisible = false
			this.debugPoints.forEach((point) => (point.isVisible = false))
			//this.lines.forEach((line) => (line.isVisible = false))
		}
	}

	Tick() {
		if (!this.enabled) return

		if (this.startFX) {
			this.startFX.setPosition(this.startPoint.x, this.startPoint.y)
			this.startFX.angle = this.angle + Math.PI
		}

		this.TickBounce()
		this.TickPoints()
		this.TickMesh()
		this.TickLines()
		this.refreshLineRenderer()

		this.TickCollision()
	}

	TickCollision() {
		if (!this.enabled) return
		const Damage = this.Damage || this.laserHolder.Damage
		if (!Damage) {
			return
		}

		this.collision.setPosition(this.startPoint.x, this.startPoint.y)
		this.collision.setSize(C3.distanceTo(this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y), this.thickness)
		this.collision.angle = this.angle

		const collidingCharas = Utils.testOverlapOpti_All(this.collision, this.runtime.objects["Chara"])
		for (const chara of collidingCharas) {
			Damage.DealDamage_Test(chara)
		}
	}

	TickBounce() {
		const range = this.bounceForced ? 2000 : this.laserHolder.remainingRange
		const endX = this.startPoint.x + Math.cos(this.angle) * range
		const endY = this.startPoint.y + Math.sin(this.angle) * range

		const raycast = this.runtime.raycast
		const ray = raycast.LOS.castRay(this.startPoint.x, this.startPoint.y, endX, endY)
		if (ray.didCollide) {
			this.endPoint = { x: ray.hitX, y: ray.hitY }
			this.reflectionAngle = ray.reflectionAngle
			this.normalAngle = ray.normalAngle
			if (this.canBounce) this.laserHolder.remainingRange = Math.max(0, this.laserHolder.remainingRange - ray.hitDistance)
			this.endFX.angle = ray.normalAngle + Math.PI
			this.endFX.setAnimation("Impact")

			// Determine collision direction based on perpAngle.
			this.collisionDirection
			const normCos = Math.cos(this.normalAngle)
			const normSin = Math.sin(this.normalAngle)
			if (Math.abs(normCos) > Math.abs(normSin)) {
				// Horizontal collision.
				this.collisionDirection = normCos > 0 ? "left" : "right"
			} else {
				// Vertical collision.
				this.collisionDirection = normSin > 0 ? "top" : "bottom"
			}
		} else {
			this.endPoint = { x: endX, y: endY }
			this.endFX.setAnimation("End")
			this.collisionDirection = null

			this.reflectionAngle = null
			this.normalAngle = null
			this.perpAngle = null
		}
	}

	TickPoints() {
		for (let i = 0; i < this.pointCount; i++) {
			const point = this.points[i]
			const t = i / (this.pointCount - 1)
			point.x = C3.lerp(this.startPoint.x, this.endPoint.x, t)
			point.y = C3.lerp(this.startPoint.y, this.endPoint.y, t)
		}
	}

	TickMesh() {
		const mesh = this.meshTiledBG
		const halfPi = Math.PI / 2
		let totalDistance = 0
		for (let i = 0; i < this.pointCount; i++) {
			if (i === 0) continue
			const point = this.points[i]
			const prevPoint = this.points[i - 1]
			const angle = C3.angleTo(prevPoint.x, prevPoint.y, point.x, point.y)
			totalDistance += C3.distanceTo(prevPoint.x, prevPoint.y, point.x, point.y)

			mesh.setMeshPoint(i, 0, {
				mode: "absolute",
				x: C3.unlerp(mesh.InitLeft, mesh.InitRight, point.x + (Math.cos(angle - halfPi) * this.thickness) / 2),
				y: C3.unlerp(mesh.InitTop, mesh.InitBottom, point.y + (Math.sin(angle - halfPi) * this.thickness) / 2),
			})
			mesh.setMeshPoint(i, 1, {
				mode: "absolute",
				x: C3.unlerp(mesh.InitLeft, mesh.InitRight, point.x + (Math.cos(angle + halfPi) * this.thickness) / 2),
				y: C3.unlerp(mesh.InitTop, mesh.InitBottom, point.y + (Math.sin(angle + halfPi) * this.thickness) / 2),
			})

			if (i === 1) {
				if (this.laserIndex === 0) {
					mesh.setMeshPoint(0, 0, {
						mode: "absolute",
						x: C3.unlerp(mesh.InitLeft, mesh.InitRight, prevPoint.x),
						y: C3.unlerp(mesh.InitTop, mesh.InitBottom, prevPoint.y),
					})
					mesh.setMeshPoint(0, 1, {
						mode: "absolute",
						x: C3.unlerp(mesh.InitLeft, mesh.InitRight, prevPoint.x),
						y: C3.unlerp(mesh.InitTop, mesh.InitBottom, prevPoint.y),
					})
				} else {
					mesh.setMeshPoint(0, 0, {
						mode: "absolute",
						x: C3.unlerp(mesh.InitLeft, mesh.InitRight, prevPoint.x + (Math.cos(angle - halfPi) * this.thickness) / 2),
						y: C3.unlerp(mesh.InitTop, mesh.InitBottom, prevPoint.y + (Math.sin(angle - halfPi) * this.thickness) / 2),
					})
					mesh.setMeshPoint(0, 1, {
						mode: "absolute",
						x: C3.unlerp(mesh.InitLeft, mesh.InitRight, prevPoint.x + (Math.cos(angle + halfPi) * this.thickness) / 2),
						y: C3.unlerp(mesh.InitTop, mesh.InitBottom, prevPoint.y + (Math.sin(angle + halfPi) * this.thickness) / 2),
					})

					//! todo: fix start of bounce
					/*
                    mesh.setMeshPoint(0, 0, {
						mode: "absolute",
						x: C3.unlerp(mesh.InitLeft, mesh.InitRight, prevPoint.x + (Math.cos(this.startPerpAngle) * this.thickness) / 2),
						y: C3.unlerp(mesh.InitTop, mesh.InitBottom, prevPoint.y + (Math.sin(this.startPerpAngle) * this.thickness) / 2),
					})
					mesh.setMeshPoint(0, 1, {
						mode: "absolute",
						x: C3.unlerp(mesh.InitLeft, mesh.InitRight, prevPoint.x - (Math.cos(this.startPerpAngle) * this.thickness) / 2),
						y: C3.unlerp(mesh.InitTop, mesh.InitBottom, prevPoint.y - (Math.sin(this.startPerpAngle) * this.thickness) / 2),
					})*/
				}
			}

			//last point
			if (i === this.pointCount - 1) {
				//const endFXScale = this.endFX.imageWidth / mesh.imageHeight
				this.endFX.height = this.thickness
				if (this.endFX.animationName !== "End") {
					this.endFX.height *= 2.5
				}
				this.endFX.width = (this.endFX.imageWidth * this.endFX.height) / this.endFX.imageHeight

				if (this.startFX) this.startFX.setSize(this.startFX.imageWidth * endFXScale, this.startFX.imageHeight * endFXScale)
				this.endFX.setPosition(point.x, point.y)
				if (this.reflectionAngle === null)
					this.endFX.angle = C3.angleTo(this.points[i - 2].x, this.points[i - 2].y, this.points[i - 1].x, this.points[i - 1].y)
			}
		}
		mesh.imageScaleX = 100 / (totalDistance / mesh.imageWidth)
		mesh.imageOffsetX += 100 * this.runtime.dt

		// If a collision occurred
		// adjust the last mesh points so they don’t extend past the wall.
		if (this.normalAngle !== null) {
			// Calculate the perpendicular angle based on the reflection angle.
			this.perpAngle = this.normalAngle + Math.PI / 2

			// Compute the collision mesh points at the collision endpoint.
			const collisionMeshPoint0 = {
				mode: "absolute",
				x: C3.unlerp(mesh.InitLeft, mesh.InitRight, this.endPoint.x + (Math.cos(this.perpAngle) * this.thickness) / 2),
				y: C3.unlerp(mesh.InitTop, mesh.InitBottom, this.endPoint.y + (Math.sin(this.perpAngle) * this.thickness) / 2),
			}
			const collisionMeshPoint1 = {
				mode: "absolute",
				x: C3.unlerp(mesh.InitLeft, mesh.InitRight, this.endPoint.x - (Math.cos(this.perpAngle) * this.thickness) / 2),
				y: C3.unlerp(mesh.InitTop, mesh.InitBottom, this.endPoint.y - (Math.sin(this.perpAngle) * this.thickness) / 2),
			}

			// Set the last mesh points using the collision endpoint.
			mesh.setMeshPoint(this.pointCount - 1, 0, collisionMeshPoint0)
			mesh.setMeshPoint(this.pointCount - 1, 1, collisionMeshPoint1)

			//Utils.debugText("Collision Direction: " + this.collisionDirection)

			// Loop backwards through previous points (except the last point) and clamp only the appropriate coordinate.
			for (let i = this.pointCount - 2; i >= 0; i--) {
				const pt = this.points[i]
				let clamped = false

				if (this.collisionDirection === "bottom") {
					// For a top collision, clamp Y so that it does not exceed endPoint.y.
					if (pt.y > this.endPoint.y) {
						pt.y = this.endPoint.y
						clamped = true
					}
				} else if (this.collisionDirection === "top") {
					// For a bottom collision, clamp Y so that it does not go below endPoint.y.
					if (pt.y < this.endPoint.y) {
						pt.y = this.endPoint.y
						clamped = true
					}
				} else if (this.collisionDirection === "right") {
					// For a left collision, clamp X so that it does not exceed endPoint.x.
					if (pt.x > this.endPoint.x) {
						pt.x = this.endPoint.x
						clamped = true
					}
				} else if (this.collisionDirection === "left") {
					// For a right collision, clamp X so that it does not go below endPoint.x.
					if (pt.x < this.endPoint.x) {
						pt.x = this.endPoint.x
						clamped = true
					}
				}

				if (clamped) {
					// Update only the clamped coordinate of the corresponding mesh points.
					// Assuming mesh.getMeshPoint(i, j) returns the current mesh point for index i and j.
					if (this.collisionDirection === "top" || this.collisionDirection === "bottom") {
						// Clamp the Y coordinate.
						let meshPt0 = mesh.getMeshPoint(i, 0)
						let meshPt1 = mesh.getMeshPoint(i, 1)
						mesh.setMeshPoint(i, 0, {
							...meshPt0,
							y: C3.unlerp(mesh.InitTop, mesh.InitBottom, pt.y),
						})
						mesh.setMeshPoint(i, 1, {
							...meshPt1,
							y: C3.unlerp(mesh.InitTop, mesh.InitBottom, pt.y),
						})
					} else {
						// Clamp the X coordinate.
						let meshPt0 = mesh.getMeshPoint(i, 0)
						let meshPt1 = mesh.getMeshPoint(i, 1)
						mesh.setMeshPoint(i, 0, {
							...meshPt0,
							x: C3.unlerp(mesh.InitLeft, mesh.InitRight, pt.x),
						})
						mesh.setMeshPoint(i, 1, {
							...meshPt1,
							x: C3.unlerp(mesh.InitLeft, mesh.InitRight, pt.x),
						})
					}
				} else {
					// Stop once a point is within the collision boundary.
					break
				}
			}
		}
	}

	TickLines() {
		for (let i = 0; i < this.pointCount; i++) {
			if (i === 0) continue
			const line = this.lines[i - 1]
			const point = this.points[i]
			const prevPoint = this.points[i - 1]
			const angle = C3.angleTo(prevPoint.x, prevPoint.y, point.x, point.y)

			line.setPosition(prevPoint.x, prevPoint.y)
			line.angle = angle
			line.setSize(C3.distanceTo(prevPoint.x, prevPoint.y, point.x, point.y), this.thickness)
		}
	}

	refreshLineRenderer() {
		//window.alert("refreshLineRenderer")
		if (this.pointObjectName) {
			for (let i = 0; i < this.points.length; i++) {
				this.debugPoints[i].x = this.points[i].x
				this.debugPoints[i].y = this.points[i].y
			}
		}
	}
}
