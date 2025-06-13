/*

C4.Weps hold the WEP_CLASS

this.unitsData["Weps"] hold the [WEP_CLASS, wepData]

this.dataInstances["Weps"] hold the WEP_CLASS instance used for Infos



*/

import Yaml from "./Module_YamlLoader.js"

import { Item } from "../inventory/Item.js"
import { Inventory } from "../inventory/Inventory.js"

export class Data_Manager {
	constructor(runtime) {
		this.runtime = runtime
		this.runtime.dataManager = this
		console.error("dataManager", this)

		this.appFiles = []

		this.modLoading = null

		this.unitsData = {
			Charas: new Map(),
			Weps: new Map(),
			Bullets: new Map(),
		}

		this.loadedData = {
			Items: new Map(),
			ItemEffects: new Map(),
			Zones: new Map(),
		}

		this.dataIsLoaded = false

		this.dispatcher = new EventTarget()

		this.wepItemsToCreate = new Set()

		this.imagesData = {}
		this.templatesData = {}
		this.animObjectUrls = new Map()

		this.funcsData = {}

		this.dataInstances = {
			Items: new Map(),
			Charas: new Map(),
			Weps: new Map(),
			Bullets: new Map(),
		}

		this.runtime.unitsData = this.unitsData
		this.runtime.loadedData = this.loadedData
		this.runtime.dataInstances = this.dataInstances

		console.error("this.runtime.unitsData", this.runtime.unitsData)
		console.error("this.runtime.loadedData", this.runtime.loadedData)
		console.error("this.runtime.dataInstances", this.runtime.dataInstances)

		console.error("this.funcsData", this.funcsData)

		this.invalidStats = new Set()
		this.statsData = {}
		this.stats_Average = {}
		this.iconFrames = new Map()
		console.error("statsData", this.statsData)
		console.error("invalidStats", this.invalidStats)

		///tokeep in case of weird race condition?
		//this.runtime.addLoadPromise(this.LoadData())

		this.runtime.addEventListener("beforeprojectstart", async (e) => {
			await this.On_Before_ProjectStart()
		})

		this.runtime.addEventListener("beforeanylayoutstart", (e) => {
			this.On_Before_LayoutStart()
		})
	}

	async LoadSubclassesFromFolder(folderUrl) {
		const urls = this.GetJSFromFolder(folderUrl)

		if (urls.length === 0) return
		if (this.runtime.main.isDemo && urls[0].includes("game_Full")) {
			return
		}
		if (urls[0].includes("game_WIP")) {
			if (this.runtime.platforms.Export !== "preview" || !this.runtime.main.isWip) {
				return
			}
		}

		// Check for _order JSON file

		let first = []
		let last = []

		const orderData = this?.orderData?.[folderUrl]

		if (orderData) {
			first = Array.isArray(orderData.first) ? orderData.first : []
			last = Array.isArray(orderData.last) ? orderData.last : []

			console.error("OrderData", orderData)
		}

		// Filter URLs into categorized groups
		const firstUrls = first.map((name) => urls.find((url) => url.includes(name + ".js"))).filter(Boolean)
		const lastUrls = last.map((name) => urls.find((url) => url.includes(name + ".js"))).filter(Boolean)
		const remainingUrls = urls.filter((url) => !firstUrls.includes(url) && !lastUrls.includes(url) && !url.includes("_order.json"))

		// Load "first" in sequence
		for (const url of firstUrls) {
			console.error("LoadSubclassesFromScript FIRST", url)
			await this.LoadSubclassesFromScript(url)
		}

		// Load remaining in parallel
		await Promise.all(remainingUrls.map((url) => this.LoadSubclassesFromScript(url)))

		// Load "last" in sequence
		for (const url of lastUrls) {
			console.error("LoadSubclassesFromScript LAST", url)
			await this.LoadSubclassesFromScript(url)
		}
	}

	async LoadScript(scriptPath) {
		try {
			scriptPath = this.runtime.baseUrl + scriptPath
			const mod = await import(scriptPath)

			return mod
		} catch (error) {
			console.error(`Failed to load mod ${scriptPath}:`, error)
		}
	}

	async LoadSubclassesFromScript(scriptPath) {
		try {
			scriptPath = this.runtime.baseUrl + scriptPath

			// Dynamically import the module
			const module = await import(scriptPath)

			// Check named exports
			Object.entries(module).forEach(([name, CLASS]) => {
				if (typeof CLASS === "function") {
					this.AddSubclassToProject(name, CLASS)
				}
			})

			// Check if there is a default export and add it to the appropriate set
			if (module.default && typeof module.default === "function") {
				const defaultName = module.default.name
				this.AddSubclassToProject(defaultName, module.default)
			}
		} catch (error) {
			console.error("Error loading module:", scriptPath, error)
		}
	}

	AddSubclassToProject(name, CLASS) {
		const isSubclassOf = (classItem, baseClass) => {
			return classItem.prototype instanceof baseClass
		}
		if (isSubclassOf(CLASS, C4.Item_Effect)) {
			name = name.replace("Event_", "")
			name = name.replace("Effect_", "")
			name = name.replace("Action_", "")
			name = name.replace("Bool_", "")
			name = name.replace("While_", "")
			C4.Modifs[name] = CLASS
			this.loadedData["ItemEffects"].set(name, CLASS)
		} else if (isSubclassOf(CLASS, C4.Component)) {
			C4.Compos[name] = CLASS
		} else if (isSubclassOf(CLASS, C4.Abi)) {
			name = name.replace("Abi_", "")
			C4.Abis[name] = CLASS
		}
		//* Characters
		else if (isSubclassOf(CLASS, C4.Units.Character)) {
			name = name.replace("Chara_", "")

			const charaDataInst = new CLASS(this.runtime, null)

			C4.Charas[name] = CLASS
			this.unitsData["Charas"].set(name, [CLASS, null])
			this.dataInstances["Charas"].set(name, charaDataInst)

			let itemType = null
			let evolution = 0
			if (charaDataInst.IsNoob) itemType = "Enemy"
			if (charaDataInst.IsHero) evolution = 1
			if (charaDataInst.IsHeroMain) {
				itemType = "Hero"
				evolution = 5
			}

			if (itemType) {
				const itemData = {
					ItemType: charaDataInst.IsHeroMain ? "Hero" : "Enemy",
					Img_AnimObject: charaDataInst.AnimObject,
					EnemyName: name,
				}

				//console.error("⭐Load Chara", name, itemData.Img_AnimObject, charaDataInst)

				this.loadedData["Items"].set(name, itemData)
				const item = new Item(runtime, null, name, evolution)

				this.dataInstances["Items"].set(name, item)
			}

			//
		} else if (isSubclassOf(CLASS, C4.Units.Weapon)) {
			//name = name.replace("Wep_", "")
			this.unitsData["Weps"].set(name, [CLASS, null])
			C4.Weps[name] = CLASS
			this.dataInstances["Weps"].set(name, new CLASS(this.runtime, null))
		} else if (isSubclassOf(CLASS, C4.Units.Bullet)) {
			name = name.replace("Bullet_", "")
			this.unitsData["Bullets"].set(name, [CLASS, null])
			C4.Bullets[name] = CLASS
			//this.dataInstances["Bullets"].set(name, new CLASS(this.runtime, null))
		} else if (isSubclassOf(CLASS, C4.Funcs)) {
			const dataFuncs = new CLASS()
			this.FuncsData_Merge(dataFuncs)
		}
	}

	FuncsData_Merge(instance) {
		// Loop through each key in the instance's `this.data` object
		Object.keys(instance.data).forEach((mainKey) => {
			// If it's a new key, create an empty object
			if (!this.funcsData[mainKey]) {
				this.funcsData[mainKey] = {}
			}

			// Loop through each function inside this `mainKey` and add it to this.funcsData
			Object.keys(instance.data[mainKey]).forEach((funcKey) => {
				// We don't want to overwrite existing functions, so we check if the key already exists
				if (!this.funcsData[mainKey][funcKey]) {
					this.funcsData[mainKey][funcKey] = instance.data[mainKey][funcKey]
				}
			})
		})
	}

	Init_C4() {
		const C4_ = {
			Units: {},
			Compos: {},
			Charas: {},
			Weps: {},
			Bullets: {},
			Abis: {},
			Modifs: {},
		}
		globalThis.C4 = C4_
		console.error("C4", C4)
	}

	async LoadData() {
		this.Init_C4()

		await this.runtime.platforms.GetAppFiles()

		const modules = [
			"ecs/Unit.js",
			"ecs/Component.js",
			"game/abis/Abi.js",
			"game/units/AnimOnly.js",
			"game/units/CameraUnit.js",
			"game/units/Weapon.js",
			"game/units/Bullet.js",
			"game/units/Damage.js",
			"game/units/Character.js",
			"game/units/Pickup.js",
			"game/units/Funcs.js",
			"game/units/Classes.js",
			"inventory/Item_Effect.js",
		]

		if (this.runtime.platforms.Export === "html") {
			console.error("LoadData - Importing Modules", modules)
		}

		for (let pathShort of modules) {
			let path = this.GetUrl(pathShort)
			if (path === undefined || path === null) {
				console.error("LoadData - Importing - path is undefined or null", pathShort)
				continue
			}
			path = this.runtime.baseUrl + path
			if (this.runtime.platforms.Export === "html") {
				console.error("LoadData - Importing", path)
			}

			await import(path)
		}

		if (this.runtime.sineManager) {
			console.error("sineManager.Init_Sine_ObjectTypes")
			this.runtime.sineManager.Init_Sine_ObjectTypes()
		}

		await this.runtime.audio.LoadAllAudioFiles()

		const statsDataRaw = await this.DataFile_UrlToObject("Game/Stats.yml")
		for (let [key, stat] of Object.entries(statsDataRaw)) {
			this.AddStatData(key, stat)
		}

		//prettier-ignore
		const iconsToLoad = [
            "Pickup_Chest", 
            "Info_SpawnBlocked",
            "U_Pentagram",
            "Info_PickupDestroyed",
        ]

		for (const icon of iconsToLoad) {
			const url = "Game/Graph/" + icon + ".png"
			Utils.Object_LoadTextIcons("Icon", icon, url)
		}

		//load order.json

		const otherData_fetch = await fetch("otherData.json")
		const otherData = await otherData_fetch.json()

		this.runtime.main.isDemo = otherData.demz

		const response = await fetch("order.json")
		this.orderData = await response.json()

		await this.LoadSubclassesFromFolder("modifs")

		this.runtime.itemManager.LoadSimpleEvents()

		this.randomItemName = "Item Random"
		this.runtime.loadedData["Items"].set(this.randomItemName, { Img: "random_icon.png" })
		this.randomItem = new Item(runtime, null, this.randomItemName, 0)
		this.randomItem.modLoading = null

		await this.LoadSubclassesFromFolder("compos")
		await this.LoadSubclassesFromFolder("chara_noobs")
		await this.LoadSubclassesFromFolder("characters")

		await this.LoadSubclassesFromFolder("chara_Full")

		await this.LoadSubclassesFromFolder("bullets")

		await this.LoadSubclassesFromFolder("wepTypes")
		await this.LoadSubclassesFromFolder("weps")
		await this.LoadSubclassesFromFolder("weps_Full")
		await this.LoadSubclassesFromFolder("weps_WIP")
		await this.LoadSubclassesFromFolder("weps_NPC")

		await this.LoadSubclassesFromFolder("abis")

		await this.LoadSubclassesFromFolder("funcs_DemoFull")
		await this.LoadSubclassesFromFolder("funcs_Full")

		await this.Load_MainGame()

		await this.LoadMod_Test()

		this.CreateWepItems()

		//create evolution map (before loading chal and save)
		this.CreateEvolutionMap()

		this.runtime.progress.LoadChalData()
		this.runtime.commu.Load_CommuData()
		this.runtime.movie.Load_SceneData()

		await this.runtime.progress.LoadSave()

		this.dataIsLoaded = true
		this.dispatcher.dispatchEvent(new CustomEvent("dataLoaded"))
	}

	async Load_MainGame() {
		await this.DataFile_LoadData("output/MAIN/_SpriteData_MAIN.json")
		await this.DataFile_LoadData("output/FULL/_SpriteData_FULL.json")
		await this.DataFile_LoadData("output/WIP/_SpriteData_WIP.json")
		//await this.DataFile_LoadData("output/DLC/_SpriteData_DLC.json")

		await this.DataFile_LoadData("Game_Demo/Over_Difficulties_Demo.yml")
		await this.DataFile_LoadData("Game_Full/Over_Difficulties.yml")

		await this.DataFile_LoadData("Game/Over_Stats.yml")

		await this.DataFile_LoadData("Game/Over_Items.yml")
		await this.DataFile_LoadData("Game_Full/Over_Items_Full.yml")
		await this.DataFile_LoadData("Game/Over_Synergies.yml")

		//playables
		await this.DataFile_LoadData("Game_Demo/Over_Playables_Demo.yml")
		await this.DataFile_LoadData("Game_Full/Over_Playables.yml")
		await this.DataFile_LoadData("Game_WIP/Over_Playables_WIP.yml")

		//challenges
		await this.DataFile_LoadData("Game_Demo/Over_Chal_Demo.yml")

		await this.DataFile_LoadData("Game_Full/Over_Chal.yml")

		/*if (this.runtime.platformInfo.exportType === "preview") {
			await this.DataFile_LoadData("Game_Full/Over_Chal_WIP.yml")
		}*/

		await this.DataFile_LoadData("Game_WIP/Over_Chal_ATKs.yml")

		await this.DataFile_LoadData("Game/Over_Waves.yml")
	}

	async LoadMod_Test() {
		this.modLoading = "Test"
		//await this.DataFile_LoadData("Mod_Test/Test_Items.yml")

		this.modLoading = null
	}

	CreateEvolutionMap() {
		this.evolutionMap = {}

		for (let [key, value] of this.runtime.dataInstances["Items"]) {
			let baseName
			let evolutionKey

			if (key.includes("_Evo_")) {
				baseName = key.split("_").slice(0, -2).join("_")

				const evoNumber = key.split("_").pop()
				evolutionKey = `Evo${evoNumber}`
			} else {
				baseName = key
				evolutionKey = "Evo0"
			}

			if (!this.evolutionMap[baseName]) {
				this.evolutionMap[baseName] = {}
			}

			this.evolutionMap[baseName][evolutionKey] = value
		}

		console.error("this.evolutionMap", this.evolutionMap)
	}

	async DataFile_LoadData(url) {
		const demoOnly = ["Game_Demo"]
		const fullOnly = ["Game_Full", "output/FULL"]
		const WIP_Only = ["Game_WIP", "output/WIP"]

		if (demoOnly.some((x) => url.includes(x))) {
			if (!this.runtime.main.isDemo) return
		}
		if (fullOnly.some((x) => url.includes(x))) {
			if (this.runtime.main.isDemo) return
		}
		if (WIP_Only.some((x) => url.includes(x))) {
			if (!this.runtime.platforms.Export === "preview") return
			if (!this.runtime.main.isWip) return
		}

		const fileData = await this.DataFile_UrlToObject(url)

		//check rules
		const rules = fileData._Rules

		if (rules.Enabled === false) return

		if (rules?._Ruleset) {
			if (rules._Ruleset === "SpriteData") {
				this.DataFile_SpriteData(fileData)
				return
			}
			if (rules._Ruleset === "Weps") {
				this.DataFile_LoadWep(fileData)
				return
			}

			if (rules._Ruleset === "Waves") {
				const zoneName = rules.ZoneName || url
				this.loadedData["Zones"].set(zoneName, fileData)
				return
			}
			if (rules._Ruleset === "Missions") {
				this.runtime.progress.AddChalData(fileData)
				return
			}
			if (rules._Ruleset === "Chal_ATKs") {
				this.runtime.progress.AddChalData(fileData)
				return
			}
		}

		if (rules?.ItemType && rules.ItemType === "Playable") {
			this.runtime.progress.AddChalData(fileData)
		}

		const defaultData = fileData._Default

		for (let [key, itemData] of Object.entries(fileData)) {
			if (key.startsWith("_")) continue
			if (defaultData) {
				const itemData_ = Utils.deepMerge(defaultData, itemData)
				this.AddItem_DataInst(key, itemData_, 0, rules)
			} else {
				this.AddItem_DataInst(key, itemData, 0, rules)
			}
		}
	}

	DataFile_SpriteData(fileData) {
		if (fileData.Images) {
			for (let [key, item] of Object.entries(fileData.Images)) {
				this.imagesData[key] = item
			}
		}
		if (fileData.Templates) {
			for (let [key, item] of Object.entries(fileData.Templates)) {
				this.templatesData[key] = item

				this.animObjectUrls.set(key, "output/" + item.AnimInfo.IconURL)
			}
		}

		console.error("this.imagesData", this.imagesData)
		console.error("this.templatesData", this.templatesData)
	}

	DataFile_LoadWep(fileData) {
		//* only load the weapon, the item/bullet will be loaded afterwards
		const defaultData = fileData._Default

		for (let [wepName, wepData_] of Object.entries(fileData)) {
			if (wepName.startsWith("_")) continue

			const wepData = Utils.deepMerge(defaultData, wepData_)

			const wepName_ = wepName.replace(/ /g, "_")

			wepData.Img_Wep.Img = wepData.Img_Wep.Img.replace("[name]", wepName_)
			wepData.ITEM.Img = wepData.ITEM.Img.replace("[name]", wepName_)
			wepData.BULLET.Img_Bullet.Img = wepData.BULLET.Img_Bullet.Img.replace("[name]", wepName_)

			wepData.Name = wepName

			const WEP_CLASS = C4.Units.Weapon

			const tempWepInst = new WEP_CLASS(this.runtime, null, 0, wepData)

			console.error("🌞 Create From YAML", wepName, wepData)
		}
	}

	CreateWepItems() {
		const toCreate = [...this.wepItemsToCreate]
		this.wepItemsToCreate = false
		//console.error("🌞 CreateWepItems List", toCreate)
		for (const wep of toCreate) {
			const IsPlayerATK = wep?.IsPlayerATK
			if (!IsPlayerATK) continue

			const WEP_CLASS = wep.constructor
			let wepName = wep.name
			const wepData = wep.data
			const itemData = wepData.ITEM

			const bulletData = wepData.BULLET || {}

			//! add DMGFX_All if needed
			if (bulletData.DAMAGE?.DmgEffects) {
				if (!itemData.Effects) itemData.Effects = {}
				//itemData.Effects["___sep"] = ""
				itemData.Effects["DmgFX_All"] = ""
			}

			//so Items loads the sprite image

			//console.error("🌞 CreateWepItems ", wepName, itemData)

			let BUL_CLASS = C4.Units.Bullet

			if (bulletData?.BulletUnit) {
				const bulletUnit = bulletData.BulletUnit.replace("Bullet_", "")
				BUL_CLASS = C4.Bullets[bulletUnit]
			}

			//Todo: create a reliable way to access all infos about Wep/Damage/Bullet

			//* Create a UR Blob if needed
			if (wepData.AnimObject) {
				itemData.Img_AnimObject = wepData.AnimObject
			}

			//* Define the evolution range
			let evoInit = 0
			let evoMax = 0
			const evos = itemData.Evolutions
			if (evos) {
				if (typeof evos === "number") {
					evoInit = evos
					evoMax = evos
				} else if (typeof evos === "string") {
					const evoSplit = evos.split("-")
					if (evoSplit.length === 1) {
						evoInit = parseInt(evoSplit[0])
						evoMax = parseInt(evoSplit[0])
					} else {
						evoInit = parseInt(evoSplit[0])
						evoMax = parseInt(evoSplit[1])
					}
				}
			}

			itemData.EvoMin = evoInit
			itemData.EvoMax = evoMax

			for (let i = evoInit; i <= evoMax; i++) {
				let Wep_NameEvo = Utils.GetNameEvo(wepName, i)

				const evoData = [i, evoInit]

				const wep = new WEP_CLASS(this.runtime, null, evoData, wepData)
				this.dataInstances["Weps"].set(Wep_NameEvo, wep)
				this.unitsData["Weps"].set(Wep_NameEvo, [WEP_CLASS, wepData])

				//* BULLET (Always due to DAMAGE)
				const bullet = new BUL_CLASS(this.runtime, null, evoData, bulletData)
				this.dataInstances["Bullets"].set(Wep_NameEvo, bullet)
				this.unitsData["Bullets"].set(Wep_NameEvo, [BUL_CLASS, bulletData])

				bullet.WepDataInst = wep
				bullet.Damage.WepDataInst = wep

				//* MINION
				const WEP = wepData.VARS.WEP
				if (WEP.ShootWhat === "Entity" && WEP.ShootWhich) {
					const MINION_CLASS = C4.Charas[WEP.ShootWhich]

					const minion = new MINION_CLASS(this.runtime, null, evoData, {})
					this.dataInstances["Charas"].set(Wep_NameEvo, minion)
					this.unitsData["Charas"].set(Wep_NameEvo, [MINION_CLASS, {}])
				}

				const wepItemName = wepName
				const wepItemNameEvo = Wep_NameEvo

				this.loadedData["Items"].set(wepItemName, itemData)

				const item = new Item(this.runtime, null, wepItemName, i)
				this.dataInstances["Items"].set(wepItemNameEvo, item)

				item.modLoading = this.modLoading

				itemData.Wep_NameEvo = Wep_NameEvo
				item.Wep_NameEvo = Wep_NameEvo
			}
		}
	}

	Get_AnimObjectUrl(name) {
		const fullBody = name + "_FullBody"
		if (this.animObjectUrls.has(fullBody)) return this.animObjectUrls.get(fullBody)
		return this.animObjectUrls.get(name)
	}

	AddItem_DataInst(itemName, itemData, evolution = 0, rules = undefined) {
		if (rules) {
			const name = itemName
			if (rules.Prefix) itemName = rules.Prefix + name
			if (rules.Img && !itemData.Img) {
				itemData.Img = rules.Img.replace("[name]", name).replace(/ /g, "_")
			}

			if (itemData.Img_AnimObject) {
				itemData.Img_AnimObject = itemData.Img_AnimObject.replace("[name]", name).replace(/ /g, "_")
			}

			if (!itemData.ItemType && rules.ItemType) itemData.ItemType = rules.ItemType

			if (rules._Ruleset === "Stats") {
				const data = Utils.deepMerge(rules, itemData)
				const initEvo = data.Rarity
				for (let i = initEvo; i <= 3; i++) {
					let nameEvo = Utils.GetNameEvo(itemName, i)

					data.name = itemName
					data.nameEvo = nameEvo

					this.loadedData["Items"].set(itemName, data)
					const item = new Item(this.runtime, null, itemName, i)
					this.dataInstances["Items"].set(nameEvo, item)
				}
				return
			}
		}

		if (!this.loadedData["Items"].has(itemName)) {
			this.loadedData["Items"].set(itemName, itemData)
		}

		if (itemData.Rarity) evolution = itemData.Rarity

		const item = new Item(runtime, null, itemName, evolution)

		item.modLoading = this.modLoading

		const nameEvo = Utils.GetNameEvo(itemName, evolution)
		this.dataInstances["Items"].set(nameEvo, item)
		return item
	}

	AddStatData(key, stat) {
		if (!key.startsWith("Stat_")) return
		key = key.replace("Stat_", "")
		this.statsData[key] = stat

		if (stat.Multi_Average) {
			this.stats_Average[key] = 1
		}

		const url = "Game/Graph/Stat_" + key + ".png"

		//check if there is an image for the stat

		// Check if the image exists silently
		const img = new Image()
		img.onload = () => {
			this.statsData[key].Img = url

			this.iconFrames.set(key, url)

			Utils.Object_LoadTextIcons("Icon", key, url)
		}
		img.onerror = () => {
			// Image doesn't exist, do nothing or handle fallback logic
		}
		img.src = url
	}

	GetStatData(stat) {
		const statData = this.statsData[stat]
		if (!statData) {
			this.invalidStats.add(stat)
		}
		return statData
	}

	On_Before_LayoutStart() {
		//
	}

	async On_Before_ProjectStart() {
		const promises = []

		//imagesData

		for (const [objectName, animData] of Object.entries(this.imagesData)) {
			promises.push(Utils.Object_LoadAnim("Anim", objectName, animData))
		}

		/*for (const [iconName, iconUrl] of Object.entries(this.iconFrames)) {
			promises.push(Utils.Object_LoadTextIcons("Icon", iconName, iconUrl))
		}*/

		await Utils.PromiseAll(
			promises
			/*() => window.alert("Loaded")*/
		)
	}

	GetJSFromFolder(folderUrl) {
		const filtered = this.runtime.appFiles
			.filter((key) => key.startsWith(folderUrl + "/") || key.includes("/" + folderUrl + "/"))
			.filter((key) => key.endsWith(".js"))

		return filtered
	}

	GetDataFilesFromFolder(folderUrl) {
		const filtered = this.runtime.appFiles
			.filter((key) => key.startsWith(folderUrl + "/") || key.includes("/" + folderUrl + "/"))
			.filter((key) => key.endsWith(".json") || key.endsWith(".yml") || key.endsWith(".yaml"))
		//const filtered = fileMap.keys().filter((key) => key.startsWith(folderUrl) && (key.endsWith(".yml") || key.endsWith(".yaml")))
		return filtered
	}

	GetUrl(filename) {
		let fullUrl = this.appFiles.find((x) => x.endsWith(filename))
		//console.error("GetUrl", fullUrl)
		//fullUrl = fullUrl.replace("https://preview.construct.net/", "")
		return fullUrl
	}

	async DataFile_UrlToObject(url, actualUrl = false) {
		let textFileUrl = url
		if (!actualUrl) {
			textFileUrl = await this.runtime.assets.getProjectFileUrl(url)
		}
		// Now fetch that URL normally
		const response = await fetch(textFileUrl)
		if (!response.ok) {
			throw new Error("Failed to load file: " + url + " Status: " + response.status)
			return false
		}
		const text = await response.text()
		let object

		if (url.endsWith(".json")) {
			object = JSON.parse(text)
		} else if (url.endsWith(".yml") || url.endsWith(".yaml")) {
			object = Yaml.load(text)
		}

		return object
	}
}
