export class Compo_Pile extends C4.Component {
	constructor(unit, data = null) {
		super(unit, data)
	}

	SetData() {
		this.SetVars_Default({
			Pile_Visu: "SnakePart",
			Pile_Visu_Size: 0,

			Pile_Visu_First: "",
			Pile_Visu_Last: "",

			Base_ImagePoint: "",

			FillAllCurves: true, // Set to true to fill the entire curve between start and end.
			FillAllCurves_Completion: 1, // 1.0 means last body part at endpoint, 1.1 means 10% further, etc.

			SegmentDist: 15,

			OffsetMid: [0, -40],
			OffsetEnd: [0, -80],

			SineBounce: true,
			SkipFirst: true,

			ZOrder_Reverse: false,
			Pile_Mirrored: true,

			Pile_Parts_Min: 0,
			Pile_Parts_Add: 0,
		})
	}

	ReleaseComp() {
		super.ReleaseComp()
		for (let i = 0; i < this.bodyparts.length; ++i) {
			const bodypart = this.bodyparts[i]
			bodypart.destroy()
		}
		this.bodyparts = null
		this.attachements = null
		this.bodyPaste = null
	}

	SetCompVisible(bool) {
		for (let i = 0; i < this.bodyparts.length; i++) {
			const bodypart = this.bodyparts[i]
			bodypart.isVisible = bool
		}
	}

	Init() {
		super.Init()
		this.bodyparts = []
		this.attachements = []

		this.Attachements_Update()

		this.bodyPaste = this.runtime.objects["Anim"].createInstance("FX_Behind", 0, 0)
		this.inst.addChild(this.bodyPaste, {
			destroyWithParent: true,
		})

		this.sineMove = new C4.Sine("value", 1, Math.random(), 0.1, false, true)

		this.springMove = this.unit.juice.Spring_Start({
			/*dimensions: 2,
			pos: [this.inst.x, this.inst.y],*/

			pos: [this.inst.x],

			angFreq: 10,
			damp: 0.4,
		})

		console.error("Pile Comp", this)
		console.error("Pile Spring", this.springMove)

		this._SetTicking(true)
	}

	Bodypart_Add_Default() {
		const inst = Utils.createAnim(this.Pile_Visu, this.inst.x, this.inst.y)
		if (this.Pile_Visu_Size) Utils.World_SetSizeByMax(inst, this.Pile_Visu_Size)
		this.Bodypart_Add(inst)
	}

	Bodypart_Add(inst) {
		this.bodyparts.push(inst)
		this.Update_Visu()
	}

	Attachement_Add(inst) {
		this.attachements.push(inst)
		this.Attachements_Update()
	}

	Attachement_Remove(inst) {
		const index = this.attachements.indexOf(inst)
		if (index !== -1) {
			this.attachements.splice(index, 1)
			this.Attachements_Update()
		}
	}

	Attachements_Update() {
		let idealBodyLength = this.attachements.length + this.Pile_Parts_Add
		idealBodyLength = Math.max(idealBodyLength, this.Pile_Parts_Min)

		//adapt length of snake to attachements (but keep minimum)
		while (idealBodyLength > this.bodyparts.length) {
			this.Bodypart_Add_Default()
		}

		while (this.bodyparts.length > idealBodyLength) {
			let indexToRemove = 0

			if (this.Pile_Visu_Last && this.bodyparts.length > 1) {
				indexToRemove = this.bodyparts.length - 2 // Remove second last instead
			} else {
				indexToRemove = this.bodyparts.length - 1
			}

			const [bodypart] = this.bodyparts.splice(indexToRemove, 1)
			bodypart.destroy()
		}

		for (let i = 0; i < this.attachements.length; i++) {
			const inst = this.attachements[i]
			inst.removeFromParent()

			const part = this.bodyparts[i]

			const partBBox = part.getBoundingBox()

			inst.setPosition(partBBox.left + partBBox.width / 2, partBBox.top + partBBox.height / 2)

			part.addChild(inst, {
				transformX: true,
				transformY: true,
			})

			const wepInst = Utils.World_GetChild(inst, "Wep")
			if (wepInst) {
				this.runtime.zOrder.LinkTo(wepInst.unit.anim, this.unit.anim, 100)
			}
		}
	}

	Update_Visu() {
		if (this.Pile_Visu_First || this.Pile_Visu_Last) {
			for (let i = 0; i < this.bodyparts.length; ++i) {
				const bodypart = this.bodyparts[i]
				if (this.Pile_Visu) {
					Utils.setAnim(bodypart, this.Pile_Visu)
				}
			}

			if (this.Pile_Visu_First) {
				const firstPart = this.bodyparts[0]
				if (firstPart) {
					Utils.setAnim(firstPart, this.Pile_Visu_First)
				}
			}
			if (this.Pile_Visu_Last) {
				const lastPart = this.bodyparts[this.bodyparts.length - 1]
				if (lastPart) {
					Utils.setAnim(lastPart, this.Pile_Visu_Last)
				}
			}
		}
	}

	Tick_DrawOutline_Pile() {
		if (!this.runtime.fxManager.drawOutlines) return
		const outlineUnit = this.unit.outline
		if (!outlineUnit || !this.unit.unit_isVisible) {
			return
		}

		this.bodyPaste.isVisible = true

		const outlinePaste = this.bodyPaste.effects[0]
		outlinePaste.isActive = true
		outlinePaste.setParameter(0, outlineUnit.getParameter(0))

		const pasteInst = this.bodyPaste

		let top = null
		let left = null
		let right = null
		let bottom = null

		/* for (let i = 0; i < this.bodyparts.length; ++i) {
			//get the max bottom/right/left/top of the bodyparts to position and resize the drawing canvas
			const bodypart = this.bodyparts[i]

			const glowingAnim = Utils.World_GetChild(bodypart, "Anim")
			if (!glowingAnim) continue
			const glowingAnim = bodypart

			const bbox = glowingAnim.getBoundingBox()

			if (top === null || bbox.top < top) top = bbox.top
			if (left === null || bbox.left < left) left = bbox.left
			if (right === null || bbox.right > right) right = bbox.right
			if (bottom === null || bbox.bottom > bottom) bottom = bbox.bottom
		}

		if (top !== null && left !== null && right !== null && bottom !== null) {
			const margin = 10
			const width = right - left + margin * 2
			const height = bottom - top + margin * 2
			const centerX = left + width / 2 - margin
			const centerY = top + height / 2 - margin

			this.drawingCanvas_local.setSize(width, height)
			this.drawingCanvas_local.setPosition(centerX, centerY)
		}*/

		for (let i = 0; i < this.bodyparts.length; ++i) {
			const bodypart = this.bodyparts[i]
			/*const glowingAnim = Utils.World_GetChild(bodypart, "Anim")
			if (!glowingAnim) continue*/

			Utils.World_MatchInst(pasteInst, bodypart)

			this.runtime.fxManager.DC_DrawOutline(pasteInst)
		}
		this.bodyPaste.isVisible = false
	}

	get instBase() {
		return this.unit?.anim || this.inst
	}

	Tick() {
		super.Tick()
		const dt = this.inst.dt

		if (this.bodyparts.length === 0) {
			return
		}

		let sineValue = 0
		if (this.SineBounce) {
			this.sineMove.Sine_TickValue(dt)
		}

		let fill_Multiplier = this.FillAllCurves_Completion + sineValue

		const instBase = this.instBase
		/*
        this.springMove.SetTarget(instBase.x)
        this.OffsetEnd[0] = this.springMove._pos[0] - instBase.x
		if (this.springMove.dimensions > 1) {
			this.OffsetEnd[1] = this.springMove._pos[1] - instBase.y
		}*/

		for (let i = 0; i < this.bodyparts.length; ++i) {
			const bodypart = this.bodyparts[i]

			bodypart.zOrder = this.inst.y + i * 0.01 * (this.ZOrder_Reverse ? 1 : -1)

			if (this.Pile_Mirrored) {
				const mirroredMod = instBase.width >= 0 ? 1 : -1
				bodypart.width = Math.abs(bodypart.width) * mirroredMod
			}
		}

		this.startPoint = instBase

		if (this.Base_ImagePoint) {
			const ip = instBase.getImagePoint(this.Base_ImagePoint)
			this.startPoint = {
				x: ip[0],
				y: ip[1],
			}
		}

		const midRotated = Utils.Vec2_Rotate(this.OffsetMid, instBase.angle)
		const endRotated = Utils.Vec2_Rotate(this.OffsetEnd, instBase.angle)

		this.springMove.SetTarget(instBase.x + endRotated[0])
		const endX = this.springMove._pos[0]

		/*this.midPoint = {
			x: instBase.x + this.OffsetMid[0],
			y: instBase.y + this.OffsetMid[1],
		}
		this.endPoint = {
			x: instBase.x + this.OffsetEnd[0],
			y: instBase.y + this.OffsetEnd[1],
		}*/

		this.midPoint = {
			x: instBase.x + midRotated[0],
			y: instBase.y + midRotated[1],
		}
		this.endPoint = {
			x: endX,
			y: instBase.y + endRotated[1],
		}

		//* Points on Curve

		let pointsOnCurve
		if (this.FillAllCurves && this.bodyparts.length > 0) {
			// Evenly distribute the body parts along the curve such that:
			//  - The startpoint is treated as a phantom point.
			//  - The first body part is at fraction 1/N of the "fill distance".
			//  - The last body part is at fraction 1 (i.e. fill distance).
			const numParts = this.bodyparts.length
			// Compute the lookup table (always computed over the base curve).
			const lookup = buildLookupTable(this.startPoint, this.midPoint, this.endPoint, 40)
			const totalLength = lookup[lookup.length - 1].length
			// Multiply the total curve length by the completion factor.
			const fillDistance = totalLength * fill_Multiplier

			pointsOnCurve = []
			// For each body part, its target distance is (i / numParts) * fillDistance,
			// with i ranging from 1 to numParts. This way, the first body part is not at the start.

			const startIndex = this.SkipFirst ? 1 : 0

			for (let i = startIndex; i <= numParts; i++) {
				const targetDistance = (i / numParts) * fillDistance
				// Look up t corresponding to the targetDistance.
				const tValue = findTForDistance(lookup, targetDistance)
				pointsOnCurve.push(getQuadraticBezierPoint(tValue, this.startPoint, this.midPoint, this.endPoint))
			}
		} else {
			// Original behavior: place points every segmentDist along the curve (skipping the start).
			pointsOnCurve = getEquallySpacedPoints(
				this.startPoint,
				this.midPoint,
				this.endPoint,
				this.SegmentDist * fill_Multiplier,
				this.SkipFirst,
				this.bodyparts.length
			)
		}

		// Update each body part's position; adjust this logic as needed for your game engine.

		let highestY = 0

		for (let i = 0; i < this.bodyparts.length; i++) {
			// If there are more body parts than computed points, use the last computed point.
			const pos = pointsOnCurve[i] || pointsOnCurve[pointsOnCurve.length - 1]
			const hasX = pos?.x
			if (!hasX) {
				console.error("Error: pos.x is undefined", pos, pointsOnCurve)
				this._SetTicking(false)
				return
			}
			this.bodyparts[i].x = pos.x
			this.bodyparts[i].y = pos.y

			if (this.bodyparts[i].y > highestY) {
				highestY = this.bodyparts[i].y
			}
		}

		this.unit.Set_AnimTopY(highestY)

		this.Tick_DrawOutline_Pile()
	}
}

//* =========== UTILS FUNCTIONS ======================================================================

/**
 * Computes a point on a quadratic Bézier curve at a given parameter t.
 * @param {number} t - Parameter between 0 and 1.
 * @param {object} p0 - Start point {x, y}.
 * @param {object} p1 - Control (mid) point {x, y}.
 * @param {object} p2 - End point {x, y}.
 * @returns {object} A point on the curve {x, y}.
 */
function getQuadraticBezierPoint(t, p0, p1, p2) {
	const invT = 1 - t
	const x = invT * invT * p0.x + 2 * invT * t * p1.x + t * t * p2.x
	const y = invT * invT * p0.y + 2 * invT * t * p1.y + t * t * p2.y
	return { x, y }
}

/**
 * Constructs a lookup table mapping parameter t to cumulative arc length along the curve.
 * @param {object} p0 - Start point {x, y}.
 * @param {object} p1 - Control (mid) point {x, y}.
 * @param {object} p2 - End point {x, y}.
 * @param {number} steps - Number of subdivisions along the curve.
 * @returns {Array} Lookup table with items {t, length}.
 */
function buildLookupTable(p0, p1, p2, steps) {
	const lookup = []
	let cumulativeLength = 0
	let prevPoint = p0
	lookup.push({ t: 0, length: 0 })

	for (let i = 1; i <= steps; i++) {
		const t = i / steps
		const point = getQuadraticBezierPoint(t, p0, p1, p2)
		const d = Math.hypot(point.x - prevPoint.x, point.y - prevPoint.y)
		cumulativeLength += d
		lookup.push({ t, length: cumulativeLength })
		prevPoint = point
	}
	return lookup
}

/**
 * Finds the t parameter corresponding to a given arc distance along the curve,
 * using binary search and linear interpolation on the lookup table.
 * @param {Array} lookup - The lookup table built from buildLookupTable.
 * @param {number} targetDistance - The distance along the curve.
 * @returns {number} The parameter t corresponding to the target distance.
 */
function findTForDistance(lookup, targetDistance) {
	let lower = 0
	let upper = lookup.length - 1
	while (upper - lower > 1) {
		const mid = Math.floor((lower + upper) / 2)
		if (lookup[mid].length < targetDistance) {
			lower = mid
		} else {
			upper = mid
		}
	}
	const lengthDiff = lookup[upper].length - lookup[lower].length
	let factor = lengthDiff ? (targetDistance - lookup[lower].length) / lengthDiff : 0
	return lookup[lower].t + factor * (lookup[upper].t - lookup[lower].t)
}

/**
 * Generates a sequence of points at fixed arc‑length intervals along
 * a quadratic Bézier, and — if you request more than fit on the curve —
 * continues past p2 by shooting out along the end‐tangent.
 *
 * @param {object} p0           Start point {x,y}
 * @param {object} p1           Control point {x,y}
 * @param {object} p2           End point {x,y}
 * @param {number} segmentDist  Desired spacing (arc length) between points
 * @param {boolean} skipFirst   If true, first point is at distance=segmentDist
 *                              rather than at the very start (d=0)
 * @param {number|null} desiredCount
 *                              If non‑null, total number of points to emit;
 *                              otherwise, stops when d > totalLength.
 * @returns {Array<object>}     Array of {x,y} points
 */
function getEquallySpacedPoints(p0, p1, p2, segmentDist, skipFirst = false, desiredCount = null) {
	// 1) build our lookup table for t ↔ arc‑length
	const lookup = buildLookupTable(p0, p1, p2, 40)
	const totalLength = lookup[lookup.length - 1].length

	// 2) helper: exact Bézier point
	function bezierPoint(t) {
		return getQuadraticBezierPoint(t, p0, p1, p2)
	}

	// 3) helper: Bézier derivative (tangent)
	function bezierTangent(t) {
		// B'(t) = 2(1−t)(p1−p0) + 2t(p2−p1)
		const x = 2 * (1 - t) * (p1.x - p0.x) + 2 * t * (p2.x - p1.x)
		const y = 2 * (1 - t) * (p1.y - p0.y) + 2 * t * (p2.y - p1.y)
		const len = Math.hypot(x, y) || 1
		return { x: x / len, y: y / len } // unit‐length
	}

	const points = []
	let dist = skipFirst ? segmentDist : 0
	let count = 0

	// 4) loop: either until we exhaust the curve + extras, or until desiredCount
	while (desiredCount === null ? dist <= totalLength : count < desiredCount) {
		if (dist <= totalLength) {
			// find parameter t for this target‐distance
			const t = findTForDistance(lookup, dist)
			points.push(bezierPoint(t))
		} else {
			// we’re beyond the end of the curve:
			// shoot out along the tangent at t=1
			const extra = dist - totalLength
			const tan = bezierTangent(1)
			points.push({
				x: p2.x + tan.x * extra,
				y: p2.y + tan.y * extra,
			})
		}
		dist += segmentDist
		count++
	}

	return points
}
