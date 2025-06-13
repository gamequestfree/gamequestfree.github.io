const limitByIndex = ["Duration", "Distance", "Speed"]

export class Compo_Move extends C4.Component {
	constructor(unit, data = null) {
		super(unit, data)

		//*========== INIT ====================
		this.initWithSpeed = true
		this.initSpeed = 0
		this.initAcc = 0
		this.initGravity = 0
		this.onSolid = "Slide" //"None", "Bounce", "Slide", "Destroy"
		this.onSolid_original = this.onSolid
		this.setAngle = false
		this.isStepping = true
		this.enabled = true

		//*========== AFTER INIT ====================

		this.debug = false

		this.speed = this.initSpeed
		this.acc = this.initAcc
		this.gravity = this.initGravity

		this.isMoving = false

		//props are initialized

		this.angleOfMotion = 0

		if (!this.initWithSpeed) {
			this.speed = 0
		}

		this.Set_Enabled(this.enabled)

		//Overboy Projectile

		this.instVisu = null

		this.moveAngle_WithoutImpulse = 0

		this.tweenActual

		this.hitX = -1
		this.hitY = -1

		this.hitPoints = []

		//TODO

		//todo stunned/frozen

		this.speed_toleranceIdle = 10
		this.targetDistanceApprox1 = 10
		this.targetDistanceApprox2 = 12

		//Lerp

		this.lerping = false
		this.lerpRemaining = 0
		this.lerpSpeed = 0

		this.stoppedLastTick = false

		//Prop tween related

		this.tag = "ProjectileBehavior"
		this.isBoomerang = false

		this.tweenState = ""
		this.tween_valueTarget = 0
		this.tween_lastValue = 0
		this.t = 0

		//Boomerang

		this.acc = 0
		this.acc_CanNegative = false

		this.maxSpeed = 0

		this.distTravel = 0
		this.distTravel_LastTick = 0

		this.returnDelay = 0
		this.throwAngle = 0
		this.thrower = null

		this.UID_Thrower = -1
		this.UID_BulletOwner = -1

		this.targetX = 0
		this.targetY = 0
		this.returnX = 0
		this.returnY = 0

		//incremented from outside
		this.moveX = 0
		this.moveY = 0

		this.impulseSet = new Set()

		this.iBeh_tween = null
		this.iBeh_physics = null
		this.iBeh_pathfinding = null
	}

	PostCreate() {
		this.angleOfMotion = this.inst.angle

		this.stepSize = Math.min(Math.abs(this.inst.width), Math.abs(this.inst.height) / 2)
		this.stopStepping = false

		this.lastX = this.inst.x
		this.lastY = this.inst.y

		this.iBeh_tween = this.inst.behaviors["Tween"]
		this.iBeh_physics = this.inst.behaviors["Physics"]
		this.iBeh_pathfinding = this.inst.behaviors["Pathfinding"]
	}

	ResetMove() {
		this.isTweening = false
		this.tween = null
		this.speed = 0
	}

	//dx direction x
	//mx movement x

	Tick() {
		if (!this.enabled) return

		try {
			const dt = this.inst.dt
		} catch (e) {
			console.error("Error in Compo_Move.Tick", this)
		}

		const dt = this.inst.dt
		if (!dt) return

		if (this.stoppedLastTick) {
			this.speed = 0
			this.stoppedLastTick = false
		}

		//acceleration
		if (this.acc !== 0) {
			this.speed += this.acc * dt
			if (!this.acc_CanNegative) this.speed = Math.max(this.speed, 0)
		}
		this.lastX = this.inst.x
		this.lastY = this.inst.y

		let mx = 0
		let my = 0

		let tickDist

		//* Tween-based movement
		if (this.isTweening && this.tween) {
			if (this.tweenState === "delay") {
				//
			}
			//tweening
			else {
				const value = this.tween.value

				tickDist = (value - this.tween_lastValue) * this.tween_valueTarget
				this.speed = tickDist / dt
				mx = Math.cos(this.angleOfMotion) * tickDist
				my = Math.sin(this.angleOfMotion) * tickDist

				this.tween_lastValue = value
			}
		}
		//* Lerp-based movement
		else if (this.lerping) {
			const ret = this.Tick_BoomerangLerp()
			mx = ret.mx
			my = ret.my
		}
		//* Acceleration-based movement
		else {
			mx = this.speed * Math.cos(this.angleOfMotion) * dt
			my = this.speed * Math.sin(this.angleOfMotion) * dt
			//gravity
			my += this.gravity * dt
			//mx = this.dx * dt + 0.5 * xacc * dt * dt
			//my = this.dy * dt + 0.5 * yacc * dt * dt
		}

		//*isMoving ??

		if (this.speed > this.speed_toleranceIdle) {
			if (!this.isMoving) {
				this.Trigger("OnMove")
				this.isMoving = true
			}
		} else {
			if (this.isMoving) {
				this.Trigger("OnStop")
				this.isMoving = false
			}
		}

		mx += this.moveX
		my += this.moveY
		this.moveX = 0
		this.moveY = 0

		this.moveAngle_WithoutImpulse = C3.toDegrees(C3.angleTo(0, 0, mx, my))

		//* impulses

		this.isImpulsing = false
		for (const impulse of this.impulseSet) {
			this.isImpulsing = true
			//acceleration impulse (+ attractor)
			if (impulse.type === "acc") {
				//!kick ignore attract and knockback
				if (this.kickMoving && this.impulseKick !== impulse) continue

				let angle = impulse.angle
				let attractor = null

				if (impulse.UID_Attractor) {
					attractor = this.runtime.getInstanceByUid(impulse.UID_Attractor)
					if (attractor) {
						angle = C3.angleTo(this.inst.x, this.inst.y, attractor.x, attractor.y)
						const dist = C3.distanceTo(this.inst.x, this.inst.y, attractor.x, attractor.y)
						if (dist < 15) {
							continue
						}
					}
				}

				impulse.speed = Math.max(impulse.speed + impulse.acc * dt, 0)
				mx += Math.cos(angle) * impulse.speed * dt
				my += Math.sin(angle) * impulse.speed * dt
				if (impulse.speed <= 0) {
					this.impulseSet.delete(impulse)
					if (this.impulseKick === impulse) {
						this.impulseKick = null
					}
				}
			}
			//tween impulse
			else if (impulse.type === "tween") {
				let impulseTickDist = (impulse.tween.value - impulse.lastValue) * impulse.distance
				impulse.speed = impulseTickDist / dt
				mx += Math.cos(impulse.angle) * impulseTickDist
				my += Math.sin(impulse.angle) * impulseTickDist
				impulse.lastValue = impulse.tween.value
			}
		}

		//*forces

		if (mx !== 0 || my !== 0) {
			this.MoveBy(mx, my)
			if (this.setAngle) {
				//if boomerang pong, object is facing the opposite direction
				this.SetInstAngle(this.tweenState === "out" ? C3.angleTo(mx, my, 0, 0) : C3.angleTo(0, 0, mx, my))

				if (this.tweenState) {
					//Utils.debugText("Tween Angle " + C3.toDegrees(C3.angleTo(mx, my, 0, 0)))
				}
			}
		}
	}

	Tick_BoomerangLerp() {
		const dt = this.inst.dt
		let tickDist = 0

		if (this.returnTo === "Pos") {
			//
		} else if (this.returnTo === "BulletOwner") {
			const bulletOwner = this.runtime.getInstanceByUid(this.UID_BulletOwner)
			if (bulletOwner) {
				const bboxMid = Utils.World_GetBBoxMid(bulletOwner)
				this.returnX = bboxMid[0]
				this.returnY = bboxMid[1]
			} else {
				this.returnTo = "Pos"
				//keep previous return position
			}
		}

		let remainingDist = 0
		let currentTargetDist = 0

		if (this.returnPath === "Path") {
			if (this.hitPoints.length > 0) {
				const lastHitPoint = this.hitPoints[this.hitPoints.length - 1]
				this.targetX = lastHitPoint.x
				this.targetY = lastHitPoint.y

				//the distance from the projectile to the last hit point
				currentTargetDist = C3.distanceTo(this.inst.x, this.inst.y, this.targetX, this.targetY)
				remainingDist += currentTargetDist

				//add the distance between each hit point
				let previousHitX = lastHitPoint.x
				let previousHitY = lastHitPoint.x

				for (let i = this.hitPoints.length - 2; i >= 1; i--) {
					const hitPoint = this.hitPoints[i]
					remainingDist += C3.distanceTo(hitPoint.x, hitPoint.y, previousHitX, previousHitY)
					previousHitX = hitPoint.x
					previousHitY = hitPoint.y
				}

				const firstHitPoint = this.hitPoints[0]
				//the distance from the first hit point to the return point
				remainingDist += C3.distanceTo(firstHitPoint.x, firstHitPoint.y, this.returnX, this.returnY)
			} else {
				this.returnPath = "Direct"
			}
		}
		if (this.returnPath === "Direct") {
			this.targetX = this.returnX
			this.targetY = this.returnY

			currentTargetDist = C3.distanceTo(this.inst.x, this.inst.y, this.targetX, this.targetY)
			remainingDist = currentTargetDist
		}

		this.angleOfMotion = C3.angleTo(this.inst.x, this.inst.y, this.targetX, this.targetY)

		tickDist = C3.lerp(0, remainingDist, this.lerpSpeed * dt)

		const PopLastHitPoint = () => {
			if (currentTargetDist <= tickDist) {
				if (this.hitPoints.length > 0) {
					tickDist -= currentTargetDist

					//call Trigger OnBackPoint

					this.inst.setPosition(this.targetX, this.targetY)

					this.hitPoints.pop()

					if (this.hitPoints.length > 0) {
						this.targetX = this.hitPoints[this.hitPoints.length - 1].x
						this.targetY = this.hitPoints[this.hitPoints.length - 1].y
					} else {
						this.targetX = this.returnX
						this.targetY = this.returnY
					}

					currentTargetDist = C3.distanceTo(this.inst.x, this.inst.y, this.targetX, this.targetY)
					this.angleOfMotion = C3.angleTo(this.inst.x, this.inst.y, this.targetX, this.targetY)

					if (currentTargetDist <= tickDist) {
						PopLastHitPoint()
					}
				} else {
					tickDist = currentTargetDist

					this.stoppedLastTick = true
					this.ReturnComplete()
				}
			} else {
				/*
                    this.lerping = false
                    this.stoppedLastTick = true
                    this.ReturnComplete()*/
			}
		}

		PopLastHitPoint()

		this.speed = tickDist / dt
		let mx = Math.cos(this.angleOfMotion) * tickDist
		let my = Math.sin(this.angleOfMotion) * tickDist

		//console.error("Boomerange Lerp", remainingDist.toFixed(2), tickDist.toFixed(2))

		if (tickDist <= 1) {
			this.stoppedLastTick = true
			this.ReturnComplete()
		}
		return {
			mx: mx,
			my: my,
		}
	}

	ApplyElasticForce(x, y, stiffness = 10, damping = 1, restLength = 0) {
		const dt = this.inst.dt
		if (!dt) return

		const dx = x - this.inst.x
		const dy = y - this.inst.y
		const dist = Math.sqrt(dx * dx + dy * dy)

		if (dist === 0) return // avoid div by 0

		const directionX = dx / dist
		const directionY = dy / dist

		const stretch = dist - restLength

		// initialize persistent velocity if not present
		if (this.elasticVx === undefined) this.elasticVx = 0
		if (this.elasticVy === undefined) this.elasticVy = 0

		// apply force if stretched
		if (stretch > 0) {
			const rawForceMag = stiffness * stretch

			// 🌿 Ease into the force with an exponential curve
			const easeFactor = 50 // tweak this for softness
			const easedForceMag = rawForceMag * (1 - Math.exp(-stretch / easeFactor))

			let fx = directionX * easedForceMag
			let fy = directionY * easedForceMag

			this.elasticVx += fx * dt
			this.elasticVy += fy * dt
		}

		const maxVelocity = 50 // tweak this to your needs
		const velMag = Math.sqrt(this.elasticVx ** 2 + this.elasticVy ** 2)
		if (velMag > maxVelocity) {
			const scale = maxVelocity / velMag
			this.elasticVx *= scale
			this.elasticVy *= scale
		}

		// Apply damping to always decay velocity
		const dampFactor = 1 / (1 + damping * dt)
		this.elasticVx *= dampFactor
		this.elasticVy *= dampFactor

		// Apply to movement vector
		this.moveX += this.elasticVx
		this.moveY += this.elasticVy

		//console.error("ApplyElasticForce", this.elasticVx, this.elasticVy)
	}

	SetInstAngle(angle) {
		let animAngle
		if (this.unit.anim) {
			this.unit.anim.angle = angle
		}
		this.inst.angle = angle
	}

	SetOnSolid(onSolid) {
		//if onSolid = 0, it's "Original"
		const onSolids = ["None", "Bounce", "Slide", "Destroy", "Original"]
		if (!onSolids.includes(onSolid)) {
			console.error("MOVE COMP : Invalid onSolid value", onSolid)
		}
		this.onSolid = onSolid === "Original" ? this.onSolid_original : onSolid
	}

	Is_Dashing() {
		if (this.isTweening || this.lerping) return true
		return false
	}

	Cancel_Dash() {
		//TODO
	}

	ReturnComplete() {
		this.isBoomerang = false
		this.lerping = false
		//this.Set_Enabled(false)
		this.tweenState = ""
		this.Trigger("OnBoomerang_Pong_End")
	}

	MoveBy(mx, my) {
		//for sliding
		//dx and dy are max but normalized so dx = mx
		this.dx = mx
		this.dy = my
		this.offX = mx
		this.offY = my

		const stepDistance = C3.distanceTo(0, 0, mx, my)

		if (!this.isStepping || stepDistance <= this.stepSize) {
			this.inst.offsetPosition(mx, my)
			if (this.isStepping) this.Trigger("OnStep")
			return
		}

		this.stopStepping = false
		const startX = this.inst.x
		const startY = this.inst.y

		const endX = startX + mx
		const endY = startY + my
		const angle = C3.angleTo(0, 0, endX, endY)

		const stepX = Math.cos(angle) * this.stepSize
		const stepY = Math.sin(angle) * this.stepSize
		const steps = Math.floor(stepDistance / this.stepSize)

		for (let i = 1; i <= steps; i++) {
			this.inst.setPosition(startX + stepX * i, startY + stepY * i)
			//looks like vanilla doesn't check collision
			//this.CheckCollision()
			this.Trigger("OnStep")
			if (this._inst.IsDestroyed() || this.stopStepping) {
				return
			}
		}

		this.inst.setPosition(endX, endY)
		this.Trigger("OnStep")
	}

	PostTick() {
		this.CheckCollision()

		this.distTravel_LastTick = C3.distanceTo(this.lastX, this.lastY, this.inst.x, this.inst.y)
		this.distTravel += this.distTravel_LastTick
	}

	angleToDeg360(angle) {
		return (C3.toDegrees(angle) + 360) % 360
	}

	//! CAREFUL : collision engine interface lacks many features (calculateBounceAngle, pushOutSolid, pushOutSolidNearest)

	CheckCollision() {
		if (!this.enabled || this.onSolid === "None") return
		if (this.speed === 0 && !this.isImpulsing) return
		if (this.lerping) {
			return
		}

		//window.alert("CheckCollision")

		const dt = this.inst.dt

		//check collision
		const collisionEngine = sdk_runtime.GetCollisionEngine()
		const solid = collisionEngine.TestOverlapSolid(this._inst)

		if (solid) {
			collisionEngine.RegisterCollision(this._inst, solid)

			//*IMPULSE

			for (const impulse of this.impulseSet) {
				const bounceAngle = collisionEngine.CalculateBounceAngle(this._inst, this.lastX, this.lastY)
				impulse.angle = bounceAngle
			}

			//hit point
			const intersectRect = this.GetIntersectRect(this._inst.GetWorldInfo().GetBoundingBox(), solid.GetWorldInfo().GetBoundingBox())
			this.hitX = intersectRect.midX()
			this.hitY = intersectRect.midY()

			//boomerang
			if (this.isTweening) {
				this.hitPoints.push({ x: this.inst.x, y: this.inst.y })
				//remember position
			}

			//* BOUNCE
			if (this.onSolid === "Bounce" || this.impulseSet.size > 0 || this.kickMoving) {
				this.runtime.objects["FX_Poc"].createInstance("FX_Ahead", this.hitX, this.hitY)

				const s = this.speed
				const bounceAngle = collisionEngine.CalculateBounceAngle(this._inst, this.lastX, this.lastY)

				this.hit_angleBefore = C3.toDegrees(this.angleOfMotion)

				const angle1 = this.angleToDeg360(bounceAngle)
				const angle2 = this.angleToDeg360(this.angleOfMotion)
				const absDiff = Math.abs(angle1 - angle2)
				this.hit_angleNormal = Math.min(absDiff, 360 - absDiff)

				const dx = Math.cos(bounceAngle) * s
				const dy = Math.sin(bounceAngle) * s
				this.angleOfMotion = bounceAngle

				this.inst.offsetPosition(dx * dt, dy * dt)

				if (this.setAngle) {
					this.SetInstAngle(bounceAngle)
				}
				if (!collisionEngine.PushOutSolid(this._inst, dx / s, dy / s, Math.max(s * 2.5 * dt, 30)))
					collisionEngine.PushOutSolidNearest(this._inst, 100)
			}

			//* SLIDE
			else if (this.onSolid === "Slide") {
				// angle + 90 degrees ? careful dy before dx
				const m = Math.atan2(this.dy, this.dx) + Math.PI / 2
				let pushedOutOk = false
				const minPushDist = (this.inst.width + this.inst.height) / 4
				const speed = this.speed
				if (collisionEngine.PushOutSolidAxis(this._inst, Math.cos(m), Math.sin(m), Math.max(speed * 2.5 * dt, minPushDist))) {
					pushedOutOk = true
					const endX = this.inst.x
					const endY = this.inst.y
					const maxStep = speed * dt
					const stepDist = C3.distanceTo(this.lastX, this.lastY, endX, endY)
					if (stepDist > maxStep * 1.01) {
						const prog = maxStep / stepDist
						const targetX = C3.lerp(this.lastX, endX, prog)
						const targetY = C3.lerp(this.lastY, endY, prog)
						this.inst.setPosition(targetX, targetY)

						const collInst = collisionEngine.TestOverlapSolid(this._inst)
						if (collInst) {
							const la = C3.angleTo(this.lastX, this.lastY, endX, endY) + Math.PI / 2
							const lxdir = Math.cos(la)
							const lydir = Math.sin(la)
							const ld = (this.inst.width + this.inst.height) / 2 / 10
							if (!collisionEngine.PushOutSolidAxis(this._inst, lxdir, lydir, Math.max(ld, 1))) {
								this.inst.setPosition(this.lastX, this.lastY)

								pushedOutOk = false
							}
						}
					}
				}
				if (!pushedOutOk) {
					const mag = Math.hypot(this.offX, this.offY)
					const pushX = -this.offX / mag
					const pushY = -this.offY / mag
					this.dx = 0
					this.dy = 0
					if (!collisionEngine.PushOutSolid(this._inst, pushX, pushY, Math.max(speed * 2.5 * dt, minPushDist))) {
						this.inst.setPosition(this.lastX, this.lastY)
					}
				}
			}

			//*
			if (this.onSolid === "Slide_CopyPaste") {
				//
			}

			//trigger On Solid Hit
			if (this.onSolid !== "Slide" || this.kickMoving) {
				this.TriggerWithEvent("On_Solid_Hit")

				if (this.kickMoving) {
					const kickComp = this.unit.GetComponent("Kickable")
					kickComp.Kick_On_Solid_Hit()
					this.TriggerWithEvent("Kick_On_Solid_Hit")
				}
			}

			//! important to avoid issues with NaN

			if (isNaN(this.inst.x) || isNaN(this.inst.y)) {
				this.inst.setPosition(this.lastX, this.lastY)
				//window.alert("NaN")
			}
		}
	}

	GetIntersectRect(a, b) {
		const left = Math.max(a.getLeft(), b.getLeft())
		const top = Math.max(a.getTop(), b.getTop())
		const right = Math.min(a.getRight(), b.getRight())
		const bottom = Math.min(a.getBottom(), b.getBottom())
		return new C3.Rect(left, top, right, bottom)
	}

	Dash_Acc(speed, acc) {
		this.isDashAcc = true
		this.speed = speed
		this.acc = acc
	}

	Impulse_Attract(UID_Attractor, speed, acc = 0) {
		const impulse = {}
		impulse.UID_Attractor = UID_Attractor
		impulse.type = "acc"
		impulse.speed = speed
		impulse.acc = acc
		this.impulseSet.add(impulse)
	}

	Impulse_Kick(angle, speed, acc = 0) {
		this.impulseSet.delete(this.impulseKick)
		this.impulseKick = this.Impulse_Acc(angle, speed, acc)
	}

	Impulse_Acc(angle, speed, acc = 0) {
		const impulse = {}
		impulse.type = "acc"
		impulse.angle = C3.toRadians(angle)
		impulse.speed = speed
		impulse.acc = acc
		this.impulseSet.add(impulse)
		return impulse
	}

	async Impulse_Tween(angle, distance, ease, duration) {
		const impulse = {}
		impulse.type = "tween"
		impulse.angle = C3.toRadians(angle)
		impulse.distance = distance
		impulse.ease = ease
		impulse.duration = duration
		impulse.lastValue = 0

		impulse.tween = this._StartTween(0, 1, duration, ease, "ProjectileBehavior")

		this.impulseSet.add(impulse)

		//await impulse.tween.finished

		try {
			await impulse.tween.finished
		} catch (error) {
			return
		}

		this.impulseSet.delete(impulse)
	}

	async Dash_Tween(distance, ease, duration) {
		this.Set_Enabled(true)
		this.isBoomerang = false
		this.isTweening = true
		this.tween_valueTarget = distance
		this.tween_lastValue = 0

		this.tween = this._StartTween(0, 1, duration, ease, "ProjectileBehavior")

		//if (!this.tween) return //fix restart issue

		try {
			await this.tween.finished
		} catch (error) {
			return
		}

		this.tween = null
		this.isTweening = false
		this.speed = 0

		this.Trigger("OnDash_End")
	}

	// Simple dt-based timer that resolves after a certain duration in game time
	WaitForSeconds(duration) {
		return new Promise((resolve) => {
			let elapsed = 0

			const wait = () => {
				const dt = this.inst.dt

				if (dt > 0) {
					elapsed += dt
				}

				if (elapsed >= duration) {
					resolve()
				} else {
					requestAnimationFrame(wait)
				}
			}

			wait()
		})
	}

	_StartTween(startValue, targetValue, duration, ease, tags) {
		if (ease === "") ease = "linear"
		return this.iBeh_tween.startTween("value", targetValue, duration, ease, {
			tags: tags,
			startValue: startValue,
		})
	}

	/*
    args = {
        distance: 200,
        ownerUID: -1,
        returnPath: "Direct",
        easeIn: "linear",
        easeOut: "lerp",
        EndLerpSpeed: 50,
        durationIn: 0.5,
        durationPause: 0.1,
    }*/

	async Boomerang_Tween(args = {}) {
		this.tween_valueTarget = args.distance || 20
		this.UID_BulletOwner = args.UID_BulletOwner || 0
		this.returnPath = args.returnPath || "Direct"
		const easeIn = args.easeIn || "linear"
		const easeOut = args.easeOut || "lerp"
		const durationIn = args.durationIn || 0.5
		const durationPause = args.durationPause || 0.1
		const lerpSpeed = args.EndLerpSpeed || 50

		this.hitPoints = []
		this.isBoomerang = true

		this.tween_lastValue = 0

		if (easeOut === "lerp") {
			this.lerpSpeed = lerpSpeed
		}

		//default return to pos
		this.returnTo = "Pos"
		this.returnX = this.inst.x
		this.returnY = this.inst.y

		if (this.UID_BulletOwner) {
			const bulletOwner = this.runtime.getInstanceByUid(this.UID_BulletOwner)
			if (bulletOwner) {
				this.returnTo = "BulletOwner"
			}
		}

		//this.Set_Enabled(true)

		//*START

		this.isTweening = true
		this.tweenState = "in"
		this.tween = this._StartTween(0, 1, durationIn, easeIn, "ProjectileBehavior")
		this.Trigger("OnBoomerang_Ping_Start")

		//*WAIT
		try {
			await this.tween.finished
		} catch (error) {
			this.isBoomerang = false
			return
		}
		this.Trigger("OnBoomerang_Ping_End")

		if (durationPause > 0) {
			//TODO await duration
			this.t = 1
			this.speed = 0
			this.currentTimer = 0
			this.tweenState = "delay"
			await this.WaitForSeconds(durationPause)
		}

		//*RETURN START

		this.Trigger("OnBoomerang_Pong_Start")

		this.tweenState = "out"

		//*LERP-RETURN
		if (easeOut === "lerp") {
			this.isTweening = false
			this.lerping = true

			//window.alert("Lerp Return")
		}

		//*TWEEN-RETURN
		else {
			//opposite of current angle
			this.angleOfMotion = C3.toRadians((C3.toDegrees(this.angleOfMotion) + 180) % 360)
			this.tween_valueTarget = distance
			this.tween_lastValue = 0

			this.tween = this._StartTween(0, 1, durationIn, easeIn, "ProjectileBehavior")

			this.isTweening = true

			//*RETURN END
			try {
				await this.tween.finished
			} catch (error) {
				this.isBoomerang = false
				return
			}

			this.tweenState = "no"
			this.isTweening = false
			//this.Set_Enabled(false)
			this.ReturnComplete()
		}
	}

	//* BOOMERANG LOGIC

	//#region BOOMERANG

	Boomerang_IsReturning() {
		return this.tweenState === "out"
	}

	//Actions setters

	IsEnabled() {
		return this.enabled
	}

	IsMovingRight() {
		return this.angleOfMotion > 0 && this.angleOfMotion < Math.PI
	}

	Set_Enabled(enabled) {
		if (!this.inst) return
		this.enabled = !!enabled

		if (this.enabled) {
			this._SetTicking(true)
			if (this.onSolid !== "None") {
				this._SetPostTicking(true)
			}
		} else {
			this._SetTicking(false)
			this._SetPostTicking(false)
		}
	}

	Set_AngleOfMotion(angle) {
		this.angleOfMotion = C3.toRadians(angle)
	}

	Set_Speed(speed) {
		this.speed = speed
	}

	Set_Acc(acc, canNegative = false) {
		this.acc_CanNegative = canNegative
		this.acc = acc
	}

	Set_Gravity(gravity) {
		this.gravity = gravity
	}

	// Expressions

	AngleOfMotion() {
		if (this.iBeh_physics && this.iBeh_physics.isEnabled) {
			return C3.toDegrees(Math.atan(this.iBeh_physics.getVelocityY() / this.iBeh_physics.getVelocityX()))
		}
		return C3.toDegrees(this.angleOfMotion)
	}

	Speed() {
		return this.speed
	}

	Acceleration() {
		return this.acc
	}

	//#endregion
}
