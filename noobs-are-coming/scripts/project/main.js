import { Audio_Manager } from "./managers/Audio_Manager.js"
import { SaveSystem } from "./managers/SaveSystem.js"

import { Layout_Game } from "./managers/Layout_Game.js"
import { Layout_Title } from "./managers/Layout_Title.js"

import { Events_Global } from "./managers/Events_Global.js"
import { Menu_Manager } from "./managers/Menu_Manager.js"
import { Shutters_Manager } from "./managers/Shutters_Manager.js"

import { Info_Manager } from "./managers/Info_Manager.js"

import { Input_Manager } from "./managers/Input_Manager.js"

import { Movie_Manager } from "./managers/Movie_Manager.js"

import { Style_Manager } from "./managers/Style_Manager.js"

import { Data_Manager } from "./managers/Data_Manager.js"
import { RichText } from "./managers/RichText.js"
import { Item_Manager } from "./managers/Item_Manager.js"
import { Hero_Manager } from "./managers/Hero_Manager.js"
import { Spawn_Manager } from "./managers/Spawn_Manager.js"
import { Wave_Manager } from "./managers/Wave_Manager.js"
import { Player } from "./managers/Player.js"
import { Pool_Manager } from "./managers/Pool_Manager.js"
import { Utils_ } from "./managers/Utils_.js"
import { UtilsColors_ } from "./managers/UtilsColors_.js"
import { Unit_Manager } from "./managers/Unit_Manager.js"
import { Camera } from "./managers/Camera.js"
import { Raycast } from "./managers/Raycast.js"
import { Timer_Manager } from "./managers/Timer_Manager.js"
import { Translation_Manager } from "./managers/Translation_Manager.js"
import { Coop_Manager } from "./managers/Coop_Manager.js"
import { Pointburst_Manager } from "./managers/Pointburst_Manager.js"
import { Pickup_Manager } from "./managers/Pickup_Manager.js"

import { Sine_Manager } from "./managers/Sine_Manager.js"

import { ZOrder_Manager } from "./managers/ZOrder_Manager.js"
import { FX_Manager } from "./managers/FX_Manager.js"
import { Progress } from "./managers/Progress.js"
import { Community_Manager } from "./managers/Community_Manager.js"

import { Platform_Steamworks } from "./managers/Platform_Steamworks.js"

import { Platform_Newgrounds } from "./managers/Platform_Newgrounds.js"
import { Platform_Pipelab } from "./managers/Platform_Pipelab.js"
import { Platform_Filesystem } from "./managers/Platform_Filesystem.js"
import { Platform_NWJS } from "./managers/Platform_NWJS.js"
import { Platform_Twitch } from "./managers/Platform_Twitch.js"
import { Platforms } from "./managers/Platforms.js"

import { Special_Manager } from "./managers/Special_Manager.js"

import { Main_Manager } from "./managers/Main_Manager.js"

//import { Composition_Manager } from "./ecs/Composition_Manager.js"

//TODO runtime.sortZOrder(iterable, callback)

runOnStartup(async (runtime) => {
	
	console.error("runtime", runtime)
	globalThis.runtime = runtime

	new SaveSystem(runtime)

	runtime.events = new Events_Global(runtime)
	console.error("runtime.events", runtime.events)

	runtime.translation = new Translation_Manager(runtime)
	runtime.utils = new Utils_(runtime)
	runtime.colorUtils = new UtilsColors_(runtime)

	runtime.input = new Input_Manager(runtime)

	const C3html = document.createElement("div")
	C3html.classList.add("c3html")
	const C3htmlwrap = document.querySelector(".c3htmlwrap")
	C3htmlwrap.appendChild(C3html)

	runtime.utils.Elem_SetStyle(C3html, {
		position: "relative",
		width: "100%",
		height: "100%",
		overflow: "hidden",
		userSelect: "none",
		WebkitUserSelect: "none",
		MozUserSelect: "none",
		msUserSelect: "none",
	})

	runtime.special = new Special_Manager(runtime)

	runtime.renderer = sdk_runtime.GetCanvasManager().GetIRenderer()

	runtime.info = new Info_Manager(runtime)

	runtime.timer = new Timer_Manager(runtime)
	runtime.camera = new Camera(runtime)
	runtime.units = new Unit_Manager(runtime)

	runtime.audio = new Audio_Manager(runtime)

	runtime.main = new Main_Manager(runtime)

	runtime.itemManager = new Item_Manager(runtime)

	runtime.steamworks = new Platform_Steamworks(runtime)
	runtime.pipelabWrapper = new Platform_Pipelab(runtime)
	runtime.filesystemWrapper = new Platform_Filesystem(runtime)
	runtime.nwjsWrapper = new Platform_NWJS(runtime)

	//! platforms before menu
	runtime.platforms = new Platforms(runtime)
	//! THOSE MUST BE AFTER platforms init
	runtime.twitch = new Platform_Twitch(runtime)
	runtime.newgrounds = new Platform_Newgrounds(runtime)

	runtime.dataManager = new Data_Manager(runtime)

	runtime.movie = new Movie_Manager(runtime)

	runtime.richText = new RichText(runtime)

	runtime.zOrder = new ZOrder_Manager(runtime)
	runtime.fxManager = new FX_Manager(runtime)

	runtime.pointburst = new Pointburst_Manager(runtime)
	runtime.pickups = new Pickup_Manager(runtime)

	runtime.style = new Style_Manager(runtime)

	runtime.sineManager = new Sine_Manager(runtime)

	runtime.players = []
	runtime.playersEnabled = new Set()
	runtime.playersAlive = new Set()

	Object.defineProperty(runtime, "singlePlayer", {
		get() {
			return this.playersEnabled.size < 2
		},
	})

	runtime.player = new Player(runtime, 0, null)
	runtime.player2 = new Player(runtime, 1, 1)
	runtime.player3 = new Player(runtime, 2, 2)
	runtime.player4 = new Player(runtime, 3, 3)

	runtime.cheatShop = false
	runtime.unlockAll = false

	runtime.spawnManager = new Spawn_Manager(runtime)
	runtime.hero = new Hero_Manager(runtime)
	runtime.waveManager = new Wave_Manager(runtime)

	runtime.pool = new Pool_Manager(runtime)

	runtime.shutters = new Shutters_Manager(runtime)
	runtime.menu = new Menu_Manager(runtime)

	//after menu init
	new Progress(runtime)
	new Community_Manager(runtime)
	runtime.coop = new Coop_Manager(runtime)

	runtime.raycast = new Raycast(runtime)

	//layouts
	runtime.layouts = []
	runtime.layouts.push(new Layout_Title(runtime))
	runtime.layouts.push(new Layout_Game(runtime))

	/*
	const compositionManager = new Composition_Manager(runtime)
	runtime.compositionManager = compositionManager*/

	runtime.addLoadPromise(runtime.dataManager.LoadData())

	runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime))
	runtime.addEventListener("beforeanylayoutstart", () => OnBeforeLayoutStart(runtime))

	runtime.addEventListener("tick", () => Tick_Stats(runtime))

	//disable annoying stuff
	document.addEventListener("keydown", (event) => {
		if (event.key === "Tab") {
			event.preventDefault()
		}
	})
})

function Tick_Stats(runtime) {
	const text = runtime.objects["DebugText_Stats"].getFirstInstance()

	const gamepadLine = navigator
		.getGamepads()
		.map((gamepad) => (gamepad ? 1 : "null"))
		.join(", ")

	const gamepads = runtime.input.gamepads
	const activeLine = gamepads.map((gamepad) => gamepad.isActive || gamepad.wasActive).join(", ")

	if (!text) return
	text.text = `[color=#ffffff][background=#000000]
    FPS: ${runtime.framesPerSecond}
    Ticks: ${runtime.ticksPerSecond} (${runtime.framerateMode})
    CPU: ${(runtime.cpuUtilisation * 100).toFixed(1)}% & GPU: ${(runtime.gpuUtilisation * 100).toFixed(1)}%
    CharaCount: ${runtime.objects["Chara"].getAllInstances().length}
    CollisionCellSize: ${runtime.collisions.getCollisionCellSize()}
    CollisionChecks: ${runtime.collisions.getCollisionCellSize()}
    WindowSize (css): ${runtime.platformInfo.canvasCssWidth} x ${runtime.platformInfo.canvasCssHeight}
    WindowSize (device): ${runtime.platformInfo.canvasDeviceWidth} x ${runtime.platformInfo.canvasDeviceHeight}
    ObjectCount: ${runtime.callFunction("ObjectCount")}
    Gamepads: ${gamepadLine}
    Actives: ${activeLine}
    Export: ${runtime.platforms.Export} (${runtime.main.version})
    `
}

//! HELP DEBUG: force multiplayer

/*function OnBeforeProjectStart(runtime) {
	//
}*/

function OnBeforeLayoutStart(runtime) {
	//
}

async function OnBeforeProjectStart(runtime) {
	let forcePlayerCount = 1

	//forcePlayerCount = Utils.randomInt(1, 4)
	//

	const forceCharas = ["Gorilla"]

	const addRandomAtk = true

	requestAnimationFrame(() => {
		if (runtime.layout.name === "GAME") {
			let itemPool = Array.from(runtime.dataInstances["Items"]).map((a) => a[1])

			let charaPool = itemPool.filter((a) => a.HasTag("Playable") && !a.lockedBy)
			itemPool = itemPool.filter((a) => !a.locked)
			let wepPool = itemPool.filter((a) => a.HasTag("Weapon")).filter((a) => a.evolution === 0)

			let forceCharaPool = charaPool.filter((a) => forceCharas.some((chara) => a.name.includes(chara)))
			if (forceCharaPool.length > 0) {
				charaPool = forceCharaPool
			}

			if (forcePlayerCount > 1) {
				const player0 = runtime.player

				player0.SetInputID("KEY")
				//player0.shop.element = player0.shop.elemMulti

				for (let i = 0; i < forcePlayerCount; i++) {
					const player = runtime.players[i]
					if (i !== 0) player.SetInputID(i - 1)
					player.SetPlayerEnabled(true)
				}
			}

			for (const player of runtime.playersEnabled) {
				player.startRun_chara = Utils.Array_Random(charaPool)
				player.startRun_wep = Utils.Array_Random(wepPool)

				if (addRandomAtk) {
					player.randomAtks = []
					for (let i = 0; i < 5; i++) {
						const randWep = Utils.Array_Random(wepPool)
						player.randomAtks.push(randWep)
					}
				}
			}
		}
	})
}

function OnBeforeLayoutStart_(runtime) {
	/*const layoutName = runtime.layout.name
	if (layoutName === "SPRITES" || layoutName === "GAME") {
		runtime.goToLayout("GAME")
	}*/
}
