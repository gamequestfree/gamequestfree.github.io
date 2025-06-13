import animate from "./Module_AnimatePlus.js"
import * as FloatingUI from "../managers/Module_FloatingUI_DOM.js"

export class Utils_ {
	constructor(runtime) {
		this.runtime = runtime
		globalThis.Utils = this
	}

	Bullet_Charmed(bulletUnit) {
		const bulletAnim = bulletUnit.anim
		const animName = bulletAnim.animationName
		const charmedAnim = animName.replace("Enemy", "Player")

		if (charmedAnim !== animName && bulletAnim.getAnimation(charmedAnim)) {
			bulletAnim.setAnimation(charmedAnim)
		}
	}

	Perf_DisableSines(object) {
		const instances = this.runtime.objects[object].getAllInstances()

		instances.forEach((inst) => {
			const behaviors = inst.behaviors
			for (const [behName, beh] of Object.entries(behaviors)) {
				if (behName.includes("Sine")) {
					beh.isEnabled = false
				}
			}
		})
	}

	BBox_RandomCadrePos(bbox, cadreWidth = 0, cadreHeight = 0, xOffset = 0, yOffset = 0, side = null) {
		// pick one side at random
		const sides = ["top", "bottom", "left", "right"]
		if (!side) side = sides[Math.floor(Math.random() * sides.length)]
		let x, y

		switch (side) {
			case "top":
				// anywhere from just above bbox.top, spanning bbox width ± cadreWidth
				x = Utils.random(bbox.left - cadreWidth, bbox.right + cadreWidth)
				y = bbox.top - yOffset
				break

			case "bottom":
				x = Utils.random(bbox.left - cadreWidth, bbox.right + cadreWidth)
				y = bbox.bottom + yOffset
				break

			case "left":
				x = bbox.left - xOffset
				y = Utils.random(bbox.top - cadreHeight, bbox.bottom + cadreHeight)
				break

			case "right":
				x = bbox.right + xOffset
				y = Utils.random(bbox.top - cadreHeight, bbox.bottom + cadreHeight)
				break
		}

		return { x, y, side }
	}

	Floor(x) {
		return x < 0 ? Math.ceil(x) : Math.floor(x)
	}

	Vec2_Rotate(vec2, angle) {
		return this.XY_Rotate(vec2[0], vec2[1], angle)
	}

	XY_Rotate(x, y, angle) {
		const xRotated = x * Math.cos(angle) - y * Math.sin(angle)
		const yRotated = x * Math.sin(angle) + y * Math.cos(angle)
		return [xRotated, yRotated]
	}

	RoundRandom(count) {
		const countFloored = Math.floor(count)
		if (Math.random() < count - countFloored) {
			return countFloored + 1
		} else {
			return countFloored
		}
	}

	GetValueFromArrayCurve(array, y) {
		if (y <= array[0][1]) {
			return array[0][0]
		}

		// If wave is after the last defined wave
		if (y >= array[array.length - 1][1]) {
			return array[array.length - 1][0]
		}

		// Linear interpolation between the two closest wave points
		for (let i = 0; i < array.length - 1; i++) {
			const [damage1, wave1] = array[i]
			const [damage2, wave2] = array[i + 1]

			if (y >= wave1 && y <= wave2) {
				const t = (y - wave1) / (wave2 - wave1)
				return damage1 + (damage2 - damage1) * t
			}
		}
	}

	Color(text, color) {
		if (text === "") return ""
		return "[c=" + color + "]" + text + "[/c]"
	}

	AjustKey(key, value) {
		if (typeof value === "number") key = key.toString()
		//make sure to remove all { and }
		else key = key.replace(/[{}]/g, "")

		key = "{" + key + "}"
		if (value === "") key = " " + key
		return key
	}

	ReplaceColor(text, key, value, color = null) {
		if (!color) {
			return this.Replace(text, key, value)
		} else {
			if (color === "green") color = "#00FF00"
			else if (color === "red") color = "#FF0000"
			else if (color === "blue") color = "#0000FF"
			key = this.AjustKey(key, value)
			text = text.replace(key, this.Color(value, color))
			return text
		}
	}

	Replace(text, key, value) {
		key = this.AjustKey(key, value)
		text = text.replace(key, value)
		return text
	}

	GetItemDisplayKey(itemName) {
		if (itemName.startsWith("U_STAT_")) {
			itemName = itemName.replace("U_", "")
			return this.Translate(itemName)
		}

		// Prettier-ignore
		itemName = itemName
			.replace("U_", "")
			.replace("Item_", "")
			.replace("Chara_", "")
			.replace("Wep_", "")
			.replace("ATK_", "")
			.replace("Evo_", "")
			//.replace("Brota_", "")
			.replace(/_/g, " ")

		// Check if itemName ends with ' <number>'
		const match = itemName.match(/^(.*) (\d+)$/)

		if (match) {
			const baseName = match[1] // Extract the name part
			const number = parseInt(match[2], 10) // Convert number part to integer

			// Return name and number separately
			return [baseName, number]
		} else {
			return [itemName, 0] // Ensure consistent return type
		}
	}

	Obj_GetFirstValue(obj) {
		if (obj && typeof obj === "object" && !Array.isArray(obj)) {
			const keys = Object.keys(obj)
			if (keys.length > 0) {
				return obj[keys[0]]
			}
		}
		return undefined // Return undefined if object is empty or invalid
	}

	GetItemDisplayName(itemName, tierColor = false) {
		const result = this.GetItemDisplayKey(itemName)

		// If GetItemDisplayKey() returned a string instead of an array, handle it
		if (typeof result === "string") {
			return this.Translate(result)
		}

		const [key, number] = result
		const translatedName = this.Translate(key)

		if (!tierColor) {
			return number > 0 ? `${translatedName} ${number}` : translatedName
		} else {
			const color = this.runtime.tierColors["TIER_" + number]
			let returnString = translatedName
			returnString = `[c=${color}]${returnString}[/c]`
			returnString = Utils.parseBBCode(returnString)
			return returnString
		}
	}

	//doesn't seem to work
	Elem_Reset(elem) {
		if (!elem) {
			throw new Error("Elem_Reset: Provided element is null or undefined")
		}

		const cleanNode = elem.cloneNode(true)

		if (elem.parentNode) {
			elem.parentNode.replaceChild(cleanNode, elem)
		}

		return cleanNode
	}

	testOverlap_Single(inst, iterable, filterCands = null) {
		for (const instCandidate of iterable) {
			if (filterCands && !filterCands(instCandidate)) continue
			if (this.runtime.collisions.testOverlap(inst, instCandidate)) {
				return instCandidate
			}
		}
		return null
	}

	testOverlap_All(inst, iterable, filterCands = null) {
		const collidingInstances = []
		if (filterCands) {
			iterable = iterable.filter(filterCands)
		}
		for (const instCandidate of iterable) {
			/*
			if (typeof instCandidate === self.ISpriteInstance) {
				console.error("not IWorldInstance", instCandidate)
				continue
			}*/
			if (this.runtime.collisions.testOverlap(inst, instCandidate)) {
				collidingInstances.push(instCandidate)
			}
		}
		return collidingInstances
	}

	//*opti only for ObjectClasses

	testOverlapOpti_Single(inst, objectClasses, filterCands = null) {
		const tempCandidates = this.runtime.collisions.getCollisionCandidates(objectClasses, inst.getBoundingBox())
		return this.testOverlap_Single(inst, tempCandidates, filterCands)
	}

	testOverlapOpti_All(inst, objectClasses, filterCands = null) {
		const tempCandidates = this.runtime.collisions.getCollisionCandidates(objectClasses, inst.getBoundingBox())
		return this.testOverlap_All(inst, tempCandidates, filterCands)
	}

	debugText(...args) {
		const text = args.join(" ")
		const debug = this.runtime.objects["DebugText"].getFirstInstance()
		if (debug) debug.text = `[color=#ffffff][background=#000000]${text}`
	}

	random(min, max) {
		if (typeof max === "undefined") return this.runtime.random() * min
		return this.runtime.random() * (max - min) + min
	}

	//max is excluded
	randomInt(min, max) {
		return Math.floor(this.random(min, max))
	}

	choose(...args) {
		const index = Math.floor(this.runtime.random() * args.length)
		return args[index]
	}

	waitOneFrame() {
		return new Promise((resolve) => requestAnimationFrame(resolve))
	}

	angle360(angle) {
		return ((angle % 360) + 360) % 360
	}

	angleToDeg360(angle) {
		return (C3.toDegrees(angle) + 360) % 360
	}

	angleToDeg(x1, y1, x2, y2) {
		return (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI
	}

	angleDiffDeg(angle1, angle2) {
		let diff = (angle2 - angle1) % 360
		// JavaScript's modulo can yield negative values, so adjust if necessary:
		if (diff > 180) {
			diff -= 360
		} else if (diff < -180) {
			diff += 360
		}
		return diff
	}

	cosDeg(angle) {
		return Math.cos(C3.toRadians(angle))
	}

	sinDeg(angle) {
		return Math.sin(C3.toRadians(angle))
	}

	clamp(val, min, max) {
		return Math.min(Math.max(val, min), max)
	}

	generateUID() {
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
			const r = (Math.random() * 16) | 0
			const v = c === "x" ? r : (r & 0x3) | 0x8
			return v.toString(16)
		})
	}

	Map_RandomWeight(map) {
		if (map.size === 0) return null

		const entries = Array.from(map.entries())
		const totalWeight = entries.reduce((sum, [, weight]) => sum + weight, 0)

		if (totalWeight <= 0) return null

		const rand = Math.random() * totalWeight
		let cumulative = 0

		for (const [key, weight] of entries) {
			cumulative += weight
			if (rand < cumulative) {
				return key
			}
		}

		return null // Fallback, should never hit this unless weights are malformed
	}

	pickRandomWeighted(array, weightKey = "weight", keyToPick = null) {
		if (array instanceof Map) {
			array = Array.from(array.values())
		} else if (array instanceof Set) {
			array = Array.from(array)
		}
		if (array.length === 0) return null
		else if (array.length === 1) return keyToPick ? array[0][keyToPick] : array[0]

		let totalWeight = array.reduce((acc, obj) => acc + obj[weightKey], 0)
		let random = Math.random() * totalWeight
		let cumulativeWeight = 0
		for (let i = 0; i < array.length; i++) {
			cumulativeWeight += array[i][weightKey]
			if (random <= cumulativeWeight) {
				return keyToPick ? array[i][keyToPick] : array[i]
			}
		}
	}

	parseBBCode(str) {
		return this.runtime.richText.parseBBCode(str)
	}

	Translate(key) {
		return this.runtime.translation.Get(key)
	}

	TranslateStat(key) {
		return this.runtime.translation.Get("STAT_" + key)
	}

	TagsParamToArray(tagsParam) {
		if (!tagsParam) return []
		else if (Array.isArray(tagsParam)) return tagsParam.filter((tag) => tag)
		else if (tagsParam instanceof Set) return Array.from(tagsParam).filter((tag) => tag)
		else if (typeof tagsParam === "string") return tagsParam.split(/[, /]+/).filter((tag) => tag)

		console.error("Invalid tagsParam value:", tagsParam)
		throw new TypeError("tagsParam must be a string, array, or null/undefined.")
	}

	Color_RandomHex() {
		// Generate a random color in hex format
		const letters = "0123456789ABCDEF"
		let color = "#"
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)]
		}
		return color
	}

	Elem_AddOutlines(elem, outlineCount) {
		const boxShadow = []
		for (let i = 0; i < outlineCount; i++) {
			// Calculate the outline distance (each subsequent outline is 4px further out)
			const distance = 4 * (i + 1)
			// Create the outline and add it to the array
			boxShadow.push(`0 0 0 ${distance}px ${this.Color_RandomHex()}`)
		}
		// Set the box-shadow property with all the outlines
		elem.style.boxShadow = boxShadow.join(", ")
	}

	Elem_SetTranslateKey(elem, key, callback = null) {
		this.runtime.translation.Elem_SetTranslateKey(elem, key, callback)
	}

	Elem_SetTranslateKey_ToHTML(elem, key, callback = null) {
		this.runtime.translation.Elem_SetTranslateKey_ToHTML(elem, key, callback)
	}

	Elem_Shake(element, duration = 150, mag = 1) {
		if (!element) return

		// Create a unique shake animation class
		const shakeClass = "shake-animation"

		// Add the keyframes for the shake effect dynamically (if not already added)
		if (!document.getElementById("shake-styles")) {
			const style = document.createElement("style")
			style.id = "shake-styles"
			style.textContent = `
                @keyframes shake {
                    0% { transform: translateX(0); }
                    25% { transform: translateX(${Utils.px(-mag)}); }
                    50% { transform: translateX(${Utils.px(mag)}); }
                    75% { transform: translateX(${Utils.px(-mag)}); }
                    100% { transform: translateX(0); }
                }
                .${shakeClass} {
                    animation: shake ${duration / 1000}s ease-in-out;
                }
            `
			document.head.appendChild(style)
		}

		// Add the shake animation class
		element.classList.add(shakeClass)

		// Use a safe timeout to remove the class
		const timeoutId = setTimeout(() => {
			if (element && element.classList) {
				element.classList.remove(shakeClass)
			}
			observer.disconnect()
		}, duration)

		// Attach a listener to detect when the element is removed
		const observer = new MutationObserver(() => {
			if (!document.body.contains(element)) {
				clearTimeout(timeoutId)
				observer.disconnect()
			}
		})

		observer.observe(document.body, { childList: true, subtree: true })
	}

	GetNameEvo(name, evo = 0) {
		return evo === 0 ? name : name + "_Evo_" + evo
	}

	GetNameEvo_Array(nameEvo) {
		const [name, evo] = nameEvo.split("_Evo_")
		return [name, evo || 0]
	}

	px(px) {
		return `calc(var(--px) * ${px})`
	}

	ems(em) {
		return `calc(var(--ems) * ${em})`
	}

	propx(prop, px) {
		return `${prop}:calc(var(--px) * ${px});`
	}

	HTML_Repeat(count, html) {
		return new Array(count).fill(html).join("")
	}

	Elem_RemoveFocus(elem) {
		//! not needed ?
		elem.classList.remove("focusable")
	}

	Elem_Focusable(elem, focusCallback, unfocusCallback, sfx = true) {
		elem.classList.add("focusable")

		if (sfx) this.Elem_Focusable_SFX(elem)

		if (focusCallback) {
			elem.addEventListener("sn:focused", focusCallback)
			//elem.addEventListener("mouseenter", focusCallback)
		}

		if (unfocusCallback) {
			elem.addEventListener("sn:unfocused", unfocusCallback)
			//elem.addEventListener("mouseleave", unfocusCallback)
		}
	}

	Elem_FocusableAngleAndScale(elem, initAngle = 10, initScale = 1.1, duration = 600, ease = "out-elastic") {
		const focus = () => {
			animate({
				elements: elem,
				transform: [`rotate(${initAngle}deg) scale(${initScale})`, "rotate(0deg) scale(1)"],
				duration: duration,
				easing: ease,
			})
		}

		this.Elem_Focusable(elem, focus, null, false)
	}

	Elem_FocusableAngle(elem, initAngle = 10, duration = 600, ease = "out-elastic") {
		const focus = () => {
			animate({
				elements: elem,
				transform: [`rotate(${initAngle}deg)`, "rotate(0deg)"],
				duration: duration,
				easing: ease,
			})
		}

		this.Elem_Focusable(elem, focus, null, false)
	}

	Elem_FocusableBump(elem, initScale = 0.8, duration = 600, ease = "out-elastic") {
		const focus = () => {
			animate({
				elements: elem,
				transform: ["scale(" + initScale + ")", "scale(1)"],
				duration: duration,
				easing: ease,
			})
		}

		this.Elem_Focusable(elem, focus, null, false)
	}

	Elem_Focusable_SFX(elem) {
		elem.addEventListener("sn:focused", () => {
			this.runtime.audio.PlaySound("UI_Select", 0.7, Utils.random(0.9, 1.1))
			//this.runtime.audio.PlaySound("Menu_Select_00", 0.8, Utils.random(0.9, 1.1))
		})

		/*elem.addEventListener("mouseenter", () => {
			this.runtime.audio.PlaySound("UI_Click")
		})*/

		elem.addEventListener("sn:pressed", () => {
			this.runtime.audio.PlaySound("UI_Click", 1, Utils.random(0.9, 1.1))
		})
	}

	//*Ring elem
	Elem_FocusableOutline(elem) {
		// Store which players are focusing on this elem
		elem.focusedBy = []

		// Ensure the element is position: relative for absolute children
		const computedStyle = getComputedStyle(elem)
		elem.style.position = "relative"
		/*
		if (computedStyle.position === "static") {
			elem.style.position = "relative"
		}*/

		// Container for ring elements
		const ringsContainer = document.createElement("div")
		ringsContainer.id = "rings"
		ringsContainer.style.position = "absolute"
		ringsContainer.style.top = "0"
		ringsContainer.style.left = "0"
		ringsContainer.style.right = "0"
		ringsContainer.style.bottom = "0"
		ringsContainer.style.pointerEvents = "none"
		ringsContainer.style.zIndex = "9999"
		ringsContainer.style.overflow = "visible"
		elem.appendChild(ringsContainer)

		const updateRings = () => {
			while (ringsContainer.firstChild) {
				ringsContainer.removeChild(ringsContainer.firstChild)
			}

			// Instead of normal order [0..N-1], we go backwards [N-1..0].
			// i.e. the bigger the index => the bigger the ring => append it first => it sits *behind*.
			for (let i = elem.focusedBy.length - 1; i >= 0; i--) {
				const playerID = elem.focusedBy[i]
				const color = this.runtime.players[playerID].color
				const spread = 1 + i * 1 // example: "1 + index * 1"

				const ring = document.createElement("div")
				ring.style.position = "absolute"

				// Expand outward equally on all sides
				ring.style.top = Utils.px(-spread)
				ring.style.left = Utils.px(-spread)
				ring.style.right = Utils.px(-spread)
				ring.style.bottom = Utils.px(-spread)

				ring.style.border = `${Utils.px(spread)} solid ${color}`
				ring.style.borderRadius = computedStyle.borderRadius || "0"
				ring.style.pointerEvents = "none"

				// Append the largest ring first, so smaller rings go on top
				ringsContainer.appendChild(ring)
			}
		}

		const focus = (event) => {
			const playerID = event.detail.playerID || 0
			if (!elem.focusedBy.includes(playerID)) {
				elem.focusedBy.push(playerID)
				updateRings()
			}
		}

		const unfocus = (event) => {
			const playerID = event.detail.playerID || 0
			const index = elem.focusedBy.indexOf(playerID)
			if (index !== -1) {
				elem.focusedBy.splice(index, 1)
				updateRings()
			}
		}

		this.Elem_Focusable(elem, focus, unfocus)
	}

	//Todo: unfocus when mouse focus something else?

	//*BowShadow (Too keep)
	Elem_FocusableOutline_(elem, color = "white") {
		let originalBoxShadow = elem.style.boxShadow || ""
		let originalBorder = elem.style.border || ""

		elem.style.willChange = "box-shadow"

		elem.focusedBy = []

		const updateBoxShadow = () => {
			const boxShadows = elem.focusedBy
				.map((playerID, index) => {
					const color = this.runtime.players[playerID].color
					const size = Utils.px(1 + index * 1)
					return `0 0 0 ${size} ${color}`
				})
				.join(", ")

			elem.style.boxShadow = boxShadows ? `${boxShadows}` : originalBoxShadow
		}

		const focus = (event) => {
			const playerID = event.detail.playerID || 0
			if (!elem.focusedBy.includes(playerID)) {
				elem.focusedBy.push(playerID)

				updateBoxShadow()
			}
		}

		const unfocus = (event) => {
			const playerID = event.detail.playerID || 0
			const index = elem.focusedBy.indexOf(playerID)
			if (index !== -1) {
				elem.focusedBy.splice(index, 1)
				updateBoxShadow()
			}
		}

		this.Elem_Focusable(elem, focus, unfocus)
	}

	Elem_FocusableOutline_TooCommented(elem, color = "white") {
		let originalBoxShadow = elem.style.boxShadow || ""
		let originalBorder = elem.style.border || ""

		elem.style.willChange = "box-shadow"

		elem.focusedBy = []

		const updateBoxShadow = () => {
			const boxShadows = elem.focusedBy
				.map((playerID, index) => {
					const color = this.runtime.players[playerID].color
					const size = Utils.px(1 + index * 1)
					return `0 0 0 ${size} ${color}`
				})
				.join(", ")

			// Update the element's box-shadow
			elem.style.boxShadow = boxShadows ? `${boxShadows}` : originalBoxShadow

			/*
			if (originalBorder) {
				if (boxShadows) {
					elem.style.border = "none"
					elem.style.outline = originalBorder
				} else {
					elem.style.border = originalBorder
					elem.style.outline = "calc(var(--px) * 2) solid " + color
				}
			}*/
		}

		//Todo: unfocus when mouse focus something else?

		// Focus event handler
		const focus = (event) => {
			const playerID = event.detail.playerID || 0
			if (!elem.focusedBy.includes(playerID)) {
				elem.focusedBy.push(playerID)

				updateBoxShadow()
			}
		}

		// Unfocus event handler
		const unfocus = (event) => {
			const playerID = event.detail.playerID || 0
			const index = elem.focusedBy.indexOf(playerID)
			if (index !== -1) {
				elem.focusedBy.splice(index, 1)
				updateBoxShadow()
			}
		}

		/*
        const focus = (event) => {
			elem.focusedBy.push(event.detail.playerID)

			let actualColor = color
			console.error("focus evenbt", event)
			if (event.detail.playerID) {
				window.alert("Focus outline", playerID)
				actualColor = this.runtime.players[event.detail.playerID].color
			}
			elem.style.outline = "calc(var(--px) * 2) solid " + actualColor
		}

		const unfocus = (event) => {
			originalOutline !== "" ? (elem.style.outline = originalOutline) : elem.style.removeProperty("outline")
		}*/

		this.Elem_Focusable(elem, focus, unfocus)
	}

	Elem_FocusableBG(elem, color = "white") {
		// Focus event handler
		const focus = (event) => {
			const playerID = event.detail.playerID || 0

			const color = this.runtime.players[playerID].color_

			elem.style.background = `linear-gradient(360deg, ${color}, rgba(0, 0, 0, 1))`

			elem.style.outline = "calc(var(--px) * 2) solid black"
		}

		// Unfocus event handler
		const unfocus = (event) => {
			elem.style.background = ""
			elem.style.outline = ""
		}

		this.Elem_Focusable(elem, focus, unfocus)
	}

	Elem_FocusableBG_Old(elem, color = "white") {
		// Focus event handler
		const focus = (event) => {
			const playerID = event.detail.playerID || 0
			const color = this.runtime.players[playerID].color_
			elem.style.backgroundColor = color
			elem.style.color = "black"

			elem.style.outline = "calc(var(--px) * 2) solid black"
		}

		// Unfocus event handler
		const unfocus = (event) => {
			elem.style.backgroundColor = ""
			elem.style.color = ""

			elem.style.outline = ""
		}

		this.Elem_Focusable(elem, focus, unfocus)
	}

	Elem_SetAttributes(element, attributes) {
		for (let key in attributes) {
			element.setAttribute(key, attributes[key])
		}
		return element
	}

	Elem_SetStyle(element, styles) {
		if (element === "new") element = document.createElement("div")
		for (let key in styles) {
			element.style[key] = styles[key]
		}
		return element
	}

	HTML_C3Scale() {
		const root = document.documentElement
		const scale = getComputedStyle(root).getPropertyValue("--construct-scale")
		return scale
	}

	async Elem_FloatingUI(elem, tooltip, limiterElem = null, args = {}) {
		if (limiterElem) {
			let pos = args.placement || "top-start"
			args = {
				placement: pos,
				middleware: [
					FloatingUI.offset(10), // Add an offset
					FloatingUI.flip(), // Allow flipping
					FloatingUI.shift({
						limiter: FloatingUI.limitShift({
							limiter: async ({ rects, elements }) => {
								const boundaryElement = limiterElem
								const boundaryRect = boundaryElement.getBoundingClientRect()

								const overflow = await FloatingUI.detectOverflow(elements, {
									boundary: boundaryElement,
								})

								return {
									x: Math.min(Math.max(rects.floating.x, boundaryRect.left), boundaryRect.right - rects.floating.width),
									y: Math.min(Math.max(rects.floating.y, boundaryRect.top), boundaryRect.bottom - rects.floating.height),
								}
							},
						}),
					}),
				],
			}
		}

		const { x, y } = await FloatingUI.computePosition(elem, tooltip, args)

		const scale = Utils.HTML_C3Scale()

		Object.assign(tooltip.style, {
			left: Utils.px(x / scale),
			top: Utils.px(y / scale),
		})
	}

	Elem_AddItemHoverTooltip(elem, type = "", pos = "top-start", limiterElem = null, args = {}) {
		const focus = async () => {
			const itemClass = elem.itemClass
			if (itemClass) {
				const player = elem.player || elem.itemClass.player
				const tooltip = player.tooltip

				tooltip.SetTooltipFromItem(itemClass, player, type, args)

				tooltip.DisplayFlex()

				if (type !== "shopMulti" && this.runtime.menu.CurMenuName() === "shopMenu_Multi" && itemClass.itemType === "Weapon") {
					const targetElem = player.shop.elemMulti

					if (targetElem) {
						// Get bounding rects
						const elemRect = elem.getBoundingClientRect()
						const targetRect = targetElem.getBoundingClientRect()
						const tooltipWidth = tooltip.element.offsetWidth
						const tooltipHeight = tooltip.element.offsetHeight

						// Calculate new position: Align center-right
						const x = targetRect.right - tooltipWidth // Match right edge
						const y = targetRect.top + targetRect.height / 2 - tooltipHeight / 2 // Align vertically

						// Apply styles
						tooltip.element.style.position = "absolute"

						const scale = Utils.HTML_C3Scale()

						Object.assign(tooltip.element.style, {
							left: Utils.px(x / scale),
							top: Utils.px(y / scale),
						})
					}
					return
				} else {
					await Utils.Elem_FloatingUI(elem, tooltip.element, limiterElem, {
						placement: pos,
						middleware: [FloatingUI.offset(10), FloatingUI.flip(), FloatingUI.shift()],
					})
				}
			}
		}

		const unfocus = () => {
			const player = elem.player || elem.itemClass.player
			player.tooltip.DisplayNone()
		}

		elem.addEventListener("sn:focused", focus)
		//elem.addEventListener("mouseenter", focus)

		elem.addEventListener("sn:unfocused", unfocus)
		//elem.addEventListener("mouseleave", unfocus)
		elem.addEventListener("bought", unfocus)
	}

	Elem_DispatchEvent(elem, string) {
		const evt = document.createEvent("CustomEvent")
		evt.initCustomEvent(string, true, true)
		return elem.dispatchEvent(evt)
	}

	Elem_AddOverlay(parentElem, id = "elemOverlay") {
		const elemOverlay = document.createElement("div")
		elemOverlay.id = id

		parentElem.style.position = parentElem.style.position || "relative"

		elemOverlay.classList.add("flex", "items_center", "justify_center")

		Object.assign(elemOverlay.style, {
			position: "absolute",
			inset: "0",
			backgroundColor: "rgba(0, 0, 0, 0.5)",
			zIndex: "10",
		})

		parentElem.appendChild(elemOverlay)

		return elemOverlay
	}

	HasStatImg(stat) {
		if (this.runtime.dataManager.statsData[stat].Img) {
			return true
		}
		return false
	}

	GetStatImg(stat) {
		const imgPath = `Game/Graph/Stat_${stat}.png`
		// inline‑flex container will center its children to the text line
		const htmlString = /*html*/ `
          <span style="
              display: inline-flex;
              align-items: center;
              vertical-align: middle;
              line-height: 1em;
              height: 1em;
          ">
            <img
              src="${imgPath}"
              onerror="this.style.display='none';"
              style="
                height: 1em;
                width: auto;
                display: block;
              "
            />
          </span>
        `
		return htmlString
	}

	GetStatImg_Old(statName) {
		const imgPath = "Game/Graph/Stat_" + statName + ".png"
		let htmlString = /*html*/ `<img  
                        src="${imgPath}" onerror="this.src='random_icon.png';"
                        style="
                            vertical-align: bottom;
                            height: 1em;
                        "/>`

		return htmlString

		/*vertical-align: bottom;
        height:${Utils.px(6)};
        width:${Utils.px(6)};*/
	}

	//#region Parser / Processors

	GetFirstInInterval(interval) {
		if (typeof interval === "number") return interval
		if (typeof interval === "string") {
			if (interval.includes("-")) {
				let [min, max] = interval.split("-")
				return parseFloat(min)
			} else return parseFloat(interval)
		}
	}

	ProcessInterval(value) {
		if (typeof value === "number") return value
		else if (typeof value === "string") {
			if (value.includes("-")) {
				let [min, max] = value.split("-")
				// Convert the min and max values to numbers
				min = parseFloat(min)
				max = parseFloat(max)

				return Utils.random(min, max)
			} else return parseFloat(value)
		}
	}

	OffsetValue(value, offset, limit = null) {
		if (limit !== null) {
			if (offset > 0) {
				return Math.min(value + offset, limit)
			}
			if (offset < 0) {
				return Math.max(value + offset, limit)
			}
		} else return value + offset
	}

	OffsetInterval(interval, offset, limit = null) {
		if (typeof interval === "number") {
			return this.OffsetValue(interval, offset, limit)
		} else if (typeof interval === "string") {
			if (interval.includes("-")) {
				let [min, max] = interval.split("-")
				// Convert the min and max values to numbers
				min = parseFloat(min)
				max = parseFloat(max)

				return this.OffsetValue(min, offset, limit) + "-" + this.OffsetValue(max, offset, limit)
			}
		} else if (Array.isArray(interval)) {
			//
		}
	}

	IsIteratorEmpty(iterator) {
		const result = iterator.next()
		return result.done
	}

	StringIsNumber(value) {
		return !isNaN(Number(value)) && value !== ""
	}

	ProcessEvoNumber(value, evo = 0, evoMin = 0) {
		if (typeof value === "number") {
			return value
		} else if (typeof value === "string") {
			if (!evo) evo = 0
			const evolutionSplit = value.split("/")
			//no evolution
			//if (evolutionSplit.length === 1) return value

			//make sure evo is within bounds
			evo = evo - evoMin

			evo = Math.min(evo, evolutionSplit.length - 1)
			value = evolutionSplit[evo]
			if (this.StringIsNumber(value)) {
				value = parseFloat(value)
			}
			return value
		} else return value
	}

	ProcessEvoNumber_NestedObject(data, evo = 0, evoMin = 0) {
		if (typeof data === "object" && data !== null) {
			if (Array.isArray(data)) {
				return data.map((item) => this.ProcessEvoNumber_NestedObject(item, evo, evoMin))
			} else {
				const processedObject = {}
				for (const key in data) {
					if (data.hasOwnProperty(key)) {
						processedObject[key] = this.ProcessEvoNumber_NestedObject(data[key], evo, evoMin)
					}
				}
				return processedObject
			}
		} else {
			return this.ProcessEvoNumber(data, evo, evoMin)
		}
	}

	SetVars_Default(This, data) {
		if (!data) return
		This._defaultVars = data

		if (!This._defaultTypes) This._defaultTypes = {}
		/*
		if (!This.varsToProcess) {
			This.varsToProcess = []
		}*/
		for (let key in data) {
			/*
			if (key.startsWith("$")) {
				This.varsToProcess.push(key)
				key = key.slice(1)
			}*/
			const value = data[key]
			This[key] = value

			//!later : add type detection
			/*
			if (typeof value === "number") {
				This._defaultTypes[key] = ["number", "range"]
			} else if (typeof value === "string") {
				if (this.IsNumberOrRange(value)) This._defaultTypes[key] = ["number", "range"]
				else This._defaultTypes[key] = ["string"]
			} else if (Array.isArray(value)) {
				This._defaultTypes[key] = ["array"]
			} else {
				This._defaultTypes[key] = [typeof value]
			}*/
		}
	}

	SetVars_AddTypes(This, data) {
		if (!data) return
		if (!This._defaultTypes) This._defaultTypes = {}
		This._defaultVarsType = data
	}

	IsNumberOrRange(input) {
		// Check if the input is a number (not a string)
		if (typeof input === "number" && !isNaN(input)) {
			return true
		}

		// If the input is a string, check for a single number
		if (typeof input === "string" && !isNaN(input) && input.trim() !== "") {
			return true
		}

		// If the input is a string, check if it's a valid range
		if (typeof input === "string") {
			const rangePattern = /^-?\d+(\.\d+)?-?-?\d+(\.\d+)?$/ // Regex for "2.5-3.5", "-1.5--0.5", etc.
			if (rangePattern.test(input)) {
				// Further validation: Ensure both sides of the range are valid numbers
				const [start, end] = input.split("-").map(Number)
				return !isNaN(start) && !isNaN(end) && start <= end
			}
		}

		return false
	}

	SetVars(This, data) {
		if (!data) return
		// Iterate through data object and override existing instance values
		for (let key in data) {
			if (data.hasOwnProperty(key) && This._defaultVars.hasOwnProperty(key)) {
				const value = this.ProcessEvoNumber(data[key], This.evolution)

				let defaultValue = This._defaultVars[key]

				let validData = false

				if (typeof value === typeof This._defaultVars[key]) {
					validData = true
				}
				if (typeof This._defaultVars[key] === "number" && this.IsNumberOrRange(value)) {
					validData = true
				}
				if (This.varsToProcess && This.varsToProcess.includes(key) && (typeof value === "string" || typeof value === "number")) {
					validData = true
				}
				if (This._defaultVarsType && This._defaultVarsType[key]) {
					//
				}

				if (!validData) {
					console.error("⛔ The key " + key + " has a different type from Default", This)
					console.error("ValueTried", value, "Default: ", This._defaultVars[key])
					console.error("Original Value", data[key], data)
					continue
				}

				This[key] = value // Override if the key exists in the instance
			}
		}
	}

	ProcessVars(This) {
		if (This.varsToProcess) {
			for (const varName of This.varsToProcess) {
				if (This[varName]) {
					const value = This[varName]
					This[varName] = this.ProcessInterval(value)
				}
			}
		}
	}

	AdjustWithCoef(value, coef) {
		if (typeof value === "string") {
			if (value.includes("-")) {
				let [min, max] = value.split("-")
				min = parseFloat(min) * coef
				max = parseFloat(max) * coef
				return `${min}-${max}`
			} else {
				//
			}
		} else if (typeof value === "number") {
			return value * coef * Utils.random(0.9, 1.1)
		}
	}

	TextC3(inst, args) {
		let text = args.text === undefined ? inst.text : args.text

		if (args.size) inst.sizePt = args.size
		if (args.opacity) inst.opacity = args.opacity

		if (args.background) {
			text = `[background=${args.background}]${text}`
		}

		if (args.color) {
			text = `[color=${args.color}]${text}`
		}
		if (args.outline) {
			text = `[outline=#000000][lineThickness=${args.outline}]${text}`
		}
		if (args.outlineBack) {
			text = `[outlineback=#000000][lineThickness=${args.outlineBack}]${text}`
		}
		if (args.typewriter) {
			//text without the tags
		} else inst.text = text
	}

	PickNearestTags(targetTags, x, y) {
		const targets = this.runtime.units.GetUnitsByTags(targetTags, "Chara")
		const target = Utils.PickNearest(targets, x, y)
		return target
	}

	PickNearest(unitsArray, x, y) {
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

	GetInCircle(unitsArray, x, y, radius, invert = false) {
		let unitsInCircle = []
		for (let i = 0; i < unitsArray.length; i++) {
			const unit = unitsArray[i]
			const dist = C3.distanceSquared(x, y, unit.inst.x, unit.inst.y)
			if (dist < radius * radius) {
				if (!invert) unitsInCircle.push(unit)
			} else {
				if (invert) unitsInCircle.push(unit)
			}
		}
		return unitsInCircle
	}

	SortByDistance(unitsArray, x, y) {
		return unitsArray.sort((a, b) => {
			const distA = C3.distanceSquared(x, y, a.inst.x, a.inst.y)
			const distB = C3.distanceSquared(x, y, b.inst.x, b.inst.y)
			return distA - distB
		})
	}

	//#endregion

	Array_Random(array, x = 0) {
		if (!Array.isArray(array) || array.length === 0) {
			return null
		}
		if (x !== 0) {
			return this._Array_RandomCount(array, x)
		}
		return array[Math.floor(Math.random() * array.length)]
	}

	_Array_RandomCount(array, x) {
		if (typeof x === "string" && x.includes("%")) {
			let percentage = parseFloat(x) / 100 // Convert "80%" to 0.8
			x = Math.round(array.length * percentage) // Get the number of elements
		}

		if (x === -1 || x >= array.length) {
			return array // Return the whole array if x is -1 or greater than/equal to array length
		}

		const shuffled = [...array].sort(() => Math.random() - 0.5)
		return shuffled.slice(0, x)
	}

	Array_Shuffle(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))
			;[array[i], array[j]] = [array[j], array[i]] // Swap elements
		}
		return array
	}

	Array_RemoveInstance(array, item) {
		const index = array.indexOf(item)
		if (index !== -1) {
			array.splice(index, 1)
		}
		return array
	}

	GetTween(tweenBeh, tags) {
		return Array.from(tweenBeh.tweensByTags(tags))[0]
	}

	AddBorders(inst, borderObj, borderLayer = "Objects") {
		const bbox = inst.getBoundingBox()
		const bboxMidX = (bbox.left + bbox.right) / 2
		const bboxMidY = (bbox.top + bbox.bottom) / 2
		const solidBorderObj = this.runtime.objects[borderObj]

		const bottom = solidBorderObj.createInstance(borderLayer, bboxMidX, bbox.bottom)
		bottom.width = inst.width
		inst.addChild(bottom, { transformX: true, transformY: true, destroyWithParent: true })

		const top = solidBorderObj.createInstance(borderLayer, bboxMidX, bbox.top)
		top.width = inst.width
		top.angleDegrees = 180
		inst.addChild(top, { transformX: true, transformY: true, destroyWithParent: true })

		const left = solidBorderObj.createInstance(borderLayer, bbox.left, bboxMidY)
		left.width = inst.height
		left.angleDegrees = 90
		inst.addChild(left, { transformX: true, transformY: true, destroyWithParent: true })

		const right = solidBorderObj.createInstance(borderLayer, bbox.right, bboxMidY)
		right.width = inst.height
		right.angleDegrees = 270
		inst.addChild(right, { transformX: true, transformY: true, destroyWithParent: true })
	}

	AddCorners(inst, cornerObj, borderLayer = "Objects") {
		const bbox = inst.getBoundingBox()
		cornerObj = this.runtime.objects[cornerObj]

		const topLeft = cornerObj.createInstance(borderLayer, bbox.left, bbox.top)

		const topRight = cornerObj.createInstance(borderLayer, bbox.right, bbox.top)
		topRight.angleDegrees = 90

		const bottomLeft = cornerObj.createInstance(borderLayer, bbox.left, bbox.bottom)
		bottomLeft.angleDegrees = 270

		const bottomRight = cornerObj.createInstance(borderLayer, bbox.right, bbox.bottom)
		bottomRight.angleDegrees = 180

		inst.addChild(topLeft, { transformX: true, transformY: true, destroyWithParent: true })
		inst.addChild(topRight, { transformX: true, transformY: true, destroyWithParent: true })
		inst.addChild(bottomLeft, { transformX: true, transformY: true, destroyWithParent: true })
		inst.addChild(bottomRight, { transformX: true, transformY: true, destroyWithParent: true })
	}

	waitForSeconds(seconds) {
		return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
	}

	Wait_Timescale(duration) {
		return new Promise((resolve) => {
			let elapsed = 0

			const wait = () => {
				const dt = this.runtime.dt

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

	angleLerpDeg(a, target, x) {
		let delta = ((target - a + 540) % 360) - 180 // Calculate shortest rotation
		return (a + delta * x + 360) % 360 // Interpolate and wrap to [0, 360)
	}

	angleRotateDeg(current, target, offset) {
		// Normalize the angles to be within [0, 360)
		current = ((current % 360) + 360) % 360
		target = ((target % 360) + 360) % 360

		// Calculate the shortest difference between target and current
		let diff = target - current
		if (diff > 180) {
			diff -= 360
		} else if (diff < -180) {
			diff += 360
		}

		// If the remaining difference is smaller than the offset,
		// we can simply set the angle to the target.
		if (Math.abs(diff) <= offset) {
			return target
		}

		// Move the current angle toward the target by the offset amount.
		if (diff > 0) {
			current += offset
		} else {
			current -= offset
		}

		// Normalize the result to [0, 360)
		return ((current % 360) + 360) % 360
	}

	/*
    angleLerpDegrees(a, target, x) {
        a = C3.toRadians(a)
        target = C3.toRadians(target)
        return C3.angleLerp(a, target, x)
    }*/

	_set(obj, path, value, override = true) {
		if (typeof path === "string") {
			path = path.split(".")
		}
		let didntExisted = false
		for (var i = 0; i < path.length - 1; i++) {
			var key = path[i]
			if (!obj.hasOwnProperty(key) || typeof obj[key] !== "object") {
				obj[key] = {}
				didntExisted = true
			}
			obj = obj[key]
		}
		if (override || didntExisted) obj[path[path.length - 1]] = value
		return obj[path[path.length - 1]]
	}

	_getOrSet(obj, path, defaultValue) {
		const parts = Array.isArray(path) ? path : path.split(".")
		let current = obj

		for (let i = 0; i < parts.length; i++) {
			const part = parts[i]
			if (current[part] === undefined) {
				if (i === parts.length - 1) {
					current[part] = defaultValue
					return defaultValue
				}
				current[part] = {}
			}
			current = current[part]
		}

		return current
	}

	deepCopy(obj) {
		if (obj === null || typeof obj !== "object") {
			return obj // Return the value if it's not an object
		}

		if (Array.isArray(obj)) {
			return obj.map(this.deepCopy) // Deep copy arrays recursively
		}

		const copy = {}
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				copy[key] = this.deepCopy(obj[key]) // Recursively copy each property
			}
		}

		return copy
	}

	deepMerge(target, source) {
		// Create a new object to avoid modifying the originals
		const output = this.deepCopy(target) //JSON.parse(JSON.stringify(target))

		for (const key in source) {
			if (source[key] instanceof Object && !Array.isArray(source[key])) {
				// If the property is a nested object, perform deep merge recursively
				output[key] = this.deepMerge(output[key] ? { ...output[key] } : {}, source[key])
			} else {
				// For other types (arrays, primitives), directly assign or replace
				output[key] = source[key]
			}
		}
		return output // Return the deeply merged result
	}

	World_CreateChildOn(inst, objName, layer, args = {}) {
		inst = inst.inst || inst // Check if inst is an instance or an object

		args.transformX = args.transformX !== undefined ? args.transformX : true
		args.transformY = args.transformY !== undefined ? args.transformY : true
		args.destroyWithParent = args.destroyWithParent !== undefined ? args.destroyWithParent : true

		const x = args.x || 0
		const y = args.y || 0
		const templateName = args.templateName || ""

		const obj = this.runtime.objects[objName]
		const child = obj.createInstance(layer, inst.x + x, inst.y + y, true, templateName)
		inst.addChild(child, args)
		return child
	}

	World_GetEffect(inst, name) {
		return inst.effects.find((effect) => effect.name === name)
	}

	World_MatchInst(inst, instToCopy) {
		if (inst.animationName) {
			inst.setAnimation(instToCopy.animationName)
			inst.animationFrame = instToCopy.animationFrame
		}

		inst.setPosition(instToCopy.x, instToCopy.y)
		inst.setSize(instToCopy.width, instToCopy.height)
		inst.angle = instToCopy.angle

		this.World_CopyMesh(inst, instToCopy)
	}

	World_MatchFrame(inst, instToCopy) {
		if (inst.animationName) {
			inst.setAnimation(instToCopy.animationName)
			inst.animationFrame = instToCopy.animationFrame
		}

		inst.width = Math.abs(inst.width) * Math.sign(instToCopy.width)
	}

	World_CopyMesh(inst1, inst2) {
		// Get the mesh size of inst2
		const [hsize, vsize] = inst2.getMeshSize()

		// If inst2 has no mesh, release mesh on inst1 if any, and return
		if (hsize === 0 || vsize === 0) {
			inst1.releaseMesh?.()
			return
		}

		// Create mesh on inst1 if it doesn't already match
		const [h1, v1] = inst1.getMeshSize()
		if (h1 !== hsize || v1 !== vsize) {
			inst1.releaseMesh?.()
			inst1.createMesh(hsize, vsize)
		}

		// Copy each mesh point from inst2 to inst1
		for (let row = 0; row < vsize; row++) {
			for (let col = 0; col < hsize; col++) {
				const point = inst2.getMeshPoint(col, row)
				inst1.setMeshPoint(col, row, {
					x: point.x,
					y: point.y,
					u: point.u,
					v: point.v,
					zElevation: point.zElevation,
				})
			}
		}
	}

	World_GetBBoxMid(inst) {
		const bbox = inst.getBoundingBox()
		const bboxMidX = (bbox.left + bbox.right) / 2
		const bboxMidY = (bbox.top + bbox.bottom) / 2
		return [bboxMidX, bboxMidY]
	}

	World_SetSizeByMax(inst, maxSize) {
		const originalRatio = inst.width / inst.height
		if (originalRatio >= 1) {
			inst.width = maxSize
			inst.height = maxSize / originalRatio
		} else {
			inst.height = maxSize
			inst.width = maxSize * originalRatio
		}
	}

	World_SetLayer(inst, layerNameOrID) {
		const layer = inst.layout.getLayer(layerNameOrID)
		inst.moveToLayer(layer)
	}

	World_GetChild(inst, childObj) {
		const children = inst.children()
		const child = children.find((child) => child.objectType.name === childObj)
		return child
	}

	World_GetChild_Nested(inst, childObj) {
		const children = inst.allChildren()
		const child = children.find((child) => child.objectType.name === childObj)
		return child
	}

	World_GetChildren(inst, childObj) {
		const children = inst.children()
		const child = children.filter((child) => child.objectType.name === childObj)
		return child
	}

	World_GetChildrend_Nested(inst, childObj) {
		const children = inst.allChildren()
		const child = children.filter((child) => child.objectType.name === childObj)
		return child
	}

	async SDK_ReplaceAnimationFrame(curImageInfo, url) {
		const response = await fetch(url)
		const blob = await response.blob()

		const runtime = globalThis.sdk_runtime
		C3X.RequireInstanceOf(blob, Blob)
		const imageInfo = C3.New(C3.ImageInfo)
		imageInfo.LoadDynamicBlobAsset(runtime, blob)
		await imageInfo.LoadStaticTexture(runtime.GetRenderer(), {
			sampling: runtime.GetSampling(),
		})
		/*
		if (sdkInst.WasReleased()) {
			imageInfo.Release()
			return
		}*/
		curImageInfo.ReplaceWith(imageInfo)
		/*const sdkType = sdkInst.GetSdkType()
		const sdkType = curImageInfo._sdkType
		sdkType._UpdateAllCurrentTexture()
		sdkType.GetObjectClass().Dispatcher().dispatchEvent(new C3.Event("animationframeimagechange"))*/
		runtime.UpdateRender()
	}

	//! deprek
	async Sprite_ToBlobURL(spriteName, animName = null, frame = 0) {
		/*
		const spriteObject = this.runtime.objects[spriteName]
		const spriteAnims = spriteObject.getAllAnimations()
		let anim = spriteAnims[0]
		if (animName) {
			anim = spriteAnims.find((anim) => anim.GetName() === animName)
		}
		const animFrames = anim.getFrames()
		let frameData = animFrames[frame]*/
		const spriteObject = this.runtime.objects[spriteName]
		const spriteObjectSdk = sdk_runtime._interfaceMap.get(spriteObject)
		const sdkFrame = spriteObjectSdk._animations[0]._frames[0]._imageInfo

		//console.error("🌞 sdkFrame", sdkFrame)

		const blobUrl = await sdkFrame.ExtractImageToBlobURL()

		if (!globalThis.spriteToBlobs) globalThis.spriteToBlobs = new Map()
		globalThis.spriteToBlobs.set(spriteName, blobUrl)

		//console.error("🌞 blobUrl", spriteName, blobUrl)

		return blobUrl
	}

	Map_Increment(map, key, value = 1) {
		if (!map.has(key)) {
			map.set(key, value)
		} else {
			map.set(key, map.get(key) + value)
		}
	}

	async Sprite_CreateOrSetAnim(sprite, animName, unit = null, origin = "bottom") {
		if (typeof animName !== "string") {
			console.error("animName is not a string", animName)
			return
		}
		if (sprite.getAnimation(animName)) sprite.setAnimation(animName)
		else {
			console.error("animName doesn't exist", animName)
		}
	}

	Sprite_SetRandomFrame(inst) {
		const frameCount = inst.animation.frameCount
		inst.animationFrame = Utils.randomInt(frameCount)
	}

	async Object_LoadTextIcons(spriteName, frameName, url) {
		const spriteObject = this.runtime.objects[spriteName]
		const spriteObjectSdk = sdk_runtime._interfaceMap.get(spriteObject)

		const animName = "Icons"

		const animFrame = spriteObject.addAnimationFrame(animName, -1)

		const animSDK = spriteObjectSdk.GetAnimationByName(animName)
		//pick last frame
		const frameSDK = animSDK._frames[animSDK._frames.length - 1]
		const imageInfoSDK = frameSDK._imageInfo
		frameSDK._tag = frameName

		//console.error("url", url, frameSDK)

		await Utils.SDK_ReplaceAnimationFrame(imageInfoSDK, url)
	}

	async Object_LoadAnim(spriteName, objectName, data) {
		const promises = []
		const spriteObject = this.runtime.objects[spriteName]
		const spriteObjectSdk = sdk_runtime._interfaceMap.get(spriteObject)

		//const sdkFrame = spriteObjectSdk._animations[0]._frames[0]._imageInfo

		//let singleAnim = Object.keys(data).length === 1

		for (let [animName, animData] of Object.entries(data)) {
			animName = objectName + "/" + animName
			//console.error("ObjectName", objectName, "AnimName", animName)
			spriteObject.addAnimation(animName)
			const frames = Object.values(animData.Frames)
			for (let i = 1; i < frames.length; i++) {
				spriteObject.addAnimationFrame(animName, -1)
			}

			//SDK1: add animation and good amount of frames
			const animSDK = spriteObjectSdk.GetAnimationByName(animName)
			animSDK._speed = animData.speed
			animSDK._isLooping = animData.looping
			animSDK._repeatCount = animData.repeatCount
			animSDK._repeatTo = animData.repeatTo
			animSDK._isPingPong = animData.pingPong

			for (let i = 0; i < frames.length; i++) {
				const frameData = frames[i]
				const frameSDK = animSDK._frames[i]
				frameSDK._duration = frameData.Duration
				frameSDK._origin = C3.New(C3.Vector2, frameData.Origin[0], frameData.Origin[1])
				frameSDK._tag = frameData.Tags //! array or string ?

				frameSDK._imagePoints = []
				if (frameData.Points) {
					for (const ipData of frameData.Points) {
						//ipData = [name, x, y]
						const ipSDK = C3.New(C3.ImagePoint, frameSDK, ipData)
						frameSDK._imagePoints.push(ipSDK)
					}
				}

				//required for internals
				frameSDK._imagePointsByName = new Map()
				for (const ip of frameSDK._imagePoints) frameSDK._imagePointsByName.set(ip.GetName().toLowerCase(), ip)

				this._collisionPoly = null
				const polyPoints = frameData.Poly
				if (polyPoints.length >= 6) this._collisionPoly = C3.New(C3.CollisionPoly, polyPoints)

				const imgPath = "output/" + frameData.ImgPath

				const imageInfoSDK = frameSDK._imageInfo

				promises.push(this.SDK_ReplaceAnimationFrame(imageInfoSDK, imgPath))
			}
		}

		await this.PromiseAll(promises)
	}

	Elem_AddSeparator(elem) {
		//if last child is a separator, do nothing
		if (
			elem.lastChild &&
			elem.lastChild.nodeType === 1 && // Node.ELEMENT_NODE
			elem.lastChild.classList.contains("separator")
		) {
			return
		}

		const sep = document.createElement("div")
		sep.classList.add("separator")
		sep.style.height = Utils.px(0.3)
		sep.style.backgroundColor = `#ccc`
		sep.style.margin = `${Utils.px(1)} 0`
		sep.style.width = `100%`
		sep.style.paddingLeft = "0px"
		elem.appendChild(sep)
	}

	async PromiseAll(promises, onComplete = null) {
		// Wrap each promise in a way that it resolves even if it fails
		const wrappedPromises = promises.map((p) =>
			p.catch((error) => {
				console.error("Error with a promise:", p, error)
				return null // Continue with other promises, returning a fallback value (null in this case)
			})
		)

		await Promise.all(wrappedPromises)

		if (onComplete) onComplete()
	}

	createAnim(templateName, x = 0, y = 0, layer = "Objects") {
		const inst = this.runtime.objects["Anim"].createInstance(layer, x, y)
		this.setAnim(inst, templateName)
		return inst
	}

	setAnim(inst, templateName) {
		let templateData = this.runtime.dataManager.templatesData[templateName]

		if (!templateData) {
			console.error("⛔ Template Data not found for", templateName)
			return
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

		const data = templateData.AnimInfo

		inst.setAnimation(data.Anim[0])
		inst.animationFrame = data.Anim[1]

		inst.setSize(data.Width, data.Height)
		inst.angle = data.Angle

		return inst
	}

	createFX(templateName, x = 0, y = 0, layer = "Objects") {
		const inst = this.createAnim(templateName, x, y, layer)
		inst.addEventListener("animationend", () => inst.destroy())
		return inst
	}

	snap(x, step) {
		return Math.round(x / step) * step
	}

	remap(x, inMin, inMax, outMin, outMax) {
		return outMin + ((x - inMin) * (outMax - outMin)) / (inMax - inMin)
	}

	remapClamp(x, inMin, inMax, outMin, outMax) {
		return C3.clamp(this.remap(x, inMin, inMax, outMin, outMax), outMin, outMax)
	}

	numIsBetween(num, x, y, inclusive = true) {
		const min = Math.min(x, y)
		const max = Math.max(x, y)

		if (inclusive) {
			return num >= min && num <= max
		} else {
			return num > min && num < max
		}
	}
}
