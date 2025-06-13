export class Spawn_Manager {
	constructor(runtime) {
		this.runtime = runtime

		//this.runtime.addEventListener("beforeanylayoutstart", (e) => this.BeforeAnyLayoutStart(e))
		//this.runtime.events.addEventListener("OnGameStart", (e) => this.OnGameStart(e))

		this.runtime.events.addEventListener("OnGameTick", (e) => this.Tick_EnemyPos(e))

		this.runtime.events.addEventListener("On_Wave_Start", (e) => this.On_Wave_Start(e))
	}

	On_Wave_Start(e) {
		if (this.runtime.waveManager.waveCount !== 0) return

		// preSpawn Chara
		const charaPosInstances = this.runtime.objects["CharaPos"].getAllInstances().filter((inst) => inst.instVars.Active)
		for (const inst of charaPosInstances) {
			const chara = this.SpawnChara(inst.instVars.Chara, inst.x, inst.y)
			if (chara) {
				if (inst.instVars.HP_Max > 0) {
					chara.healthComp.max = inst.instVars.HP_Max
					chara.healthComp.current = inst.instVars.HP_Max
				}
				if (chara.name === "Chara_Spy_Mob") {
					//window.alert("Chara_Spy_Mob")
					globalThis.weakRef = new WeakRef(chara)
					/*
					globalThis.weakRefObj = { key: "value" }
					weakRef = new WeakRef(weakRefObj)*/
					//globalThis.weakRefObj = null
				}
			}
		}
	}

	async SpawnCheat() {
		this.runtime.layouts[1].SetRandomGround()

		//this.runtime.waveManager.DepopAll()

		let itemPool = Array.from(runtime.dataInstances["Items"]).map((a) => a[1])
		let charaPool = itemPool.filter((a) => a.HasTag("Playable") && !a.locked)
		let wepPool = itemPool.filter((a) => a.HasTag("Weapon")).filter((a) => a.evolution === 0)

		wepPool = wepPool.filter((a) => !a.name.includes("Laser"))
		wepPool = wepPool.filter((a) => !a.name.includes("Decoy"))

		let charaRandomTrailer = itemPool.filter((a) => a.name.includes("RandomTrailer"))

		for (const player of this.runtime.playersEnabled) {
			//player.startRun_chara = Utils.Array_Random(charaPool)

			player.startRun_chara = charaRandomTrailer[0]
			player.startRun_wep = null
		}

		this.runtime.menu.ClearStack()
		this.runtime.goToLayout(this.runtime.layout.name)

		await Utils.waitForSeconds(0.5)

		this.runtime.objects["HTML_Coin"].getAllInstances().forEach((inst) => (inst.isVisible = false))

		//this.runtime.layout.getLayer("HUD_Local").isVisible = false

		for (const player of this.runtime.playersEnabled) {
			player.coinElem_game = null
			for (let i = 0; i < 6; i++) {
				player.inventoryWeps.AddItem(Utils.Array_Random(wepPool), 1)
			}

			player.stats.SetStatValue("Damage", 20)
			player.stats.SetStatValue("Luck", -99)
		}

		for (let i = 0; i < 5; i++) {
			const pos = this.GetPosInArea(40)
			this.runtime.spawnManager.SpawnChara("Noob_1", pos[0], pos[1])
		}

		for (let i = 0; i < 3; i++) {
			const pos = this.GetPosInArea(40)
			this.runtime.spawnManager.SpawnChara("Noob_2", pos[0], pos[1])
		}

		for (let i = 0; i < 2; i++) {
			const pos = this.GetPosInArea(40)
			this.runtime.spawnManager.SpawnChara("Noob_Rogue", pos[0], pos[1])
		}

		this.runtime.waveManager.waveCount = Utils.randomInt(3, 10)
		this.runtime.waveManager.Wave_Skip(true)

		//! just to refresh the UI
		this.runtime.waveManager.WaveCount_Add(0)

		for (const player of this.runtime.playersEnabled) {
			const healtComp = player.unit.healthComp
			healtComp.setMax(Utils.randomInt(10, 30))
			healtComp.setCurrent(Utils.randomInt(10, 20))

			player.level = Utils.randomInt(5, 10)
			player.LevelUpdate()

			healtComp.setMax(40)
			healtComp.setCurrent(40)
		}
	}

	SpawnUnit(unitType, objectType, unitNameEvo, dataOverride = null, x = 0, y = 0, layer = "Collisions") {
		//console.error("SpawnUnit", unitNameEvo)
		const [unitName, evo] = Utils.GetNameEvo_Array(unitNameEvo)
		const unitData = this.runtime.unitsData[unitType].get(unitNameEvo)

		const dataInst = this.runtime.dataInstances[unitType].get(unitNameEvo)
		const evoMin = dataInst ? dataInst.evoMin : 0

		if (unitData) {
			let CLASS = unitData[0]
			let data = unitData[1]

			if (dataOverride === {}) dataOverride = null

			if (data && dataOverride) {
				data = Utils.deepMerge(data, dataOverride)
			} else if (dataOverride) {
				data = dataOverride
			}

			if (dataOverride) {
				/*
				console.error("⚠️ SpawnUnit dataOverride", dataOverride)
				console.error("⚠️ SpawnUnit data", data)*/
			}

			let inst = this.runtime.objects[objectType].createInstance(layer, x, y)

			//console.error("SpawnUnit evoMin dataInst", unitNameEvo, dataInst)
			const evoData = [evo, evoMin]

			const unit = new CLASS(this.runtime, inst, evoData, data)

			return [unit, data]
		}
		console.error("⛔ SpawnUnit", unitType, unitName, "not found", "in this.runtime.unitsData")
		return [null, null]
	}

	SpawnChara(unitNameEvo, x = 0, y = 0, dataOverride = null) {
		if (x === 0 && y === 0) {
			const pos = this.GetPosInArea(40)
			x = pos[0]
			y = pos[1]
		}

		const [unit, data] = this.SpawnUnit("Charas", "Chara", unitNameEvo, dataOverride, x, y, "Collisions_Debug")
		if (unit) {
			return unit
		}
		return null
	}

	SpawnWep(unitNameEvo, x = 0, y = 0, dataOverride = null) {
		//unitNameEvo = unitNameEvo.replace("Wep_", "")

		const [unit, data] = this.SpawnUnit("Weps", "Wep", unitNameEvo, dataOverride, x, y)
		if (unit) {
			if (data) {
				unit.AddTags(data.Synergies)
			}
			return unit
		}
		return null
	}

	SpawnBullet(unitNameEvo, x = 0, y = 0, dataOverride = null) {
		const [unit, data] = this.SpawnUnit("Bullets", "Bullet", unitNameEvo, dataOverride, x, y)
		if (unit) {
			return unit
		}
		return null
	}

	async SpawnRaid() {
		const raidTelegraph = this.SpawnInstance("Raid_Telegraph", "FX_Behind", 50, 50)

		this.SpawnEnemy_InCircle("Noob_Chevalier", raidTelegraph)
	}

	SpawnEnemy_InCircle(unitNameEvo, circleInst) {
		let pos = this.GetPosInArea_FromCircle(circleInst.x, circleInst.y, circleInst.width / 2)
		return this.SpawnChara(unitNameEvo, pos[0], pos[1])
	}

	SpawnDanger(size = 10, x = 0, y = 0) {}

	GetPosInArea(marginHor = 0, marginVer = null) {
		marginVer = marginVer === null ? marginHor : marginVer

		const areaBbox = this.runtime.objects["Area_Spawn"].getFirstInstance().getBoundingBox()
		const x = areaBbox.left + marginHor + Math.random() * (areaBbox.width - marginHor * 2)
		const y = areaBbox.top + marginVer + Math.random() * (areaBbox.height - marginVer * 2)

		return [x, y]
	}

	SpawnCoin(x, y, type = "") {
		if (type === "") {
			type = "Regular"

			const rand = Math.random() * 100
			if (rand < this.runtime.main.GetSharedStat_Average_Cache("Drop_Souls")) {
				type = "Soul_Golden"
			}
		}

		const coinInst = this.runtime.pool.CreateInstance("Pickup_Coin", "Objects_Ground", x, y)

		coinInst.setAnimation(type)

		const frameCount = coinInst.animation.frameCount
		coinInst.animationFrame = Utils.randomInt(frameCount)

		//* AUTO ATTRACT
		let autoAttract_player = null

		const playersShuffle = this.runtime.players.filter((p) => p.enabled).sort(() => Math.random() - 0.5)
		for (const player of playersShuffle) {
			const chance_autoAttract = player.stats.GetStatValue("Soul_AutoAttract")
			if (chance_autoAttract > 0) {
				const rand = Math.random()
				if (rand < chance_autoAttract) {
					autoAttract_player = player
					break // Only assign to the first player that meets the condition
				}
			}
		}

		if (autoAttract_player) {
			coinInst.behaviors["Bullet"].isEnabled = false
			coinInst.instVars.CanBePickup = true

			autoAttract_player.pickerComp.Pickup_Coin(coinInst, autoAttract_player.inst.uid)
		}
	}

	CheckPosInArea(x, y) {
		const areaBbox = this.runtime.objects["Area_Spawn"].getFirstInstance().getBoundingBox()
		return x >= areaBbox.left && x <= areaBbox.right && y >= areaBbox.top && y <= areaBbox.bottom
	}

	GetPosInArea_FromCircle(centerX, centerY, radius) {
		const maxAttempts = 10 // Prevent infinite loop
		let attempts = 0

		if (isNaN(centerX) || isNaN(centerY) || isNaN(radius)) {
			const areaBbox = this.runtime.objects["Area_Spawn"].getFirstInstance()
			console.warn("GetPosInArea_FromCircle NAN")
			return [areaBbox.x, areaBbox.y] // Return center of area if invalid input
		}

		while (attempts < maxAttempts) {
			const angle = Math.random() * Math.PI * 2
			const x = centerX + Math.cos(angle) * radius
			const y = centerY + Math.sin(angle) * radius

			if (this.CheckPosInArea(x, y)) {
				return [x, y] // Return valid position
			}

			attempts++
		}

		console.warn("Failed to find a valid position within max attempts.")
		return [centerX, centerY] // Return null if no valid position is found
	}

	SpawnInstance(objectType, layer, marginHor = 0, marginVer = null) {
		marginVer = marginVer === null ? marginHor : marginVer

		const pos = this.GetPosInArea(marginHor, marginVer)

		const inst = this.runtime.objects[objectType].createInstance(layer, pos[0], pos[1])
		return inst
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
		const defaultDist = 20
		const defaultStrength = 50
		const dt = this.runtime.dt

		for (const chara of charas) {
			if (chara.unit.name === "Chara_Player") continue

			// Allow per-instance overrides if you’ve set them on the object
			const sepDist = chara.unit.sepDist ?? defaultDist
			const sepStrength = chara.unit.sepStrength ?? defaultStrength

			for (const other of charas) {
				if (other === chara) continue
				if (other.unit.name === "Chara_Player") continue

				// Vector from this chara to the other one
				const dx = other.x - chara.x
				const dy = other.y - chara.y
				const distSq = dx * dx + dy * dy

				// Only push if within separation distance
				if (distSq > 0 && distSq < sepDist * sepDist) {
					// Inverse-square falloff for smoother repulsion
					const forceFactor = sepStrength / distSq

					// Apply to the other chara’s movement component
					const mov = other.unit.moveComp
					mov.moveX += dx * forceFactor * dt
					mov.moveY += dy * forceFactor * dt
				}
			}
		}
	}

	/*
	Tick_EnemyPos() {
		const charas = runtime.objects["Chara"].getAllInstances()
		const separationDist = 20
		const separationStrength = 50
		const collisions = this.runtime.collisions

		for (const chara of charas) {
			if (chara.unit.name === "Chara_Player") continue

			let sepDist = chara.sepDist || separationDist
			let sepStrength = chara.sepStrength || separationStrength

			let separationForce = { x: 0, y: 0 }
			//const candidates = collisions.getCollisionCandidates(runtime.objects["Chara"], chara.getBoundingBox())
			//const candidatesSet = new Set(candidates)
			for (const otherChara of charas) {
				if (chara === otherChara) continue
				if (otherChara.unit.name === "Chara_Player") continue
				//const bool = collisions.testOverlap(chara, otherChara)

				const bool = C3.distanceTo(chara.x, chara.y, otherChara.x, otherChara.y) < sepDist
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
			separationForce.x *= sepStrength
			separationForce.y *= sepStrength

			const moveComp = chara.unit.moveComp
			moveComp.moveX += separationForce.x * this.runtime.dt
			moveComp.moveY += separationForce.y * this.runtime.dt
		}
	}*/
}
