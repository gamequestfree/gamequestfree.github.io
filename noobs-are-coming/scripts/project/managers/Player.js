import { Inventory } from "../inventory/Inventory.js"
import { Shop } from "../inventory/Shop.js"
import { ShopStats } from "../inventory/ShopStats.js"
import { Tooltip } from "../inventory/Tooltip.js"
import { SpatialNavigation } from "../inventory/SpatialNavigation.js"
import { Stats } from "../inventory/Stats.js"

import { EventDispatcher } from "./EventDispatcher.js"
import { PlayerEffects } from "./PlayerEffects.js"
import { UtilsColors_ } from "./UtilsColors_.js"

export class Player {
	constructor(runtime, playerIndex, inputID = null) {
		this.runtime = runtime
		this.runtime.players.push(this)
		this.playerIndex = playerIndex
		this.isPlayer0 = this.playerIndex === 0

		this.startRun_chara = null
		this.startRun_wep = null

		this.events = new EventDispatcher(this.runtime)
		this.globalEvents = this.runtime.events

		this.invincibleCheat = false

		this.synergies = {}
		this.waves_equipedAtks = {}

		this.loadingRunData = null

		this.level = 1
		this.xp_current = 0
		this.xp_required = 100

		this.charaClass = "Player"

		const colorKey = "Player" + this.playerIndex
		this.color = this.runtime.tierColors[colorKey]
		this.colorDark = this.runtime.tierColors[colorKey + "_DARK"]
		this.colorAlpha = this.runtime.tierColors[colorKey + "_ALPHA"]
		this.colorBack = this.runtime.tierColors[colorKey + "_BACK"]
		this.color_ = this.color
		this.colorDark_ = this.colorDark
		this.colorAlpha_ = this.colorAlpha
		this.colorBack_ = this.colorBack

		this.colorMultiBack = this.colorBack_

		this.runtime.addEventListener("beforeprojectstart", (e) => this.BeforeProjectStart(e))
		this.runtime.events.addEventListener("On_Wave_Start", () => this.On_Wave_Start())
		this.runtime.events.addEventListener("On_Wave_End", () => this.On_Wave_End())

		this.input = this.runtime.input

		this.joyMoveName = "Move" + this.playerIndex
		this.joyAimName = "Aim" + this.playerIndex

		this.forceMove = false

		this.SetInputID(inputID)

		this.eventListeners = [
			{ event: "tick", callback: this.Tick_Menu.bind(this) },
			{ event: "OnGameStart", callback: this.OnGameStart.bind(this) },
			{ event: "OnGameTick", callback: this.Tick_Game.bind(this) },
			{ event: "Input", callback: this.OnInputEvent.bind(this) },
		]
	}

	MapItemsToData(items) {
		const itemsData = items.map((item) => [item.name, item.evolution, item.quantity])
		return itemsData
	}

	GetSavePlayerData() {
		const playerData = {
			character: this.startRun_chara.name,
			inv_items: this.MapItemsToData(this.inventory.items),
			inv_weps: this.MapItemsToData(this.inventoryWeps.items),
			inv_invisible: this.MapItemsToData(this.inventoryInvisible.items),
			Level: this.level,
			XP: this.xp_current,
			coins: this.coins,
			//shopStats
			levelUps: this.shopStats.levelUps,
			itemFounds: this.shopStats.itemFounds,
			itemFounds_Legendary: this.shopStats.itemFounds_Legendary,
		}

		//remove chara from items

		if (playerData.inv_items.length > 0 && playerData.inv_items[0][0] === this.startRun_chara.name) {
			console.error("Remove Chara from items in saveData", this.startRun_chara.name)
			playerData.inv_items.shift()
		}

		return playerData
	}

	Reset() {
		//! FORGETTING THIS BROKE RESTART (!!!!)

		if (this.isPlayer0) {
			this.runtime.progress.newItemsUnlocked = []
		}

		this.pickerComp = null

		this.level = 1
		this.xp_current = 0
		this.XP_RequiredUpdate()
		this.powerBar = null

		this.synergies = {}
		this.waves_equipedAtks = {}

		this.coinElem_game = null

		this.events.ClearEvents()
		this.effects.Reset()
		this.shop.Reset()
		this.shopStats.Reset()
		this.inventory.Reset()
		this.inventoryWeps.Reset()
		this.inventoryInvisible.Reset()
		this.stats.Reset()

		this.inventoryWeps.SetSlotCount(6)
	}

	Update_CoinPortal(value = null) {
		if (!this.runtime.coinPortal_actual) this.runtime.coinPortal_actual = 0
		if (value !== null) this.runtime.coinPortal_actual = value

		const soulsPortalElem = this.coinElem_soulPortal.getElement()

		//soulsPortalElem.querySelector("#soulPortalText").innerHTML = this.runtime.coinPortal_actual

		let text = this.runtime.translation.Get("HUD_SoulPortal")

		text = text.replace("{x}", this.runtime.coinPortal_actual)
		text = ` (${text})`

		soulsPortalElem.querySelector("#soulPortalInfo").innerHTML = text

		if (this.runtime.coinPortal_actual === 0) {
			this.coinElem_soulPortal.isVisible = false
		} else {
			this.coinElem_soulPortal.isVisible = true
		}
	}

	ActivatePlayerframe(isLeft = true) {
		//*PlayerFrame

		this.playerFrame_game = this.runtime.objects["HTML_PlayerFrame"].createInstance("HUD_HTML", 0, 0)

		const playerFrameElem = this.playerFrame_game.getElement()

		playerFrameElem.innerHTML = /*html*/ `
        <div class="itemBox" style="">
            <img src="${this.startRun_chara.img}" draggable="false" 
                onerror="this.onerror=null; this.src='random_icon.png';">
            ${0 > 1 ? `<div class="itemQuantity">x${item.quantity}</div>` : ""}
        </div>
        `

		const itemBox = playerFrameElem.querySelector(".itemBox")

		//this.runtime.style.Elem_ItemStyle(itemBox, "Player" + this.playerIndex)
		this.runtime.style.Elem_ItemStyleFrame(itemBox)

		//this.coinElem_game.removeFromParent()
		if (isLeft) {
			const bar_bbox = this.bar_HP.getBoundingBox()
			this.playerFrame_game.setPosition(bar_bbox.left, bar_bbox.top)
			const frame_bbox = this.playerFrame_game.getBoundingBox()

			this.bar_HP.setPosition(frame_bbox.right + bar_bbox.width / 2 + 4, this.bar_HP.y)
		} else {
			const bar_bbox = this.bar_HP.getBoundingBox()
			const frame_bbox = this.playerFrame_game.getBoundingBox()
			this.playerFrame_game.setPosition(bar_bbox.right - frame_bbox.width, bar_bbox.top)

			const frame_bbox_updated = this.playerFrame_game.getBoundingBox()
			this.bar_HP.setPosition(frame_bbox_updated.left - bar_bbox.width / 2, this.bar_HP.y)
		}
	}

	ATK_Stat(stat, value, hitUnit = null) {
		//
	}

	OnGameStart() {
		//* reset inventories

		this.runtime.playersAlive.add(this)

		this.Reset()

		this.shop.HTML_SetElementsInShop()
		this.stats.ShowTabButtons(true) //edge case with previous game being Multiplayer

		const playerData = this.loadingRunData

		if (playerData) {
			this.startRun_chara = this.runtime.dataInstances["Items"].get(playerData.character)

			this.SetCoins(playerData.coins)
			this.level = playerData.Level
			this.xp_current = playerData.XP
			this.shopStats.levelUps = playerData.levelUps
			this.shopStats.itemFounds = playerData.itemFounds
			this.shopStats.itemFounds_Legendary = playerData.itemFounds_Legendary
		}

		//* spawn Player

		const playerPositions = this.runtime.objects["PlayerPos"].getAllInstances()
		const playerPos = playerPositions.filter((pos) => pos.instVars.PlayerIndex === this.playerIndex)[0]

		//const charaToSpawn = playerPos.instVars.PlayerChara || "Player"

		const charaToSpawn = this?.startRun_chara?.charaClass || this.charaClass

		this.playableName = this.startRun_chara?.name.replace("U_", "").replace("Chara_", "")

		const unit = this.runtime.spawnManager.SpawnChara(charaToSpawn, playerPos.x, playerPos.y, {
			PlayableName: this.playableName,
		})
		console.error("Spawn Player", unit, charaToSpawn)

		this.SetPlayerUnit(unit)

		this.unit.enemyTags = ["Enemy"]

		if (this.invincibleCheat) {
			this.unit.healthComp.SetCurrentToMax(9999)
		} else {
			const hpMax = this.stats.GetStatValue("HP_Max")
			this.unit.healthComp.SetCurrentToMax(hpMax)
		}

		this.unit.SetOutline(this.color_)

		this.runtime.progress.CallSettingFunction("HPBar_Player")

		//* add start items

		if (this.startRun_chara) {
			const item = this.startRun_chara
			this.inventory.AddItem(item)
		}

		if (this.startRun_wep) {
			const item = this.startRun_wep
			this.inventoryWeps.AddItem(item)
		}

		if (this.randomAtks) {
			for (const randAtk of this.randomAtks) {
				this.inventoryWeps.AddItem(randAtk)
			}
			this.randomAtks = []
		}

		//* Load items (DEBUG/CHEATS)

		if (!playerData) {
			//this.inventoryWeps.AddItemByName("Pistol", 2)
		}

		//*load items from save

		if (playerData) {
			for (const item of playerData.inv_items) {
				this.inventory.AddItemByName(item[0], item[1], item[2])
			}
			for (const item of playerData.inv_weps) {
				this.inventoryWeps.AddItemByName(item[0], item[1], item[2], true)
			}
			for (const item of playerData.inv_invisible) {
				this.inventoryInvisible.AddItemByName(item[0], item[1], item[2])
			}
		}

		//! careful to bug with savedGame (duplicate)
		this.AddItemByName("U_Mushroom_Invisible")

		//*spawn Hurtbox
		this.unit.GenerateHurtbox()

		//* spawn Bars
		this.bar_XP = this.runtime.objects["Bar"].createInstance("HUD", 0, 0, true)
		this.bar_HP = this.runtime.objects["Bar"].createInstance("HUD", 0, 0, true)

		this.bar_XP.setPosition(this.bar_HP.x, this.bar_HP.y + 11)
		this.bar_HP.addChild(this.bar_XP, {
			transformX: true,
			transformY: true,
			transformHeight: true,
			transformWidth: true,
			destroyWithParent: true,
		})

		const initBar = (inst) => {
			const frame = Utils.World_GetChild(inst, "Bar_Frame")
			frame.setPosition(inst.x, inst.y)
			frame.setSize(inst.width + 7, inst.height + 3.5)

			const shadow = Utils.World_GetChild(inst, "Bar_Shadow")
			shadow.setPosition(inst.x, inst.y)
			shadow.setSize(inst.width, inst.height * 0.4)

			const textBar = Utils.World_GetChild(inst, "Text_Bar")
			textBar.setPosition(inst.x, inst.y)
			textBar.setSize(inst.width, inst.height)
		}

		initBar(this.bar_HP)
		initBar(this.bar_XP)

		this.Health_OnChanged()
		this.LevelUpdate()

		let barHpBbox = this.bar_HP.getBoundingBox()

		this.coinElem_game = Utils.World_CreateChildOn(this.bar_HP, "HTML_Coin", "HUD_HTML", { y: 20 })
		this.coinElem_game.width = this.bar_HP.width

		const elemStyle = {
			zIndex: -10,
			fontSize: Utils.px(8),
			fontFamily: "LilitaOne",
		}

		const coinsElem = this.coinElem_game.getElement()
		Object.assign(coinsElem.style, elemStyle)
		coinsElem.classList.add("flex", "items_center", "textOutline")

		if (this.isPlayer0) {
			this.runtime.coinPortal_actual = 0

			this.coinElem_soulPortal = Utils.World_CreateChildOn(this.coinElem_game, "HTML_Coin", "HUD_HTML", { y: 10 })
			this.coinElem_soulPortal.width = this.bar_HP.width

			const soulsPortalElem = this.coinElem_soulPortal.getElement()
			Object.assign(soulsPortalElem.style, elemStyle)
			soulsPortalElem.classList.add("flex", "items_center", "textOutline")

			soulsPortalElem.innerHTML = /*html*/ `
            <div class="horizontal items_center justify_center" style="
                font-size: ${Utils.px(6)};
                margin-left: ${Utils.px(1)};
            ">
                <div id="soulPortalText" style="
                    color:white; 
                    display:none;">
                </div>
                <img src="Game/Graph/Stat_SoulPortal.png" draggable="false" style="
                    width: ${Utils.px(9)}; 
                    height: ${Utils.px(9)};
                    margin-right: ${Utils.px(1)};
                    object-fit: contain;
                    
                ">
                <div id="soulPortalInfo" style="
                    color:gray;"
                >
                </div>
               
            </div>
            `

			this.coinElem_soulPortal.isVisible = false
		}

		//temp
		/*this.bar_HP.isVisible = false
		this.bar_XP.isVisible = false
		this.coinElem_game.isVisible = false*/

		this.UpdateCoins()

		this.bar_HP.Set_Color_Current([1, 0, 0])
		this.bar_XP.Set_Color_Current([1, 0, 1])

		this.XP_UpdateBar()

		let isLeft = true

		const horMargin = 12

		const topY = 15
		const bottomY = 300 - 30

		const leftX = horMargin + this.bar_HP.width / 2
		const rightX = 533 - horMargin - this.bar_HP.width / 2

		if (this.isPlayer0) {
			this.bar_HP.setPosition(leftX, topY)
			coinsElem.classList.add("justify_start")
		} else if (this.playerIndex === 1) {
			this.bar_HP.setPosition(rightX, topY)
			coinsElem.classList.add("justify_end")
			isLeft = false
		} else if (this.playerIndex === 2) {
			this.bar_HP.setPosition(leftX, bottomY)
			coinsElem.classList.add("justify_start")
		} else if (this.playerIndex === 3) {
			this.bar_HP.setPosition(rightX, bottomY)
			coinsElem.classList.add("justify_end")
			isLeft = false
		}

		/*let barHpBbox = this.bar_HP.getBoundingBox()

        this.bar_HP_Skull = this.runtime.objects["Bar_Skull"].createInstance("HUD", 0, 0, true)

		this.bar_HP.addChild(this.bar_HP_Skull, {
			transformX: true,
			transformY: true,
			destroyWithParent: true,
		})

		if (isLeft) this.bar_HP_Skull.setPosition(barHpBbox.right + this.bar_HP_Skull.width / 2 + 5, this.bar_HP.y)
		else this.bar_HP_Skull.setPosition(barHpBbox.left - this.bar_HP_Skull.width / 2 - 5, this.bar_HP.y)*/

		//! UI REWORK

		/*
		if (this.isPlayer0) {
			this.bar_HP.setPosition(75, 41)
		}*/

		this.ActivatePlayerframe(isLeft)

		const healthComp = this.unit.healthComp
		healthComp.AddListener(this.bar_HP)

		if (playerData) {
			healthComp.current = playerData.HP
		}

		this.unit.stats = this.stats

		//*Cursor (useless)

		/*
		this.cursor = this.runtime.objects["Cursor"].createInstance("Cursor", 0, 0)
		this.cursorDir = this.runtime.objects["Cursor_Dir"].createInstance("Cursor", 0, 0)
		this.cursor.addChild(this.cursorDir, {
			transformX: true,
			transformY: true,
			transformWidth: true,
			transformHeight: true,
			destroyWithParent: true,
		})
		this.runtime.mouse.setCursorStyle("none")*/

		this.loadingRunData = null

		//* PowerBar

		this.powerBar = this.runtime.objects["Bar_Local"].createInstance("HUD_Local", this.inst.x, this.unit.AnimTopY() - 15 + 7)
		this.inst.addChild(this.powerBar, {
			transformX: true,
			transformY: true,
			destroyWithParent: true,
		})
		this.powerBar.isVisible = false
		this.powerBar.Set_Color_Current([0, 0, 1])

		//* Spammers

		if (this.isPlayer0) {
			const spamFunc = () => {
				this.unit.timerComp.Timer_Start("Spam", 1.5 / this.stats.GetStatValue("Spam"), () => {
					spamFunc()
					let enemies = this.runtime.units.GetUnitsByTags("Noob", "Chara")
					enemies = enemies.filter((enemy) => !enemy.IsElite && enemy.CanPseudo)
					let hasBark = false
					while (!hasBark && enemies.length > 0) {
						const enemy = Utils.Array_Random(enemies)
						if (this.runtime.twitch.IsTwitchOn() && this.runtime.twitch.msgWasCast) {
							hasBark = true
						} else {
							hasBark = enemy.Bark("Noob")
						}
						/*
                        // old way: twitch messages with regular interval
                        if (this.runtime.twitch.IsTwitchOn() && this.runtime.twitch.twitchMessages.length > 0) {
							hasBark = enemy.BarkTwitch_Old()
						}*/
						enemies.splice(enemies.indexOf(enemy), 1)
					}
					this.runtime.twitch.msgWasCast = false
				})
			}
			spamFunc()
		}

		const randMove = () => {
			this.unit.timerComp.Timer_Start("randMove", Utils.random(0.15, 0.3), () => {
				this.randDir = Utils.random(0, 360)
				randMove()
			})
		}
		randMove()
	}

	Update_Wave_EquipedAttacks() {
		for (const [key, value] of Object.entries(this.waves_equipedAtks)) {
			const matchingItem = this.inventoryWeps.items.find((item) => item.name === key)
			if (!matchingItem) this.waves_equipedAtks[key] = null
		}
		for (const item of this.inventoryWeps.items) {
			if (!this.waves_equipedAtks[item.name]) {
				this.waves_equipedAtks[item.name] = this.runtime.waveManager.waveCount
			}
		}
		//console.error("Update_Wave_EquipedAttacks", this.runtime.waveManager.waveCount, this.waves_equipedAtks)
	}

	On_Second() {
		const DamagePerSec = this.stats.GetStatValue("DamagePerSec")
		if (DamagePerSec > 0) {
			this.unit.TakeDamage({
				Dmg: 1,
				No_Invulnerability: true,
			})
		}
	}

	On_Wave_Start() {
		if (!this.enabled) return

		this.Update_Wave_EquipedAttacks()

		this.TriggerPlayerEvent("On_Wave_Start_" + this.runtime.waveManager.waveCount)

		this.HP_Regen_Trigger(true)

		this.unit.timerComp.Timer_Start_Repeat("On_Second", 1, () => this.On_Second())

		//* BOSS SPAM

		//Destroy all bubbles
		this.runtime.objects["Text_Bark_Boss"].getAllInstances().forEach((inst) => inst.destroy())
		this.unit.timerComp.Timer_Stop("Spam_Boss")

		let delayNoobsAreComing = 1

		if (this.runtime.waveManager.waveCount === 1) delayNoobsAreComing = 4.5

		if (this.isPlayer0) {
			this.unit.timerComp.Timer_Start("Bark_BossStart", delayNoobsAreComing, () => {
				const playerRand = Utils.Array_Random(Array.from(this.runtime.playersAlive))
				playerRand.unit.Bark("BossStart")
			})
		}

		const spamFunc = () => {
			const random = Utils.random(8, 12)
			this.unit.timerComp.Timer_Start("Spam_Boss", random / this.stats.GetStatValue("Spam_Boss"), () => {
				spamFunc()
				if (!this.unit.Dead) this.unit.Bark("Boss")
			})
		}

		this.unit.timerComp.Timer_Start("Init_Spam_Boss", delayNoobsAreComing, spamFunc())
	}

	HP_Regen_Trigger(first = false) {
		const HP_Regen = this.stats.GetStatValue("HP_Regen")
		if (HP_Regen <= 0) {
			return
		}

		if (!first) {
			this.unit.Heal(1)
		}

		const hpRegenTimer = this.stats.Stat_Regen_IntervalPerHP()
		//window.alert("HP_Regen_Trigger " + hpRegenTimer)
		this.unit.timerComp.Timer_Start("HP_Regen", hpRegenTimer, () => {
			//console.error("HP_Regen callback")
			this.HP_Regen_Trigger()
		})
	}

	On_Wave_End() {
		if (!this.enabled) return

		this.unit.timerComp.Timer_Stop("On_Second")

		this.TriggerPlayerEvent("On_Wave_End_" + this.runtime.waveManager.waveCount)

		this.TriggerPlayerEvent("On_Shop_Enter")

		this.stats.SetStatValue("ThisWave_Kills", 0)
		this.stats.SetStatValue("ThisWave_Crits", 0)

		this.stats.SetStatValue("ThisWave_HitsTaken", 0)
		this.stats.SetStatValue("ThisWave_DamagesTaken", 0)

		this.stats.SetStatValue("RerollsDone_LastShop", 0)
		this.stats.SetStatValue("BoughtItems_LastShop", 0)

		//this.unit.Bark("BossEnd")

		this.unit.timerComp.Timer_Stop("HP_Regen")
	}

	SetPlayerEnabled(bool) {
		if (this.enabled === bool) return
		this.enabled = bool
		//! WARNING

		if (bool) {
			this.runtime.playersEnabled.add(this)
		} else {
			this.runtime.playersEnabled.delete(this)
		}

		this.eventListeners.forEach(({ event, callback }) => {
			if (this.enabled) {
				this.globalEvents.addEventListener(event, callback)
			} else {
				this.globalEvents.removeEventListener(event, callback)
			}
		})

		this.effects.SetEnabled(bool)
		this.shop.SetEnabled(bool)

		if (this.SN) this.SN.UpdateMouseActive()
	}

	SetInputID(inputID) {
		this.inputID = inputID
		this.inputSuffix = inputID !== null ? "|" + inputID : ""

		this.input.Create_Joystick_WithID(this.inputID, this.joyMoveName, "LS", "Move", null)
		this.input.Create_Joystick_WithID(this.inputID, this.joyAimName, "RS", null, "Origin")

		if (this.isPlayer0) {
			if (inputID === null) {
				this.color = "#ffffff"
			} else {
				this.color = this.color_
				this.colorDark = this.colorDark_
			}
		}

		if (this.SN) this.SN.UpdateMouseActive()
	}

	OnInputEvent(e) {
		for (const inputEvent of this.inputEvents) {
			const inputEventName = "On_" + inputEvent.action + this.inputSuffix + "_" + inputEvent.type
			if (inputEventName === e.name) {
				/*
				if (e.name.startsWith("On_Put") && e.name.includes("Pressed")) {
					window.alert("playerIndex input " + this.playerIndex + " " + inputEventName)

				}*/
				inputEvent.fn()
			}
		}
	}

	SetInputEvents() {
		this.inputEvents = [
			{ action: "Shoot", type: "Down", fn: () => this.Input_Shoot() },

			{ action: "Move_Left", type: "Pressed", fn: () => this.UIMove("left") },
			{ action: "Move_Right", type: "Pressed", fn: () => this.UIMove("right") },
			{ action: "Move_Down", type: "Pressed", fn: () => this.UIMove("down") },
			{ action: "Move_Up", type: "Pressed", fn: () => this.UIMove("up") },
			{ action: "UI_Press", type: "Pressed", fn: () => this.SN.press() },

			{ action: "Move_Left", type: "Down", fn: () => this.UIMove("left", true) },
			{ action: "Move_Right", type: "Down", fn: () => this.UIMove("right", true) },
			{ action: "Move_Down", type: "Down", fn: () => this.UIMove("down", true) },
			{ action: "Move_Up", type: "Down", fn: () => this.UIMove("up", true) },

			{ action: "Toggle_Pause", type: "Pressed", fn: () => this.runtime.menu.Toggle_Pause(this) },
			{ action: "Back_Keyboard", type: "Pressed", fn: () => this.runtime.menu.Back_Keyboard(this) },
			{ action: "Back_Gamepad", type: "Pressed", fn: () => this.runtime.menu.Back_Gamepad(this) },

			{ action: "Tab_Left", type: "Pressed", fn: () => this.Tab_Left() },
			{ action: "Tab_Right", type: "Pressed", fn: () => this.Tab_Right() },

			{ action: "Tab_Button", type: "Pressed", fn: () => this.Tab_Button(true) },
			{ action: "Tab_Button", type: "Released", fn: () => this.Tab_Button(false) },

			{ action: "Lock", type: "Pressed", fn: () => this.Input_Lock() },

			{ action: "Ready", type: "Pressed", fn: () => this.PlayerReady() },
		]
	}

	Tab_Button(pressed) {
		this.shop.Show_ATK_Syns(pressed)
	}

	PlayerReady() {
		if (this.runtime.menu.CurMenuName() === "shopMenu_Multi") {
			this.shop.ValidateOverlay(!this.shop.validate)
		}
	}

	SetNeedToRetrigger() {}

	UIMove(dir, hold = false) {
		const currentTime = performance.now()
		const lastMoveTime = "lastMoveTime" + dir
		const delayKey = "moveDelay" + dir

		// Initialize delay if not set
		if (this[delayKey] === undefined) this[delayKey] = 200

		if (!hold) {
			// Reset delay to 200ms on a new press
			this[delayKey] = 200

			if (this.runtime.menu.CurMenuName() === "shopMenu_Multi") {
				this.shop.ValidateOverlay(false)
			}

			this.needToRetriggerNav = false
			this.SN.move(dir)
			this[lastMoveTime] = currentTime
		} else {
			if (this.needToRetriggerNav) return

			if (this.isPlayer0) {
				let hasScrolled = false
				if (dir === "up") hasScrolled = this.runtime.menu.ScrollElem_Step(true)
				else if (dir === "down") hasScrolled = this.runtime.menu.ScrollElem_Step(false)
				if (hasScrolled) return
			}

			if (currentTime - this[lastMoveTime] > this[delayKey]) {
				this[lastMoveTime] = currentTime
				// Decrease delay by 10ms, but not below 100ms
				this[delayKey] = Math.max(80, this[delayKey] - 15)

				this.SN.move(dir)
			}
		}
	}

	BeforeProjectStart(e) {
		console.error("Player", this.playerIndex, this)

		this.stats = new Stats(this.runtime, this, true)

		this.effects = new PlayerEffects(this)

		this.tooltip = new Tooltip(this.runtime, true)

		this.inventoryInvisible = new Inventory(this.runtime, this, "Inventory_Invisible", [], true)
		this.inventoryWepsInvisible = new Inventory(this.runtime, this, "Inventory_Weps_Invisible", [], true)

		this.inventory = new Inventory(this.runtime, this, "Inventory_Upgrades")
		this.inventoryWeps = new Inventory(this.runtime, this, "Inventory_Weps")

		this.shop = new Shop(this.runtime, this)

		this.shopStats = new ShopStats(this.runtime, this)
		this.shop.shopStats = this.shopStats

		//* CHEAT SHOP POOL
		//inventoryCheats Pool

		let allItems = Array.from(this.runtime.dataInstances["Items"].values())
		//allItems = allItems.filter((item) => !item.HasTag("Stat"))
		allItems = allItems.filter((item) => !item.HasTag("Playable"))
		allItems = allItems.filter((item) => !item.HasTag("Synergy"))
		allItems = allItems.filter((item) => !item.HasTag("Difficulty"))
		//allItems = allItems.filter((item) => !item.HasTag("Enemy"))
		allItems = allItems.filter((item) => !item.HasTag("InvisibleItem"))
		allItems = allItems.filter((item) => item.lockedBy !== "Demo")

		const typeOrder = { Item: 0, Weapon: 1, Hero: 2, Enemy: 3, Stat: 4 }
		allItems.sort((a, b) => {
			// 1) Compare itemType according to our desired order
			const diff = typeOrder[a.itemType] - typeOrder[b.itemType]
			if (diff !== 0) return diff

			// 2) if both are Items, sort by evolution first
			if (a.itemType === "Item") {
				const evoDiff = a.evolution - b.evolution
				if (evoDiff !== 0) return evoDiff
			}

			// 3) finally, sort alphabetically by nameEvo
			return a.nameEvo.localeCompare(b.nameEvo)
		})

		this.inventoryCheats = new Inventory(this.runtime, this, "Cheats_Upgrades", allItems)

		this.inventoryCheats.hasFilters = true

		this.inventoryCheats.ClickItem = (itemClass) => this.BuyItem(itemClass, true)

		this.inventoryWeps.ClickItem = (itemClass, itemBox) => this.ClickInvWep(itemClass, itemBox)

		this.inventory.ClickItem = () => this.ClickItem_SelectGo()

		this.inventoryCheats.Refresh(true)
		this.inventoryCheats.element.style.display = "none"

		//Open Elements in Shop

		//this.shop.HTML_SetInShop()

		this.SN = new SpatialNavigation(this)

		this.SpatialNavigation()

		this.SetInputEvents()

		if (this.isPlayer0) {
			this.SetPlayerEnabled(true)
		}
	}

	ClickItem_SelectGo() {
		const curMenu = this.runtime.menu.CurMenuName()

		if (curMenu === "pauseMenu") {
			const button_Resume = this.runtime.menu.pauseMenu.querySelector(".button_Resume")
			this.SN.focus(button_Resume)
		} else if (curMenu === "shopMenu") {
			const button_Go = this.shop.elemSingle.querySelector(".button_Go")
			this.SN.focus(button_Go)
		} else if (curMenu === "shopMenu_Multi") {
			const button_Ready = this.shop.elemMulti.querySelector(".button_Ready")
			this.SN.focus(button_Ready)
		}
	}

	ClickInvWep(itemClass, itemBox) {
		const curMenuName = this.runtime.menu.CurMenuName()
		if (curMenuName === "shopMenu_Multi" || curMenuName === "shopMenu") {
			if (this.tooltip.has_InvWepButtons) {
				//console.error("ClickInvWep", this, this.shop.WepItemContextMenu)
				this.shop.WepItemContextMenu(itemBox)
				this.SpatialNavigation(this.tooltip.element)
				this.tooltip.DisplayFlex()
			}
		}
	}

	SpatialNavigation(restrictParent = null, selector = ".focusable") {
		const SN = this.SN

		SN.clear()
		SN.init()
		SN.add({ selector: selector })
		// .settingItem, .itemBox, .footer button, .settingSlider

		if (restrictParent) {
			if (!Array.isArray(restrictParent)) {
				restrictParent = [restrictParent]
			}
			SN.set({
				navigableFilter: function (elem, sectionId) {
					for (let i = 0; i < restrictParent.length; i++) {
						if (restrictParent[i].contains(elem)) {
							return true
						}
					}
					return false
				},
			})
		} else {
			SN.set({
				navigableFilter: null,
			})
		}

		SN.limitAccessFromDirection(".statContainer", ["left", "right"])

		SN.setNavigationRules(".settingSlider", ["up", "down"])
		SN.makeFocusable()
		SN.focus()
	}

	SetCoinElem(coinElement, value, color = "", iconColor = false) {
		//this condition prevents a bug where the in game coinElem HUD reappears
		if (coinElement.style.display !== "none") {
			coinElement.style.display = "flex"
		}
		coinElement.style.color = color
		coinElement.style.alignItems = "center"

		if (iconColor === false) {
			iconColor = "#ff1fff" // Default color if none is provided
		} else if (iconColor === true) {
			iconColor = color
		}

		// coinwrapper
		// display: flex;

		coinElement.innerHTML = /*html*/ `
            <div style="margin-left: ${Utils.px(1)};">
                ${value}
            </div>
            <div id="coinWrapper" style="
                
                align-items: center;
                justify-content: center;
                width: 0.7em; 
                height: 0.7em; 
                margin-left: 0.2em;
                border-radius: 50%; 
                background-color: ${iconColor}; 
                border: 0.07em solid white;
                box-shadow: 0 0 0.3em ${iconColor}80; /* Subtle glow with slight transparency */
                box-sizing: border-box;
            ">
            </div>
        `
	}

	//old way
	SetCoinElem_(coinElement, value, color = "", iconColor = false) {
		const coinImg = "coin_icon_gray.png"

		coinElement.style.display = "flex"
		coinElement.style.color = color
		coinElement.style.alignItems = "center"

		if (iconColor === false) {
			iconColor = "#ff1fff"
		} else if (iconColor === true) iconColor = color

		/*if (value === undefined) {
			window.alert("SetCoinElem value undefined")
			console.error("SetCoinElem value undefined", coinElement)
		}*/

		coinElement.innerHTML = /*html*/ `
        <div style="margin-left: ${Utils.px(1)};">
            ${value}
        </div>
        <div id="coinWrapper" style="
            position: relative; 
            width: 1em; 
            height: 1em; 
            margin-left: 0.2em;
            box-sizing: border-box;
            
        ">
            <img id="coinImg" src=${coinImg} style="
                width: 100%; 
                height: 100%; 
                object-fit: contain;
                display: block;
                box-sizing: border-box;
            ">
            <div id="coinOverlay" style="
                position: absolute; 
                top: 0; 
                left: 0; 
                width: 100%; 
                height: 100%; 
                background-color: ${iconColor}; 
                mix-blend-mode: color; 
                -webkit-mask-image: url(${coinImg}); 
                -webkit-mask-size: contain; 
                -webkit-mask-repeat: no-repeat; 
                -webkit-mask-position: center;
                mask-image: url(${coinImg}); 
                mask-size: contain; 
                mask-repeat: no-repeat; 
                mask-position: center;
                pointer-events: none;
                -webkit-mask-composite: destination-in; /* Combines mask and avoids artifacts */
                mask-composite: intersect; /* Same purpose for standard masks */
                box-sizing: border-box;
            ">
            </div>
        </div>
        `
	}

	get coins() {
		return this.stats.GetStatValue("Souls")
	}

	Process_SpawnedEntity(unit) {
		if (unit.targetSummonner) {
			unit.enemyTags.push("Player" + this.playerIndex)
		}

		if (this.effects.GetBool("CollectSouls_Minion")) {
			if (unit.HasTag("Minion")) {
				const pickerComp = unit.AddComponent(C4.Compos.Compo_Picker, "Picker", {
					PlayerPickerIndex: this.playerIndex,
				})
			}
		}

		if (this.effects.GetBool("Attract_Kickable")) {
			if (unit.HasTag("Kickable")) {
				unit.moveComp.Impulse_Attract(this.unit.uid, 10, 20)
			}
		}

		if (this.effects.GetBool("Attract_Turrets")) {
			if (unit.HasTag("Turret")) {
				unit.moveComp.Impulse_Attract(this.unit.uid, 65, 0)
				console.error("Attract_Turrets", unit)
			}
		}

		if (this.effects.GetBool("Kickable_Disks")) {
			if (unit.HasTag("Disk")) {
				unit.kickComp = unit.AddComponent(C4.Compos.Compo_Kickable, "Kickable", {
					Kick_Enabled: true,
					KickDirection: "Nearest",
					DamageActivation: false,
					Kick_Speed: unit.Speed,
					Kick_Acc: 0,

					KickOnSolid_Feedbacks: {},
				})

				if (unit.name.includes("Overdisk")) {
					unit.kickComp.Kick_CanRekick = 1.2
				}
			}
		}

		if (this.effects.GetBool("Kickable_Turrets")) {
			if (unit.HasTag("Turret")) {
				unit.kickComp = unit.AddComponent(C4.Compos.Compo_Kickable, "Kickable", {
					Kick_Enabled: true,
					KickDirection: "Move",
					DamageActivation: false,
					Kick_Speed: 300,
					Kick_Acc: -400,

					KickOnSolid_Feedbacks: {},
				})
			}
		}

		if (this.effects.GetBool("CollectSouls_Kickable")) {
			if (unit.HasTag("Kickable")) {
				const pickerComp = unit.AddComponent(C4.Compos.Compo_Picker, "Picker", {
					PlayerPickerIndex: this.playerIndex,
				})

				console.error("Add Picker to Kickable", pickerComp)
			}
		}
	}

	AddCoins(amount) {
		if (typeof amount !== "number") return
		amount = Math.floor(amount)

		this.stats.Stat_Add("Souls", amount)
	}

	SetCoins(amount) {
		if (typeof amount !== "number") return
		amount = Math.floor(amount)

		this.stats.SetStatValue("Souls", amount)
	}

	/*
    AddCoins(amount) {
		this.coins += amount
		this.coins = Math.floor(this.coins)
		this.UpdateCoins()
	}*/

	UpdateCoins() {
		const playerColor = this.color_

		const setColorBool = !this.runtime.singlePlayer

		//*GAME HUB
		if (this.coinElem_game?.getElement()) {
			this.SetCoinElem(this.coinElem_game.getElement(), this.coins, playerColor, setColorBool)
		}

		//*SHOP
		const coinShop = this.shop.element.querySelector("#coinShop")
		if (coinShop) {
			this.SetCoinElem(coinShop, this.coins, playerColor, false)
		}

		//*SHOP STAT (single)

		if (this.shopStats.single_coinText) {
			this.SetCoinElem(this.shopStats.single_coinText, this.coins, playerColor, false)
		}

		//*SHOP STATS
		if (this.shopStats.multi_coinText) {
			this.SetCoinElem(this.shopStats.multi_coinText, this.coins, playerColor, false)
		}

		//*COST
		const itemCosts = this.shop.element.querySelectorAll(".itemCost")

		for (const costElem of itemCosts) {
			if (typeof costElem.shopIndex === "number") {
				const price = this.shop.GetIndexPrice(costElem.shopIndex)
				this.SetCoinElem(costElem, price)
				if (this.coins < price) {
					costElem.style.color = "red"
				} else costElem.style.color = ""
			}
		}
		const rerollCost = this.shop.element.querySelector(".rerollCost")
		const rerollCost_shopStats = this.shopStats.rerollCostElem
		const rerolls = [rerollCost, rerollCost_shopStats]
		for (const rerollElem of rerolls) {
			if (this.shop.rerollPrice > this.coins) {
				rerollElem.style.color = "red"
			} else rerollElem.style.color = ""
		}
	}

	RemoveItemByName(itemName, evolution = 0, quantityToRemove = 1) {
		let ret = false
		ret = this.inventory.RemoveItemByName(itemName, evolution, quantityToRemove)
		if (!ret) this.inventoryWeps.RemoveItemByName(itemName, evolution, quantityToRemove)
		if (!ret) this.inventoryInvisible.RemoveItemByName(itemName, evolution, quantityToRemove)
		console.error("RemoveItemByName", ret, itemName, evolution, quantityToRemove)
	}

	AddItemByName(itemName, evolution = 0, quantityToAdd = 1, forceAutorized = false) {
		const itemNameEvo = Utils.GetNameEvo(itemName, evolution)
		const item = this.runtime.dataInstances["Items"].get(itemNameEvo)
		if (!item) {
			console.error("Item not found", itemNameEvo)
			return
		} else {
			if (item.HasTag("Synergy") || item.HasTag("InvisibleItem")) {
				this.inventoryInvisible.AddItem(item, quantityToAdd, forceAutorized)
			} else if (item.HasTag("Weapon")) {
				this.inventoryWeps.AddItem(item, quantityToAdd, forceAutorized)
			} else {
				this.inventory.AddItem(item, quantityToAdd, forceAutorized)
			}
		}
	}

	SellItem(item, type = "shop") {
		this.runtime.audio.PlaySound("UI_Buy")
		const recycleValue = item.Get_Sell_Value()
		if (type === "shop") {
			if (item.HasTag("Weapon")) {
				this.inventoryWeps.RemoveItem(item)
			} else {
				this.inventory.RemoveItem(item)
			}
		}
		this.TriggerPlayerEvent("On_Shop_Sell")
		this.AddCoins(recycleValue)
	}

	BuyItem(itemClass, forceAutorized = false) {
		const price = this.shop.GetItemPrice(itemClass)

		//! means the item was not found (so it's bought)
		if (price === null) {
			return false
		}

		//first check if there is a slot for the item

		if (!this.shop.cheatShop) {
			if (this.coins < price) {
				this.runtime.audio.PlaySound("UI_ClickFailBuzzer", 0.5)
				return false
			}
		}

		let hasBuy = false
		if (itemClass.HasTag("Weapon")) {
			hasBuy = this.inventoryWeps.AddItem(itemClass, 1, forceAutorized)
		} else {
			hasBuy = this.inventory.AddItem(itemClass)
		}
		if (!hasBuy) {
			//inventory full
			this.runtime.audio.PlaySound("UI_ClickFailBuzzer", 0.5)
			return false
		}

		if (!this.shop.cheatShop) {
			this.AddCoins(-price)
		}

		this.stats.Stat_Add("BoughtItems", 1)
		this.stats.Stat_Add("BoughtItems_LastShop", 1)

		this.runtime.audio.PlaySound("UI_Buy")

		this.shop.RemoveShopItem(itemClass)

		this.TriggerPlayerEvent("On_Shop_Buy")

		//this.shop.RefreshShopDescriptions()

		return true
	}

	Tick_Menu() {
		//
	}

	Tick_Game() {
		if (!this.unit) return
		if (this.runtime.movie.IsPlaying()) {
			this.unit.FollowTargetMove = false
			this.unit.InputMove = false
			return
		}
		if (this.runtime.timeScale > 0) {
			//follow Mouse
			//this.unit.moveComp.angleOfMotion = C3.angleTo(this.inst.x, this.inst.y, this.runtime.mouse.getMouseX(), this.runtime.mouse.getMouseY())

			//* AIM
			this.unit.charaComp.Set_Angle_Aim(this.input.Joy_Angle(this.joyAimName))

			//* MOVE
			if (this.forceMove) {
				this.unit.FollowTargetMove = false
				this.unit.InputMove = true
				this.unit.charaComp.Set_TargetXY_ByAngle("origin", this.unit.moveComp.AngleOfMotion(), 50)
			} else if (!this.unit.Dead && this.input.Joystick_IsActive(this.joyMoveName)) {
				//window.alert("this.unit.charaComp.Set_TargetXY_ByAngle('origin', this.input.Joy_Angle('Move'), 50)")
				this.unit.charaComp.Set_TargetXY_ByAngle("origin", this.input.Joy_Angle(this.joyMoveName), 50)
				this.unit.FollowTargetMove = true
				this.unit.InputMove = true
			} else {
				this.unit.FollowTargetMove = false
				this.unit.InputMove = false
			}

			if (this.effects.GetBool("Cant_StopMoving")) {
				if (!this.unit.InputMove) {
					this.unit.moveComp.SetOnSolid("Bounce")
				}
				this.unit.InputMove = true
			}
			if (this.effects.GetBool("Cant_Move")) {
				this.unit.InputMove = false
			}

			//!TEMP TRAILER

			/*
			if (!this.runtime.singlePlayer) {
				this.unit.charaComp.Set_TargetXY_ByAngle("origin", this.randDir, 50)
				this.unit.FollowTargetMove = true
				this.unit.InputMove = true
			}*/

			this.Tick_Picks()
			//this.Tick_EnemyCollision()
			this.Tick_Orb()
		}

		//this.Tick_Cursor()
		//this.Tick_Goop()
	}

	Tick_Goop() {
		const goop = this.runtime.objects["Goop"].createInstance("Goop", this.inst.x, this.inst.y)
		goop.setSize(Utils.random(10, 30), Utils.random(10, 30))
		goop.offsetPosition(Utils.random(-7, 7), Utils.random(-7, 7))
	}

	//!disabled
	Tick_EnemyCollision() {
		const enemyHitboxClass = this.runtime.objects["Hitbox_Enemy"]
		const rect = this.inst.getBoundingBox()
		const candidates = this.runtime.collisions.getCollisionCandidates(enemyHitboxClass, rect)
		for (const candidate of candidates) {
			if (this.runtime.collisions.testOverlap(this.circlePickup, candidate)) {
				damageInst.DealDamage_Test(this.unit)
			}
		}
	}

	Pick_Potion_Heal() {
		this.TriggerPlayerEvent("On_Potion")
		const healValue = this.stats.GetStatValue("Potion_Heal")
		this.runtime.audio.PlaySound("Potion")

		if (this.unit.healthComp.IsFull()) {
			this.TriggerPlayerEvent("On_Potion_HP_Max")
		}

		this.unit.Heal(healValue)
	}

	Tick_Orb() {
		const colliderInst = this.inst
		const rect = this.inst.getBoundingBox()

		const orbClass = this.runtime.objects["Orb"]
		const orbCollides = Utils.testOverlapOpti_All(colliderInst, orbClass)

		for (const orbCollide of orbCollides) {
			if (orbCollide.playerIndex !== this.playerIndex) {
				continue
			}
			const e = new C3.Event("Orb_Skill_Activate", true)
			orbCollide.dispatchEvent(e)
		}

		if (this.powerActiveAlone) return
	}

	Tick_Picks() {
		const colliderInst = this.inst

		const pickClass = this.runtime.objects["Picks"]
		const pickCollides = Utils.testOverlapOpti_All(colliderInst, pickClass)
		for (const inst of pickCollides) {
			const pickName = inst.objectType.name
			if (pickName === "Pickup_Potion") {
				if (this.effects.GetBool("Potion_Cork")) {
					return
				}
				this.Pick_Potion_Heal()
			} else if (pickName === "Pickup_Chest") {
				const text = this.runtime.translation.Get("Chest")
				this.runtime.pointburst.CreatePointBurst_Icon(text, this.unit.x, this.unit.y - 30, "", "Pickup_Chest")
				this.shopStats.itemFounds += 1
				this.runtime.audio.PlaySound("Chest_Jingle2", 1, 1)
				this.TriggerPlayerEvent("On_Pickup_Chest")
			} else if (pickName === "Pickup_Soul_Flask") {
				if (!this.runtime.waveManager.isWaving) continue
				this.runtime.audio.PlaySound("Glass_Break", 0.8, 1)
				this.runtime.audio.PlaySound("Pickup_SoulFlask", 0.8, 1)
				for (let i = 0; i < 10; i++) {
					this.runtime.spawnManager.SpawnCoin(inst.x, inst.y, "Regular")
				}
			} else if (pickName === "Pickup_Mushroom") {
				this.TriggerPlayerEvent("On_Pickup_Mushroom")
			}
			inst.destroy()
		}
	}

	TriggerHitEvent(...args) {
		this.effects.TriggerHitEvent(...args)
	}

	TriggerPlayerEvent(eventName) {
		this.effects.TriggerPlayerEvent(eventName)
	}

	Pick_Coin(type = "") {
		let coinValue = 1

		if (type === "Soul_Golden") {
			this.runtime.audio.PlaySound("Soul_Golden")
			this.TriggerPlayerEvent("On_Pickup_Soul_Golden")
			coinValue = 10

			//gold Pointburst
			let text = "x" + coinValue
			let x = this.unit.x
			let y = this.unit.healthBar.getBoundingBox().top - 5
			const instPoint = this.runtime.pointburst.CreatePointBurst_SpriteFont(text, x, y)
			instPoint.colorRgb = [1, 0.992, 0.608]
			instPoint.characterScale = 0.25
		} else if (type === "Red") {
			this.TriggerPlayerEvent("On_Pickup_Soul_Red")
			coinValue = 5
		} else {
			if (this.runtime.coinPortal_actual > 0) {
				this.runtime.player.Update_CoinPortal(this.runtime.coinPortal_actual - 1)
				coinValue = 2

				//x2 soul portal Pointburst
				let text = "x" + coinValue
				let x = this.unit.x
				let y = this.unit.healthBar.getBoundingBox().top - 5
				const instPoint = this.runtime.pointburst.CreatePointBurst_SpriteFont(text, x, y)
				instPoint.colorRgb = [1, 0, 0.847]
				instPoint.characterScale = 0.25
			}
		}

		this.TriggerPlayerEvent("On_Pickup_Soul")
		this.AddCoins(coinValue)
		this.XP_Add(1)
	}

	XP_Add(value) {
		value = value * this.stats.GetStatValue("XP_Gain")

		this.xp_current += value

		//console.error("XP_Add", value)

		if (this.xp_current >= this.xp_required) {
			this.xp_current -= this.xp_required
			this.LevelUp()
		}

		this.XP_UpdateBar()
	}

	XP_UpdateBar() {
		/*this.bar_XP.data._current = this.xp_current
		this.bar_XP.data._max = this.xp_required*/
		this.bar_XP.Set_Data(this.xp_current, this.xp_required)
	}

	XP_RequiredUpdate() {
		this.xp_required = (this.level + 3) * (this.level + 3)
	}

	LevelUp() {
		this.level += 1

		this.runtime.audio.PlaySound("LevelUp")

		this.runtime.pointburst.CreatePointBurst_Icon("LEVEL " + this.level, this.inst.x, this.inst.y - 50, "", "Level")

		this.LevelUpdate()

		let levelUpElemToPush = {}

		if (this.level === 5) levelUpElemToPush.tier = 1
		else if (this.level === 10) levelUpElemToPush.tier = 2
		else if (this.level % 5 === 0) levelUpElemToPush.tier = 3

		if (!this.effects.GetBool("NoStatOnLevelUp")) {
			this.shopStats.levelUps.push(levelUpElemToPush)
		}

		this.XP_RequiredUpdate()
		this.TriggerPlayerEvent("On_LevelUp")
		this.XP_UpdateBar()
	}

	LevelUpdate() {
		this.stats.SetStatValue("Level", this.level)

		this.Bar_TextC3(this.bar_XP, {
			text: "LVL " + this.level,
			outlineBack: 6,
		})
	}

	//!disabled
	Tick_Cursor() {
		this.cursorDir.angleDegrees = this.input.Joy_Angle(this.joyAimName)

		if (this.unit && this.input.lastInputType === "Gamepad") {
			const dist = 50
			this.cursor.setPosition(
				this.inst.x + Math.cos(C3.toRadians(this.input.Joy_Angle(this.joyAimName))) * dist,
				this.inst.y + Math.sin(C3.toRadians(this.input.Joy_Angle(this.joyAimName))) * dist
			)
		} else this.cursor.setPosition(this.runtime.mouse.getMouseX(), this.runtime.mouse.getMouseY())
	}

	get hurtbox() {
		return this.unit.hurtbox
	}

	OnHurt() {
		this.TriggerPlayerEvent("On_Hurt")
		this.runtime.audio.PlaySound("player_gorilla_hurt_01")

		this.runtime.audio.PlaySound("PunchHit0", 0.5)

		this.runtime.callFunction("HitVignette", false)
	}

	SetInvulnerable(duration) {
		if (duration === true) this.unit.invulnerable_InfiniteTimer = true
		else this.unit.invulnerable_InfiniteTimer = false

		if (duration === true) {
			this.unit.timerComp.Timer_Stop("invulnerable")
			this.hurtbox.isCollisionEnabled = false
		} else if (duration === false) {
			this.unit.timerComp.Timer_Stop("invulnerable")
			this.hurtbox.isCollisionEnabled = true
		} else if (typeof duration === "number") {
			this.hurtbox.isCollisionEnabled = false

			this.unit.timerComp.Timer_Start_Args({
				id: "invulnerable",
				onlyIfLonger: true,
				duration: duration,
				callback: () => {
					this.hurtbox.isCollisionEnabled = true
				},
			})
		}
	}

	SetPlayerVisible(bool) {
		//
	}

	SetPlayerActive(bool) {
		//
	}

	OnRevive() {
		if (this.runtime.playersEnabled.has(this) && !this.runtime.playersAlive.has(this)) {
			//this.flesh.destroy()

			this.runtime.camera.AddMainTarget(this.inst)

			this.unit.shadow.isVisible = true
			this.unit.healthBar.isVisible = true
			this.circleGradient.isVisible = true

			this.unit.Dead = false
			this.unit.SetUnitVisible(true)
			this.unit.AddTags(this.savedTags)
			this.runtime.playersAlive.add(this)

			this.unit.healthComp.SetCurrentToMax()

			this.SetInvulnerable(1)

			console.error("👼 Revive", this.playerIndex)
			return true
		}
		return false
	}

	OnDeath() {
		//createCorpse

		/*
		this.flesh = this.runtime.objects["Flesh"].createInstance("Objects", this.inst.x, this.inst.y)
		this.unit.inst.addChild(this.flesh, {
			transformX: true,
			transformY: true,
			destroyWithParent: true,
		})*/
		this.runtime.camera.RemoveMainTarget(this.inst)

		this.DepopMinions()

		this.unit.shadow.isVisible = false
		this.unit.healthBar.isVisible = false
		this.circleGradient.isVisible = false

		this.unit.SetUnitVisible(false)

		this.savedTags = [...this.unit.tags]

		this.unit.RemoveTags(this.savedTags)

		this.runtime.playersAlive.delete(this)
		this.bar_HP.Set_Data(0, -1)

		this.TriggerPlayerEvent("On_Death")

		//this.SetPlayerUnit(null)

		this.CheckGameOver()
	}

	DepopMinions() {
		const playerMinions = this.runtime.units.GetUnitsByTags("PlayerMinion" + this.playerIndex, "Chara")
		for (const minion of playerMinions) {
			const poof = this.runtime.objects["FX_ParticlePoof"].createInstance("Objects", minion.x, minion.y)
			minion.Depop()
		}
	}

	CheckGameOver() {
		if (this.runtime.playersAlive.size < 1) {
			this.runtime.menu.GameOver()
		}
	}

	SetPlayerUnit(unit) {
		if (unit === null) {
			this.runtime.camera.RemoveMainTarget(this.inst)

			this.unit = null
			this.inst = null
			this.anim = null

			return
		}
		this.unit = unit
		this.inst = unit.inst
		this.anim = unit.anim

		this.unit.player = this
		this.unit.playerIndex = this.playerIndex

		this.unit.AddTags(["Tank", "Player", "Player" + this.playerIndex])

		if (this.runtime.singlePlayer) {
			this.runtime.camera.SetMainTarget(this.inst)
		} else {
			this.runtime.camera.AddMainTarget(this.inst)
		}

		if (this.runtime.singlePlayer || this.inputID === "KEY") {
			this.input.Set_Main_Listener_UID(this.inst.uid)
		}

		this.InitPlayer()
	}

	InitPlayer() {
		//circleCarry
		this.circleCarry = this.runtime.objects["Circle"].createInstance("Ground_Marks", this.inst.x, this.inst.y)
		this.circleCarry.setSize(100, 100)
		this.circleCarry.isVisible = false
		this.inst.addChild(this.circleCarry, {
			transformX: true,
			transformY: true,
			destroyWithParent: true,
		})

		//circlePickup
		this.circlePickup = this.runtime.objects["Circle"].createInstance("Ground_Marks", this.inst.x, this.inst.y)
		this.circlePickup.setSize(100, 100)
		this.circlePickup.isVisible = false
		this.inst.addChild(this.circlePickup, {
			transformX: true,
			transformY: true,
			destroyWithParent: true,
		})

		this.pickerComp = this.unit.AddComponent(C4.Compos.Compo_Picker, "Picker", {
			PlayerPickerIndex: this.playerIndex,
		})
		this.pickerComp.pickerInst = this.circlePickup

		//circlePickup_close
		this.circlePickup_close = this.runtime.objects["Circle"].createInstance("Ground_Marks", this.inst.x, this.inst.y)
		this.circlePickup_close.setSize(60, 60)
		this.circlePickup_close.isVisible = false
		this.inst.addChild(this.circlePickup_close, {
			transformX: true,
			transformY: true,
			destroyWithParent: true,
		})

		//circleGradient
		this.circleGradient = this.runtime.objects["Circle_Gradient"].createInstance("Ground_Marks", this.inst.x, this.inst.y)
		//this.circleGradient.setSize(100, 100)
		//this.circlePickup.isVisible = false
		this.circleGradient.colorRgb = this.runtime.colorUtils.ColorToRGBArray(this.color_)
		this.circleGradient.y -= this.circleGradient.height * 0.15
		this.inst.addChild(this.circleGradient, {
			transformX: true,
			transformY: true,
			destroyWithParent: true,
		})

		this.unit.Healthbar_Create()
		if (this.unit.healthBar) this.unit.healthBar.isVisible = true
	}

	Bar_TextC3(bar, args) {
		if (!bar) return
		const barText = Utils.World_GetChild(bar, "Text_Bar")
		if (barText) {
			Utils.TextC3(barText, args)
		}
	}

	Health_OnChanged() {
		//window.alert("Health_OnChanged")
		this.Bar_TextC3(this.bar_HP, {
			text: this.unit.healthComp.current + " / " + this.unit.healthComp.max,
			outlineBack: 6,
		})

		this.stats.SetStatValue("HP_Current", this.unit.healthComp.current)
		this.stats.SetStatValue("HP_Missing", this.unit.healthComp.max - this.unit.healthComp.current)
		this.stats.SetStatValue("HP_Missing_Percent", ((this.unit.healthComp.max - this.unit.healthComp.current) / this.unit.healthComp.max) * 100)
	}

	/*
	Option_HPBarCharacter(bool) {
		if (!this.unit) return
		if (bool) this.unit.Healthbar_Create()
		if (this.unit.healthBar) this.unit.healthBar.isVisible = bool
	}*/

	//* ============= INPUTS ==================

	Input_Shoot() {
		if (this.runtime.layout.name !== "GAME") return
		this.unit?.wepActive?.wepComp?.SimulateInputDown()
	}

	Input_Lock() {
		this.shop.service.LockItemMulti()
	}

	Tab_SingleShop(toRight = true) {
		if (!this.runtime.singlePlayer) return

		if (toRight) {
			const button_Go = this.shop.elemSingle.querySelector(".button_Go")
			this.SN.focus(button_Go)
		}
		if (!toRight) {
			const button_Reroll = this.shop.elemSingle.querySelector(".button_Reroll")
			this.SN.focus(button_Reroll)
		}
	}

	Tab_Left() {
		this.Tab_SingleShop(false)
		if (this.tab > 0) {
			this.tab--
			console.error("🛒 Tab_Left", this.tab)
			this.Tab_Update_InMulti()
		}
	}

	Tab_Right() {
		this.Tab_SingleShop(true)
		if (this.tab < 2) {
			this.tab++
			console.error("🛒 Tab_Right", this.tab)
			this.Tab_Update_InMulti()
		}
	}

	Tab_NavRow_UpdateInputIcons(navRow) {
		const leftIcon = navRow.querySelector("#leftIcon")
		const rightIcon = navRow.querySelector("#rightIcon")

		if (this.inputID === "KEY") {
			leftIcon.src = "Control_Key_X.png"
			rightIcon.src = "Control_Key_C.png"
		} else {
			leftIcon.src = "steamdeck_button_l1.png"
			rightIcon.src = "steamdeck_button_r1.png"
		}
	}

	Tab_Update_InMulti(forceIndex = -1) {
		if (this.runtime.singlePlayer) return

		const curMenuName = this.runtime.menu.CurMenuName()
		if (curMenuName === "endMenu_Multi") return

		if (forceIndex != -1) {
			this.tab = forceIndex
		}

		this.stats.ShowTabButtons(false)

		console.error("🛒 Tab_Update_InMulti", this.tab)

		this.multi_ShowingStats = !this.multi_ShowingStats

		let navRow = null
		let mainContainer = null
		let overlayStats = null

		if (curMenuName === "shopMenu_Multi") {
			navRow = this.shop.navRow
			mainContainer = this.shop.shopMulti_default
			overlayStats = this.shop.shopMulti_OverlayStats
		} else if (curMenuName === "shopStatsMenu_Multi") {
			navRow = this.shopStats.navRow
			mainContainer = this.shopStats.containerMulti
			overlayStats = this.shopStats.shopMulti_OverlayStats
		} else if (curMenuName === "endMenu_Multi") {
			navRow = this.endElem.querySelector("#navRow")
			mainContainer = this.endElem.querySelector("#end_PlayerInfo")
			overlayStats = this.endElem.querySelector("#shopMulti_OverlayStats")
		}

		this.Tab_NavRow_UpdateInputIcons(navRow)

		mainContainer.style.display = "none"
		overlayStats.style.display = "none"
		this.tooltip.DisplayNone()

		const LeftIcon = navRow.querySelector("#leftIcon")
		const RightIcon = navRow.querySelector("#rightIcon")
		const tabLabel = navRow.querySelector("#tabLabel")
		const tabLabel_Left = navRow.querySelector("#tabLabel_Left")
		const tabLabel_Right = navRow.querySelector("#tabLabel_Right")

		LeftIcon.style.visibility = this.tab === 0 ? "hidden" : "visible"
		RightIcon.style.visibility = this.tab === 2 ? "hidden" : "visible"

		tabLabel_Left.style.visibility = this.tab === 0 ? "hidden" : "visible"
		tabLabel_Right.style.visibility = this.tab === 2 ? "hidden" : "visible"

		let elemNav

		let tabNameKey_0 = "Menu_Shop_Shop"

		if (curMenuName === "shopMenu_Multi") {
			tabNameKey_0 = "Menu_Shop_Shop"
		} else if (curMenuName === "shopStatsMenu_Multi") {
			tabNameKey_0 = "Menu_Shop_Upgrades"
		} else if (curMenuName === "endMenu_Multi") {
			tabNameKey_0 = "Menu_Shop_Inventory"
		}

		if (this.tab === 0) {
			elemNav = mainContainer
			mainContainer.style.display = "flex"
			//! important to do something with left even if it's hidden otherwise alignment issue
			this.runtime.translation.Elem_SetTranslateKey(tabLabel_Left, "Anything")
			this.runtime.translation.Elem_SetTranslateKey(tabLabel, tabNameKey_0)
			this.runtime.translation.Elem_SetTranslateKey(tabLabel_Right, "Primary")
		}
		if (this.tab === 1) {
			elemNav = overlayStats
			overlayStats.style.display = "flex"
			this.stats.OpenTab("Primary")
			//this.runtime.translation.Elem_SetTranslateKey(tabLabel, "Menu_Shop_Stats")
			this.runtime.translation.Elem_SetTranslateKey(tabLabel_Left, tabNameKey_0)
			this.runtime.translation.Elem_SetTranslateKey(tabLabel, "Primary")
			this.runtime.translation.Elem_SetTranslateKey(tabLabel_Right, "Secondary")
		}
		if (this.tab === 2) {
			elemNav = overlayStats
			overlayStats.style.display = "flex"
			this.stats.OpenTab("Secondary")
			//this.runtime.translation.Elem_SetTranslateKey(tabLabel, "Menu_Shop_Stats")
			this.runtime.translation.Elem_SetTranslateKey(tabLabel_Left, "Primary")
			this.runtime.translation.Elem_SetTranslateKey(tabLabel, "Secondary")
		}

		this.SpatialNavigation(elemNav)

		if (this.playerIndex === 0) {
			if (curMenuName === "endMenu_Multi") {
				const endMenu_Multi = this.runtime.menu.nameToMenu.get("endMenu_Multi")
				const end_Footer = endMenu_Multi.querySelector("#end_Footer")
				this.SpatialNavigation([elemNav, end_Footer])
			}
		}

		this.tab_previous = this.tab
	}
}
