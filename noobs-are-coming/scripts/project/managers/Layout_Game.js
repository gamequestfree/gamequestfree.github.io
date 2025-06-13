import { Layout } from "./Layout.js"

/*import { LineAnimator } from "../game/misc/LineAnimator.js"
import { RopeAnimator } from "../game/misc/RopeAnimator.js"
import { LaserHolder } from "../game/misc/LaserHolder.js"*/

export class Layout_Game extends Layout {
	constructor(runtime) {
		super(runtime, "Game")

		//runtime.laserHolder = new LaserHolder(runtime)
		//runtime.lineAnimator = new LineAnimator(runtime)
		//runtime.ropeAnimator = new RopeAnimator(runtime)
	}

	PreStart(e) {}

	Start(e) {
		//! don't unlock achievements in full unlock mode
		this.runtime.main.canUnlockAchievements = true
		if (this.runtime.main.IsUnlockAll() && this.runtime.platforms.Export !== "preview" && !this.runtime.player.shop.cheatShop) {
			this.runtime.main.canUnlockAchievements = false
		}

		this.runtime.isPause = false

		this.runtime.timeScale_game = 1
		this.runtime.timeScale = 1

		this.runtime.gameOver = false

		this.runtime.playersAlive.clear()

		this.runtime.layout.getLayer("FireStart_BG0").isVisible = false

		this.runtime.audio.StopMusic()
		this.runtime.audio.PlayRandomMusic()

		this.SetRandomGround()
	}

	UpdateGround() {
		//
	}

	SetRandomGround(mapSkin = null) {
		const areaTextures_before = this.runtime.objects["TileBG"].getAllInstances()
		for (const areaTexture of areaTextures_before) {
			areaTexture.destroy()
		}

		const area = this.runtime.objects["Area_Spawn"].getFirstInstance()

		/*const array = ["Main", "Sand", "Frozen", "Mysterious", "HL1", "HL2", "HL4", "HL3"]
		const rand = Utils.Array_Random(array)
		let bgName = "TiledBG_" + rand*/

		//let bgName = "TiledBG_Main"

		let bgName = "TiledBG_Spawn"

		if (mapSkin) bgName = mapSkin

		const skin = this.runtime.style.skin?.TiledBG
		if (skin) {
			bgName = "TiledBG_" + Utils.Array_Random(skin)
		}

		const tiledBGObject = this.runtime.objects[bgName]
		console.error("tiledBGObject", bgName, tiledBGObject)

		const randTexture = tiledBGObject.createInstance("Ground", area.x, area.y)
		randTexture.setSize(area.width, area.height)
		randTexture.setPosition(area.x, area.y)

		//* Mesh Pserspective
		/*
		randTexture.createMesh(2, 2)
		const offset = 0.05
		randTexture.setMeshPoint(0, 0, {
			x: offset,
			y: 0,
		})
		randTexture.setMeshPoint(1, 0, {
			x: 1 - offset,
			y: 0,
		})*/

		this.runtime.main.mapSkin = randTexture.objectType.name

		//! C3 bug, it only works with requestAnimationFrame (adding child to a just created object picked by getAllInstances)
		requestAnimationFrame(() => {
			const areaTextures = this.runtime.objects["TileBG"].getAllInstances()
			for (const areaTexture of areaTextures) {
				const vignette = this.runtime.objects["PostPro_Vignette"].createInstance("Ground", areaTexture.x, areaTexture.y)
				vignette.opacity = 0.9
				vignette.setSize(areaTexture.width, areaTexture.height)
				areaTexture.addChild(vignette, {
					transformX: true,
					transformY: true,
					transformWidth: true,
					transformHeight: true,
					destroyWithParent: true,
				})

				Utils.World_CopyMesh(vignette, areaTexture)

				Utils.AddBorders(areaTexture, "Solid_Border", "Objects")
				Utils.AddCorners(areaTexture, "Corner", "Ground")
				Utils.AddBorders(areaTexture, "TiledBG_Border", "Ground")
			}
		})

		/*
		//random tileBG
		const randTexture = Utils.Array_Random(areaTextures)
		const area = this.runtime.objects["Area_Spawn"].getFirstInstance()
		randTexture.setSize(area.width, area.height)
		randTexture.setPosition(area.x, area.y)*/
	}

	End(e) {
		for (const player of this.runtime.players) {
			player.Reset()
		}
	}

	PreTick() {
		//clear DrawingCanvas
		this.runtime.fxManager.PreTick()
	}

	Tick() {
		this.runtime.zOrder.SortZ()
		this.runtime.fxManager.Tick_Glow()
	}

	/*
	DrawRectangle() {
		const toDel = this.runtime.objects["ToDel"].getFirstInstance()
		const iRenderer = this.runtime.renderer
		const bbox = toDel.getBoundingBox()

		iRenderer.setAlphaBlendMode()
		iRenderer.setColorFillMode()
		iRenderer.setColor([1, 0, 0, 1])
		iRenderer.rect(bbox)

		console.error("draw rectangle")
	}*/

	/*
function OnBeforeLayoutStart(runtime) {
	const colorPickerInstances = runtime.objects["ColorPicker"].getAllInstances()
	const colorsData = {}
	console.error("colorsData", colorsData)
	for (let i = 0; i < 25; i++) {
		colorsData[i] = {}
	}
	for (const colorPicker of colorPickerInstances) {
		const vars = colorPicker.instVars
		if (vars.WorldID === "" || vars.TypeID === "") {
			continue
		}
		colorsData[parseInt(vars.WorldID)][vars.TypeID] = rgbToHex(colorPicker.colorRgb)
	}

}

function rgbToHex(colorRgb) {
	// Destructure the RGB array
	let [r, g, b] = colorRgb

	// Convert each component to the range of 0-255 and then to a hex string
	r = Math.round(r * 255)
		.toString(16)
		.padStart(2, "0")
	g = Math.round(g * 255)
		.toString(16)
		.padStart(2, "0")
	b = Math.round(b * 255)
		.toString(16)
		.padStart(2, "0")

	// Combine the hex values
	return `#${r}${g}${b}`
}*/
}
