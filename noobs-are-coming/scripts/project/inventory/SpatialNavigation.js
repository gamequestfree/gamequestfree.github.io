/* eslint-disable quotes */
/* eslint-disable no-constant-condition */
/* eslint-disable no-redeclare */

const refocusLastElem = true
const mouseDebugging = false

export class SpatialNavigation {
	constructor(player) {
		this.player = player
		this.playerIndex = player.playerIndex || 0

		this.runtime = player.runtime

		//todo: is it still relevant ??
		this.focusClass = "focus-" + this.playerIndex

		this.onMouseEnter = this.onMouseEnter.bind(this)
		this.onMouseLeave = this.onMouseLeave.bind(this)
		//this.onMouseOver = this.onMouseOver.bind(this)
		this.onClick = this.onClick.bind(this)
		this.onContextMenu = this.onContextMenu.bind(this)

		/************************/
		/* Global Configuration */
		/************************/
		// Note: an <extSelector> can be one of following types:
		// - a valid selector string for "querySelectorAll"
		// - a NodeList or an array containing DOM elements
		// - a single DOM element
		// - a string "@<sectionId>" to indicate the specified section
		// - a string "@" to indicate the default section
		this._globalConfig = {
			selector: "", // can be a valid <extSelector> except "@" syntax.
			straightOnly: false,
			straightOverlapThreshold: 0.5,
			rememberSource: false,
			disabled: false,
			defaultElement: "", // <extSelector> except "@" syntax.
			enterTo: "", // '', 'last-focused', 'default-element'
			leaveFor: null, // {left: <extSelector>, right: <extSelector>,
			//  up: <extSelector>, down: <extSelector>}
			restrict: "self-first", // 'self-first', 'self-only', 'none'
			tabIndexIgnoreList: "a, input, select, textarea, button, iframe, [contentEditable=true]",
			navigableFilter: null,

			enableWrapping: true,
		}

		/*********************/
		/* Constant Variable */
		/*********************/
		this._KEYMAPPING = {
			37: "left",
			38: "up",
			39: "right",
			40: "down",
		}

		this._REVERSE = {
			left: "right",
			up: "down",
			right: "left",
			down: "up",
		}

		this._EVENT_PREFIX = "sn:"
		this._ID_POOL_PREFIX = "section-"

		/********************/
		/* Private Variable */
		/********************/
		this._idPool = 0
		this._ready = false
		this._pause = false
		this._sections = {}
		this._sectionCount = 0
		this._defaultSectionId = ""
		this._lastSectionId = ""
		this._duringFocusChange = false
		this._currentFocusedElement = null // Added to keep track of the current focused element
		this._lastFocusedElement = null // Useful for onMouseLeave scenario
		this._navigationRules = []
		this._accessRestrictions = []

		/************/
		/* Polyfill */
		/************/
		this.elementMatchesSelector = function (elem, selector) {
			if (!elem || !selector) {
				return false
			}
			if (elem.matches) {
				return elem.matches(selector)
			} else if (elem.matchesSelector) {
				return elem.matchesSelector(selector)
			} else if (elem.msMatchesSelector) {
				return elem.msMatchesSelector(selector)
			} else if (elem.webkitMatchesSelector) {
				return elem.webkitMatchesSelector(selector)
			} else if (elem.mozMatchesSelector) {
				return elem.mozMatchesSelector(selector)
			} else if (elem.oMatchesSelector) {
				return elem.oMatchesSelector(selector)
			} else {
				// Fallback for older browsers
				var parent = elem.parentNode || document
				var matchedNodes = parent.querySelectorAll(selector)
				return [].slice.call(matchedNodes).indexOf(elem) >= 0
			}
		}

		/*****************/
		/* Event Binding */
		/*****************/
		// Removed event handlers for focus and blur
		// this.onFocus = this.onFocus.bind(this)
		// this.onBlur = this.onBlur.bind(this)

		this.init()
	}

	/*******************/
	/* Public Function */
	/*******************/
	init() {
		if (!this._ready) {
			// Removed event listeners for focus and blur
			// window.addEventListener("focus", this.onFocus, true)
			// window.addEventListener("blur", this.onBlur, true)
			this._ready = true
		}
	}

	uninit() {
		// Removed event listeners for focus and blur
		// window.removeEventListener("blur", this.onBlur, true)
		// window.removeEventListener("focus", this.onFocus, true)
		this.clear()
		this._idPool = 0
		this._ready = false
	}

	clear() {
		this.runtime.mouse.setCursorStyle("default")
		this.set({
			navigableFilter: null,
		})
		this._sections = {}
		this._sectionCount = 0
		this._defaultSectionId = ""
		this._lastSectionId = ""
		this._duringFocusChange = false
	}

	limitAccessFromDirection(selector, blockedDirections) {
		// blockedDirections is an array, e.g. ["left", "right"]
		this._accessRestrictions.push({
			selector,
			blockedDirections,
		})
	}

	// set(<config>);
	// set(<sectionId>, <config>);
	set() {
		var sectionId, config

		if (typeof arguments[0] === "object") {
			config = arguments[0]
		} else if (typeof arguments[0] === "string" && typeof arguments[1] === "object") {
			sectionId = arguments[0]
			config = arguments[1]
			if (!this._sections[sectionId]) {
				throw new Error('Section "' + sectionId + "\" doesn't exist!")
			}
		} else {
			return
		}

		for (var key in config) {
			if (this._globalConfig[key] !== undefined) {
				if (sectionId) {
					this._sections[sectionId][key] = config[key]
				} else if (config[key] !== undefined) {
					this._globalConfig[key] = config[key]
				}
			}
		}

		if (sectionId) {
			// Remove "undefined" items
			this._sections[sectionId] = this.extend({}, this._sections[sectionId])
		}
	}

	// add(<config>);
	// add(<sectionId>, <config>);
	add() {
		var sectionId
		var config = {}

		if (typeof arguments[0] === "object") {
			config = arguments[0]
		} else if (typeof arguments[0] === "string" && typeof arguments[1] === "object") {
			sectionId = arguments[0]
			config = arguments[1]
		}

		if (!sectionId) {
			sectionId = typeof config.id === "string" ? config.id : this.generateId()
		}

		if (this._sections[sectionId]) {
			throw new Error('Section "' + sectionId + '" has already existed!')
		}

		this._sections[sectionId] = {}
		this._sectionCount++

		this.set(sectionId, config)

		return sectionId
	}

	remove(sectionId) {
		if (!sectionId || typeof sectionId !== "string") {
			throw new Error('Please assign the "sectionId"!')
		}
		if (this._sections[sectionId]) {
			delete this._sections[sectionId]
			this._sectionCount--
			if (this._lastSectionId === sectionId) {
				this._lastSectionId = ""
			}
			return true
		}
		return false
	}

	disable(sectionId) {
		if (this._sections[sectionId]) {
			this._sections[sectionId].disabled = true
			return true
		}
		return false
	}

	enable(sectionId) {
		if (this._sections[sectionId]) {
			this._sections[sectionId].disabled = false
			return true
		}
		return false
	}

	pause() {
		this._pause = true
	}

	resume() {
		this._pause = false
	}

	CanMenuInteract() {
		if (this._pause) return false
		if (this.runtime.menu.playerMenuID === -1) return true
		if (this.runtime.menu.playerMenuID === this.playerIndex) return true
		return false
	}

	// focus([silent])
	// focus(<sectionId>, [silent])
	// focus(<extSelector>, [silent])
	// Note: "silent" is optional and default to false
	focus(elem, silent) {
		var result = false

		if (silent === undefined && typeof elem === "boolean") {
			silent = elem
			elem = undefined
		}

		var autoPause = !this._pause && silent

		if (autoPause) {
			this.pause()
		}

		if (!elem) {
			result = this.focusSection()
		} else {
			if (typeof elem === "string") {
				if (this._sections[elem]) {
					result = this.focusSection(elem)
				} else {
					result = this.focusExtendedSelector(elem)
				}
			} else {
				var nextSectionId = this.getSectionId(elem)
				if (this.isNavigable(elem, nextSectionId)) {
					result = this.focusElement(elem, nextSectionId)
				}
			}
		}

		if (autoPause) {
			this.resume()
		}

		return result
	}

	setNavigationRules(selector, allowedDirections) {
		this._navigationRules.push({
			selector: selector,
			allowedDirections: allowedDirections,
		})
	}

	// move(<direction>)
	// move(<direction>, <selector>)
	move(direction, selector, ignoreFunction = false) {
		direction = direction.toLowerCase()
		if (!this._REVERSE[direction]) {
			return false
		}

		var elem = selector ? this.parseSelector(selector)[0] : this.getCurrentFocusedElement()
		// Use _lastFocusedElement if no element is currently focused
		if (!elem) {
			if (refocusLastElem && this._lastFocusedElement) {
				// Refocus the last focused element
				var lastElem = this._lastFocusedElement
				var sectionId = this.getSectionId(lastElem)
				if (sectionId) {
					this.focusElement(lastElem, sectionId)
					return true // Do not proceed to move
				} else {
					return false // Can't refocus if sectionId is invalid
				}
			} else {
				// Proceed to move from the last focused element
				elem = this._lastFocusedElement
			}
		}
		if (!elem) {
			return false
		}

		var sectionId = this.getSectionId(elem)
		if (!sectionId) {
			return false
		}

		var willmoveProperties = {
			direction: direction,
			sectionId: sectionId,
			cause: "api",
		}

		this.fireEvent(elem, "move_" + direction)

		if (!this.CanMenuInteract()) return false

		if (!this.fireEvent(elem, "willmove", willmoveProperties)) {
			return false
		}

		//! if move override function (now loops parent)

		if (!ignoreFunction) {
			let currentElem = elem
			while (currentElem) {
				const moveFn = currentElem["move_" + direction]
				if (typeof moveFn === "function") {
					const elemToFocus = moveFn.call(currentElem)
					if (elemToFocus) {
						if (elemToFocus === "noMove") return false
						this.focus(elemToFocus)
						return true
					}
					// If function exists but returns nothing, break (don't keep bubbling)
					break
				}
				currentElem = currentElem.parentElement
			}
		}

		/*if (!ignoreFunction && elem["move_" + direction]) {
			const elemToFocus = elem["move_" + direction]()
			if (elemToFocus) {
				if (elemToFocus === "noMove") return false
				this.focus(elemToFocus)
				return true
			}
		}*/

		return this.focusNext(direction, elem, sectionId)
	}

	IsHidden(elem) {
		const style = window.getComputedStyle(elem)
		return style.display === "none" || style.visibility === "hidden"
	}

	//custom added
	press() {
		//! TEMP FIX: otherwise impossible to press the dropdown option with gamepad
		const evt = document.createEvent("CustomEvent")
		evt.initCustomEvent("sn:pressDropdown", true, true, {})
		document.dispatchEvent(evt)

		if (!this.CanMenuInteract()) return false

		// Get the currently focused element
		const focusedElement = this.getCurrentFocusedElement()

		// Check if there is a focused element
		if (focusedElement) {
			//only if the element is visible
			if (this.IsHidden(focusedElement)) {
				//console.error("Element is hidden, can't press")
				return false
			} else {
				//console.error("Element is not hidden, can press", focusedElement)
			}

			// Simulate the click event
			//focusedElement.click()
			this.fireEvent(focusedElement, "pressed")
			return true // Return true to indicate the click was successful
		}

		return false // Return false if no element was focused
	}

	// makeFocusable()
	// makeFocusable(<sectionId>)
	makeFocusable(sectionId) {
		var doMakeFocusable = (section) => {
			var tabIndexIgnoreList = section.tabIndexIgnoreList !== undefined ? section.tabIndexIgnoreList : this._globalConfig.tabIndexIgnoreList
			this.parseSelector(section.selector).forEach((elem) => {
				if (!this.matchSelector(elem, tabIndexIgnoreList)) {
					if (!elem.getAttribute("tabindex")) {
						elem.setAttribute("tabindex", "-1")
					}
				}
			})
		}

		if (sectionId) {
			if (this._sections[sectionId]) {
				doMakeFocusable(this._sections[sectionId])
			} else {
				throw new Error('Section "' + sectionId + "\" doesn't exist!")
			}
		} else {
			for (var id in this._sections) {
				doMakeFocusable(this._sections[id])
			}
		}
	}

	setDefaultSection(sectionId) {
		if (!sectionId) {
			this._defaultSectionId = ""
		} else if (!this._sections[sectionId]) {
			throw new Error('Section "' + sectionId + "\" doesn't exist!")
		} else {
			this._defaultSectionId = sectionId
		}
	}

	/*****************/
	/* Mouse support */
	/*****************/

	UpdateMouseActive() {
		const bool = this.checkMouse()
		this.SetMouseActive(bool)
	}

	checkMouse() {
		if (!this.player.enabled) return false
		if (mouseDebugging) {
			return true
		} else {
			if (this.player.inputID === "KEY") return true
			if (this.player.inputID === null) return true
		}
		return false
	}

	// Update mouse handling based on the configuration
	SetMouseActive(bool) {
		this.mouseActive = bool
		//document.removeEventListener("mouseover", this.onMouseOver, true)
		document.removeEventListener("mouseenter", this.onMouseEnter, true)
		document.removeEventListener("mouseleave", this.onMouseLeave, true)
		document.removeEventListener("click", this.onClick, true)
		document.removeEventListener("contextmenu", this.onContextMenu, true)

		if (this.mouseActive) {
			//document.addEventListener("mouseover", this.onMouseOver, true)
			document.addEventListener("mouseenter", this.onMouseEnter, true)
			document.addEventListener("mouseleave", this.onMouseLeave, true)
			document.addEventListener("click", this.onClick, true)
			document.addEventListener("contextmenu", this.onContextMenu, true)
		}
	}

	/*
	onMouseOver(event) {
		//if (!this.checkMouse()) return
		var elem = event.target

		if (elem.classList.contains("focusable")) {
			document.body.style.cursor = "pointer"
		} else {
			document.body.style.cursor = "default"
		}
	}*/

	//!test to optimize
	isNavigableSimple(elem) {
		if (!elem.classList || !elem.classList.contains("focusable")) {
			return false
		}
		if (typeof this._globalConfig.navigableFilter === "function") {
			if (this._globalConfig.navigableFilter(elem, "") === false) {
				return false
			}
		}
		return true
	}

	getAllNavigableElements(filterVisible = true) {
		const arr = Array.from(document.querySelectorAll(".focusable"))
		if (filterVisible) arr.filter((elem) => this.isElemVisible(elem))
		return arr
	}

	onMouseEnter(event) {
		//if (!this.checkMouse()) return
		var elem = event.target

		if (this.isNavigableSimple(elem)) {
			this.focus(elem)
			//document.documentElement.style.cursor = "pointer"
			this.runtime.mouse.setCursorStyle("pointer")
			/*
			if (document.body.style.cursor !== "pointer") {
				document.body.style.cursor = "pointer"
			}*/
		}
	}

	onMouseLeave(event) {
		//if (!this.checkMouse()) return
		var elem = event.target

		if (this._currentFocusedElement === elem) {
			this.blur()
			//document.documentElement.style.cursor = "default"
			this.runtime.mouse.setCursorStyle("default")
			/*
			if (document.body.style.cursor !== "default") {
				document.body.style.cursor = "default"
			}*/
		}
	}

	findClosestNavigableElement(elem) {
		while (elem && elem !== document.body) {
			if (this._currentFocusedElement === elem) {
				return elem
			}

			//!NOT SURE
			//! activating below allow clicking objects that are not focused yet
			//! (because currently gamepad or keys are used)
			/*
			var sectionId = this.getSectionId(elem)
			if (this.isNavigable(elem, sectionId)) {
				//focus this element
				this.focus(elem)
				//this.docus(elem, true)

				return elem
			}*/

			elem = elem.parentElement
		}
		return null
	}

	onClick(event) {
		//if (!this.checkMouse()) return
		const elem = this.findClosestNavigableElement(event.target)

		if (elem) {
			this.fireEvent(elem, "pressed")
		}
	}

	onContextMenu(event) {
		//if (!this.checkMouse()) return
		const elem = this.findClosestNavigableElement(event.target)

		if (elem) {
			this.fireEvent(elem, "rightclick")
		}
	}

	// Implement the blurElement method
	//!todo refacto to be used in the focusElement method ?
	blur() {
		const elem = this._currentFocusedElement
		if (elem) {
			var unfocusProperties = {
				nextElement: null,
				nextSectionId: null,
				direction: "mouseLeave",
				native: false,
			}
			if (!this.fireEvent(elem, "willunfocus", unfocusProperties)) {
				return false
			}
			elem.classList.remove(this.focusClass)
			this.fireEvent(elem, "unfocused", unfocusProperties, false)
			this._currentFocusedElement = null
			//do not reset the lastFocusedElement here
		}
	}

	/*****************/
	/* Core Function */
	/*****************/
	getRect(elem) {
		var cr = elem.getBoundingClientRect()
		var rect = {
			left: cr.left,
			top: cr.top,
			right: cr.right,
			bottom: cr.bottom,
			width: cr.width,
			height: cr.height,
		}
		rect.element = elem
		rect.center = {
			x: rect.left + Math.floor(rect.width / 2),
			y: rect.top + Math.floor(rect.height / 2),
		}
		rect.center.left = rect.center.right = rect.center.x
		rect.center.top = rect.center.bottom = rect.center.y
		return rect
	}

	filterOutAccessRestricted(candidates, direction) {
		return candidates.filter((candidate) => {
			// If candidate matches a rule that blocks `direction`, exclude it.
			for (let rule of this._accessRestrictions) {
				if (this.matchSelector(candidate, rule.selector)) {
					// If the candidate matches the selector AND direction is blocked:
					if (rule.blockedDirections.includes(direction)) {
						return false // Exclude from final list
					}
				}
			}
			// Otherwise keep it
			return true
		})
	}

	partition(rects, targetRect, straightOverlapThreshold) {
		var groups = [[], [], [], [], [], [], [], [], []]

		for (var i = 0; i < rects.length; i++) {
			var rect = rects[i]
			var center = rect.center
			var x, y, groupId

			if (center.x < targetRect.left) {
				x = 0
			} else if (center.x <= targetRect.right) {
				x = 1
			} else {
				x = 2
			}

			if (center.y < targetRect.top) {
				y = 0
			} else if (center.y <= targetRect.bottom) {
				y = 1
			} else {
				y = 2
			}

			groupId = y * 3 + x
			groups[groupId].push(rect)

			if ([0, 2, 6, 8].indexOf(groupId) !== -1) {
				var threshold = straightOverlapThreshold

				if (rect.left <= targetRect.right - targetRect.width * threshold) {
					if (groupId === 2) {
						groups[1].push(rect)
					} else if (groupId === 8) {
						groups[7].push(rect)
					}
				}

				if (rect.right >= targetRect.left + targetRect.width * threshold) {
					if (groupId === 0) {
						groups[1].push(rect)
					} else if (groupId === 6) {
						groups[7].push(rect)
					}
				}

				if (rect.top <= targetRect.bottom - targetRect.height * threshold) {
					if (groupId === 6) {
						groups[3].push(rect)
					} else if (groupId === 8) {
						groups[5].push(rect)
					}
				}

				if (rect.bottom >= targetRect.top + targetRect.height * threshold) {
					if (groupId === 0) {
						groups[3].push(rect)
					} else if (groupId === 2) {
						groups[5].push(rect)
					}
				}
			}
		}

		return groups
	}

	generateDistanceFunction(targetRect) {
		return {
			nearPlumbLineIsBetter: function (rect) {
				var d
				if (rect.center.x < targetRect.center.x) {
					d = targetRect.center.x - rect.right
				} else {
					d = rect.left - targetRect.center.x
				}
				return d < 0 ? 0 : d
			},
			nearHorizonIsBetter: function (rect) {
				var d
				if (rect.center.y < targetRect.center.y) {
					d = targetRect.center.y - rect.bottom
				} else {
					d = rect.top - targetRect.center.y
				}
				return d < 0 ? 0 : d
			},
			nearTargetLeftIsBetter: function (rect) {
				var d
				if (rect.center.x < targetRect.center.x) {
					d = targetRect.left - rect.right
				} else {
					d = rect.left - targetRect.left
				}
				return d < 0 ? 0 : d
			},
			nearTargetTopIsBetter: function (rect) {
				var d
				if (rect.center.y < targetRect.center.y) {
					d = targetRect.top - rect.bottom
				} else {
					d = rect.top - targetRect.top
				}
				return d < 0 ? 0 : d
			},
			topIsBetter: function (rect) {
				return rect.top
			},
			bottomIsBetter: function (rect) {
				return -1 * rect.bottom
			},
			leftIsBetter: function (rect) {
				return rect.left
			},
			rightIsBetter: function (rect) {
				return -1 * rect.right
			},
		}
	}

	prioritize(priorities) {
		var destPriority = null
		for (var i = 0; i < priorities.length; i++) {
			if (priorities[i].group.length) {
				destPriority = priorities[i]
				break
			}
		}

		if (!destPriority) {
			return null
		}

		var destDistance = destPriority.distance

		destPriority.group.sort(function (a, b) {
			for (var i = 0; i < destDistance.length; i++) {
				var distance = destDistance[i]
				var delta = distance(a) - distance(b)
				if (delta) {
					return delta
				}
			}
			return 0
		})

		return destPriority.group
	}

	// Modified the navigate method to accept an optional targetRect
	navigate(target, direction, candidates, config, targetRect) {
		if ((!target && !targetRect) || !direction || !candidates || !candidates.length) {
			return null
		}

		var rects = []
		for (var i = 0; i < candidates.length; i++) {
			var rect = this.getRect(candidates[i])
			if (rect) {
				rects.push(rect)
			}
		}
		if (!rects.length) {
			return null
		}

		// Use the provided targetRect if available
		if (!targetRect) {
			targetRect = this.getRect(target)
		}
		if (!targetRect) {
			return null
		}

		var distanceFunction = this.generateDistanceFunction(targetRect)

		var groups = this.partition(rects, targetRect, config.straightOverlapThreshold)

		var internalGroups = this.partition(groups[4], targetRect.center, config.straightOverlapThreshold)

		var priorities

		switch (direction) {
			case "left":
				priorities = [
					{
						group: internalGroups[0].concat(internalGroups[3]).concat(internalGroups[6]),
						distance: [distanceFunction.nearPlumbLineIsBetter, distanceFunction.topIsBetter],
					},
					{
						group: groups[3],
						distance: [distanceFunction.nearPlumbLineIsBetter, distanceFunction.topIsBetter],
					},
					{
						group: groups[0].concat(groups[6]),
						distance: [distanceFunction.nearHorizonIsBetter, distanceFunction.rightIsBetter, distanceFunction.nearTargetTopIsBetter],
					},
				]
				break
			case "right":
				priorities = [
					{
						group: internalGroups[2].concat(internalGroups[5]).concat(internalGroups[8]),
						distance: [distanceFunction.nearPlumbLineIsBetter, distanceFunction.topIsBetter],
					},
					{
						group: groups[5],
						distance: [distanceFunction.nearPlumbLineIsBetter, distanceFunction.topIsBetter],
					},
					{
						group: groups[2].concat(groups[8]),
						distance: [distanceFunction.nearHorizonIsBetter, distanceFunction.leftIsBetter, distanceFunction.nearTargetTopIsBetter],
					},
				]
				break
			case "up":
				priorities = [
					{
						group: internalGroups[0].concat(internalGroups[1]).concat(internalGroups[2]),
						distance: [distanceFunction.nearHorizonIsBetter, distanceFunction.leftIsBetter],
					},
					{
						group: groups[1],
						distance: [distanceFunction.nearHorizonIsBetter, distanceFunction.leftIsBetter],
					},
					{
						group: groups[0].concat(groups[2]),
						distance: [distanceFunction.nearPlumbLineIsBetter, distanceFunction.bottomIsBetter, distanceFunction.nearTargetLeftIsBetter],
					},
				]
				break
			case "down":
				priorities = [
					{
						group: internalGroups[6].concat(internalGroups[7]).concat(internalGroups[8]),
						distance: [distanceFunction.nearHorizonIsBetter, distanceFunction.leftIsBetter],
					},
					{
						group: groups[7],
						distance: [distanceFunction.nearHorizonIsBetter, distanceFunction.leftIsBetter],
					},
					{
						group: groups[6].concat(groups[8]),
						distance: [distanceFunction.nearPlumbLineIsBetter, distanceFunction.topIsBetter, distanceFunction.nearTargetLeftIsBetter],
					},
				]
				break
			default:
				return null
		}

		if (config.straightOnly) {
			priorities.pop()
		}

		var destGroup = this.prioritize(priorities)
		if (!destGroup) {
			return null
		}

		var dest = null
		if (config.rememberSource && config.previous && config.previous.destination === target && config.previous.reverse === direction) {
			for (var j = 0; j < destGroup.length; j++) {
				if (destGroup[j].element === config.previous.target) {
					dest = destGroup[j].element
					break
				}
			}
		}

		if (!dest) {
			dest = destGroup[0].element
		}

		return dest
	}

	/********************/
	/* Private Function */
	/********************/
	generateId() {
		var id
		while (true) {
			id = this._ID_POOL_PREFIX + String(++this._idPool)
			if (!this._sections[id]) {
				break
			}
		}
		return id
	}

	parseSelector(selector) {
		var result = []
		try {
			if (selector) {
				if (typeof selector === "string") {
					result = [].slice.call(document.querySelectorAll(selector))
				} else if (typeof selector === "object" && selector.length) {
					result = [].slice.call(selector)
				} else if (typeof selector === "object" && selector.nodeType === 1) {
					result = [selector]
				}
			}
		} catch (err) {
			console.error(err)
		}
		return result
	}

	matchSelector(elem, selector) {
		if (typeof selector === "string") {
			return this.elementMatchesSelector(elem, selector)
		} else if (typeof selector === "object" && selector.length) {
			return selector.indexOf(elem) >= 0
		} else if (typeof selector === "object" && selector.nodeType === 1) {
			return elem === selector
		}
		return false
	}

	getCurrentFocusedElement() {
		return this._currentFocusedElement // Updated to return the stored current focused element
	}

	extend(out) {
		out = out || {}
		for (var i = 1; i < arguments.length; i++) {
			if (!arguments[i]) {
				continue
			}
			for (var key in arguments[i]) {
				if (arguments[i].hasOwnProperty(key) && arguments[i][key] !== undefined) {
					out[key] = arguments[i][key]
				}
			}
		}
		return out
	}

	exclude(elemList, excludedElem) {
		if (!Array.isArray(excludedElem)) {
			excludedElem = [excludedElem]
		}
		for (var i = 0, index; i < excludedElem.length; i++) {
			index = elemList.indexOf(excludedElem[i])
			if (index >= 0) {
				elemList.splice(index, 1)
			}
		}
		return elemList
	}

	isNavigable(elem, sectionId, verifySectionSelector) {
		if (!elem || !sectionId || !this._sections[sectionId] || this._sections[sectionId].disabled) {
			return false
		}
		if ((elem.offsetWidth <= 0 && elem.offsetHeight <= 0) || elem.hasAttribute("disabled")) {
			return false
		}
		if (verifySectionSelector && !this.matchSelector(elem, this._sections[sectionId].selector)) {
			return false
		}

		//! might be intensive operation, why it is needed?
		// New checks for visibility and display properties

		const style = window.getComputedStyle(elem)
		if (style.visibility === "hidden") {
			return false // Exclude from navigation
		}

		if (typeof this._sections[sectionId].navigableFilter === "function") {
			if (this._sections[sectionId].navigableFilter(elem, sectionId) === false) {
				return false
			}
		} else if (typeof this._globalConfig.navigableFilter === "function") {
			if (this._globalConfig.navigableFilter(elem, sectionId) === false) {
				return false
			}
		}
		return true
	}

	getSectionId(elem) {
		for (var id in this._sections) {
			if (!this._sections[id].disabled && this.matchSelector(elem, this._sections[id].selector)) {
				return id
			}
		}
	}

	getSectionNavigableElements(sectionId) {
		return this.parseSelector(this._sections[sectionId].selector).filter((elem) => {
			return this.isNavigable(elem, sectionId)
		})
	}

	getSectionDefaultElement(sectionId) {
		var defaultElement = this.parseSelector(this._sections[sectionId].defaultElement).find((elem) => {
			return this.isNavigable(elem, sectionId, true)
		})
		if (!defaultElement) {
			return null
		}
		return defaultElement
	}

	getSectionLastFocusedElement(sectionId) {
		var lastFocusedElement = this._sections[sectionId].lastFocusedElement
		if (!this.isNavigable(lastFocusedElement, sectionId, true)) {
			return null
		}
		return lastFocusedElement
	}

	fireEvent(elem, type, details = {}, cancelable) {
		if (arguments.length < 4) {
			cancelable = true
		}

		details.playerID = this.playerIndex

		const evt = document.createEvent("CustomEvent")
		evt.initCustomEvent(this._EVENT_PREFIX + type, true, cancelable, details)
		return elem.dispatchEvent(evt)
	}

	focusElement(elem, sectionId, direction, externalCheck = true) {
		if (!elem) {
			return false
		}

		//! if move_external override function (find parent)
		if (direction && externalCheck) {
			const currentElem = this.getCurrentFocusedElement()
			let parent = currentElem

			while (parent) {
				const moveExternalFn = parent["move_" + direction + "_external"]
				if (typeof moveExternalFn === "function") {
					// Only override if the target element is NOT inside this parent
					if (!parent.contains(elem)) {
						const overrideElem = moveExternalFn.call(parent)
						if (overrideElem === "noMove") {
							return false
						} else if (overrideElem === "loop") {
							return this.focus_parentFromDir(parent, direction, this.getRect(currentElem), 5)
						} else if (overrideElem) {
							return this.focusElement(overrideElem, this.getSectionId(overrideElem), direction, false)
						}

						// If function returns nothing, fallback to default
						break
					}
				}
				parent = parent.parentElement
			}
		}

		//! if element has navRedirect function, call it
		if (typeof elem.navRedirect === "function") {
			const redirectResult = elem.navRedirect(direction)

			console.error("navRedirect", direction, redirectResult)

			if (redirectResult) {
				if (redirectResult === "noMove") {
					return false
				} else if (redirectResult instanceof HTMLElement) {
					// If it's an HTMLElement, focus it
					return this.focusElement(redirectResult, this.getSectionId(redirectResult), direction, true)
				}
			}
		}

		let currentFocusedElement = this.getCurrentFocusedElement()

		var silentFocus = () => {
			if (currentFocusedElement) {
				currentFocusedElement.classList.remove(this.focusClass)
			}
			elem.classList.add(this.focusClass)
			this._currentFocusedElement = elem
			this._lastFocusedElement = elem
			this.focusChanged(elem, sectionId)
		}

		if (this._duringFocusChange) {
			silentFocus()
			return true
		}

		this._duringFocusChange = true

		if (!this.CanMenuInteract()) {
			silentFocus()
			this._duringFocusChange = false
			return true
		}

		if (currentFocusedElement) {
			var unfocusProperties = {
				nextElement: elem,
				nextSectionId: sectionId,
				direction: direction,
				native: false,
			}
			if (!this.fireEvent(currentFocusedElement, "willunfocus", unfocusProperties)) {
				this._duringFocusChange = false
				return false
			}
			currentFocusedElement.classList.remove(this.focusClass)
			this.fireEvent(currentFocusedElement, "unfocused", unfocusProperties, false)
		}

		var focusProperties = {
			previousElement: currentFocusedElement,
			sectionId: sectionId,
			direction: direction,
			native: false,
		}
		if (!this.fireEvent(elem, "willfocus", focusProperties)) {
			this._duringFocusChange = false
			return false
		}
		elem.classList.add(this.focusClass)
		this.fireEvent(elem, "focused", focusProperties, false)

		//scroll the element into view
		elem.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" })

		this._duringFocusChange = false

		this._currentFocusedElement = elem
		this._lastFocusedElement = elem
		this.focusChanged(elem, sectionId)

		return true
	}

	isElemVisible(el) {
		while (el) {
			const style = window.getComputedStyle(el)
			if (style.display === "none" || style.visibility === "hidden") {
				return false
			}
			el = el.parentElement
		}
		return true
	}

	getFocusable_parentFromDir(parentElem, direction, currentRect = null, offset = 0) {
		if (!parentElem || !direction) return false

		const currentElem = this.getCurrentFocusedElement()
		if (!currentElem) return false

		if (!currentRect) {
			currentRect = this.getRect(currentElem)
		}

		const parentRect = this.getRect(parentElem)
		const wrappedRect = this.createWrappedRect(currentRect, direction, parentRect, offset)

		// Find focusable elements within the parent (excluding current)
		let allCandidates = this.getAllNavigableElements(false).filter((el) => parentElem.contains(el) && el !== currentElem)

		allCandidates = allCandidates.filter((el) => this.isElemVisible(el))

		const filteredCandidates = this.filterOutAccessRestricted(allCandidates, direction)
		const config = this._globalConfig

		const next = this.navigate(null, direction, filteredCandidates, config, wrappedRect)

		return next
	}

	focus_parentFromDir(parentElem, direction, currentRect = null, offset = 0) {
		const next = this.getFocusable_parentFromDir(parentElem, direction, currentRect, offset)

		if (next) {
			return this.focus(next)
		}

		return false
	}

	focusChanged(elem, sectionId) {
		if (!sectionId) {
			sectionId = this.getSectionId(elem)
		}
		if (sectionId) {
			this._sections[sectionId].lastFocusedElement = elem
			this._lastSectionId = sectionId
		}
	}

	focusExtendedSelector(selector, direction) {
		if (selector.charAt(0) == "@") {
			if (selector.length == 1) {
				return this.focusSection()
			} else {
				var sectionId = selector.substr(1)
				return this.focusSection(sectionId)
			}
		} else {
			var next = this.parseSelector(selector)[0]
			if (next) {
				var nextSectionId = this.getSectionId(next)
				if (this.isNavigable(next, nextSectionId)) {
					return this.focusElement(next, nextSectionId, direction)
				}
			}
		}
		return false
	}

	focusSection(sectionId) {
		var range = []
		var addRange = (id) => {
			if (id && range.indexOf(id) < 0 && this._sections[id] && !this._sections[id].disabled) {
				range.push(id)
			}
		}

		if (sectionId) {
			addRange(sectionId)
		} else {
			addRange(this._defaultSectionId)
			addRange(this._lastSectionId)
			Object.keys(this._sections).map(addRange)
		}

		for (var i = 0; i < range.length; i++) {
			var id = range[i]
			var next

			if (this._sections[id].enterTo == "last-focused") {
				next = this.getSectionLastFocusedElement(id) || this.getSectionDefaultElement(id) || this.getSectionNavigableElements(id)[0]
			} else {
				next = this.getSectionDefaultElement(id) || this.getSectionLastFocusedElement(id) || this.getSectionNavigableElements(id)[0]
			}

			if (next) {
				return this.focusElement(next, id)
			}
		}

		return false
	}

	fireNavigatefailed(elem, direction) {
		this.fireEvent(
			elem,
			"navigatefailed",
			{
				direction: direction,
			},
			false
		)
	}

	gotoLeaveFor(sectionId, direction) {
		if (this._sections[sectionId].leaveFor && this._sections[sectionId].leaveFor[direction] !== undefined) {
			var next = this._sections[sectionId].leaveFor[direction]

			if (typeof next === "string") {
				if (next === "") {
					return null
				}
				return this.focusExtendedSelector(next, direction)
			}

			var nextSectionId = this.getSectionId(next)
			if (this.isNavigable(next, nextSectionId)) {
				return this.focusElement(next, nextSectionId, direction)
			}
		}
		return false
	}

	checkNavigationRules(direction, currentFocusedElement) {
		for (var i = 0; i < this._navigationRules.length; i++) {
			var rule = this._navigationRules[i]
			if (this.matchSelector(currentFocusedElement, rule.selector)) {
				var allowedDirections = rule.allowedDirections
				var isAllowed = false

				if (Array.isArray(allowedDirections)) {
					isAllowed = allowedDirections.indexOf(direction) >= 0
				} else if (typeof allowedDirections === "object") {
					if (allowedDirections[direction] !== undefined) {
						isAllowed = allowedDirections[direction]
					} else {
						isAllowed = true
					}
				} else {
					isAllowed = true
				}

				if (!isAllowed) {
					// Direction is not allowed
					this.fireEvent(currentFocusedElement, "move_" + direction)
					return false
				}
			}
		}
		return true
	}

	focusNext(direction, currentFocusedElement, currentSectionId) {
		// 1) Check your normal navigation rules
		const checkNavigationRulesResult = this.checkNavigationRules(direction, currentFocusedElement)
		if (!checkNavigationRulesResult) {
			return false
		}

		// 2) Check data-sn-* override
		const extSelector = currentFocusedElement.getAttribute("data-sn-" + direction)
		if (typeof extSelector === "string") {
			if (extSelector === "" || !this.focusExtendedSelector(extSelector, direction)) {
				this.fireNavigatefailed(currentFocusedElement, direction)
				return false
			}
			return true
		}

		// 3) Gather all navigable elements
		const sectionNavigableElements = {}
		let allNavigableElements = []
		for (const id in this._sections) {
			sectionNavigableElements[id] = this.getSectionNavigableElements(id)
			allNavigableElements = allNavigableElements.concat(sectionNavigableElements[id])
		}

		// 4) Merge global + section config
		const config = this.extend({}, this._globalConfig, this._sections[currentSectionId])
		let next

		// 5) Prepare the candidate list
		const currentSectionNavigableElements = sectionNavigableElements[currentSectionId]
		let candidates

		// -- Restrict-based logic
		if (config.restrict === "self-only" || config.restrict === "self-first") {
			// Exclude current element from the same section
			candidates = this.exclude(currentSectionNavigableElements, currentFocusedElement)
			// NEW: filter out any that block incoming direction
			candidates = this.filterOutAccessRestricted(candidates, direction)

			// Attempt to find the next
			next = this.navigate(currentFocusedElement, direction, candidates, config)

			// If not found and "self-first", try all elements
			if (!next && config.restrict === "self-first") {
				candidates = this.exclude(allNavigableElements, currentSectionNavigableElements)
				// NEW: filter again
				candidates = this.filterOutAccessRestricted(candidates, direction)

				next = this.navigate(currentFocusedElement, direction, candidates, config)
			}
		} else {
			// config.restrict == "none"
			candidates = this.exclude(allNavigableElements, currentFocusedElement)
			// NEW: filter out restricted
			candidates = this.filterOutAccessRestricted(candidates, direction)

			next = this.navigate(currentFocusedElement, direction, candidates, config)
		}

		// 6) If a next element was found, handle cross-section & focus
		if (next) {
			// Remember where we came from (for "rememberSource" logic)
			this._sections[currentSectionId].previous = {
				target: currentFocusedElement,
				destination: next,
				reverse: this._REVERSE[direction],
			}

			const nextSectionId = this.getSectionId(next)

			// If we’re jumping to a new section, check leaveFor + enterTo
			if (currentSectionId !== nextSectionId) {
				const result = this.gotoLeaveFor(currentSectionId, direction)
				if (result) {
					return true
				} else if (result === null) {
					this.fireNavigatefailed(currentFocusedElement, direction)
					return false
				}

				let enterToElement
				switch (this._sections[nextSectionId].enterTo) {
					case "last-focused":
						enterToElement = this.getSectionLastFocusedElement(nextSectionId) || this.getSectionDefaultElement(nextSectionId)
						break
					case "default-element":
						enterToElement = this.getSectionDefaultElement(nextSectionId)
						break
				}
				if (enterToElement) {
					next = enterToElement
				}
			}

			return this.focusElement(next, nextSectionId, direction)
		}
		// 7) If not found, try wrapping (if enabled)
		else if (config.enableWrapping) {
			const currentRect = this.getRect(currentFocusedElement)
			const viewportSize = this.getViewportSize()
			const wrappedRect = this.createWrappedRect(currentRect, direction, viewportSize)

			// Try again from the "imaginary" wrappedRect
			if (config.restrict === "self-only" || config.restrict === "self-first") {
				candidates = this.exclude(currentSectionNavigableElements, currentFocusedElement)
				// NEW: filter restricted
				candidates = this.filterOutAccessRestricted(candidates, direction)

				next = this.navigate(null, direction, candidates, config, wrappedRect)

				if (!next && config.restrict === "self-first") {
					candidates = this.exclude(allNavigableElements, currentSectionNavigableElements)
					// NEW: filter restricted
					candidates = this.filterOutAccessRestricted(candidates, direction)

					next = this.navigate(null, direction, candidates, config, wrappedRect)
				}
			} else {
				candidates = this.exclude(allNavigableElements, currentFocusedElement)
				// NEW: filter restricted
				candidates = this.filterOutAccessRestricted(candidates, direction)

				next = this.navigate(null, direction, candidates, config, wrappedRect)
			}

			if (next) {
				this._sections[currentSectionId].previous = {
					target: currentFocusedElement,
					destination: next,
					reverse: this._REVERSE[direction],
				}

				const nextSectionId = this.getSectionId(next)
				if (currentSectionId !== nextSectionId) {
					const result = this.gotoLeaveFor(currentSectionId, direction)
					if (result) {
						return true
					} else if (result === null) {
						this.fireNavigatefailed(currentFocusedElement, direction)
						return false
					}

					let enterToElement
					switch (this._sections[nextSectionId].enterTo) {
						case "last-focused":
							enterToElement = this.getSectionLastFocusedElement(nextSectionId) || this.getSectionDefaultElement(nextSectionId)
							break
						case "default-element":
							enterToElement = this.getSectionDefaultElement(nextSectionId)
							break
					}
					if (enterToElement) {
						next = enterToElement
					}
				}

				return this.focusElement(next, nextSectionId, direction)
			}
			// If wrapping still fails, try leaveFor
			else if (this.gotoLeaveFor(currentSectionId, direction)) {
				return true
			}
		}

		// 8) If everything fails, fire navigatefailed
		this.fireNavigatefailed(currentFocusedElement, direction)
		return false
	}

	// Added method to get the viewport size
	getViewportSize() {
		return {
			width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
			height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
		}
	}

	// Added method to create the imaginary rectangle for wrapping
	createWrappedRect(currentRect, direction, containerRect, offset = 0) {
		const rect = Object.assign({}, currentRect)

		switch (direction) {
			case "left":
				rect.left = containerRect.right + offset
				rect.right = rect.left + rect.width
				break
			case "right":
				rect.right = containerRect.left - offset
				rect.left = rect.right - rect.width
				break
			case "up":
				rect.top = containerRect.bottom + offset
				rect.bottom = rect.top + rect.height
				break
			case "down":
				rect.bottom = containerRect.top - offset
				rect.top = rect.bottom - rect.height
				break
		}

		rect.center = {
			x: rect.left + Math.floor(rect.width / 2),
			y: rect.top + Math.floor(rect.height / 2),
		}
		rect.center.left = rect.center.right = rect.center.x
		rect.center.top = rect.center.bottom = rect.center.y

		return rect
	}
}
