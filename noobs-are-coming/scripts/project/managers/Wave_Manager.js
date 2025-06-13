export class Wave_Manager {
	constructor(runtime) {
		this.runtime = runtime

		this.runtime.events.addEventListener("OnGameStart", (e) => this.OnGameStart(e))
		this.runtime.events.addEventListener("OnGameTick", (e) => this.Tick(e))
		this.runtime.events.addEventListener("OnGameEnd", (e) => this.OnGameEnd(e))
		//this.runtime.addEventListener("beforeprojectstart", () => this.OnBeforeProjectStart())

		this.difficulty = 1
		this.difficultyItem = 0

		this.isEndless = false

		this.maxMobCount = 100

		this.wave_enforce = 1
		this.wave_OnGameStart = true

		this.waves = new Map()
		this.runningWaves = new Set()

		this.zoneName = null
		this.zoneData = null

		this.waveMax = 15

		this.isWaving = false

		this.noSpawnThisWave = false
	}

	WaveScale() {
		return 1 / this.runtime.main.GetSharedStat_Average_Cache("Wave_Scale")
	}

	OnGameEnd(e) {
		this.bandes = null
	}

	LoadZone(name) {
		if (name === this.zoneName) return
		const loadingZoneData = this.runtime.loadedData["Zones"].get(name)

		if (!loadingZoneData) {
			return
		}
		this.zoneName = name
		this.zoneData = loadingZoneData

		const rules = this.zoneData._Rules

		for (const [key, value] of Object.entries(this.zoneData)) {
			if (key === "_Rules") continue
			const waveName = key.toString()
			this.waves.set(waveName, new Wave(runtime, waveName, value, rules))

			if (parseInt(key) > this.waveMax) {
				this.waveMax = parseInt(key)
			}
		}

		console.error("zoneData", this.zoneData)
		console.error("waves", this.waves)
	}

	OnGameStart(e) {
		//! weird fix
		//window.alert("OnGameStart Waves")
		for (const wave of this.runningWaves) {
			this.runningWaves.delete(wave)
		}

		this.overlapCheck_Circle = this.runtime.objects["Circle"].createInstance("Objects", 0, 0)
		this.overlapCheck_Circle_factor = 0.8
		this.overlapCheck_Circle.isVisible = false

		this.overlapCheck_Square = this.runtime.objects["Square_Bottom"].createInstance("Objects", 0, 0)
		this.overlapCheck_Square.isVisible = false

		this.def_Telegraph = this.runtime.objects["Telegraph_BirthSpawn"]
		this.def_Layer_telegraph = "Ground_Marks"

		this.def_blocker_Instances = new Set()
		this.def_blocker_Classes = [this.runtime.objects["Chara"], this.runtime.objects["Wep"]]

		const areaInstances = this.runtime.objects["Area_Spawn"].getAllInstances()
		this.def_SpawnAreas = areaInstances.map((inst) => ({
			instance: inst,
			Weight: inst.instVars.Weight,
		}))

		this.waveNumberText = this.runtime.objects["Text_HUD"].getAllInstances().find((inst) => inst.instVars.ID === "Wave")
		this.waveTimerText = this.runtime.objects["Text_HUD"].getAllInstances().find((inst) => inst.instVars.ID === "WaveTimer")
		this.waveFinishText = this.runtime.objects["Text_HUD"].getAllInstances().find((inst) => inst.instVars.ID === "WaveFinish")

		this.waveInstructions = this.runtime.objects["Text_HUD"].getAllInstances().find((inst) => inst.instVars.ID === "WaveInstruct")

		Utils.TextC3(this.waveInstructions, {
			text: "  " + this.runtime.translation.Get("Wave_Instructions") + "  ",
			background: "black",
			color: "rgb(255, 0, 102)",
		})

		this.isEndless = false

		this.waveCount = this.wave_enforce
		this.WaveCount_Add(0)

		if (this.wave_OnGameStart) {
			requestAnimationFrame(() => this.StartWave(this.waveCount))
		}

		/*
		for (let i = 0; i < 100; i++) {
			this.SpawnChara("Spy_Mob", Math.random() * 300, Math.random() * 300)
		}*/
	}

	Tick() {
		if (this.runtime.gameOver) return
		//if (!this.isWaving) return

		const dt = this.runtime.dt * this.WaveScale()

		for (const wave of this.runningWaves) {
			wave.Tick(dt)

			const integer = Math.ceil(wave.waveTimer)

			if (integer !== this.lastInteger) {
				this.lastInteger = integer
				if (integer <= 5) this.runtime.audio.PlaySound("clock_tick_0" + (Utils.randomInt(3) + 1), 1)
			}

			Utils.TextC3(this.waveTimerText, {
				text: integer,
				outlineBack: 6,
				color: wave.waveTimer > 5 ? "white" : "red",
			})

			if (wave.waveTimer <= 0) {
				this.Wave_End()
			}
		}

		//check percent wave
	}

	WaveCount_Add(value = 0) {
		this.waveCount += value

		let waveText = this.runtime.translation.Get("Wave_Game")
		waveText = waveText.replace("{current}", this.waveCount)

		if (this.isEndless) {
			const endlessTr = this.runtime.translation.Get("Endless")
			waveText = waveText.replace("{max}", endlessTr)
		} else {
			waveText = waveText.replace("{max}", this.waveMax)
		}

		const diff = this.difficulty
		const diffColor = this.runtime.tierColors["TIER_" + diff]

		const D_letter = this.runtime.translation.Get("Difficulty_D")

		waveText += ` [color=${diffColor}](${D_letter}${diff})[/color]`

		Utils.TextC3(this.waveNumberText, {
			text: waveText,
			outlineBack: 7,
		})
	}

	WaveText_Update() {
		//
	}

	DepopAll() {
		const waveDepops = this.runtime.objects["WaveDepops"].getAllInstances().forEach((inst) => inst.destroy())

		const charas = this.runtime.objects["Chara"].getAllInstances()
		for (const chara of charas) {
			if (chara.unit.name === "Chara_Player") continue
			const poof = this.runtime.objects["FX_ParticlePoof"].createInstance("Objects", chara.x, chara.y)
			chara.unit.Depop()
		}

		const bullets = this.runtime.objects["Bullet"].getAllInstances()
		for (const bullet of bullets) {
			//if (chara.unit.name === "Chara_Player") continue
			//!todo Unify the Depop to all units

			//! important to check as bullets could already be destroyed with a chara
			if (bullet?.unit?.DestroyUnit) {
				bullet.unit.DestroyUnit()
			}
		}

		const telegraphs = this.runtime.objects["Telegraph_BirthSpawn"].getAllInstances()
		/*if (telegraphs.length > 0) {
			window.alert("DepopAll Telegraphs")
		}*/
		for (const telegraph of telegraphs) {
			telegraph.destroy()
		}
	}

	Wave_EndDuration() {
		for (const wave of this.runningWaves) {
			wave.waveTimer = 0.5
		}
	}

	Wave_Retry() {
		this.runtime.objects["Picks"].getAllInstances().forEach((inst) => inst.destroy())
		this.runtime.objects["Pickup_Coins"].getAllInstances().forEach((inst) => inst.destroy())

		this.runtime.gameOver = false
		this.runtime.timeScale = 1
		this.Call_Wave_End()
		this.StartWave(this.waveCount)
	}

	Wave_Skip(isNext = true) {
		this.Call_Wave_End()

		if (isNext) {
			this.Wave_Next()
		} else {
			this.WaveCount_Add(-1)
			this.StartWave(this.waveCount)
		}

		this.runtime.hero.Wave_Skip_AddHero()
	}

	/*
	Cheat_WinRun() {
		this.waveCount = this.waveMax
		this.WaveCount_Add(0)
		this.Wave_End(true)
	}*/

	Bandes(param = 100) {
		if (param === "destroy") {
			if (!this.bandes) return
			for (const bande of this.bandes) {
				bande.destroy()
			}
			this.bandes = null
			return
		}

		if (!this.bandes) {
			const bandeObject = this.runtime.objects["Bandes"]

			const offset = 20

			const bandeTop = bandeObject.createInstance("PostPro", this.runtime.viewportWidth / 2, -offset)
			bandeTop.angleDegrees = 90
			const bandeBottom = bandeObject.createInstance("PostPro", this.runtime.viewportWidth / 2, this.runtime.viewportHeight + offset)
			bandeBottom.angleDegrees = 270
			this.bandes = [bandeTop, bandeBottom]
		}

		for (const bande of this.bandes) {
			bande.height = this.runtime.viewportWidth + 100
			bande.width = 0

			bande.behaviors["Tween"].startTween("width", 100, 0.3, "out-back")
		}
	}

	Call_Wave_End() {
		for (const wave of this.runningWaves) {
			this.runningWaves.delete(wave)
		}

		const waveName = "Unknown" //!tofix
		this.runtime.events.dispatchEventString("On_Wave_End", { waveName: waveName })

		this.DepopAll()

		for (const unit of this.runtime.units.units.values()) {
			unit.On_Wave_End()
		}
	}

	Players_Harvest() {
		for (const player of Array.from(this.runtime.playersEnabled)) {
			//* stat soul harvest

			const harvest = player.stats.GetStatValue("Harvest")
			const harvestCoins = player.coins * harvest

			//window.alert("harvestCoins: " + harvestCoins)

			player.AddCoins(harvestCoins)

			//* minimum soul happen to let player buy something

			if (player.coins < 18) {
				const randCoins = Utils.randomInt(18, 22)
				player.SetCoins(randCoins)
			}
		}
	}

	async Wave_End(instant = false) {
		if (this.waveCount > this.waveMax) {
			this.runtime.progress.GameOver_WinRun("endless")
		}

		this.isWaving = false

		const soulFlasks = this.runtime.objects["Pickup_Soul_Flask"].getAllInstances()
		for (const soulFlask of soulFlasks) soulFlask.opacity = 0.5

		this.runtime.audio.PlaySound("Success1", 1, 0.99)

		this.Bandes()

		this.Call_Wave_End()

		this.runtime.objects["Text_Bark_Boss"].getAllInstances().forEach((inst) => inst.destroy())

		this.waveFinishText.isVisible = true

		this.waveFinishText.y = -100
		this.waveFinishText.behaviors["Tween"].startTween("y", 100, 0.3, "out-back", {
			tags: "pop",
		})

		const trText = this.runtime.translation.Get("Wave_Completed").toUpperCase()

		Utils.TextC3(this.waveFinishText, {
			text: " " + trText + " ",
			outlineBack: 5,
			background: "black",
		})

		this.runtime.camera.zoomScale = 1.1

		const cuteSprite = Utils.World_GetChild(this.waveFinishText, "CuteDevil")
		if (cuteSprite) {
			const textWidth = this.waveFinishText.textWidth
			cuteSprite.x = this.waveFinishText.x - textWidth / 2 - cuteSprite.width / 2 - 10

			let cuteAnim = Utils.World_GetChild(cuteSprite, "Anim")
			if (cuteAnim) cuteAnim.destroy()

			const cuteAnimObject = this.runtime.style.skin?.WaveFinishedAnim || "Anim_CuteDevil"

			cuteAnim = Utils.createAnim(cuteAnimObject, cuteSprite.x, cuteSprite.y, "HUD")

			cuteSprite.addChild(cuteAnim, {
				transformX: true,
				transformY: true,
				transformAngle: true,
			})
			cuteAnim.setOrigin(0.5, 0.5)

			console.error("cuteAnim", cuteAnim)
		}

		if (instant) {
			this.Wave_End_Actual()
			return
		}

		//*New Coin End

		await Utils.Wait_Timescale(1)

		const area = this.runtime.objects["Area_Spawn"].getFirstInstance()

		let x_portal = area.x + Utils.random(-60, 60)
		let y_portal = area.y + Utils.random(-60, 60)

		if (this.runtime.singlePlayer) {
			//!todo: make sure it's visible if area is too big?
		}

		const coinPortal = this.runtime.objects["Coin_Portal"].createInstance("FX_Ahead", x_portal, y_portal)
		coinPortal.setSize(0, 0)
		coinPortal.behaviors["Tween"].startTween("size", [25, 25], 0.3, "out-elastic")

		const textCount = this.runtime.pool.CreateInstance("Text_SoulPortal", "HUD_Local", coinPortal.x, coinPortal.y - 20)
		coinPortal.addChild(textCount, {
			transformX: true,
			transformY: true,
			destroyWithParent: true,
		})

		textCount.coinCount = 0
		textCount.text = ""
		textCount.fontColor = [1, 1, 1]
		textCount.sizePt = 7
		//textCount.verticalAlign = "center"
		//textCount.height = 40

		//* COIN VORTEX

		let allCoins = [...this.runtime.objects["Pickup_Coin"].getAllInstances()]
		allCoins = allCoins.filter((coin) => {
			return coin.instVars.UID_Entity === 0
		})

		//* COIN PERSIST

		const coinsPersist = this.runtime.main.GetSharedStat_Sum("Souls_Persist")
		if (coinsPersist) {
			allCoins = Utils.Array_Shuffle(allCoins)
			const coinCount = allCoins.length
			const coinCountToKeep = Math.round(coinCount * coinsPersist)
			allCoins = allCoins.slice(coinCountToKeep)
		}

		this.runtime.coinPortal = 0

		this.runtime.player.Update_CoinPortal(0)

		await Utils.Wait_Timescale(0.2)

		this.runtime.audio.PlaySound("Coin_Portal2")

		for (const coin of allCoins) {
			const dist = C3.distanceTo(coin.x, coin.y, coinPortal.x, coinPortal.y)
			const tweenDuration = Utils.remapClamp(dist, 0, 200, 0, 1)

			const tween = coin.behaviors["Tween"].startTween("position", [coinPortal.x, coinPortal.y], tweenDuration, "in-sine", {
				tags: "soulPortal",
				destroyOnComplete: true,
			})

			tween.finished.then(() => {
				this.runtime.coinPortal++

				const stat_soulPortal = this.runtime.main.GetSharedStat_Average_Cache("SoulPortal")

				this.runtime.player.Update_CoinPortal(Math.floor(this.runtime.coinPortal * stat_soulPortal))

				let infoText = this.runtime.translation.Get("Info_SoulPortal")

				infoText = infoText.replace("{0}", stat_soulPortal * 100)
				infoText = infoText.replace("{total}", this.runtime.coinPortal)

				//!do not beautify otherwise newline will be broken
				textCount.text = `[outlineback=#000000][lineThickness=5][size=7]${this.runtime.coinPortal_actual}[/size]
[color=gray][size=5](${infoText})[/size][/color]`

				/*
                Utils.TextC3(textCount, {
					text: `${this.runtime.coinPortal_actual}
                    [color=gray][size=5](${infoText})[/size][/color]`,
					outlineBack: 5,
				})*/
			})
		}

		//* grace period where coins are still pickable

		await Utils.Wait_Timescale(0.3)

		let allCoins_stillHere = [...this.runtime.objects["Pickup_Coin"].getAllInstances()]
		allCoins_stillHere = allCoins_stillHere.filter((coin) => {
			return coin.instVars.UID_Entity === 0
		})

		for (const coin of allCoins_stillHere) {
			coin.unpickable = true
			coin.opacity = 0.7
		}

		await Utils.Wait_Timescale(0.2)

		this.waveFinishText.behaviors["Tween"].startTween("y", -100, 0.3, "in-back", {
			tags: "pop",
		})

		await Utils.Wait_Timescale(1.3)

		coinPortal.behaviors["Tween"].startTween("size", [0, 0], 0.3, "in-back", {
			destroyOnComplete: true,
		})

		await Utils.Wait_Timescale(0.4)

		this.Wave_End_Actual()
	}

	async Wave_End_Actual() {
		this.Players_Harvest()

		this.waveFinishText.isVisible = false
		const cuteAnim = Utils.World_GetChild_Nested(this.waveFinishText, "Anim")
		if (cuteAnim) {
			cuteAnim.destroy()
			console.error("cuteAnim destroy")
		}

		//*/ legacy coins end

		//* Movie scene

		const ret = await this.runtime.movie.PlayScene_BeforeShop()

		if (ret !== null) {
			if (ret === false) return
			this.Wave_End_Actual2()
			return
		}

		await this.runtime.shutters.Shutters_CloseOpen()
		this.Wave_End_Actual2()
	}

	Endless_Continue() {
		this.isEndless = true
		this.runtime.gameOver = false
		this.Wave_End_Actual2()
	}

	EndlessButton_SetVisible_AndFocusTopButton(menu, winBool) {
		const endlessButton = menu.querySelector(".endlessButton")
		const restartButton = menu.querySelector(".restartButton")

		const player0 = this.runtime.player

		if (!winBool || this.runtime.main.isDemo) {
			endlessButton.style.display = "none"
			player0.SN.focus(restartButton)
		} else {
			endlessButton.style.display = "flex"
			player0.SN.focus(endlessButton)
		}
	}

	Wave_End_Actual2() {
		this.noSpawnThisWave = false

		//*RUN END / GAMEOVER / GAME OVER
		if (this.waveCount === this.waveMax && !this.isEndless) {
			this.runtime.menu.GameOver(true, true)
		} else {
			this.runtime.timeScale = 0
			this.runtime.menu.StartShopPhase()
		}
	}

	Wave_Next() {
		this.WaveCount_Add(1)

		this.StartWave(this.waveCount)
	}

	Set_Difficulty(value) {
		this.difficulty = value

		this.waveMax = 20

		if (this.difficulty === 1) this.waveMax = 15
	}

	Wave_TestMobs() {
		if (this.waveCount === 0) {
			this.runtime.spawnManager.SpawnChara("Hero_Freezard")
		}
	}

	async StartWave(waveName) {
		this.runtime.audio.PlayRandomMusic()

		if (!this.zoneName) {
			await this.LoadZone("OVERMOBS")
		}

		this.isWaving = true

		this.Wave_TestMobs()

		const soulFlasks = this.runtime.objects["Pickup_Soul_Flask"].getAllInstances()
		for (const soulFlask of soulFlasks) soulFlask.opacity = 1

		this.Bandes("destroy")

		this.enemy_HP = this.runtime.main.GetSharedStat_Sum("Enemy_HP")
		this.enemy_Damage = this.runtime.main.GetSharedStat_Sum("Enemy_Damage")
		this.enemy_Speed = this.runtime.main.GetSharedStat_Sum("Enemy_Speed")
		this.enemy_Count = this.runtime.main.GetSharedStat_Sum("Enemy_Count")

		this.elite_HP = this.runtime.main.GetSharedStat_Sum("Elite_HP")
		this.elite_Damage = this.runtime.main.GetSharedStat_Sum("Elite_Damage")
		this.elite_Speed = this.runtime.main.GetSharedStat_Sum("Elite_Speed")

		this.enemy_Drop = 1

		const waveProgress = this.waveCount / 15

		//* Difficulty

		if (this.difficulty === 3) {
			this.enemy_HP += 0.12 * waveProgress
			this.enemy_Damage += 0.12 * waveProgress
		}
		if (this.difficulty === 4) {
			this.enemy_HP += 0.25 * waveProgress
			this.enemy_Damage += 0.25 * waveProgress
		}
		if (this.difficulty === 5) {
			this.enemy_HP += 0.4 * waveProgress
			this.enemy_Damage += 0.4 * waveProgress
		}

		//* Endless Mode
		const current_wave = this.waveCount
		const endless_wave = Math.max(0, current_wave - 20)
		const endless_mult = 2.0 + Math.max(0, (current_wave - 35) * 0.2) //* only scaling faster after wave 35
		const endless_factor = Math.max(0, (endless_wave * (endless_wave + 1)) / 2 / 100) * endless_mult

		if (current_wave > 20) {
			this.enemy_Damage += endless_factor
			this.enemy_HP += endless_factor * 2.25

			//speed is based on the existing speed mods (mult instead of addition)
			//start scaling very slowly
			this.enemy_Speed *= 1 + Math.min(1.75, endless_factor / 13)

			this.dropChance = 1 / (1 + endless_factor)
		}
		this.endless_Price_Inflation = 1 + endless_factor / 5

		console.error("Start_Wave", current_wave, {
			wave: current_wave,
			enemy_HP: this.enemy_HP,
			enemy_Damage: this.enemy_Damage,
			enemy_Speed: this.enemy_Speed,
			enemy_Count: this.enemy_Count,
		})

		//* General

		//Utils.debugText("EnemyCount: " + this.enemy_Count)

		this.waveFinishText.isVisible = false

		this.runtime.progress.SaveCurrentRun("Wave")

		this.Update_Room_Size()

		this.runtime.main.Update_SharedStat_Average()

		this.runtime.hero.SpawnHeroes()

		this.runtime.events.dispatchEventString("On_Wave_Start", { waveName: waveName })

		for (const unit of this.runtime.units.units.values()) {
			unit.On_Wave_Start()
		}

		for (const player of Array.from(this.runtime.playersEnabled)) {
			if (player.effects.GetBool("No_Heal_BetweenWaves")) {
				const revive = player.OnRevive()
				if (revive) {
					this.unit.healthComp.setCurrent(1)
				}
				//set to max currentHP or 1
			} else {
				player.OnRevive()
				player.unit.healthComp.SetCurrentToMax()
			}
		}

		//window.alert("StartWave " + waveName)
		if (typeof waveName === "number") {
			//! endless loop wave 10 to 19 with higher difficulties
			if (waveName > 20) {
				waveName = 10 + ((waveName - 20) % 10)
				console.error("waveEndless based on", waveName)
			}
			if (waveName > this.waveMax) {
				this.isEndless = true
			}
			waveName = waveName.toString()
		}
		const wave = this.waves.get(waveName)
		if (wave) {
			wave.Wave_StartWave()
			this.runningWaves.add(wave)
		}
	}

	Update_Room_Deco() {
		//!TODO
		//return
		const area = this.runtime.objects["Area_Spawn"].getFirstInstance()
		const bbox = area.getBoundingBox()

		//* Deco

		/*
		const propsObj = this.runtime.objects["Props"]
		while (propsObj.getAllInstances().length < 20) {
			propsObj.createInstance("Objects", 0, 0)
		}

		const props = propsObj.getAllInstances()
		props.forEach((inst) => {
			const frameCount = inst.animation.frameCount
			inst.animationFrame = Utils.randomInt(frameCount)
			const scale = Utils.random(0.7, 1) * inst.instVars.scale
			inst.setSize(inst.imageWidth * scale * Utils.choose(-1, 1), inst.imageHeight * scale)
			//sert position to random place in area
			const x = bbox.left + Math.random() * bbox.width
			const y = bbox.top + Math.random() * bbox.height
			inst.setPosition(x, y)
		})*/

		const enviroObj = this.runtime.objects["Enviro_Props"]
		while (enviroObj.getAllInstances().length < 90) {
			enviroObj.createInstance("Objects", 0, 0)
		}

		const fireObj = this.runtime.objects["FX_SmoothFire_InGame"]
		while (fireObj.getAllInstances().length < 10) {
			fireObj.createInstance("Objects", 0, 0)
		}
		const fires = fireObj.getAllInstances()

		const enviroDecos = enviroObj.getAllInstances()
		let allDecos = enviroDecos.concat(fires)
		allDecos = Utils.Array_Shuffle(allDecos)
		//console.error("fires", fires)
		//console.error("allDecos", allDecos)

		const fireflies = this.runtime.objects["Particle"].getAllInstances()
		fireflies.forEach((inst) => {
			if (inst.instVars.Type === "Dungeon") {
				const randPos = Utils.BBox_RandomCadrePos(bbox, 50, 50)
				inst.setPosition(randPos.x, randPos.y)
			}
		})

		fires.forEach((inst) => {
			inst.colorRgb = [1, 0.5, 0.5]

			if (this.runtime.main.mapSkin.includes("FirePink")) {
				inst.colorRgb = [1, 0, 0.847]
			}

			if (this.runtime.main.mapSkin.includes("FireGreen")) {
				inst.colorRgb = [0.071, 1, 0]
			}

			if (this.runtime.main.mapSkin.includes("FireBlue")) {
				inst.colorRgb = [0, 1, 1]
			}
		})

		enviroDecos.forEach((inst) => {
			if (this.runtime.main.mapSkin.includes("Dungeon")) {
				inst.setAnimation("Candles")
			} else if (this.runtime.main.mapSkin.includes("Moss")) {
				inst.setAnimation("Moss")
			} else if (this.runtime.main.mapSkin.includes("Astral")) {
				inst.setAnimation("Astral")
			} else if (this.runtime.main.mapSkin.includes("Jungle")) {
				inst.setAnimation("Jungle")
			} else if (this.runtime.main.mapSkin.includes("Plank")) {
				inst.setAnimation("Plank")
			}
		})

		let index = 0
		let section = 0
		let x = 0
		let y = 0

		allDecos.forEach((inst) => {
			const frameCount = inst.animation.frameCount
			inst.animationFrame = Utils.randomInt(frameCount)

			const scale = Utils.random(0.7, 1) * inst.instVars.scale
			inst.setSize(inst.imageWidth * scale * Utils.choose(-1, 1), inst.imageHeight * scale)
		})

		const decoMargin_width = 80
		const decoMargin_height = 60

		//! seems important to fix some issue
		requestAnimationFrame(() => {
			for (const inst of allDecos) {
				index++

				const absWidth = Math.abs(inst.width)

				//top
				if (index < 30) {
					inst.dungeonSide = "top"

					section = index
					x = bbox.left - 40 + ((bbox.width + 80) * section) / 30 + Utils.random(-5, 5)
					y = bbox.top - Math.random() * decoMargin_height
				}
				//bottom
				else if (index < 60) {
					inst.dungeonSide = "bottom"
					section = index - 30
					x = bbox.left - 40 + ((bbox.width + 80) * section) / 30 + Utils.random(-5, 5)
					y = bbox.bottom + 10 + Math.random() * decoMargin_height
				}
				//left
				else if (index < 80) {
					inst.dungeonSide = "left"
					section = index - 60
					x = bbox.left - Math.random() * decoMargin_width - absWidth / 2 - 10
					y = bbox.top + (bbox.height * section) / 20 + Utils.random(-5, 5)
				}
				//right
				else {
					inst.dungeonSide = "right"
					section = index - 80
					x = bbox.right + Math.random() * decoMargin_width + absWidth / 2 + 10
					y = bbox.top + (bbox.height * section) / 20 + Utils.random(-5, 5)
				}
				inst.setPosition(x, y)

				if (inst.dungeonSide === "left" && this.runtime.collisions.testOverlap(inst, area)) {
					inst.x -= absWidth
				}
				if (inst.dungeonSide === "right" && this.runtime.collisions.testOverlap(inst, area)) {
					inst.x += absWidth
				}
			}
		})
	}

	Update_Room_Size(changeSkin = false) {
		const baseWidth = 720
		const baseHeight = 420

		const area = this.runtime.objects["Area_Spawn"].getFirstInstance()

		const newRoomSize = this.runtime.main.GetSharedStat_Sum("Room_Size")

		if (newRoomSize === this.oldRoomSize) {
			if (changeSkin) this.runtime.layouts[1].SetRandomGround(null)
			this.Update_Room_Deco()
			return
		}

		if (!this.oldRoomSize) this.oldRoomSize = 1

		if (newRoomSize < this.oldRoomSize) {
			for (const player of this.runtime.playersEnabled) {
				const angleFromCenter = C3.angleTo(area.x, area.y, player.unit.x, player.unit.y)
				let dist = Utils.random(50, 200)
				dist = Math.min(dist, baseHeight * newRoomSize * 0.7)
				const x = area.x + Math.cos(angleFromCenter) * dist
				const y = area.y + Math.sin(angleFromCenter) * dist
				player.inst.setPosition(x, y)
			}
		}

		this.oldRoomSize = newRoomSize

		area.setSize(baseWidth * newRoomSize, baseHeight * newRoomSize)

		// Precompute the half-room offsets
		const offsetY = (baseHeight * newRoomSize) / 2 - baseHeight / 2
		const offsetX = (baseWidth * newRoomSize) / 2 - baseWidth / 2

		// A simple map of side → [xMultiplier, yMultiplier]
		const multipliers = {
			Top: [0, -1],
			Bottom: [0, 1],
			Left: [-1, 0],
			Right: [1, 0],
		}

		const lights = this.runtime.objects["Light"].getAllInstances()
		for (const light of lights) {
			const side = light.instVars.Side
			const m = multipliers[side]

			if (!m) continue // skip any unknown sides
			if (light.baseX === undefined) light.baseX = light.x
			if (light.baseY === undefined) light.baseY = light.y

			// Apply the offset in the correct axis
			light.x = light.baseX + m[0] * offsetX
			light.y = light.baseY + m[1] * offsetY
		}

		const skin = changeSkin ? null : this.runtime.main.mapSkin

		this.runtime.layouts[1].SetRandomGround(skin)

		this.Update_Room_Deco()
	}

	normalize(vector) {
		const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y)
		if (magnitude === 0) return { x: 0, y: 0 } // Handle zero vector
		return {
			x: vector.x / magnitude,
			y: vector.y / magnitude,
		}
	}

	Tick_EnemyPos() {
		const charas = runtime.objects["Chara"].getAllInstances()
		const separationStrength = 50
		const collisions = this.runtime.collisions

		for (const chara of charas) {
			if (chara.unit.name === "Chara_Player") continue

			let separationForce = { x: 0, y: 0 }
			//const candidates = collisions.getCollisionCandidates(runtime.objects["Chara"], chara.getBoundingBox())
			//const candidatesSet = new Set(candidates)
			for (const otherChara of charas) {
				if (chara === otherChara) continue
				//const bool = collisions.testOverlap(chara, otherChara)
				const bool = C3.distanceTo(chara.x, chara.y, otherChara.x, otherChara.y) < 50
				if (!bool) continue
				let diff = {
					x: chara.x - otherChara.x,
					y: chara.y - otherChara.y,
				}

				// Instead of normalizing and dividing by distance, we can simply scale
				let distanceSquared = diff.x * diff.x + diff.y * diff.y // Avoid costly sqrt
				if (distanceSquared > 0) {
					let distanceFactor = 1 / distanceSquared // Inverse square of the distance for repulsion
					separationForce.x += diff.x * distanceFactor
					separationForce.y += diff.y * distanceFactor
				}
			}

			//separationForce = normalize(separationForce)
			separationForce.x *= separationStrength
			separationForce.y *= separationStrength

			// Apply separation force to enemy's velocity
			/*chara.x += separationForce.x * this.runtime.dt
			chara.y += separationForce.y * this.runtime.dt*/

			const moveComp = chara.unit.moveComp
			moveComp.moveX += separationForce.x * this.runtime.dt
			moveComp.moveY += separationForce.y * this.runtime.dt
		}
	}
}

class Wave {
	constructor(runtime, name, data, rules = {}) {
		this.runtime = runtime
		this.name = name
		this.Spawners = new Set()

		this.waveTimer_start = 0
		this.waveTimer = 0
		this.telegraphs = new Map()

		this.lastInteger = 0

		if (data._Duration) {
			this.waveTimer = Utils.ProcessInterval(data._Duration)
			this.waveTimer_start = this.waveTimer
			delete data._Duration
		}

		for (let [key, value] of Object.entries(data)) {
			const spawner = new Spawner(runtime, this, key, value, rules)
			this.Spawners.add(spawner)
		}
	}

	Wave_StartWave() {
		this.waveTimer = this.waveTimer_start

		if (this.runtime.hero.isHeroWave) {
			this.waveTimer = Math.max(this.waveTimer, 60)
		}
	}

	Tick(dt) {
		if (this.waveTimer > 0) {
			this.waveTimer -= dt

			if (this.waveTimer <= 0) {
				this.waveTimer = 0
				//this.Trigger("On_Wave_End")
			}
		}

		if (this.runtime.waveManager.noSpawnThisWave) {
			return
		}

		for (const spawner of this.Spawners) {
			spawner.Tick(dt)
		}
	}
}

class Spawner {
	constructor(runtime, wave, name, data, rules = {}) {
		this.runtime = runtime
		this.waveManager = this.runtime.waveManager
		this.wave = wave
		this.name = name

		this.SetVars_Default({
			Type: "",
			Diff: 0,
			Count: 1,
			Chance: 1,
			Wait: 1,
			Every: 1,
			Area: 0,
			Repeat: null,
			Telegraph: null,
		})

		/*
		this.SetVars_AddTypes({
			Every: [],
		})*/

		this.SetVars(data)

		if (Array.isArray(this.Every)) {
			this.Every = this.Every[0]
			this.EveryOffset = this.Every[1]
			this.EveryLimit = this.Every?.[2] || 1
		}

		//utils calculate number of repeat in a wave

		/*
		if (this.EveryOffset && this.EveryOffset > 0) {
			let duration = wave.waveTimer_start - this.Wait
			let every = this.Every
			count = 1
			while (duration > every) {
				count++
				duration -= every
				every = Utils.OffsetInterval(every, this.EveryOffset, this.EveryLimit)
			}
		}*/

		const split = this.name.split("|")
		if (split.length >= 2 && split[0] === "Diff") {
			this.Diff = parseInt(split[1])
			//window.alert("Diff " + this.Diff)
		}

		this.spawnables = new Set()
		this.spawnablesWeighted = new Set()

		this.spawnables.add({
			Type: this.Type,
			Count: this.Count,
			Chance: this.Chance,
			Telegraph: this.Telegraph,
		})

		if (data.Adds) {
			for (const [key, add] of Object.entries(data.Adds)) {
				this.spawnables.add({
					Type: add.Type,
					Count: add.Count ? add.Count : 1,
					Chance: add.Chance ? add.Chance : 1,
					Telegraph: add.Telegraph ? add.Telegraph : null,
				})
			}
		}

		if (data.Weighted) {
			for (const [key, add] of Object.entries(data.Weighted)) {
				this.spawnablesWeighted.add({
					Type: add.Type,
					Count: add.Count ? add.Count : 1,
					Weight: add.Weight ? add.Weight : 1,
					Telegraph: add.Telegraph ? add.Telegraph : this.Telegraph ? this.Telegraph : null,
				})
			}
		}

		this.time = Utils.ProcessInterval(this.Wait)

		//runtime variables

		this.isWaiting = true

		this.rangePosition = null
		this.maxEntityCount = null

		this.delayed = []

		//collision
		this.blocker_Classes = []
		this.blocker_Instances = []

		//not sure
		this.isPaused = false
	}

	Tick(dt) {
		if (!this.isPaused) {
			if (this.waveManager.difficulty < this.Diff) return
			this.time -= dt

			if (this.time <= 0) {
				//waiting ends
				if (this.isWaiting) {
					this.isWaiting = false
					this.time = Utils.ProcessInterval(this.Every)
				}

				//trigger spawn
				else {
					if (this.EveryOffset && this.EveryOffset > 0) {
						this.Every = Utils.OffsetInterval(this.Every, this.EveryOffset, this.EveryLimit)
					}

					this.time = Utils.ProcessInterval(this.Every)
				}

				//*ACTUAL SPAWNING LOGIC

				if (this.rangeArea > 0) {
					this.waveManager.overlapCheck_Circle.setSize(
						this.rangeArea * this.waveManager.overlapCheck_Circle_factor,
						this.rangeArea * this.waveManager.overlapCheck_Circle_factor
					)
					this.SetAndCheckRandomPos_GroupArea()
				}

				for (const spawnable of this.spawnables) {
					//check if the object is already spawned
					if (this.maxEntityCount !== null) {
						//TODO continue
					}

					if (spawnable.Chance < Math.random()) return

					let count = Utils.ProcessInterval(spawnable.Count)

					let originalCount = count

					if (count > 0) {
						const debugEnemyMult = 1
						count = count * debugEnemyMult
						//coopModifier
						count = count + count * (this.runtime.playersEnabled.size - 1) * this.runtime.coop.perPlayer_AddEnemyCount
						//Enemy_Count sharedStat
						count = count * this.waveManager.enemy_Count
						count = Math.max(1, count)

						//decimal determines the chance of spawning an extra entity
						count = Utils.RoundRandom(count)
					}

					//Utils.debugText("Spawning " + count + " " + spawnable.Type + " originalCount:" + originalCount.toFixed(2))

					//spawn entity OR telegraph
					for (let i = 0; i < count; i++) {
						this.Spawnable(spawnable.Type)
					}
				}

				//weighted spawning
				if (this.spawnablesWeighted.size > 0) {
					const spawnable = Utils.pickRandomWeighted(this.spawnablesWeighted, "Weight")
					if (spawnable) {
						const count = Utils.ProcessInterval(spawnable.Count)
						for (let i = 0; i < count; i++) {
							this.Spawnable(spawnable.Type)
						}
					}
				}

				if (this.Repeat !== null) {
					this.Repeat--
					if (this.Repeat <= 0) {
						this.wave.Spawners.delete(this)
						return
					}
				}
			}
		}
	}

	//#region Spawner functions

	async Spawnable(type) {
		//Spawn telegraph

		const typeInstance = this.runtime.dataInstances["Charas"].get(type)

		if (!typeInstance) {
			console.error("Spawner : No type instance found for " + type + " in dataInstances")
			return
		}

		const checkInst = this.waveManager.overlapCheck_Square

		checkInst.setSize(40, 40)

		if (typeInstance.SpawnMargin) {
			checkInst.setSize(typeInstance.SpawnMargin + 2, typeInstance.SpawnMargin + 2)
		}
		//window.alert(checkInst.width + " " + checkInst.height)

		const pos = this.SetAndCheckRandomPos(checkInst)
		if (!pos) return

		if (this.waveManager.def_Telegraph) {
			this.runtime.timer.Add(Math.random() * 0.5, () => {
				const layer = this.waveManager.def_Layer_telegraph
				const inst = this.waveManager.def_Telegraph.createInstance(layer, pos[0], pos[1])
				const uid = inst.uid

				this.wave.telegraphs.set(uid, {
					spawner: this,
					type: type,
				})

				this.runtime.timer.AddFromInstance(inst, false, 0.5, () => {
					this.Telegraph_Spawn(uid)
				})
			})
		}
		//Spawn object
		else {
			const inst = this.Spawn_Object(type, pos[0], pos[1])
		}
	}

	FindPositionForType() {
		//
	}

	Spawn_Object(type, x = 0, y = 0) {
		if (!this.waveManager.isWaving) return

		const chara = this.runtime.spawnManager.SpawnChara(type, x, y)
		const inst = chara.inst

		if (chara.HasTag("Noob")) {
			const enemies = this.runtime.units.GetUnitsByTag("Noob", "Chara")
			if (enemies.length >= this.runtime.waveManager.maxMobCount) {
				let destroyedAnEnemy = false
				while (!destroyedAnEnemy) {
					//pick and remove first enemy of the array
					const enemy = enemies.shift()
					console.error("Enemy Depop", enemy.name)
					destroyedAnEnemy = true
					enemy.Depop(true)
				}
			}
		}

		return inst
	}

	Telegraph_Spawn(teleGraphUid) {
		const telegraph = this.wave.telegraphs.get(teleGraphUid)
		if (telegraph) {
			const teleGraphInst = this.runtime.getInstanceByUid(teleGraphUid)
			if (!teleGraphInst) return

			let spawnBlocked_inst = null
			let spawnBlocked_player = null

			//check if player above
			const playersAlive = Array.from(this.runtime.playersAlive)
			for (const player of playersAlive) {
				if (C3.distanceTo(player.inst.x, player.inst.y, teleGraphInst.x, teleGraphInst.y) < 47) {
					spawnBlocked_inst = player.inst
					spawnBlocked_player = player
				}
			}

			const spawnPickup_blockSpawn = this.runtime.main.GetSharedStat_Sum("EnemySpawnPickup_BlockSpawn", 0)
			const spawnPickup_destroyPickup = this.runtime.main.GetSharedStat_Sum("EnemySpawnPickup_DestroyPickup", 0)

			if (spawnPickup_blockSpawn > 0 || spawnPickup_destroyPickup > 0) {
				const pickups = this.runtime.objects["Picks"].getAllInstances()
				for (const pickup of pickups) {
					if (C3.distanceTo(pickup.x, pickup.y, teleGraphInst.x, teleGraphInst.y) < 30) {
						if (Math.random() < spawnPickup_blockSpawn) {
							spawnBlocked_inst = pickup
						} else if (Math.random() < spawnPickup_destroyPickup) {
							this.runtime.audio.PlaySound("Pickup_Destroyed", 0.8)
							const text = this.runtime.translation.Get("Destroyed_Pickup")
							this.runtime.pointburst.CreatePointBurst_Icon(text, pickup.x, pickup.y - 30, "", "Info_PickupDestroyed")
							pickup.destroy()
						}
						break
					}
				}
			}

			if (spawnBlocked_inst) {
				if (spawnBlocked_player) {
					spawnBlocked_player.events.dispatchEventString("On_Spawn_Blocked")
				}

				let text = ""
				if (this.runtime.waveManager.waveCount < 5) text = this.runtime.translation.Get("Spawn_Blocked")
				this.runtime.pointburst.CreatePointBurst_Icon(text, spawnBlocked_inst.x, spawnBlocked_inst.y - 30, "", "Info_SpawnBlocked")
				this.runtime.audio.PlaySound("Dodge", 1)
				teleGraphInst.destroy()
				this.wave.telegraphs.delete(teleGraphUid)
				return
			}

			const unit = this.Spawn_Object(telegraph.type, teleGraphInst.x, teleGraphInst.y)
			//! Todo : check if unit can be spawned (overlap?)
			//this.SetAndCheckRandomPos(unit)
			this.wave.telegraphs.delete(teleGraphUid)
			teleGraphInst.destroy()
			//window.alert("Telegraph_Spawn", telegraph)
		}
	}

	SetAndCheckRandomPos_GroupArea() {
		const inst = this.waveManager.overlapCheck_Circle
		let hasCollided = true

		while (hasCollided) {
			const randPos = this._PickRandomPosition(this.rangeArea / 2)
			inst.setPosition(randPos[0], randPos[1])

			hasCollided = this.TestOverlap(inst)

			if (hasCollided) this._CreateDebugCollision(inst.x, inst.y)
		}

		this.rangePosition = [inst.x, inst.y]
	}

	SetAndCheckRandomPos(inst, needToSpawn = false) {
		let retries = 4
		let hasCollided = true
		let randPos

		while (retries > 0 && hasCollided) {
			//group spawning with range
			if (this.rangePosition) {
				const range = this.rangeArea
				const x = this.rangePosition[0] + Math.random() * range - range / 2
				const y = this.rangePosition[1] + Math.random() * range - range / 2
				randPos = [x, y]
			}
			//regular spawning
			else randPos = this._PickRandomPosition()

			inst.setPosition(randPos[0], randPos[1])

			hasCollided = this.TestOverlap(inst)

			if (hasCollided) this._CreateDebugCollision(inst.x, inst.y)
			if (!needToSpawn) retries--
		}

		if (hasCollided) {
			return false
		}

		return [inst.x, inst.y]
	}

	_PickRandomPosition(margins = 0) {
		const spawnAreas = this.SpawnAreas ? this.SpawnAreas : this.waveManager.def_SpawnAreas
		const spawnArea = Utils.pickRandomWeighted(spawnAreas, "Weight").instance
		if (!spawnArea) {
			console.error("SPAWNER : No spawn area found")
			return null
		}
		const spawnPoint = this._GetRandomPointInRotatedRect(spawnArea, margins)

		return spawnPoint
	}

	_GetRandomPointInRotatedRect(inst, margins = 0) {
		const width = inst.width - margins * 2
		const height = inst.height - margins * 2
		const angle = inst.angle

		const randomX = Math.random() * width - width / 2
		const randomY = Math.random() * height - height / 2

		// Apply rotation to the point
		const rotatedX = randomX * Math.cos(angle) - randomY * Math.sin(angle)
		const rotatedY = randomX * Math.sin(angle) + randomY * Math.cos(angle)

		// Translate point to actual center
		const x = rotatedX + inst.x
		const y = rotatedY + inst.y

		return [x, y]
	}

	Stop_Spawners_All() {
		this._spawners.clear()
	}

	Set_DebugCollision(objectClass) {
		this.debugCollision_obj = objectClass
	}

	_CreateDebugCollision(x, y) {
		if (!this.debugCollision_obj) return
		const inst = CreateObject(this.debugCollision_obj, this.def_Layer, x, y, false)
	}

	TestOverlap(inst) {
		//*CUSTOM INSTANCES

		for (const [blockInst, range] of this.waveManager.def_blocker_Instances) {
			if (C3.distanceTo(inst.x, inst.y, blockInst.x, blockInst.y) < range) {
				return true
			}
		}

		//*SOLIDS

		const collisionEngine = this.runtime.collisions

		//returns null if no collision, or the solid instance
		const collideSolid = collisionEngine.testOverlapSolid(inst)
		if (collideSolid) return true

		//*CUSTOM BLOCKING CLASSES

		const test = Utils.testOverlapOpti_Single(inst, this.waveManager.def_blocker_Classes)

		return test ? true : false
	}

	_OnInstanceDestroyed(inst) {
		this.spawnedInstances.delete(inst)
		this.wave.telegraphs.delete(inst)
	}

	//#endregion

	//#region Setup

	SetVars_Default(data) {
		for (let key in data) {
			this[key] = data[key]
		}
	}

	SetVars(data) {
		// Iterate through data object and override existing instance values
		for (let key in data) {
			if (data.hasOwnProperty(key) && this.hasOwnProperty(key)) {
				this[key] = data[key] // Override if the key exists in the instance
			}
		}
	}

	ProcessVars() {
		for (const varName of this.varsToProcess) {
			if (this[varName]) {
				const value = this[varName]
				this[varName] = Utils.ProcessInterval(value)
			}
		}
	}

	//#endregion
}
