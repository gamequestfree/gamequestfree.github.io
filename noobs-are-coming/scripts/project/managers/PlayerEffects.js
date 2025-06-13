export class PlayerEffects {
	constructor(player) {
		this.player = player

		this.playerEvents = player.events

		this.runtime = player.runtime
		this.globalEvents = this.runtime.events

		//better create dedicated events ?

		this.enabled = false

		// Define event listeners directly in the array
		this.globalEventListeners = [
			{ event: "OnUnit_Created", callback: this.RefreshLiving.bind(this, true) },
			{ event: "OnUnit_Destroyed", callback: this.RefreshLiving.bind(this, false) },
			{ event: "OnGameTick", callback: this.Tick.bind(this) },
			{ event: "On_Wave_Start", callback: this.On_Wave_Start.bind(this) },
			{ event: "On_Wave_End", callback: this.On_Wave_End.bind(this) },
		]

		this.stacks = {}

		//specific stuff
		this.isMoving = false

		this.whilesSimple = new Map()

		for (const [whileName, whileData] of Object.entries(this.runtime.itemManager.effectsEvents.simple_While)) {
			const whileDataNew = Object.assign({}, whileData)
			if (whileData.check) whileDataNew.check = whileData.check.bind(this)

			this.whilesSimple.set("While_" + whileName, whileDataNew)
		}
	}

	SetEnabled(bool) {
		if (this.enabled === bool) return
		this.enabled = bool

		this.globalEventListeners.forEach(({ event, callback }) => {
			if (this.enabled) {
				this.globalEvents.addEventListener(event, callback)
				console.error("PlayerEvent added: " + event)
			} else {
				this.globalEvents.removeEventListener(event, callback)
			}
		})
	}

	Reset() {
		this.stacks = {}
	}

	GetStack(stackName) {
		if (!this.stacks[stackName]) this.stacks[stackName] = []
		return this.stacks[stackName]
	}

	GetStackCount(stackName) {
		if (!this.stacks[stackName]) return 0
		return this.stacks[stackName].length
	}

	GetBool(stackName) {
		return this.GetStack(stackName).length > 0
	}

	GetStackValue(stackName, operation = "min", defaultValue = 0) {
		const stack = this.GetStack(stackName)
		if (stack.length === 0) return defaultValue
		let value = 0
		for (const item of stack) {
			if (operation === "min") {
				value = Math.min(value, item.value)
			} else if (operation === "max") {
				value = Math.max(value, item.value)
			} else if (operation === "sum") {
				value += item.value
			}
		}

		return value
	}

	PlayerStack_Add(name, modif) {
		if (!name) return

		const effectStack = this.GetStack(name)
		effectStack.push(modif)

		//console.error("🏆 Add stack", name, modif, effectStack)

		modif.UpdateStack()

		const whileData = this.whilesSimple.get(name)
		if (whileData && whileData.isActive) {
			modif.ActivateEffects()
		}
	}

	PlayerStack_Remove(name, modif) {
		if (!name) return
		const effectStack = this.GetStack(name)
		const index = effectStack.indexOf(modif)
		if (index > -1) {
			effectStack.splice(index, 1)
		}

		modif.UpdateStack()

		const whileData = this.whilesSimple.get(name)
		if (whileData && !whileData.isActive) {
			modif.DesactivateEffects()
		}
	}

	//*

	Tick(e) {
		if (!this.enabled) return

		this.GetStack("Every_Seconds").forEach((a) => a.Tick())
		this.GetStack("During").forEach((a) => a.Tick())

		this.Tick_Simple_While()

		/*
		//* Moving
		const moving = this.player.unit?.moveComp.isMoving
		if (moving !== undefined && moving !== this.isMoving) {
			this.isMoving = moving
			if (moving) {
				this.On_Move_Start()
			} else {
				this.On_Move_End()
				//window.alert("On_Move_End")
			}
		}

		//* Facing
		const isFacingRight = this.player.unit?.charaComp?.isFacingRight
		if (isFacingRight !== undefined && isFacingRight !== this.isFacingRight) {
			this.isFacingRight = isFacingRight
			if (isFacingRight) {
				this.On_Facing_Right()
			} else {
				this.On_Facing_Left()
			}
		}*/
	}

	Tick_Simple_While() {
		for (const [whileName, whileData] of this.whilesSimple.entries()) {
			if (whileData.check) {
				const check = whileData.check()
				const wasActive = whileData.isActive
				whileData.isActive = check
				if (wasActive !== whileData.isActive) {
					//console.error("🏆", whileName, check)
					if (check) {
						if (whileData.onStart) {
							this.playerEvents.dispatchEvent(whileData.onStart)
							if (typeof this[whileData.onStart] === "function") {
								this[whileData.onStart]()
							}
						}
					} else {
						if (whileData.onEnd) {
							this.playerEvents.dispatchEvent(whileData.onEnd)
							if (typeof this[whileData.onEnd] === "function") {
								this[whileData.onEnd]()
							}
						}
					}

					if (check) this.GetStack(whileName).forEach((a) => a.ActivateEffects())
					else this.GetStack(whileName).forEach((a) => a.DesactivateEffects())

					if (whileData.opposite) {
						/*if (whileData.opposite === "Standing") {
							Utils.debugText("🏆" + whileData.opposite + !check)
						}*/
						const oppositeWhile = "While_" + whileData.opposite
						if (check) this.GetStack(oppositeWhile).forEach((a) => a.DesactivateEffects())
						else this.GetStack(oppositeWhile).forEach((a) => a.ActivateEffects())
					}
				}
			}

			const whileStack = this.GetStack(whileName)
			if (whileStack.length === 0) continue
		}
	}

	Update_Type_Mod() {
		this.typeMods = {}
		const stack = this.GetStack("Type_Mod")
		for (const modif of stack) {
			const type = modif.mainType
			if (!this.typeMods[type]) this.typeMods[type] = {}
			this.typeMods[type][modif.tag] = modif
		}


	}

	TriggerHitEvent(name, unit) {
		this.player.UID_AffectedUnit = unit.uid
		this.player.events.dispatchEventString(name)
	}

	TriggerPlayerEvent(name) {
		this.player.events.dispatchEventString(name)
		//trigger Stack if any
		//this.GetStack(name)?.forEach((a) => a.ActivateEffects())

		if (typeof this[name] === "function") {
			this[name]()
		}
	}

	On_Wave_Start(e) {
		this.GetStack("Every_Seconds").forEach((a) => a.Reset())

		this.GetStack("Action_Spawn").forEach((a) => a.On_Wave_Start())
	}

	On_Wave_End(e) {
		this.GetStack("During").forEach((a) => a.OnRemoved_())

		this.GetStack("Action_Spawn").forEach((a) => a.On_Wave_End())
	}

	/*
	On_Move_Start() {
		this.playerEvents.dispatchEvent("On_Move_Start")
		this.GetStack("While_Moving").forEach((a) => a.ActivateEffects())
		this.GetStack("While_Standing").forEach((a) => a.DesactivateEffects())
	}

	On_Move_End() {
		this.playerEvents.dispatchEvent("On_Move_End")
		this.GetStack("While_Moving").forEach((a) => a.DesactivateEffects())
		this.GetStack("While_Standing").forEach((a) => a.ActivateEffects())
	}*/

	On_Circle_Inside() {
		const playerInst = this.player.inst
		this.runtime.pointburst.CreatePointBurst_Icon("", playerInst.x, playerInst.y - 50, "", "U_Pentagram")

		const circleSparkFx = this.runtime.pool.CreateInstance("FX_Sparks_Grayscale", "FX_Ahead", playerInst.x, playerInst.y - 30)

		playerInst.addChild(circleSparkFx, {
			transformX: true,
			transformY: true,
			destroyWithParent: true,
		})
	}

	On_Circle_Outside() {
		const playerInst = this.player.inst

		const circleSparkFx = Utils.World_GetChild(playerInst, "FX_Sparks_Grayscale")
		if (circleSparkFx) {
			circleSparkFx.destroy()
		}
	}

	//add/remove item/entityTag

	RefreshLiving(created, event) {
		const charaUnit = event.unit
		/*
		for (const everyEquip of this.For_Every_Living) {
			item.Refresh()
		}*/
	}

	RefreshEquip() {
		for (const everyEquip of this.For_Every_Equip) {
			everyEquip
		}
	}

	//* VALUES *//

	Get_HP_MissingPercent() {
		const healthComp = this.player.unit.healthComp
		const missingPercent = Math.floor(healthComp.GetPercentMissing())
		return
	}

	Get_HP_Percent() {
		const healthComp = this.player.unit.healthComp
		const missingPercent = Math.floor(healthComp.GetPercent())
		return
	}

	Get_Coins() {
		return this.player.coins
	}
}
