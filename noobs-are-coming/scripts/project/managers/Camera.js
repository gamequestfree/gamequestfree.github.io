export class Camera {
	constructor(runtime) {
		this.runtime = runtime

		this.runtime.addEventListener("beforeanylayoutstart", (e) => this.BeforeAnyLayoutStart(e))
		this.runtime.addEventListener("beforeanylayoutend", (e) => this.BeforeAnyLayoutEnd(e))
		this.runtime.addEventListener("resize", (e) => this.RezChanged(e))
		this.runtime.addEventListener("beforeprojectstart", (e) => this.BeforeProjectStart(e))

		this.RezChanged()

		//* ===== CONFIG ===== *//

		this.lockX = false
		this.lockY = false

		this.offsetX = 0
		this.offsetY = 0

		this.speed = 10
		this.zoomScale = 1
		this.zoomSpeed = 10

		this.camForward_Dist = 0
		this.camForward_Speed = 0
		this.aimingMoveFactor = 0.2 //

		this.joystickAimingDist = 40

		this.angleCam = 0
		this.angleSpeed = 0

		this.layersNoRotate = ["Debug", "HUD", "HUD_HTML", "Static", "Cursor", "Vignette", "PostPro", "Objects_Glow"]

		//====================================================================================================

		this.baseScale = 1

		this.currentScale = 1
		this.scaleTarget_override = null

		this.joyTargetX = 0
		this.joyTargetY = 0

		this.uid_mainTargets = new Set()
		this.inst_cameraData = null

		this.init = true

		this.zoomType = 0 // Manual/Area

		this.targetMap = new Map()
		this.impulsesMap = new Map()
		this.rotateShakesMap = new Map()

		this.runtime.addEventListener("instancedestroy", (e) => this._OnInstanceDestroyed(e.instance))

		this.triggerObjectClasses = []

		this.zoomMod = 1

		this.rotateShake_step = "Idle"
		this.rotateShake_angle = 0

		this.isOriginalData = true

		this.originalData = {}
		this._Set_Data(this.originalData, this)

		this.tickFunction = this.Tick.bind(this)
	}

	Screenshake(args = {}) {
		if (this.unit && this.runtime.settings["Screenshake"]) {
			this.unit.juice.Shake(args)
		}
	}

	BeforeProjectStart(e) {
		this.input = this.runtime.input
	}

	BeforeAnyLayoutStart(e) {
		const camera = this.runtime.objects["Camera"].getFirstInstance()
		if (camera) {
			this.inst = camera
			this.unit = new C4.Units.CameraUnit(this.runtime, this.inst)
			this.runtime.addEventListener("tick", this.tickFunction)

			this.iBeh_tween = this.inst.behaviors["Tween"]

			if (this.Step === "Invisible") {
				this._SetVisible(false)
			}

			this.RezChanged()
		}
	}

	BeforeAnyLayoutEnd(e) {
		if (this.unit) this.unit.DestroyUnit()
		this.unit = null
		this.runtime.removeEventListener("tick", this.tickFunction)
	}

	RezChanged(e) {
		if (this.zoomType === 1) {
			let wi = undefined
			if (this.wi_minimumArea) wi = this.wi_minimumArea
			else if (this.inst_cameraData) wi = this.inst_cameraData.GetWorldInfo()

			if (!wi) return

			const layer = sdk_runtime.GetMainRunningLayout().GetLayerByName("Static")
			const layerWidth = layer.GetViewport3D().width()
			const layerHeight = layer.GetViewport3D().height()
			/*
				console.error("layer", layer)
				console.error("OriginalSize", layerWidth, layerHeight)
				console.error("AreaSize", wi.GetWidth(), wi.GetHeight())*/

			this.baseScale = Math.min(layerWidth / wi.GetWidth(), layerHeight / wi.GetHeight())
		}
	}

	_OnInstanceDestroyed(inst) {
		const uid = inst.uid
		this.targetMap.delete(uid)
	}

	Set_MinimumArea(objectClass) {
		const objInstances = objectClass.GetCurrentSol().GetInstances()
		if (objInstances.length === 0) return

		this.zoomType = 1

		this.wi_minimumArea = objInstances[0].GetWorldInfo()
		this.RezChanged()

		this.originalData.zoomType = this.zoomType
	}

	RotateShake(ignoreSetting = false, amplitude = 2, speed = 100) {
		if (!ignoreSetting && !this.runtime.settings["Screenshake"]) return
		this.rotateShake_isRight = !this.rotateShake_isRight
		this.rotateShake_amplitude = amplitude
		this.rotateShake_speed = speed
		this.rotateShake_step = "Ping"
		this.rotateShake_angle = 0
	}

	ImpulseAngle(angle, distance, duration) {
		const tween = this.iBeh_tween.startTween("value", 1, duration / 2, "out-sine", {
			tags: "PopIn",
			startValue: 0,
			pingPong: true,
		})
		const impulse = {
			angle: C3.toRadians(angle),
			distance: distance,
		}
		this.impulsesMap.set(tween, impulse)
	}

	_SetLayoutAngle(a) {
		const angle = C3.toRadians(a)
		this.runtime.layout.angle = angle

		//_SetNonRotateLayersAngle()

		for (const layerName of this.layersNoRotate) {
			const myLayer = this.runtime.layout.getLayer(layerName)
			if (!myLayer) continue
			myLayer.angle = -angle
			for (const layer of myLayer.allSubLayers()) {
				layer.angle = -angle
			}
		}
	}

	Tick() {
		if (this.runtime.timeScale === 0) return
		this.inst.timeScale = 1
		const dt = this.inst.dt
		//const dt = this.runtime.dt

		if (!this.inst || this.uid_mainTargets.size === 0) {
			return
		}
		let targetX = 0
		let targetY = 0

		let mainTargetX = 0
		let mainTargetY = 0

		let elementsToDelete = []

		let minX = Infinity
		let minY = Infinity
		let maxX = -Infinity
		let maxY = -Infinity
		let padding = 50
		//padding = padding / this.runtime.layout.scale

		this.uid_mainTargets.forEach((uid) => {
			const inst_MainTarget = this.runtime.getInstanceByUid(uid)
			if (!inst_MainTarget) {
				elementsToDelete.push(uid)
			} else {
				const bbox = inst_MainTarget.getBoundingBox()
				/*
				if (bbox.left < minX) minX = bbox.left
				if (bbox.top < minY) minY = bbox.top
				if (bbox.right > maxX) maxX = bbox.right
				if (bbox.bottom > maxY) maxY = bbox.bottom*/

				minX = Math.min(minX, bbox.left - padding)
				minY = Math.min(minY, bbox.top - padding)
				maxX = Math.max(maxX, bbox.right + padding)
				maxY = Math.max(maxY, bbox.bottom + padding)
			}
		})

		const boundingBoxWidth = maxX - minX || 1
		const boundingBoxHeight = maxY - minY || 1

		const viewport = this.runtime.layout.getLayer("HUD").getViewport()
		const viewportWidth = viewport.width
		const viewportHeight = viewport.height

		//! IMP for trailer
		let ScaleMod_Singleplayer_Min = 0.9
		let ScaleMod_Multiplayer_Min = 0.7

		//old
		let multiplayerScaleMod = Math.min(viewportWidth / boundingBoxWidth, viewportHeight / boundingBoxHeight)
		multiplayerScaleMod = Math.min(multiplayerScaleMod, ScaleMod_Multiplayer_Min)

		const multiFixedCam = true

		//calculate the scale so the area is entirely visible with margins

		const area = this.runtime.objects["Area_Spawn"].getFirstInstance()
		if (multiFixedCam) {
			const areaWidth = area.width
			const areaHeight = area.height
			const areaMargin = 20

			const scaleWidth = viewportWidth / (areaWidth + 20 * 2)
			const scaleHeight = viewportHeight / (areaHeight + 20 * 2)
			const scaleMulti = Math.min(scaleWidth, scaleHeight)

			multiplayerScaleMod = scaleMulti
		}

		if (this.uid_mainTargets.size <= 1) multiplayerScaleMod = ScaleMod_Singleplayer_Min

		elementsToDelete.forEach((uid) => this.uid_mainTargets.delete(uid))

		if (this.uid_mainTargets.size > 0) {
			mainTargetX = (minX + maxX) / 2
			mainTargetY = (minY + maxY) / 2
		} else {
			mainTargetX = 0
			mainTargetY = 0
		}

		targetX = mainTargetX
		targetY = mainTargetY

		if (multiFixedCam && this.uid_mainTargets.size > 1) {
			targetX = area.x
			targetY = area.y
		}

		//*rotate Shake

		if (this.rotateShake_step !== "Idle") {
			//Ping
			if (this.rotateShake_step === "Ping") {
				this.rotateShake_angle = Math.min(this.rotateShake_angle + this.rotateShake_speed * dt, this.rotateShake_amplitude)
				if (this.rotateShake_angle === this.rotateShake_amplitude) this.rotateShake_step = "Pong"
			}
			//Pong
			else {
				this.rotateShake_angle = Math.max(this.rotateShake_angle - this.rotateShake_speed * dt, 0)
				if (this.rotateShake_angle === 0) {
					this.rotateShake_step = "Idle"
					this._SetLayoutAngle(0)
				}
			}
			if (this.rotateShake_angle !== 0) {
				this._SetLayoutAngle(this.rotateShake_isRight ? this.rotateShake_angle : -this.rotateShake_angle)
			}
		}

		//*impulse

		for (const [tween, impulse] of this.impulsesMap) {
			if (tween.isReleased || tween.progress === 1) {
				this.impulsesMap.delete(tween)
			} else {
				const tweenValue = tween.value > 1 ? 2 - tween.value : tween.value
				targetX += Math.cos(impulse.angle) * impulse.distance * tweenValue
				targetY += Math.sin(impulse.angle) * impulse.distance * tweenValue
			}
		}

		//* MODE : CENTER OFFSET

		for (const [uid, data] of this.targetMap) {
			//ignore main target
			if (this.uid_mainTargets.has(uid)) continue
			targetX += (data.x - mainTargetX) * data.offsetPercent
			targetY += (data.y - mainTargetY) * data.offsetPercent
		}

		//LockXY

		let forceX = false
		let forceY = false

		if (this.inst_cameraData) {
			if (this.lockX) {
				targetX = this.inst_cameraData.x
			}
			if (this.lockY) {
				targetY = this.inst_cameraData.y
			}
		}

		//Aim Move (Mouse)

		if (this.runtime.playersAlive.size < 1) {
			if (this.aimingMoveFactor != 0) {
				if ((this.input && this.input.lastInput_isMouseKeyboard) || (!this.input && this.runtime.mouse)) {
					const layerName = this.inst.layer.name
					const mousePos = this.runtime.mouse.getMousePosition(layerName)
					targetX += (mousePos[0] - mainTargetX) * this.aimingMoveFactor
					targetY += (mousePos[1] - mainTargetY) * this.aimingMoveFactor
				}
			}

			if (this.joystickAimingDist != 0) {
				if (this.input && !this.input.lastInput_isMouseKeyboard) {
					const joystick = this.input.joysticks.get("Aim")
					if (joystick) {
						const joyAngle = C3.toRadians(joystick.angle)

						let joyTendsToX = 0
						let joyTendsToY = 0

						if (joystick.isActive) {
							joyTendsToX = this.joystickAimingDist * Math.cos(joyAngle)
							joyTendsToY = this.joystickAimingDist * Math.sin(joyAngle)
						}

						this.joyTargetX = C3.lerp(this.joyTargetX, joyTendsToX, 10 * dt)
						this.joyTargetY = C3.lerp(this.joyTargetY, joyTendsToY, 10 * dt)

						targetX += this.joyTargetX
						targetY += this.joyTargetY
					}
				}
			}
		}

		//OffsetXY

		targetX += this.offsetX
		targetY += this.offsetY

		//(in fact no) if forceX, the logic change : targetX is not the actual target but just an offset

		let x = forceX ? this.inst.x : C3.lerp(this.inst.x, targetX, this.speed * dt)
		let y = forceY ? this.inst.y : C3.lerp(this.inst.y, targetY, this.speed * dt)

		//lockX no cameraData

		if (!this.inst_cameraData) {
			if (this.lockX) x = this.inst.x + this.offsetX
			if (this.lockY) y = this.inst.y + this.offsetY
		}

		this.inst.setPosition(x, y)

		//zoom

		this.currentScale = C3.lerp(this.currentScale, this.zoomScale * multiplayerScaleMod, this.zoomSpeed * dt)
		this.runtime.layout.scale = this.currentScale * this.zoomMod * this.baseScale

		//Utils.debugText("MultiScale:" + multiplayerScaleMod.toFixed(2) + " LayoutScale" + this.runtime.layout.scale.toFixed(2))

		//const zoom = wi.GetZoomRate()

		if (this.uid_mainTargets.size === 1) {
			const cameraData = this.TestOverlapDirector()
			if (cameraData) {
				this.isOriginalData = false
				this._Set_CameraData(cameraData)
			} else {
				if (!this.isOriginalData) {
					this._Set_Data(this, this.originalData)
					this.inst_cameraData = null
					this.isOriginalData = true
				}
			}
		}
	}

	TestOverlapDirector() {
		//TODO
		if (this.triggerObjectClasses.size === 0) return

		const collisionEngine = this.runtime.collisions

		const uidSingleMainTarget = this.uid_mainTargets.values().next().value

		const instMainTarget = this.runtime.getInstanceByUid(uidSingleMainTarget)

		return Utils.testOverlapOpti_Single(instMainTarget, this.triggerObjectClasses)
	}

	SetMainTarget(inst) {
		this.uid_mainTargets.clear()
		this.uid_mainTargets.add(inst.uid)
	}

	AddMainTarget(inst) {
		this.uid_mainTargets.add(inst.uid)
	}

	RemoveMainTarget(inst) {
		this.uid_mainTargets.delete(inst.uid)
	}

	Set_ZoomModifier(percent) {
		this.zoomMod = percent / 100
	}

	Add_Target(inst, offsetPercent_, weight_) {
		this.targetMap.set(inst.uid, {
			inst: inst,
			offsetPercent: offsetPercent_ / 100,
			weight: weight_,
		})
	}

	Add_CameraTriggerType(objectClass) {
		this.triggerObjectClasses.push(objectClass)
		console.warn("Add_CameraTriggerType", this.triggerObjectClasses)
	}

	Reset_OriginalData() {
		this.inst_cameraData = null
		this._Set_Data(this, this.originalData)
	}

	_Set_CameraData(inst) {
		const beh_camData = Inst_GetBehavior(inst, BEH_CAMERA)
		if (!beh_camData) return
		if (this.inst_cameraData === inst) return

		this.inst_cameraData = inst

		this._Set_Data(this, beh_camData)
	}

	_Set_Data(object, data) {
		//if (data._inst) console.error(data._inst.GetObjectClass().GetName())

		object.lockX = data.lockX
		object.lockY = data.lockY
		object.offsetX = data.offsetX
		object.offsetY = data.offsetY
		object.speed = data.speed
		object.zoomScale = data.zoomScale
		object.zoomSpeed = data.zoomSpeed
		//this.zoomType = data.zoomType
		object.camForward_Dist = data.camForward_Dist
		object.camForward_Speed = data.camForward_Speed
		object.aimingMoveFactor = data.aimingMoveFactor
		object.joystickAimingDist = data.joystickAimingDist
		object.angleCam = data.angleCam
		object.angleSpeed = data.angleSpeed
	}
}
