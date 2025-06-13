class ArrayC3 {
	constructor(o) {
		const sz = o["size"]
		this._cx = sz[0]
		this._cy = sz[1]
		this._cz = sz[2]
		this._arr = o["data"]
	}

	At(x, y, z) {
		x = Math.floor(x)
		y = Math.floor(y)
		z = Math.floor(z)
		if (x >= 0 && x < this._cx && y >= 0 && y < this._cy && z >= 0 && z < this._cz) return this._arr[x][y][z]
		else return 0
	}
}

const keyInputs = {
	0: 48,
	1: 49,
	2: 50,
	3: 51,
	4: 52,
	5: 53,
	6: 54,
	7: 55,
	8: 56,
	9: 57,
	backspace: 8,
	tab: 9,
	enter: 13,
	shift: 16,
	ctrl: 17,
	alt: 18,
	pause: 19,
	"caps lock": 20,
	escape: 27,
	space: 32,
	"page up": 33,
	"page down": 34,
	end: 35,
	home: 36,
	left: 37,
	up: 38,
	right: 39,
	down: 40,
	insert: 45,
	delete: 46,
	":": 58,
	";": 59,
	"<": 60,
	"=": 61,
	a: 65,
	b: 66,
	c: 67,
	d: 68,
	e: 69,
	f: 70,
	g: 71,
	h: 72,
	i: 73,
	j: 74,
	k: 75,
	l: 76,
	m: 77,
	n: 78,
	o: 79,
	p: 80,
	q: 81,
	r: 82,
	s: 83,
	t: 84,
	u: 85,
	v: 86,
	w: 87,
	x: 88,
	y: 89,
	z: 90,
	windows: 91,
	"right window key": 92,
	select: 93,
	num0: 96,
	num1: 97,
	num2: 98,
	num3: 99,
	num4: 100,
	num5: 101,
	num6: 102,
	num7: 103,
	num8: 104,
	num9: 105,
	multiply: 106,
	add: 107,
	subtract: 109,
	"decimal point": 110,
	divide: 111,
	f1: 112,
	f2: 113,
	f3: 114,
	f4: 115,
	f5: 116,
	f6: 117,
	f7: 118,
	f8: 119,
	f9: 120,
	f10: 121,
	f11: 122,
	f12: 123,
	"num lock": 144,
	"scroll lock": 145,
	")": 169,
	"*": 170,
	"semi-colon": 186,
	"equal sign": 187,
	comma: 188,
	dash: 189,
	period: 190,
	"/": 191,
	"grave accent": 192,
	"open bracket": 219,
	"back slash": 220,
	"close braket": 221,
	"single quote": 222,
	"²": 222,
}

const mouseInputs = {
	mouse_left: "mouse_left",
	mouse_right: "mouse_right",
	mouse_middle: "mouse_middle",
	mouse_scroll_up: "mouse_scroll_up",
	mouse_scroll_down: "mouse_scroll_down",
	mouse_move: "mouse_move",
}

const gamepadInputs = {
	south: "b_0",
	east: "b_1",
	west: "b_2",
	north: "b_3",
	LB: "b_4",
	RB: "b_5",
	LT: "b_6",
	RT: "b_7",
	select: "b_8",
	start: "b_9",
	LS_click: "b_10",
	RS_click: "b_11",
	dpad_up: "b_12",
	dpad_down: "b_13",
	dpad_left: "b_14",
	dpad_right: "b_15",
	//those codes below aren't useful (Stick triggers are done directly in this plugin code)

	LS_up: "a_1;-1",
	LS_down: "a_1;1",
	LS_left: "a_0;-1",
	LS_right: "a_0;1",
	RS_up: "a_3;-1",
	RS_down: "a_3;1",
	RS_left: "a_2;-1",
	RS_right: "a_2;1",
}

export class Input_Manager {
	constructor(runtime) {
		this.runtime = runtime

		this.init = false

		this.gamepadDeadzone = 0.2

		this.gamepadTriggerzone = 0.8

		this.lastInputType = ""
		this.lastInput = ""

		this.lastInput_isMouseKeyboard = false
		this.lastInput_wasMouseKeyboard = false

		this.nameToCode = Object.assign({}, keyInputs, mouseInputs, gamepadInputs)
		//for each gamepad
		for (let i = 0; i < 4; i++) {
			for (const [key, value] of Object.entries(gamepadInputs)) {
				// Create a new key and value with the gamepad index
				const newKey = `${key}|${i}`
				const newValue = `${value}|${i}`

				// Add to the nameToCode mapping
				this.nameToCode[newKey] = newValue
			}
		}

		this.codeToName = Object.fromEntries(Object.entries(this.nameToCode).map(([key, value]) => [value, key]))
		this.buttons = {}
		this.actions = {}
		this.gamepads = []

		this.loadedFiles = new Set()

		this.downButtons_actual = new Set()
		this.last_pressed = new Set()
		this.last_onlyPressed = new Set()
		this.last_released = new Set()

		//automated joystick
		this.joysticks = new Map()

		this.uid_mainListener = 0

		/*console.error("Input Manager", this)
		console.error("Joysticks", this.joysticks)*/

		this.runtime.addEventListener("beforeprojectstart", (e) => {
			this.On_Before_ProjectStart()
		})
	}

	On_Before_ProjectStart() {
		this.mousePlugin = this.runtime.mouse

		this.touchPlugin = this.runtime.touch

		this.keyboardPlugin = this.runtime.keyboard

		if (C3.Plugins.gamepad) {
			this.gamepadPlugin = this.GetSingleGlobalByCtor(C3.Plugins.gamepad)

			console.error("Gamepad Plugin", this.gamepadPlugin)

			this.Gamepad = {}

			this.Gamepad.GamepadCount = C3.Plugins.gamepad.Exps.GamepadCount.bind(this.gamepadPlugin)
			this.Gamepad.RawAxis = C3.Plugins.gamepad.Exps.RawAxis.bind(this.gamepadPlugin)

			const inputManager = this

			//* listen for gamepad pressed
			/*
            this.gamepadPlugin._OnGamepadInputUpdate = function (data) {

                const index = data["index"]
                if (!this._gamepads.has(index)) this._OnGamepadConnected(data)
                const info = this._gamepads.get(index)
                info.Update(data["buttons"], data["axes"])
                for (let i = 0, len = info.GetButtonCount(); i < len; ++i) {
                    if (info.HasButtonBecomePressed(i)) {
                        this._lastButton = i
                        console.error("Last Button is Gamepad", this._lastButton)
                    }
                }
            }.bind(this.gamepadPlugin)*/
		}

		this.Request_Config("defaultControls.json")

		this.runtime.addEventListener("tick", (e) => {
			this.Tick()
			this.Tick2()
		})
	}

	async Request_Config(url) {
		if (this.loadedFiles.has(url)) return

		this.loadedFiles.add(url)

		// Get the correct URL to fetch
		const textFileUrl = await this.runtime.assets.getProjectFileUrl(url)

		// Now fetch that URL normally
		const response = await fetch(textFileUrl)
		const responseJson = await response.json()
		this.configJson = new ArrayC3(responseJson)

		const arr = this.configJson

		//*Default Profiles
		this.profilesDefault = {}

		//for each profiles (X column)
		for (let x = 2; x < arr._cx; x++) {
			const tokenColumn = arr.At(x, 0, 0).split("_")
			const profileString = tokenColumn[0]
			let variantString = null
			if (profileString === "") continue

			//profiles main

			let profileVariant

			if (tokenColumn.length === 1) {
				profileVariant = this.getOrSet(this, ["profilesDefault", profileString, "actions"], {})
			}
			//profiles variants
			if (tokenColumn.length === 2) {
				variantString = tokenColumn[1]
				profileVariant = this.getOrSet(this, ["profilesDefault", profileString, "variants", variantString, "actions"], {})
			}

			//for each action (Y row)
			for (let y = 1; y < arr._cy; y++) {
				const actionString = arr.At(0, y, 0)
				let inputString = arr.At(x, y, 0)
				let canReassign = false
				if (inputString === "") continue
				if (typeof inputString === "number") inputString = inputString.toString()
				if (inputString.includes("!")) {
					inputString = inputString.replace("!", "")
					canReassign = true
				}
				if (!this.nameToCode[inputString]) {
					console.error("InputSystem: [", inputString, "] input Name does not match an Input Code")
					continue
				}

				let button
				button = this.getOrSet(profileVariant, [actionString, inputString], {})

				if (canReassign) button.CanReassign = canReassign
			}
		}

		//*Active Profiles

		//just copy the default profiles
		this.profiles = JSON.parse(JSON.stringify(this.profilesDefault))

		for (const [profileName, profile] of Object.entries(this.profiles)) {
			this._InitProfile(profile)
		}

		//* MULTIPLAYER

		//Gamepad specific
		for (let gamepadId = 0; gamepadId < 4; gamepadId++) {
			this._InitProfile(this.profiles["GAMEPAD"], gamepadId)
		}

		//Mouse/Keyboard specific

		this._InitProfile(this.profiles["KEY"], "KEY")

		this.init = true
	}

	On_Input_Init() {
		return true
	}

	_InitProfile(profile, id = null) {
		for (const [actionName, action] of Object.entries(profile.actions)) {
			for (const [inputName, input] of Object.entries(action)) {
				const inputNameWithID = id === null ? inputName : `${inputName}|${id}`
				const actionNameWithID = id === null ? actionName : `${actionName}|${id}`
				const buttonActions = this.getOrSet(this, ["buttons", inputNameWithID, "actions"], [])
				buttonActions.push(actionNameWithID)
			}
		}
		if (!profile.variants) return
		for (const [variantName, variant] of Object.entries(profile.variants)) {
			this._InitProfile(variant, id)
		}
	}

	Tick() {
		//for all downButtons_actual
		for (const button of this.downButtons_actual) {
			for (const action of button.actions) {
				this.TriggerEvent("On_" + action + "_Down")
			}
		}
		if (this.gamepadPlugin) {
			//for (let gamepadId = 0; gamepadId < this.Gamepad.GamepadCount(); gamepadId++)
			for (let gamepadId = 0; gamepadId < 4; gamepadId++) {
				//window.alert("Gamepad " + this.Gamepad.GamepadCount())
				//if (gamepadId !== 0) continue
				let gamepad
				if (this.gamepads[gamepadId]) {
					gamepad = this.gamepads[gamepadId]
				} else {
					gamepad = {
						ID: gamepadId,
						LS_active: false,
						LS_angle: 0,
						LS_x: 0,
						LS_y: 0,
						RS_active: false,
						RS_angle: 0,
						RS_x: 0,
						RS_y: 0,
						isActive: false,
						wasActive: false,
					}
					this.gamepads.push(gamepad)
				}
				gamepad.LS_x = this.Gamepad.RawAxis(gamepadId, 0)
				gamepad.LS_y = this.Gamepad.RawAxis(gamepadId, 1)
				gamepad.RS_x = this.Gamepad.RawAxis(gamepadId, 2)
				gamepad.RS_y = this.Gamepad.RawAxis(gamepadId, 3)

				if (Math.abs(gamepad.LS_x) > this.gamepadDeadzone || Math.abs(gamepad.LS_y) > this.gamepadDeadzone) {
					gamepad.LS_active = true
					gamepad.LS_angle = C3.toDegrees(Math.atan2(gamepad.LS_y, gamepad.LS_x))
				} else gamepad.LS_active = false

				if (Math.abs(gamepad.RS_x) > this.gamepadDeadzone || Math.abs(gamepad.RS_y) > this.gamepadDeadzone) {
					gamepad.RS_active = true
					gamepad.RS_angle = C3.toDegrees(Math.atan2(gamepad.RS_y, gamepad.RS_x))
				} else gamepad.RS_active = false

				//! should trigger zone differs from deadzone ? (triggerZone = 0.55?)

				// Left Stick Handling
				this.HandleStickDirection(gamepad, "LS_right", gamepad.LS_x > this.gamepadTriggerzone)
				this.HandleStickDirection(gamepad, "LS_left", gamepad.LS_x < -this.gamepadTriggerzone)
				this.HandleStickDirection(gamepad, "LS_down", gamepad.LS_y > this.gamepadTriggerzone)
				this.HandleStickDirection(gamepad, "LS_up", gamepad.LS_y < -this.gamepadTriggerzone)

				// Right Stick Handling
				this.HandleStickDirection(gamepad, "RS_right", gamepad.RS_x > this.gamepadTriggerzone)
				this.HandleStickDirection(gamepad, "RS_left", gamepad.RS_x < -this.gamepadTriggerzone)
				this.HandleStickDirection(gamepad, "RS_down", gamepad.RS_y > this.gamepadTriggerzone)
				this.HandleStickDirection(gamepad, "RS_up", gamepad.RS_y < -this.gamepadTriggerzone)

				gamepad.wasActive = gamepad.isActive
				gamepad.isActive = false
			}

			this.Tick_Joysticks()

			this.Tick_MouseOnly()
		}
	}

	Tick_MouseOnly() {
		if (!this.runtime.settings["Mouse_Only"]) return

		for (const player of this.runtime.players) {
			if (player.inputID === "KEY" || player.inputID === null) {
				const joystick = this.joysticks.get("Move" + player.playerIndex)

				if (!joystick) continue
				//window.alert("It Works")
				const inst = player.inst
				if (!inst) continue
				const layerName = inst.layer.name
				const mousePos = this.mousePlugin.getMousePosition(layerName)
				joystick.isActive = true
				joystick.angle = C3.toDegrees(C3.angleTo(inst.x, inst.y, mousePos[0], mousePos[1]))

				if (this.mousePlugin.isMouseButtonDown(0)) {
					joystick.isActive = false
				}
			}
		}
	}

	Tick_Joysticks() {
		for (const [key, joystick] of this.joysticks) {
			joystick.isActive = false

			if (joystick.gamepad && this.lastInputType === "Gamepad") {
				const gamepadIndex = typeof joystick.inputID === "number" ? joystick.inputID : 0
				const gamepad = this.gamepads[gamepadIndex]
				//todo for SinglePlayer : detect the last gamepad used

				if (gamepad) {
					/*console.error("joystick", joystick)
					console.error("gamepad", gamepad)*/

					if (joystick.gamepad === "LS") {
						joystick.isActive = gamepad.LS_active
						joystick.angle = gamepad.LS_angle
						continue
					} else if (joystick.gamepad === "RS") {
						joystick.isActive = gamepad.RS_active
						joystick.angle = gamepad.RS_angle
						continue
					}
				}
			}

			if (joystick.mouse) {
				if (this.mainListener) {
					const inst = this.runtime.getInstanceByUid(this.mainListener)
					if (inst) {
						const layerName = inst.layer.name
						const mousePos = this.mousePlugin.getMousePosition(layerName)
						joystick.isActive = true
						joystick.angle = C3.toDegrees(C3.angleTo(inst.x, inst.y, mousePos[0], mousePos[1]))
						continue
					}
				}
			}

			if (joystick.actionID) {
				const suffix = joystick.inputID === null || joystick.inputID === undefined ? "" : "|" + joystick.inputID
				if (suffix === "") {
					/*console.error("joystick", joystick)
                    window.alert("WTF")*/
				}
				const vertical =
					(this.Is_Down(joystick.actionID + "_Up" + suffix) ? -1 : 0) + (this.Is_Down(joystick.actionID + "_Down" + suffix) ? 1 : 0)

				const horizontal =
					(this.Is_Down(joystick.actionID + "_Left" + suffix) ? -1 : 0) + (this.Is_Down(joystick.actionID + "_Right" + suffix) ? 1 : 0)
				if (vertical !== 0 || horizontal !== 0) joystick.isActive = true
				joystick.angle = C3.toDegrees(Math.atan2(vertical, horizontal))
				continue
			}
		}
	}

	Tick2() {
		for (const button of this.last_pressed) {
			this.Set_Button_State(button, 2)
		}
		for (const button of this.last_onlyPressed) {
			this.Set_Button_State(button, 0)
		}
		for (const button of this.last_released) {
			this.Set_Button_State(button, 0)
		}

		this.last_pressed.clear()
		this.last_onlyPressed.clear()
		this.last_released.clear()
	}

	//#region new Funcs

	HandleStickDirection(gamepad, buttonName, isActive) {
		// Store previous state

		if (isActive) {
			gamepad.isActive = true
			// Update state only if it's not already active
			if (!gamepad.wasActive) {
				this.Set_Button_State_Gamepad(gamepad, buttonName, 3)
			} else {
				this.Set_Button_State_Gamepad(gamepad, buttonName, 2)
			}
		} else {
			if (gamepad.wasActive) {
				this.Set_Button_State_Gamepad(gamepad, buttonName, 1)
			}
		}
	}
	//#endregion

	//Joystick
	//* scripting only
	Create_Joystick_WithID(id, joyName, gamepadStick, actionID, mouseStick = null) {
		//const joyNameWithID = id !== null ? `${joyName}|${id}` : joyName
		if (id === "KEY") gamepadStick = null
		if (typeof id === "number") mouseStick = null

		const joystick = {}

		this.joysticks.set(joyName, joystick)

		joystick.lerpValue = 0

		joystick.inputID = id
		joystick.gamepad = gamepadStick // "LS" or "RS" or null
		joystick.actionID = actionID
		joystick.mouse = mouseStick // "Origin" or "BBoxMid" or null
	}

	//* eventsheet only
	Create_Joystick(joyName, gamepadStick, actionID, mouseStick) {
		const joystick = {}

		this.joysticks.set(joyName, joystick)

		joystick.lerpValue = 0

		if (gamepadStick === 0) joystick.gamepad = "LS"
		else if (gamepadStick === 1) joystick.gamepad = "RS"
		else if (gamepadStick === 2) joystick.gamepad = null

		if (actionID) joystick.actionID = actionID

		if (mouseStick === 0) joystick.mouse = null
		else if (mouseStick === 1) joystick.mouse = "Origin"
		else if (mouseStick === 2) joystick.mouse = "BBoxMid"
	}

	Map_Joystick(joyName, joystick) {
		//
	}

	Set_Main_Listener(objectClass) {
		const pickedInstances = objectClass.GetCurrentSol().GetInstances()
		if (pickedInstances.length === 0) return
		this.mainListener = pickedInstances[0].GetUID()
	}

	//useful for scripting
	Set_Main_Listener_UID(uid) {
		this.mainListener = uid
	}

	Joy_Angle(joyName) {
		const joystick = this.joysticks.get(joyName)
		if (!joystick) return 0
		if (!joystick.angle) return 0
		return joystick.angle
	}

	Joystick_IsActive(joyName) {
		const joystick = this.joysticks.get(joyName)
		return joystick.isActive
	}

	Input_Update(inputCode, action) {
		const buttonName = this.codeToName[inputCode]
		if (!buttonName) {
			console.error("InputSystem: [", inputCode, "] input Code doesn't have input Name")
			return
		}
		const button = this.buttons[buttonName]
		if (!button) {
			return //this input is not associated to any action
		}
		let state
		let onlyPressed = false

		//*PRESSED
		if (action === 0 || action === "Pressed") state = 3
		//*IF ONLY PRESSED
		else if (action === 1 || action === "OnlyPressed") state = 4
		//*RELEASED
		else if (action === 2 || action === "Released") state = 1

		this.Set_Button_State(buttonName, state)

		if (!inputCode.startsWith("a_") && !inputCode.startsWith("b_")) {
			//window.alert("Also launch key")
			this.Set_Button_State(buttonName + "|KEY", state)
		}
	}

	Set_Button_State_Gamepad(gamepad, buttonName, state) {
		const button = this.buttons[buttonName]
		if (!button) return

		this.Set_LastInputType("Gamepad")
		this.Set_Button_State(buttonName, state)

		const buttonNameWithID = `${buttonName}|${gamepad.ID}`
		this.Set_Button_State(buttonNameWithID, state)
	}

	Is_Button_Down(buttonName) {
		const button = this.buttons[buttonName]
		if (!button) {
			window.alert("Button not found")
			return false
		}
		return button.value >= 2
	}

	Set_Button_State(buttonName, state) {
		const button = this.buttons[buttonName]
		if (!button) return

		if (state === 2) this.downButtons_actual.add(button)
		else this.downButtons_actual.delete(button)

		if (state === 3) {
			this.last_pressed.add(buttonName)
		} else if (state === 1) {
			this.last_released.add(buttonName)
		} else if (state === 4) {
			this.last_onlyPressed.add(buttonName)
		}

		if (state === 4) state = 3
		if (state === 3) this.Set_LastInput(buttonName)

		button.value = state
		/*
        if (button.value !== 0) {
            console.error("Button", buttonName, button.value)
        }*/
		for (const action of button.actions) {
			this.Set_Action_State(action, state)
		}
	}

	Set_Action_State(actionName, state) {
		this.actions[actionName] = state
		this.actionTriggered = actionName
		if (state === 3) {
			this.Trigger("On_Pressed")
			this.TriggerEvent("On_" + actionName + "_Pressed")
		} else if (state === 1) {
			this.Trigger("On_Released")
			this.TriggerEvent("On_" + actionName + "_Released")
		}

		//if (actionName === "Up_Move") console.error("Up_Move", state)
	}

	Set_LastInput(input) {
		this.lastInput = input
		if (keyInputs[input]) {
			this.Set_LastInputType("Keyboard")
		} else if (mouseInputs[input]) {
			this.Set_LastInputType("Mouse")
		} else if (gamepadInputs[input]) {
			this.Set_LastInputType("Gamepad")
		}
	}

	Set_LastInputType(lastInputType) {
		if (this.lastInputType !== lastInputType) {
			this.lastInputType = lastInputType
			this.lastInput_isMouseKeyboard = true

			if (lastInputType === "Mouse") {
				//
			}
			if (lastInputType === "Keyboard") {
				//
			}
			if (lastInputType === "Gamepad") {
				this.lastInput_isMouseKeyboard = false
			}

			this.Trigger("On_LastInputType")
			this.TriggerEvent("On_LastInputType")

			this.lastInput_wasMouseKeyboard = this.lastInput_isMouseKeyboard
		}
	}

	On_LastInputType(lastCombo) {
		if (lastCombo === 0 && this.lastInputType === "Gamepad") return true
		if (lastCombo === 1 && this.lastInputType === "Mouse") return true
		if (lastCombo === 2 && this.lastInputType === "Keyboard") return true
		// careful not the same to check "ON" and "IS"
		if (lastCombo === 3 && !this.lastInput_wasMouseKeyboard && this.lastInput_isMouseKeyboard) return true
	}

	Is_LastInputType(lastCombo) {
		if (lastCombo === 0 && this.lastInputType === "Gamepad") return true
		if (lastCombo === 1 && this.lastInputType === "Mouse") return true
		if (lastCombo === 2 && this.lastInputType === "Keyboard") return true
		// careful not the same to check "ON" and "IS"
		if (lastCombo === 3 && this.lastInput_isMouseKeyboard) return true
	}

	LastInput() {
		return this.lastInput
	}

	LastInputType() {
		return this.lastInputType
	}

	GetActionState(action) {
		return this.actions[action]
	}

	Is_Down(action) {
		if (!this.actions[action]) return false
		return this.actions[action] >= 2
	}

	Input_Init() {
		return true
	}

	// ======= UTILS =======

	GetSingleGlobalByCtor(ctor) {
		if (!ctor) return null
		return sdk_runtime.GetSingleGlobalObjectClassByCtor(ctor)?.GetSingleGlobalInstance()?.GetSdkInstance()
	}

	set(obj, path, value, override = true) {
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

	getOrSet(obj, path, defaultValue) {
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

	TriggerEvent(eventName) {
		if (this.runtime.events) {
			this.runtime.events.dispatchEventString("Input", { name: eventName })
		}
	}

	//azea

	Release() {
		super.Release()
	}

	Trigger(method) {
		//
	}

	GetScriptInterfaceClass() {
		return scriptInterface
	}
}
