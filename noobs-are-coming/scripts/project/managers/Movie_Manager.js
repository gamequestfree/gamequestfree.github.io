const movie_offsetY = 30

export class Movie_Manager {
	constructor(runtime, contextOpts) {
		this.runtime = runtime

		runtime.addEventListener("beforeanylayoutstart", () => this.OnBeforeLayoutStart())
		runtime.addEventListener("beforeanylayoutend", () => this.OnBeforeLayoutEnd())

		runtime.addEventListener("tick", () => this.Tick())

		this.instFond = null

		this.movieUnits = new Set()

		this.currentScenetteId = null

		this.shakes = new Map()

		this.posOffset = [0, 0]
	}

	get heroes() {
		return this.runtime.hero.heroes
	}

	async PlayScene_BeforeShop() {
		const waveManager = this.runtime.waveManager
		const waveCount = waveManager.waveCount
		const difficulty = waveManager.difficulty

		if (waveCount === 1 && !this.runtime.main.IsDev()) {
			return await this.Scenette_Wave_1()
		}
		if (waveCount === 5) {
			return await this.Scenette_Wave_5()
		}
		if (waveCount === 10) {
			return await this.Scenette_Wave_10()
		}
		if (waveCount === 15 && difficulty === 1) {
			return await this.Scenette_Wave_15()
		}

		/*if (waveCount === 0) {
			this.runtime.hero.heroes = ["Hero_Freezard", "Hero_Dwelf"]
			return await this.Scenette_Hero_Intro()
		}*/

		if (this.heroes.length > 0) {
			return await this.Scenette_Hero_Intro()
		}

		//if no scene: null
		return null
	}

	async PlayScene_AfterShop() {
		const waveManager = this.runtime.waveManager
		const waveCount = waveManager.waveCount
		const difficulty = waveManager.difficulty

		if (waveCount !== 0) {
			if (this.heroes.length > 0) {
				return await this.Scenette_Hero_Intro()
			}
		}

		//if no scene: null
		return null
	}

	async Load_SceneData() {
		this.scenesData = await this.runtime.dataManager.DataFile_UrlToObject("output/_Scenes_SCENE.json")
		console.error("this.scenesData", this.scenesData)
	}

	CreateSceneFromData(sceneID, x, y) {
		const sceneData = this.scenesData[sceneID]
		if (!sceneData) return
		for (const unitData of sceneData) {
			const unit = this.SpawnAnim(unitData.AnimObject, x + unitData.Pos[0], y + unitData.Pos[1], {
				layer: "Objects",
				size: [unitData.Width, unitData.Height],
				sineXY: [5, 4, 1.2],
				moveComp: false,
			})
		}
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
	}

	Shake_Stop(name) {
		this.shakes.delete(name.toLowerCase())
	}

	Tick() {
		if (this.runtime.layout.name !== "GAME") return
		if (!this.layoutHasMovie) return

		const dt = this.runtime.dt

		let isShaking = false

		const posOffset = [0, 0]

		for (const [name, shake] of this.shakes.entries()) {
			if ((shake.mode !== 2) & (shake.remaining <= dt)) {
				this.shakes.delete(name)
			} else {
				isShaking = true
				let magX = shake.magX
				let magY = shake.magY
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

		if (!isShaking) {
			this.posOffset = [0, 0]
		}

		const layerAnchor = this.runtime.layout.getLayer("HUD")

		if (layerAnchor) {
			const layerAnchorViewport = layerAnchor.getViewport()

			//console.error("layerAnchorViewport", layerAnchorViewport)

			this.layersMovie.forEach((layerName) => {
				const layer = this.runtime.layout.getLayer(layerName)
				layer.scrollTo(layer.baseScrollX + posOffset[0], layer.baseScrollY + posOffset[1])
				//if (layerName === "Objects_BG0") console.error("getScrollPosition()", layerName, layer.getScrollPosition())
			})
		}

		this.Tick_Hero_Intro()
	}

	IsPlaying() {
		return this.currentScenetteId !== null
	}

	OnBeforeLayoutStart() {
		this.instFond = this.runtime.objects["BGFond"].getFirstInstance()

		const scenetteLayer = this.runtime.layout.getLayer("Scenette_BG0")

		if (scenetteLayer) {
			this.layoutHasMovie = true
			this.layersMovie = Array.from(scenetteLayer.allSubLayers()).map((layer) => layer.name)
			console.error("this.layersMovie", this.layersMovie)
			this.layersMovie.push(scenetteLayer.name)

			const layerAnchorViewport = this.runtime.layout.getLayer("HUD").getViewport()

			if (layerAnchorViewport) {
				//console.error("layerAnchorViewport", layerAnchorViewport)

				this.layersMovie.forEach((layerName) => {
					const layer = this.runtime.layout.getLayer(layerName)

					layer.baseScrollX = layerAnchorViewport.width / 2
					layer.baseScrollY = layerAnchorViewport.height / 2
					layer.scrollTo(layer.baseScrollX, layer.baseScrollY)
					//if (layerName === "Objects_BG0") console.error("getScrollPosition()", layerName, layer.getScrollPosition())
				})
			}
		} else {
			this.layersMovie = null
			this.shakes.clear()
			this.posOffset = [0, 0]
		}
	}

	OnBeforeLayoutEnd() {
		this.instFond = null
		this.currentScenetteId = null // Invalidate the active scenette
	}

	SpawnAnim(name, x, y, args = {}) {
		let instBase = this.instFond
		let offsetY = movie_offsetY
		if (args.baseParent) {
			instBase = args.baseParent.inst
			offsetY = 0
		}

		if (instBase) {
			x = instBase.x + x
			y = instBase.y + y + offsetY
		}

		const layer = args.layer || "Objects_BG0"
		//console.error("layer", this.runtime.layout.name, this.runtime.layout, layer, this.runtime.layout.getLayer(layer))

		let inst = this.runtime.objects["Anim"].createInstance(layer, x, y)

		const data = {
			AnimObject: name,
			UnitScale: args.UnitScale || 1.2,
			moveComp: args.moveComp || true,
		}

		if (this.runtime.dataManager.templatesData[data.AnimObject + "_FullBody"]) {
			data.AnimObject += "_FullBody"
		}

		const unit = new C4.Units.AnimOnly(this.runtime, inst, 0, data)

		if (args.size) {
			inst.width = args.size[0]
			inst.height = args.size[1]
		}

		if (args.left) inst.width *= -1
		if (args.noSine) unit.juice.Sine_Stop_All()
		if (args.sineXY) {
			const sineXY = args.sineXY
			const sineDuration = sineXY[2] || 0.5
			unit.juice.Sine_Stop_All()

			const random = Math.random()

			unit.juice.Sine_Start("Height", sineDuration, random, sineXY[0])
			unit.juice.Sine_Start("Width", sineDuration, random + 0.5, sineXY[1])
		}

		if (args.shadowOpacity) {
			unit.shadow.opacity = args.shadowOpacity
		}

		if (args.noShadow && unit.shadow) {
			unit.shadow.destroy()
			unit.shadow = null
		}
		if (args.destroyOnFinished) {
			unit.inst.addEventListener("animationend", () => {
				unit.DestroyUnit()
			})
		}

		if (args.heroName) {
			args.pseudo = true
		}

		if (args.pseudo) {
			let text = ""

			if (args.heroName) {
				text = this.runtime.translation.Get(unit.charaName)
			} else {
				text = this.runtime.main.Get_Pseudo()
			}

			const textLvl = this.runtime.objects["Text_Game"].createInstance(layer, unit.x, unit.AnimTopY() - 8)

			let pseudoStyle = {}

			if (args.pseudoStyle) pseudoStyle = args.pseudoStyle

			pseudoStyle.size = pseudoStyle.size || 5
			pseudoStyle.color = pseudoStyle.color || "#00ff00"
			pseudoStyle.text = text
			pseudoStyle.outlineBack = 5

			Utils.TextC3(textLvl, pseudoStyle)

			unit.inst.addChild(textLvl, {
				transformX: true,
				transformY: true,
				destroyWithParent: true,
			})
		}

		if (args.baseParent) {
			instBase.addChild(inst, {
				transformX: true,
				transformY: true,
				destroyWithParent: true,
			})
		}

		this.movieUnits.add(unit.uid)

		return unit
	}

	SpawnPlayer(id = -1, x, y, args = {}) {
		let player = this.runtime.player
		if (id === -1) {
			const playersAlive = Array.from(this.runtime.playersAlive)
			player = Utils.Array_Random(playersAlive)
		}
		let AnimObject = player.unit.AnimObject_FullBody()

		if (!args.pseudoStyle) {
			args.pseudoStyle = {
				color: "#ff0000",
			}
		}

		const unit = this.SpawnAnim(AnimObject, x, y, args)

		unit.SetOutline(player.color_)

		return unit
	}

	async Scene_Start() {
		this.sceneRefs = {}

		await this.runtime.shutters.Shutters_CloseOpen()

		this.runtime.layout.getLayer("HUD_HTML").isVisible = false

		this.runtime.layout.getLayer("NoobsBG").isVisible = true
		this.runtime.layout.getLayer("FG_Above_BG0").isVisible = true
		this.runtime.layout.getLayer("FireShop_BG0").isVisible = false

		this.runtime.layout.getLayer("FondMovie_BG0").isVisible = true
		this.runtime.layout.getLayer("Fade_BG0").isVisible = false
	}

	async Scene_End() {
		await this.runtime.shutters.Shutters_CloseOpen()

		this.sceneRefs = {}

		this.currentScenetteId = null

		for (const uid of Array.from(this.movieUnits)) {
			const unit = this.runtime.getUnitByUID(uid)
			if (unit) unit.DestroyUnit()
			continue
			const inst = this.runtime.getInstanceByUid(uid)
			if (inst) inst.destroy()
		}
		this.movieUnits.clear()

		const sdkLayer_objects = sdk_runtime.GetMainRunningLayout().GetLayer("Objects_BG0")
		const sdkLayer_shadows = sdk_runtime.GetMainRunningLayout().GetLayer("Shadows_BG0")
		for (const inst of sdkLayer_objects._instances) {
			sdk_runtime.DestroyInstance(inst)
		}
		for (const inst of sdkLayer_shadows._instances) {
			sdk_runtime.DestroyInstance(inst)
		}

		this.runtime.layout.getLayer("FondMovie_BG0").isVisible = false
		this.runtime.layout.getLayer("Fade_BG0").isVisible = false

		this.runtime.layout.getLayer("NoobsBG").isVisible = false
		this.runtime.layout.getLayer("FG_Above_BG0").isVisible = false
	}

	// Helper function to generate a unique scenette ID
	generateScenetteId() {
		return Symbol() // Creates a unique identifier
	}

	// Function to check if the scenette should stop execution
	isCanceled(scenetteId) {
		return this.currentScenetteId !== scenetteId
	}

	// Improved delay function that stops if the scenette is no longer active
	async delay(seconds, scenetteId) {
		let remainingTime = seconds * 1000

		let ret = null

		while (ret === null && remainingTime > 0) {
			if (this.isCanceled(scenetteId)) {
				ret = false // Stop if another scenette started
				break
			}

			const tick = Math.min(100, remainingTime)
			await new Promise((resolve) => setTimeout(resolve, tick))

			if (!this.runtime.isPause) {
				remainingTime -= tick
			} else {
				while (this.runtime.isPause) {
					if (this.isCanceled(scenetteId)) {
						ret = false
						break
					}
					await new Promise((resolve) => setTimeout(resolve, 100))
				}
			}
		}

		if (ret === null) ret = true

		/*if (ret === false) {
			this.sceneRefs = null
		}*/

		return ret
	}

	async Scenette_Wave_1() {
		const scenetteId = this.generateScenetteId()
		this.currentScenetteId = scenetteId
		await this.Scene_Start()
		if (this.isCanceled(scenetteId)) return false

		const noob1 = this.SpawnAnim("Noob_1", -40, 0, {
			left: false,
			pseudo: true,
		})
		const noob2 = this.SpawnAnim("Noob_Couette", 40, 0, {
			left: true,
			pseudo: true,
		})

		if (!(await this.delay(0.3, scenetteId))) return false
		noob1.Bark("Scene1_D1", { duration: 1 })

		if (!(await this.delay(1.2, scenetteId))) return false
		noob2.Bark("Scene1_D2")

		if (!(await this.delay(1, scenetteId))) return false
		this.PlaySound("Skill_Impact_Start")

		if (!(await this.delay(0.2, scenetteId))) return false

		//* Explode everything
		const player = this.SpawnPlayer(-1, 0, 0, {
			left: false,
		})
		const fx = this.SpawnAnim("FX_AirStrike_Impact", 0, 0, {
			left: true,
			noSine: true,
			noShadow: true,
			destroyOnFinished: true,
		})

		this.PlaySound("Skill_Impact_Execute")
		//this.runtime.camera.RotateShake(true)
		this.Shake({
			Mag: [0, 5],
		})

		if (!(await this.delay(0.1, scenetteId))) return false

		noob1.OnDestroyed_VFX()
		noob2.OnDestroyed_VFX()

		if (!(await this.delay(0.3, scenetteId))) return false
		player.Bark("Boss")

		if (!(await this.delay(1.7, scenetteId))) return false
		await this.Scene_End()
		return true
	}

	async Scenette_Wave_5() {
		const scenetteId = this.generateScenetteId()
		this.currentScenetteId = scenetteId
		await this.Scene_Start()
		if (this.isCanceled(scenetteId)) return false

		const player = this.SpawnPlayer(-1, -80, 0, {
			left: false,
		})
		const chevalier = this.SpawnAnim("Noob_Chevalier", 80, 0, {
			left: true,
			pseudo: true,
		})

		if (!(await this.delay(0.2, scenetteId))) return false

		chevalier.Bark("KnightLeeroy")

		if (!(await this.delay(0.3, scenetteId))) return false

		//*PREPARE

		this.PlaySound("CuteMob_Prepare", 0.7)
		chevalier.SetOutline([1, 0, 0])
		chevalier.juice.Shake()

		if (!(await this.delay(0.5, scenetteId))) return false

		this.PlaySound("CuteMob_ATK_1", 0.7)

		chevalier.moveComp.Set_AngleOfMotion(180)
		chevalier.moveComp.Set_Speed(300)

		if (!(await this.delay(0.5, scenetteId))) return false

		chevalier.OnDestroyed_VFX()

		player.juice.Roll()
		/*player.juice.Spring_StartOffset("angle", {
			name: "Offset_Angle",
		})
		player.juice.GetSpring("Offset_Angle").SetPos(50)*/

		if (!(await this.delay(0.5, scenetteId))) return false

		player.Bark("Boss")

		if (!(await this.delay(0.8, scenetteId))) return false

		await this.Scene_End()
		return true
	}

	async Scenette_Wave_10() {
		const scenetteId = this.generateScenetteId()
		this.currentScenetteId = scenetteId
		await this.Scene_Start()
		if (this.isCanceled(scenetteId)) return false

		const barbare = this.SpawnAnim("Noob_2", -100, -2, {
			left: false,
			pseudo: "Barbare",
		})
		const rogue = this.SpawnAnim("Noob_Rogue", -50, 4, {
			left: false,
			pseudo: "Rogue",
		})

		const frog = this.SpawnAnim("Noob_Frog", 35, -3, {
			left: true,
			pseudo: "Frog",
		})
		const mage = this.SpawnAnim("Noob_Mage", 70, 10, {
			left: true,
			pseudo: "Mage",
		})
		const buffer = this.SpawnAnim("Noob_Buffer", 100, 0, {
			left: true,
			pseudo: "Buffer",
		})

		this.runtime.objects["FX_SmoothFire"].createInstance("Objects_BG0", this.instFond.x, this.instFond.y + movie_offsetY)

		if (!(await this.delay(0.7, scenetteId))) return false

		buffer.Bark("Scene10_D1")

		if (!(await this.delay(1.5, scenetteId))) return false

		barbare.Bark("Scene10_D2")

		if (!(await this.delay(2, scenetteId))) return false

		await this.Scene_End()

		return true
	}

	Tick_Hero_Intro() {
		if (this.tweenHeroIntro && !this.tweenHeroIntro.isReleased) {
			const tweenValue = this.tweenHeroIntro.value

			this.sceneRefs.playerParent.x = 265 - tweenValue
			this.sceneRefs.heroesParent.x = 265 + tweenValue
		}
	}

	async Scenette_Hero_Intro() {
		const scenetteId = this.generateScenetteId()
		this.currentScenetteId = scenetteId
		await this.Scene_Start()
		if (this.isCanceled(scenetteId)) return false

		this.runtime.layout.getLayer("FondMovie_BG0").isVisible = false
		this.runtime.layout.getLayer("Fade_BG0").isVisible = true

		this.runtime.audio.StopMusic()
		this.PlaySound("BossIntro_2", 1)

		const outsideValue = 300
		const middleValue = 110
		const middleValue_Smooth = 100

		//* SPAWN PLAYER AND HEROES

		const playerParent = this.SpawnAnim("AnimInvisible", -outsideValue, 0, {
			noShadow: true,
		})
		const heroesParent = this.SpawnAnim("AnimInvisible", outsideValue, 0, {
			noShadow: true,
		})

		/*const circleProj_player = Utils.World_CreateChildOn(playerParent, "Circle_Proj", "Objects_BG0")
		const circleProj_heroes = Utils.World_CreateChildOn(heroesParent, "Circle_Proj", "Objects_BG0")*/

		/*const circleProj_player = Utils.World_CreateChildOn(playerParent, "TitleGround", "Objects_BG0", {
			templateName: "BossIntro",
		})
		const circleProj_heroes = Utils.World_CreateChildOn(heroesParent, "TitleGround", "Objects_BG0", {
			templateName: "BossIntro",
		})*/

		const player = this.SpawnPlayer(-1, 0, 0, {
			heroName: true,
			left: false,
			baseParent: playerParent,
			shadowOpacity: 0.8,
			pseudoStyle: {
				color: "#ff0000",
				size: 6,
			},
			UnitScale: 1.4,
		})

		const heroesToSpawn = [...this.heroes]

		for (const heroMainToSpawn of this.heroes) {
			const dataInst = this.runtime.dataManager.dataInstances["Charas"].get(heroMainToSpawn)

			if (dataInst && dataInst.heroFriends) {
				for (const heroFriend of dataInst.heroFriends) {
					heroesToSpawn.push(heroFriend)
				}
			}
		}

		const heroesAnim = []

		for (let i = 0; i < heroesToSpawn.length; i++) {
			const heroName = heroesToSpawn[i]

			//repartir les héros sur la ligne tous les 30 px
			let x = 40 * (i - Math.floor(heroesToSpawn.length / 2))
			x += Utils.random(-5, 5)
			let y = Utils.random(-2, 2)
			y += i % 2 === 0 ? -12 : 12

			const heroAnim = this.SpawnAnim(heroName, x, y, {
				heroName: true,
				left: true,
				sineXY: [5, 4, 1.2],
				baseParent: heroesParent,
				shadowOpacity: 0.8,
				pseudoStyle: {
					size: 6,
				},
				UnitScale: 1.4,
			})
			heroAnim.SetOutline([1, 0, 0])

			heroesAnim.push(heroAnim)
		}

		//sort heroesAnim order by y using moveToBottom()
		heroesAnim.sort((a, b) => b.y - a.y)
		for (const heroAnim of heroesAnim) {
			heroAnim.inst.moveToBottom()
		}

		//* INTRO TWEENING

		this.sceneRefs = {
			playerParent: playerParent,
			heroesParent: heroesParent,
		}

		playerParent.timerComp.Timer_Start("Intro_Shake", 0.3, () => {
			this.tweenHeroIntro = playerParent.tweenBeh.startTween("value", middleValue, 0.5, "out-elastic", {
				startValue: outsideValue,
			})

			playerParent.timerComp.Timer_Start("Intro_Shake", 0.3, () => {
				playerParent.juice.Shake()
				heroesParent.juice.Shake()

				const versus = this.runtime.objects["Versus"].createInstance("Objects_BG0", this.instFond.x, this.instFond.y)
				const versusTweenBeh = versus.behaviors["Tween"]
				versus.setSize(0, 0)
				versusTweenBeh.startTween("size", [57, 57], 0.3, "out-elastic")

				this.movieUnits.add(versus.uid)
			})

			this.tweenHeroIntro.finished.then(() => {
				this.tweenHeroIntro = playerParent.tweenBeh.startTween("value", middleValue_Smooth, 4, "linear", {
					startValue: middleValue,
				})
			})
		})

		if (!(await this.delay(1.5, scenetteId))) return false

		const randHero = Utils.Array_Random(heroesAnim)
		randHero.Bark_Hero()

		if (!(await this.delay(1.7, scenetteId))) return false

		const versus = this.runtime.objects["Versus"].getFirstInstance()
		if (versus) {
			const versusTweenBeh = versus.behaviors["Tween"]
			versusTweenBeh.startTween("size", [0, 0], 0.3, "in-back", {
				destroyOnFinished: true,
			})
		}

		if (!(await this.delay(0.3, scenetteId))) return false

		await this.Scene_End()
		this.runtime.audio.PlayMusic_Spec("Boss_SombreGrivoiseries_DirectDrop")
		return true
	}

	async Scenette_Mergoboy_1() {
		//
	}

	async Scenette_Mergoboy_2() {
		//
	}

	async Scenette_Wave_19_Overboy() {
		const scenetteId = this.generateScenetteId()
		this.currentScenetteId = scenetteId
		await this.Scene_Start()
		if (this.isCanceled(scenetteId)) return false

		this.runtime.audio.StopMusic()
		this.PlaySound("DarkMagic_Ambient", 0.9)

		const player = this.SpawnPlayer(-1, -40, 0, {
			left: false,
		})

		if (!(await this.delay(0.5, scenetteId))) return false

		this.PlaySound("Skill_Impact_Start")

		if (!(await this.delay(0.2, scenetteId))) return false

		//* Overboy apparition

		const overboy = this.SpawnAnim("Play_Overboy_Big", 40, 0, {
			left: true,
			sineXY: [5, 4, 1.2],
			pseudoStyle: {
				color: "#ff0000",
			},
		})
		overboy.SetOutline([1, 0, 0])
		const fx = this.SpawnAnim("FX_AirStrike_Impact", 40, 0, {
			left: true,
			noSine: true,
			noShadow: true,
			destroyOnFinished: true,
		})
		this.PlaySound("Skill_Impact_Execute")

		if (!(await this.delay(0.8, scenetteId))) return false

		//* YOU DARE TO CHALLENGE ME ?

		overboy.Bark("Scene19_D1")

		if (!(await this.delay(1, scenetteId))) return false

		this.PlaySound("DarkMagic_Promo")
		if (!(await this.delay(0.7, scenetteId))) return false

		this.runtime.objects["FX_Promotion"].createInstance("Objects_BG0", overboy.x, overboy.y)
		if (!(await this.delay(0.1, scenetteId))) return false

		//* OVERBOY TURN INTO BOSS

		overboy.DestroyUnit()
		const overboyBigger = this.SpawnAnim("Play_Overboy_Bigger", 40, 0, {
			left: true,
			sineXY: [5, 4, 1.2],
		})
		overboyBigger.SetOutline([1, 0, 0])

		overboyBigger.juice.Shake()
		const spring = overboyBigger.juice.Spring_StartOffset("size2D", {
			name: "size_offset",
		})
		spring.SetPos([-10, 10])

		if (!(await this.delay(1, scenetteId))) return false

		await this.Scene_End()
		return true
	}

	async Scenette_Wave_15() {
		const scenetteId = this.generateScenetteId()
		this.currentScenetteId = scenetteId
		await this.Scene_Start()
		if (this.isCanceled(scenetteId)) return false

		this.runtime.audio.StopMusic()
		this.PlaySound("DarkMagic_Ambient", 0.9)
		const player = this.SpawnPlayer(-1, -40, 0, {
			left: false,
		})
		if (!(await this.delay(0.5, scenetteId))) return false

		this.PlaySound("Skill_Impact_Start")
		if (!(await this.delay(0.2, scenetteId))) return false

		//* Overboy apparition

		const overboy = this.SpawnAnim("Play_Overboy_Big", 40, 0, {
			left: true,
			sineXY: [5, 4, 1.2],
		})
		overboy.SetOutline([1, 0, 0])
		const fx = this.SpawnAnim("FX_AirStrike_Impact", 40, 0, {
			left: true,
			noSine: true,
			noShadow: true,
			destroyOnFinished: true,
		})
		this.PlaySound("Skill_Impact_Execute")
		if (!(await this.delay(0.8, scenetteId))) return false

		//* GOOD JOB
		overboy.Bark("Scene15_D1")
		if (!(await this.delay(0.1, scenetteId))) return false

		this.PlaySound("DarkMagic_Promo")
		if (!(await this.delay(0.7, scenetteId))) return false

		this.runtime.objects["FX_Promotion"].createInstance("Objects_BG0", player.x, player.y)
		if (!(await this.delay(0.2, scenetteId))) return false

		player.DestroyUnit()

		if (!(await this.delay(1, scenetteId))) return false

		await this.Scene_End()
		return true
	}

	PlaySound(...args) {
		return this.runtime.audio.PlaySound(...args)
	}
}
