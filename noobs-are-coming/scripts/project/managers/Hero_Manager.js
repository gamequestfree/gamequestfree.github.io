export class Hero_Manager {
	constructor(runtime) {
		this.runtime = runtime
		runtime.addEventListener("beforeanylayoutstart", () => this.OnBeforeLayoutStart())

		this.heroes = []

		this.lastHero = ""

		this.crews = new Map()

		this.forceNextHeroes = ["Mynthos", "JDG", "MV", "Bob", "Lundi_Antoine", "ZTeam_Tank"]
	}

	Crew_CreateFromHeroMain(heroMain) {
		if (heroMain.heroFriends.length === 0) return

		const crewId = heroMain.uid
		const crewData = {}
		this.crews.set(crewId, crewData)

		heroMain.crewId = crewId

		crewData[heroMain.name] = heroMain.uid

		crewData.count_init = heroMain.heroFriends.length + 1

		for (const hero of heroMain.heroFriends) {
			const pos = this.runtime.spawnManager.GetPosInArea_FromCircle(heroMain.x, heroMain.y, 100)

			const heroUnit = this.runtime.spawnManager.SpawnChara(hero)
			heroUnit.crewId = crewId

			crewData[heroUnit.name] = heroUnit.uid
		}
	}

	Crew_GetUid(crewID, unitName) {
		const crew = this.crews.get(crewID)
		if (!crew) return 0
		const unitUid = crew[unitName]
		if (!unitUid) return 0
		return unitUid
	}

	Crew_GetUnit(crewID, unitName) {
		const uid = this.Crew_GetUid(crewID, unitName)
		if (uid === 0) return null
		const unit = this.runtime.getUnitByUID(uid)
		return unit
	}

	OnBeforeLayoutStart() {
		//prettier-ignore
		this.onlyHeroes = [
			"Ballistank",
			"Freezard",
			"Trinity_Tank",
			"Pile",
			"Mynthos",
			"JDG",
			"MV",
			"Bob",
            "ZTeam_Tank",
		]

		const lang = this.runtime.settings.Language
		if (lang === "fr") this.onlyHeroes.push("Lundi_Antoine")

		this.pool_Heroes_Availables = Array.from(this.runtime.dataInstances["Items"].values())
		this.pool_Heroes_Availables = this.pool_Heroes_Availables.filter((item) => item.itemType === "Hero")
		this.pool_Heroes_Availables = this.pool_Heroes_Availables.filter((item) => !item.locked)

		if (this.onlyHeroes) {
			this.pool_Heroes = this.pool_Heroes_Availables.filter((item) => this.onlyHeroes.some((hero) => item.name.includes(hero)))
		}
	}

	AddHero_NextWave_CheckWave(waveNumberOffset = 0) {
		let waveCount = this.runtime.waveManager.waveCount

		waveCount = waveCount + waveNumberOffset

		if (waveCount >= 15 && waveCount % 5 === 0) {
			this.AddHero_NextWave()
		} else {
			//
		}
	}

	Wave_Skip_AddHero() {
		this.AddHero_NextWave_CheckWave()
		this.SpawnHeroes()
	}

	AddHero_NextWave() {
		//console.error("Last Hero:", this.lastHero)
		let possibleHeroes = this.pool_Heroes.filter((item) => !this.heroes.includes(item.name) && item.name !== this.lastHero)
		if (possibleHeroes.length === 0) possibleHeroes = this.pool_Heroes

		let heroPicked = Utils.Array_Random(possibleHeroes)

		if (this.forceNextHeroes.length > 0) {
			const forcedHero = this.forceNextHeroes.shift()
			const heroPicked_maybe = this.pool_Heroes_Availables.find((item) => item.name.includes(forcedHero))
			if (heroPicked_maybe) heroPicked = heroPicked_maybe
		}

		this.heroes.push(heroPicked.name)

		this.lastHero = heroPicked.name
	}

	SpawnHeroes() {
		if (this.heroes.length === 0) {
			this.isHeroWave = false
			return
		}

		this.isHeroWave = true

		for (const heroName of this.heroes) {
			this.runtime.spawnManager.SpawnChara(heroName)
		}

		for (const player of this.runtime.players) {
			const heroItems = player.inventory.items.filter((item) => item.itemType === "Hero" || item.itemType === "Enemy")
			for (const item of heroItems) {
				item.RemoveItemFromInventory()
			}
		}

		this.heroes = []
	}
}
