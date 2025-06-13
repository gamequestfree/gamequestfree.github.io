const propSine = ["Horizontal", "Vertical", "Forwards/Backwards", "Width", "Height", "Size", "Angle", "Opacity", "Z elevation", "Value Only"]
const prop1D = ["angle", "scale", "posX", "posY", "posZ"]
const prop2D = ["pos2D", "scale2D", "size2D"]
const propSpring = ["pos2D", "scale2D", "size2D", "angle"]
//const propTween = ["Position", "X", "Y", "Size", "Width", "Height", "Angle", "Opacity", "Color"]

const flipThreshold = 0.01

export class Compo_Juice extends C4.Component {
	constructor(unit, data = null) {
		super(unit, data)

		this._enabled = true

		this.shakes = new Map()

		this.springs = new Map()
		this.springsProps = new Map()

		this.sines = new Map()
		this.tweens = new Map()

		//squash and stretch (lerp)
		this.SS_lerpSpeed = 10
		this.SS_x = 1
		this.SS_y = 1

		this.currentSpring = null

		this.uniqueTagCount = 0

		this.dt = 0
		this.dtRounded = 0

		if (!globalThis._cachedMotionParams) globalThis._cachedMotionParams = new Map()

		this.justStartedSpringNames = []

		this.overridePos = [false, false]

		this.lastPosOffset = [0, 0]
		this.lastAngleOffset = 0
		//this.lastSizeOffset = [0, 0]
		this.lastScaleMultiplier = [1, 1]

		this.flipX = {
			actualValue: 1,
			value: 1,
			lastValue: 1,
			target: 1,
			speed: 10,
		}
		this.flipY = {
			actualValue: 1,
			value: 1,
			lastValue: 1,
			target: 1,
			speed: 10,
		}
	}

	Trigger(method) {
		//TODO (to fix)
	}

	PostCreate() {
		this.tweenBeh = this.inst.behaviors?.["Tween"]

		if (!this.tweenBeh) window.alert("Tween behavior not found")

		this.inst.addEventListener("framechange", (animName, animFrame) => {})

		this._SetPostTicking(true)
		this._SetTicking2(true)
	}

	//===UPDATE TICKING================================================================

	_UpdateTickState() {
		if (this._enabled && (this.springs.size > 0 || this.shakes.size > 0)) {
			this._SetPostTicking(true)
			this._SetTicking2(true)
		} else {
			this._SetPostTicking(false)
			this._SetTicking2(false)
		}
	}

	//! TICK 2 /////////////////////////////////////////////////////////////////////////////
	Tick2() {
		const dt = this.inst.dt
		this.dt = dt
		this.dtRounded = parseFloat(dt.toFixed(4))

		let posOffset = [0, 0]
		let forcedPosOffset = [0, 0]
		let angleOffset = 0
		//let sizeOffset = [1, 1]
		let scaleMultiplier = [1, 1]

		let springPosNumber = 0

		//let overridePos = [false, false]
		let overrideAngle = false
		let springAngleOffset = 0

		if (dt > 0) {
			//* SS_Lerp

			if (this.SS_y !== 1) {
				this.SS_y = C3.lerp(this.SS_y, 1, this.SS_lerpSpeed * dt)
				scaleMultiplier[1] *= this.SS_y
			}

			if (this.SS_x !== 1) {
				this.SS_x = C3.lerp(this.SS_x, 1, this.SS_lerpSpeed * dt)
				scaleMultiplier[0] *= this.SS_x
			}

			//* SHAKES
			for (const [name, shake] of this.shakes.entries()) {
				if ((shake.mode !== 2) & (shake.remaining <= dt)) {
					//
				} else {
					let magX = shake.magX * Math.min(this.inst.timeScale, 1)
					let magY = shake.magY * Math.min(this.inst.timeScale, 1)
					if (shake.mode === 0) {
						// decay
						magX *= shake.remaining / shake.duration
						magY *= shake.remaining / shake.duration
					}
					const a = Math.random() * Math.PI * 2
					posOffset[0] += Math.cos(a) * magX
					posOffset[1] += Math.sin(a) * magY
					shake.remaining -= dt
				}
			}

			//* TWEENS
			for (const [name, tweenMotion] of this.tweens.entries()) {
				switch (tweenMotion.prop) {
					case "Position":
						posOffset[0] += tweenMotion.GetValueX()
						posOffset[1] += tweenMotion.GetValueY()
						break
					case "X":
						posOffset[0] += tweenMotion.GetValueX()
						break
					case "Y":
						//IT MUST BE VALUE X !!! (because only 1 property is tweened at a time)
						posOffset[1] += tweenMotion.GetValueX()

						break
					case "Angle":
						angleOffset += tweenMotion.GetValueX()
						break
				}
			}

			//* SINES
			for (const [name, sine] of this.sines.entries()) {
				if (sine.enabled) {
					const sineValue = sine.Sine_TickValue(this.dt)

					if (!globalThis.sineUID) globalThis.sineUID = this.unit.uid

					switch (sine.prop) {
						case "Horizontal":
							posOffset[0] += sineValue
							break
						case "Vertical":
							posOffset[1] += sineValue
							break
						case "Size":
							//
							break
						case "Width":
							scaleMultiplier[0] *= 1 + sineValue
							break
						case "Height":
							scaleMultiplier[1] *= 1 + sineValue
							break
						case "Angle":
							angleOffset += sineValue
							break
						case "Opacity":
							//wi.SetOpacity(this._initialValue + (this.WaveFunc(this._i) * this._mag) / 100)
							break
						case "Forwards/Backwards":
							/*
                                if (this.inst.x !== this._lastKnownValue) this._initialValue += this.inst.x - this._lastKnownValue
                                if (this.inst.y !== this._lastKnownValue2) this._initialValue2 += this.inst.y - this._lastKnownValue2
                                this.inst.x = (this._initialValue + Math.cos(this.inst.angle) * this.WaveFunc(this._i) * this._mag)
                                this.inst.y = (this._initialValue2 + Math.sin(this.inst.angle) * this.WaveFunc(this._i) * this._mag)
                                this._lastKnownValue = this.inst.x
                                this._lastKnownValue2 = this.inst.y*/
							break
						case "Z elevation":
							//wi.SetZElevation(this._initialValue + this.WaveFunc(this._i) * this._mag)
							break
					}
				}
			}

			//override only when springing prop directly

			//* SPRINGS

			for (const [name, spring] of this.springs.entries()) {
				if (!spring._isPaused && !spring._isAtStable) {
					this.UpdateSpring(spring)

					//SPRING OFFSETS
					if (spring._type === "offset") {
						switch (spring._prop) {
							case "posX":
								posOffset[0] += spring._pos[0]
								springPosNumber++
								break
							case "posY":
								posOffset[1] += spring._pos[0]
								break
							case "pos2D":
								posOffset[0] += spring._pos[0]
								posOffset[1] += spring._pos[1]
								break

							case "scale":
								scaleMultiplier[0] *= 1 + spring._pos[0]
								scaleMultiplier[1] *= 1 + spring._pos[0]
								break

							case "angle":
								springAngleOffset = C3.toRadians(spring._pos[0])
								angleOffset += springAngleOffset

								if (spring.isRollingAroundPoint) {
									//now set up directly on Roll call
									//const originToCenterX = wi.GetOriginX() * this.inst.width - this.inst.width / 2
									//const originToCenterY = wi.GetOriginY() * this.inst.height - this.inst.height / 2

									//console.error("RollSpring around point", spring._pos[0])

									let cosAngle = Math.cos(springAngleOffset)
									let sinAngle = Math.sin(springAngleOffset)
									posOffset[0] += spring.originToCenterX * cosAngle - spring.originToCenterY * sinAngle - spring.originToCenterX
									posOffset[1] += spring.originToCenterX * sinAngle + spring.originToCenterY * cosAngle - spring.originToCenterY
								}
								break

							default:
								break
						}
					}
					//SPRING PROPS
					else if (spring._type === "prop") {
						switch (spring._prop) {
							/*
							case "flipX":
								isFlippingX = true
								flipXmod = this.remapPingPong(spring._pos[0])
								break
							case "flipY":
								isFlippingY = true
								flipYmod = this.remapPingPong(spring._pos[0])
								break*/
							case "distort":
								//TODO
								break
							case "pos2D":
								this.inst.setPosition(spring._pos[0], spring._pos[1])

								this.overridePos[0] = true
								this.overridePos[1] = true
								break
							case "scale2D":
								scaleMultiplier[0] *= spring._pos[0]
								scaleMultiplier[1] *= spring._pos[1]
								break
							case "size2D":
								this.inst.setSize(spring._pos[0], spring._pos[1])

								break
							case "angle":
								this.inst.angle = spring._pos[0]

								break
							default:
								break
						}
					}
				}
			}
		}

		let newPos = [0, 0, 0]
		let newAngle = 0
		let newSize = [1, 1, 1]

		//newPos[0] = this.inst.x + posOffset[0] - this.lastPosOffset[0]
		//newPos[1] = this.inst.y + posOffset[1] - this.lastPosOffset[1]

		newPos[0] = this.inst.x + posOffset[0] - (this.overridePos[0] ? 0 : this.lastPosOffset[0])
		newPos[1] = this.inst.y + posOffset[1] - (this.overridePos[1] ? 0 : this.lastPosOffset[1])

		this.overridePos = [false, false]

		newAngle = this.inst.angle + angleOffset - this.lastAngleOffset

		newSize[0] = this.inst.width * scaleMultiplier[0] * (1 / this.lastScaleMultiplier[0])
		newSize[1] = this.inst.height * scaleMultiplier[1] * (1 / this.lastScaleMultiplier[1])

		if (dt > 0) {
			//* FLIPS

			if (this.flipX.value !== this.flipX.target) {
				this.UpdateFlip(this.flipX, dt, newSize, 0)
			}
			if (this.flipY.value !== this.flipY.target) {
				this.UpdateFlip(this.flipY, dt, newSize, 1)
			}
		}

		if (newPos[0] !== this.inst.x || newPos[1] !== this.inst.y) {
			this.inst.setPosition(newPos[0], newPos[1])
		}

		if (newAngle !== this.inst.angle) {
			this.inst.angle = newAngle
		}

		if (newSize[0] !== this.inst.width || newSize[1] !== this.inst.height) {
			//window.alert("newSize " + Math.floor(newSize[0]) + " " + Math.floor(newSize[1]))

			this.inst.setSize(newSize[0], newSize[1])
		}

		this.lastAngleOffset = angleOffset
		this.lastPosOffset = posOffset
		this.lastScaleMultiplier = scaleMultiplier
	}

	Tween_PingPong(tag, prop, restart, targetX, targetY, easeIn, easeOut, durationIn, durationMid, durationOut, durationEnd) {
		const tweenMotion = new TweenMotion(
			this,
			tag,
			prop,
			restart,
			0,
			targetX,
			targetY,
			easeIn,
			easeOut,
			durationIn,
			durationMid,
			durationOut,
			durationEnd
		)
	}

	Shake(args = {}) {
		let name = args?.name?.toLowerCase() || ""

		//no tag
		if (name === "") {
			name = "Shake" + this.uniqueTagCount
			this.uniqueTagCount++
		}
		//override existing
		else if (this.shakes.get(name)) {
			this.shakes.delete(name)
		}

		let duration = args.Duration || 1

		let mag = args.Mag || [1, 1]
		if (typeof mag === "number") mag = [mag, mag]

		let mode = args.Mode || 0
		if (typeof mode === "string") {
			mode = mode.toLowerCase()
			if (mode === "reducing") mode = 0
			else if (mode === "constant") mode = 1
			else if (mode === "endless") mode = 2
		}

		const shake = {
			name: name,
			magX: mag[0],
			magY: mag[1],
			duration: duration,
			remaining: duration,
			mode: mode,
		}

		this.shakes.set(shake.name, shake)

		this._UpdateTickState()
	}

	Shake_Stop(name) {
		this.shakes.delete(name.toLowerCase())
	}

	SS_SetScale(scaleX, scaleY) {
		this.SS_x = scaleX
		this.SS_y = scaleY
		//window.alert("SS_SetScale " + this.SS_x + " " + this.SS_y)
	}

	UpdateFlip(flip, dt, newSize, sizeAxis) {
		if (flip.lastValue === 0) {
			flip.lastValue = 1
		}

		flip.value = C3.lerp(flip.value, flip.target, flip.speed * dt)

		if (Math.abs(flip.value - flip.target) < flipThreshold) {
			flip.value = flip.target
			flip.value = this.remapPingPong(flip.value)
			flip.target = flip.value
		}

		flip.actualValue = this.remapPingPong(flip.value)

		newSize[sizeAxis] = newSize[sizeAxis] * flip.actualValue * (1 / flip.lastValue)
		flip.lastValue = flip.actualValue
	}

	//Sine_Start("Horizontal", 0.5, 0, 10)
	Sine_Start(prop, period, periodOffsetPercent, mag, sineTriangle = false, enabled = true) {
		const sine = new C4.Sine(prop, period, periodOffsetPercent, mag, sineTriangle, enabled)

		this.sines.set(prop, sine)
	}

	Sine_Stop(prop) {
		this.sines.delete(propSine[prop])
	}

	Sine_Stop_All() {
		this.sines.clear()
	}

	Flip(direction, mode, speed, flipCount) {
		const _name = name.toLowerCase()
		const myFlip = direction <= 2 ? this.flipX : this.flipY
		const wasMirrored = this.inst.width < 0 ? true : false

		let initFlipScale = wasMirrored ? -1 : 1

		myFlip.speed = speed

		switch (direction) {
			case 0:
				//Side
				break
			case 1:
				//Right
				break
			case 2:
				//Left
				break
			case 3:
				//Up
				break
			case 4:
				//Down
				break
			default:
				break
		}

		switch (mode) {
			case 0:
				//Full
				myFlip.target = myFlip.target + 4
				break
			case 1:
				//Half
				myFlip.target = myFlip.target + 2
				break
			case 2:
				//Loop
				break
			case 3:
				//Count
				myFlip.target = myFlip.target + 4 * flipCount
				break

			default:
				break
		}
	}

	//* === ACTION MAIN ===
	//Shake(name, mag, duration, mode)

	SetCurSpring(prop, tag) {
		//this.currentSpring = this.springsProps.get("pos2D")
		let potentialSpring

		if (prop === 0) {
			potentialSpring = this.springs.get(tag.toLowerCase())
		} else {
			const propName = propSpring[prop - 1]
			potentialSpring = this.springsProps.get(propName)
		}
		this.currentSpring = potentialSpring ? potentialSpring : null
	}

	remapPingPong(value) {
		// The "folded" part of the value beyond the range [-1, 1]
		// Modulo by 2 to get the overshoot beyond the nearest even boundary.
		const fold = Math.abs(value) % 2

		// Determine the number of full ranges the value has surpassed.
		const fullRanges = Math.floor(Math.abs(value) / 2)

		// Determine if we need to flip the sign of the result
		const signFlip = fullRanges % 2 === 1 ? -1 : 1

		// Determine if the fold is within the range after folding
		if (fold <= 1) {
			// If the value was originally negative, flip the sign
			return signFlip * (value >= 0 ? fold : -fold)
		} else {
			// Reflect the folded part back into the [-1, 1] range
			const reflected = 2 - fold
			return signFlip * (value >= 0 ? reflected : -reflected)
		}
	}

	Spring_Start(args = {}) {
		let _name = args?.name?.toLowerCase() || ""

		//no tag
		if (_name === "") {
			_name = "Spring" + this.uniqueTagCount
			this.uniqueTagCount++
		}
		//check if spring already exists
		else if (this.springs.get(_name)) {
			this.springs.delete(_name)
		}

		args.name = _name

		const spring = new SpringMotion(this, args)

		this.springs.set(_name, spring)

		this.currentSpring = spring

		this.justStartedSpringNames.push(spring)
		this.Trigger("OnSpringStart")
		this.justStartedSpringNames.pop()

		this._UpdateTickState()
		return spring
	}

	Spring_StartOffset(prop, args = {}) {
		args.dimensions = 1
		if (prop.includes("2D")) args.dimensions = 2

		args.type = "offset"
		args.prop = prop

		//console.error("Spring_StartOffset", args)

		const spring = this.Spring_Start(args)
		return spring

		//"angle", "scale", "posX", "posY", "posZ"
		//"pos2D", "scale2D", "size2D"
	}

	Spring_SetProp(prop, args = {}) {
		let currentVal = null
		switch (prop) {
			case "pos2D":
				currentVal = [this.inst.x, this.inst.y]
				break
			case "scale2D":
				currentVal = [1, 1]
				break
			case "size2D":
				currentVal = [this.inst.width, this.inst.height]
				break
			case "angle":
				currentVal = [this.inst.angle]
				break
			default:
				break
		}
		console.error("Spring_SetProp", prop, currentVal, this.inst)

		args.dimensions = Array.isArray(currentVal) ? currentVal.length : 1

		args.pos = currentVal
		args.target = currentVal

		args.type = "prop"
		args.prop = prop

		const spring = this.Spring_Start(args)

		if (this.springsProps.get(prop)) {
			this.springsProps.delete(prop)
		}
		this.springsProps.set(prop, spring)
	}

	//Spring Start 1D/2D/3D

	Roll(args = {}) {
		//*specific to Roll

		let direction = args.direction || 1
		let rollCount = args.rollCount || 1
		let pivot = args.pivot || "Center"
		let ip = args.ip || 0

		if (direction !== -1) direction = 1
		if (this.inst.width < 0) direction *= -1
		rollCount = Math.max(1, rollCount)
		rollCount = Math.round(rollCount)

		const target = 360 * rollCount * direction

		//window.alert("Roll " + target)

		//

		args.pos = 0
		args.target = [target]
		args.dimensions = 1

		args.type = "offset"
		args.prop = "angle"

		if (!args.angFreq) args.angFreq = 20
		if (!args.damp) args.damp = 0.5

		const spring = this.Spring_Start(args)

		//console.error("RollSpring", spring)

		let rollPivotX
		let rollPivotY

		//rotate around origin, nothing special to do
		if (pivot === "Origin") {
			//
		}
		//rotate around center or image point
		else {
			//window.alert("Roll")
			spring.isRollingAroundPoint = true
			let rollPivotX = 0.5
			let rollPivotY = 0.5

			//center
			if (pivot === "Center") {
				//
			}
			//imagePoint (name or index) (if doesn't exist, or equal to 0, rotate around origin)
			else if (pivot === "ImagePoint") {
				if (ip <= 0) return //rotate around origin

				const imagePoint = this.GetImagePoint(this.inst, ip)
				if (imagePoint) {
					rollPivotX = ip[0]
					rollPivotY = ip[1]
				} else return //rotate around origin
			}

			const origin = this.GetImagePoint(this.inst, 0)

			spring.originToCenterX = (origin[0] - rollPivotX) * this.inst.width
			spring.originToCenterY = (origin[1] - rollPivotY) * this.inst.height
		}
	}

	GetImagePoint(inst, nameOrIndex) {
		//! usefull to get in [0-1]
		const frame = inst.animation.getFrames()[inst.animationFrame]
		const ip = frame.getImagePoint(nameOrIndex)
		return ip
	}

	/*
    this.Spring_Start({
        name: name,
        valueCount: valueCount,
        pos: pos,
        vel: vel,
        target: target,
        freq: freq,
        damp: damp,
        destroyOnEq: destroyOnEq,
    })*/

	Spring_Stop(name) {
		this.springs.delete(name.toLowerCase())
		this._UpdateTickState()
	}

	Spring_StopAll() {
		this.springs.clear()
		this._UpdateTickState()
	}

	Spring_PauseResume(name) {
		//
	}

	//#region SPRING MOTION CODE
	//******************************************************************************
	// This function will compute the parameters needed to simulate a damped spring
	// over a given period of time.
	// - An angular frequency is given to control how fast the spring oscillates.
	// - A damping ratio is given to control how fast the motion decays.
	//     damping ratio > 1: over damped
	//     damping ratio = 1: critically damped
	//     damping ratio < 1: under damped
	//******************************************************************************
	CalcMotionParams(pOutParams, deltaTime, angFreq, damp) {
		const epsilon = 0.0001

		// force values into legal range
		if (damp < 0.0) damp = 0.0
		if (angFreq < 0.0) angFreq = 0.0

		// if there is no angular frequency, the spring will not move and we can
		// return identity
		if (angFreq < epsilon) {
			pOutParams._posPosCoef = 1.0
			pOutParams._posVelCoef = 0.0
			pOutParams._velPosCoef = 0.0
			pOutParams._velVelCoef = 1.0
			return
		}

		if (damp > 1.0 + epsilon) {
			// over-damped
			const za = -angFreq * damp
			const zb = angFreq * Math.sqrt(damp * damp - 1.0)
			const z1 = za - zb
			const z2 = za + zb

			const e1 = Math.exp(z1 * deltaTime)
			const e2 = Math.exp(z2 * deltaTime)

			const invTwoZb = 1.0 / (2.0 * zb) // = 1 / (z2 - z1)

			const e1_Over_TwoZb = e1 * invTwoZb
			const e2_Over_TwoZb = e2 * invTwoZb

			const z1e1_Over_TwoZb = z1 * e1_Over_TwoZb
			const z2e2_Over_TwoZb = z2 * e2_Over_TwoZb

			pOutParams._posPosCoef = e1_Over_TwoZb * z2 - z2e2_Over_TwoZb + e2
			pOutParams._posVelCoef = -e1_Over_TwoZb + e2_Over_TwoZb

			pOutParams._velPosCoef = (z1e1_Over_TwoZb - z2e2_Over_TwoZb + e2) * z2
			pOutParams._velVelCoef = -z1e1_Over_TwoZb + z2e2_Over_TwoZb
		} else if (damp < 1.0 - epsilon) {
			// under-damped
			const omegaZeta = angFreq * damp
			const alpha = angFreq * Math.sqrt(1.0 - damp * damp)

			const expTerm = Math.exp(-omegaZeta * deltaTime)
			const cosTerm = Math.cos(alpha * deltaTime)
			const sinTerm = Math.sin(alpha * deltaTime)

			const invAlpha = 1.0 / alpha

			const expSin = expTerm * sinTerm
			const expCos = expTerm * cosTerm
			const expOmegaZetaSin_Over_Alpha = expTerm * omegaZeta * sinTerm * invAlpha

			pOutParams._posPosCoef = expCos + expOmegaZetaSin_Over_Alpha
			pOutParams._posVelCoef = expSin * invAlpha

			pOutParams._velPosCoef = -expSin * alpha - omegaZeta * expOmegaZetaSin_Over_Alpha
			pOutParams._velVelCoef = expCos - expOmegaZetaSin_Over_Alpha
		} else {
			// critically damped
			const expTerm = Math.exp(-angFreq * deltaTime)
			const timeExp = deltaTime * expTerm
			const timeExpFreq = timeExp * angFreq

			pOutParams._posPosCoef = timeExpFreq + expTerm
			pOutParams._posVelCoef = timeExp

			pOutParams._velPosCoef = -angFreq * timeExpFreq
			pOutParams._velVelCoef = -timeExpFreq + expTerm
		}
	}

	//******************************************************************************
	// This function will update the supplied position and velocity values over
	// according to the motion parameters.
	//******************************************************************************
	UpdateSpring(spring) {
		//console.error("UpdateSpring", spring._pos, spring)

		//check if we have reached Stable
		let valuesStable = 0
		//console.error("spring", spring._name, spring)
		for (let i = 0; i < spring._dimensions; i++) {
			if (Math.abs(spring._pos[i] - spring._target[i]) < 0.01 && Math.abs(spring._vel[i]) < 0.01) {
				valuesStable++
			}
		}
		if (valuesStable === spring._dimensions) {
			spring._pos = [...spring._target]
			spring._vel = new Array(spring._dimensions).fill(0)
			if (spring._destroyOnStable) {
				this.springs.delete(spring._name)
				this.springsProps.delete(spring._prop)
			} else {
				if (!spring._isAtStable) {
					this.currentSpring = spring
					/*this.Trigger(Cnds.OnSpringStable(spring._name))
						console.error("Stable reached", spring._name)*/
					spring._isAtStable = true
				}
			}
			return
		}

		const freqDampKey = `${spring._angFreq} ${spring._damp}`
		let deltaTimeMap = globalThis._cachedMotionParams.get(freqDampKey)

		if (!deltaTimeMap) {
			deltaTimeMap = new Map()
			globalThis._cachedMotionParams.set(freqDampKey, deltaTimeMap)
		}

		let motionParams = deltaTimeMap.get(this.dtRounded)

		if (!motionParams) {
			motionParams = new MotionParams()
			this.CalcMotionParams(motionParams, this.dtRounded, spring._angFreq, spring._damp)
			deltaTimeMap.set(this.dtRounded, motionParams)
		} else {
			//
		}

		//loop spring values
		for (let i = 0; i < spring._dimensions; i++) {
			const oldPos = spring._pos[i] - spring._target[i] // update in Stable relative space
			const oldVel = spring._vel[i]

			spring._pos[i] = oldPos * motionParams._posPosCoef + oldVel * motionParams._posVelCoef + spring._target[i]
			spring._vel[i] = oldPos * motionParams._velPosCoef + oldVel * motionParams._velVelCoef
		}
	}
	//#endregion

	//* === CONDITION & TRIGGERS ===

	IsAtStable(tag) {
		const spring = this.springs.get(tag.toLowerCase())
		if (!spring) return false
		return spring._isAtStable
	}

	HasSpring(tag) {
		return this.springs.has(name.toLowerCase())
	}

	GetSpring(tag) {
		return this.springs.get(tag.toLowerCase())
	}

	//* === ACTION SECOND ===

	//* Set AngFreq and Damp

	Set_Freq_And_Damp(tag, freq, damp) {
		const spring = tag === "" ? this.currentSpring : this.springs.get(tag.toLowerCase())
		if (spring) {
			if (freq !== -1) spring._angFreq = freq
			if (damp !== -1) spring._damp = damp
		}
	}

	//////////////////////////////////////////////////
	// Utility Methods
	getLatestArrayIndex(array) {
		return array.length - 1
	}
}

//******************************************************************************
// Cached set of motion parameters that can be used to efficiently update
// multiple springs using the same time step, angular frequency and damping
// ratio.
//******************************************************************************
class MotionParams {
	constructor() {
		this._posPosCoef = 0.0
		this._posVelCoef = 0.0
		this._velPosCoef = 0.0
		this._velVelCoef = 0.0
	}
}

/*
new SpringMotion({
    name: "Spring1",
    dimensions: 2,
    destroyOnStable: false,
})*/

class SpringMotion {
	constructor(juice, args) {
		this.juice = juice

		this._name = args.name
		this._dimensions = args.dimensions || 1

		this._destroyOnStable = args.destroyOnStable || false
		this._pos = args.pos
		this._vel = args.vel
		this._target = args.target
		this._angFreq = args.angFreq || 20
		this._damp = args.damp || 0.2

		this._type = args.type || "" //value, prop, offsetProp
		this._prop = args.prop || ""

		if (!this._pos) this._pos = new Array(this._dimensions).fill(0)
		if (!this._vel) this._vel = new Array(this._dimensions).fill(0)
		if (!this._target) this._target = new Array(this._dimensions).fill(0)

		if (!Array.isArray(this._pos)) this._pos = [this._pos]
		if (!Array.isArray(this._vel)) this._vel = [this._vel]
		if (!Array.isArray(this._target)) this._target = [this._target]

		/*
		if (isNaN(this._pos[0])) window.alert("SpringMotion pos NaN")
		if (isNaN(this._vel[0])) window.alert("SpringMotion vel NaN")
		if (this._prop === "angle" && this._type === "offset") {
			console.error("RollSpring data", this._pos, this._vel, this._target)
		}*/

		this._isPaused = false
		this._isAtStable = false
	}

	SetCosAngle(which, angle, dist) {
		const x = Math.cos(C3.toRadians(angle)) * dist
		const y = Math.sin(C3.toRadians(angle)) * dist
		if (which === "Pos") this.SetPos([x, y])
		else if (which === "Vel") this.SetVel([x, y])
		else if (which === "Target") this.SetTarget([x, y])
	}

	SetPos(arr) {
		this.SetArray("Pos", arr)
	}

	SetVel(arr) {
		this.SetArray("Vel", arr)
	}

	SetTarget(arr) {
		this.SetArray("Target", arr)
	}

	SetArray(which, arr) {
		if (typeof arr === "number") arr = [arr]
		if (!Array.isArray(arr)) {
			console.error("SetTarget: arr is not an array")
		}

		let whichArr
		if (which === "Pos") whichArr = this._pos
		else if (which === "Vel") whichArr = this._vel
		else if (which === "Target") whichArr = this._target

		for (let i = 0; i < arr.length; i++) {
			whichArr[i] = arr[i]
		}

		this._isAtStable = false
	}
}

/*
 Shake({
    Name: "Shake1",
    Mag: 10,
    Duration: 1,
    mode: "reducing"}
)
*/

class FlipMotion {
	constructor(name, magX, magY, duration, mode) {
		this.name = name
		this.magX = magX
		this.magY = magY
		this.duration = duration
		this.remaining = duration
		this.mode = mode
	}
}

class TweenMotion {
	constructor(juiceBeh, tag, prop, restart, valueInit, targetX, targetY, easeIn, easeOut, durationIn, durationMid, durationOut, durationEnd) {
		this.tweenBeh = juiceBeh.tweenBeh
		if (this.tag === "") {
			this.tag = "Tween" + this.juiceBehavior.uniqueTagCount
			this.juiceBehavior.uniqueTagCount++
		}

		if (this.prop === "Angle") {
			targetX = C3.toRadians(targetX)
		}

		this.targetX = targetX
		this.targetY = targetY

		this.Tween_PingPong(tag, prop, valueInit, easeIn, easeOut, durationIn, durationMid, durationOut, durationEnd)
	}

	GetTweenValue() {
		if (this.tween) {
			return this.tween.value()
		} else return 1
	}

	GetValueX() {
		return this.targetX * this.GetTweenValue()
	}

	GetValueY() {
		return this.targetY * this.GetTweenValue()
	}

	async Tween_PingPong(tag, prop, valueInit, easeIn, easeOut, durationIn, durationMid, durationOut, durationEnd) {
		//in tween
		this.tween = this.tweenBeh.startTween("value", 1, durationIn, easeIn, {
			startValue: 0,
		})

		try {
			await this.tween.finished
		} catch (error) {
			return
		}

		this.tween = this.tweenBeh.startTween("value", 1, durationMid, "linear", {
			startValue: 1,
		})

		try {
			await this.tween.finished
		} catch (error) {
			return
		}

		//out tween
		this.tween = this.tweenBeh.startTween("value", 0, durationOut, easeOut, {
			startValue: 1,
		})
	}
}
