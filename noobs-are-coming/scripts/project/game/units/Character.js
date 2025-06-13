import { Stats } from "../../inventory/Stats.js"

C4.Units.Character = class Character extends C4.Unit {
	static unitType = "Chara"
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	//*========== CONFIG ====================

	SetData() {
		super.SetData()

		this.charaComp = this.AddComponent(C4.Compos.Compo_Chara, "Character")
		this.brainComp = this.AddComponent(C4.Compos.Compo_Brain, "Brain")
		this.orbitComp = this.AddComponent(C4.Compos.Compo_Orbits, "Orbits")
		this.moveComp = this.AddComponent(C4.Compos.Compo_Move, "Move")
		this.varsToProcess = ["Speed_Walk"]
		this.SetVars_Default({
			FactionID: "Enemy",
			IsEnemy: false,
			IsElite: false,
			IsHero: false,
			IsHeroMain: false,
			IsMinion: false,

			HP_HeroScale: 1,

			CanPseudo: true,
			//CanNoobBark: true,

			Lvl: 3,

			HP_Max: 10,
			HP_PerWave: 0,
			Speed_Walk: "35",
			Speed_Acceleration: 0,
			AngleSpeed: -1,
			Damage: 0,
			Damage_PerWave: 0,

			Invulnerable: false,

			Damage_Enemy: [],

			Knockback_Mult: 1,

			HasUsername: false,

			Shadow_Width: 1.6,
			Has_Healthbar: false,

			//walk Anim
			WalkType: "Sine",

			WalkJump_HeightMax: 0,
			WalkJump_TweenDuration: 0.15,
			WalkJump_AngleMode: "Alt", //"No", "Alt", "Move", "Opposite"
			WalkJump_AngleMax: 5,
			WalkJump_StepSS: false,
			WalkJump_StepSS_Arr: [1.1, 0.9],

			RandomFrame: true,

			//drop
			Drop_Souls: 0,
			Drop_Loot: {},

			FollowTargetMove: false,
			OffsetXY: [0, 0],
			OffsetAngle: 0,

			Circle_Range: 0,
		})

		this.OverrideData({
			AnimObject: "Anim",
			VARS: {
				//
			},
			Img_Chara: {
				Origin: [0.5, 1],
			},
		})
	}

	InitData() {
		this.name = this.data.Name || this.constructor.name

		this.AddTags(this.name)

		this.WalkJump_TweenDuration = this.WalkJump_TweenDuration * Utils.random(0.9, 1.1)

		this.AddAbis(this.data?.Abis)
		this.Events = this.data?.Events

		this.enemyTags = this.data?.EnemyTags || ["Enemy"]

		if (this.data?.TargetSummoner) {
			this.targetSummonner = true
		}

		requestAnimationFrame(() => {
			this.Chara_TargetRandomUnit()
		})
	}

	SetInternals() {
		//config
		this.player = null

		//runtimeData
		this.Dead = false

		//runtime
		this.Speed_ToleranceIdle = 10
		this.Target_DistanceAprox1 = 5
		this.Target_DistanceAprox2 = 12

		this.autoweps = []
		this.mergos = []

		this.speedMult = 1

		this.cantMove = false
		this.invulnerable = false

		this.statusDamages_NameToUID = new Map()
	}

	ReleaseUnit() {
		this.mergos = []

		this.charaComp = null
		this.brainComp = null
		this.orbitComp = null
		this.moveComp = null

		this.orbitWep = null

		if (this.Hitbox) {
			if (this.Hitbox.Damage) {
				this.Hitbox.Damage.ReleaseDamage()
				this.Hitbox.Damage = null
			}
			this.Hitbox = null
		}
	}

	ATK_Stat(stat, value, hitUnit = null) {
		super.ATK_Stat(stat, value, hitUnit)
		//this.wepComp.ATK_Stat(stat, value, hitUnit)

		if (this.player) {
			this.player.TriggerHitEvent("On_You_" + stat, hitUnit)

			//console.error("On_You_" + stat)

			const value = this.Get_ATK_Stat_ThisWave(stat)
			if (stat === "Kill") {
				this.stats.SetStatValue("ThisWave_Kills", value)
			}
			if (stat === "Crit") {
				this.stats.SetStatValue("ThisWave_Crits", value)
			}
		}
	}

	IsInvulnerable(damageToTest = null) {
		if (this.invulnerable) return true
		if (this.timerComp.Timer_Get("invulnerable")) return true
		if (this.invulnerable_InfiniteTimer) return true
		if (this.Flag_Has("Invulnerable")) return true
		if (this.Flag_Has("Invulnerable_TooHigh")) return true
		return false
	}

	get color() {
		if (this.player) return this.player.color_
		else return this.runtime.colorsGame.EnemyIdle
	}

	Set_Circle_Range(radius = -1, color = null) {
		if (radius >= 0) this.Circle_Range = radius
		if (color) this.Circle_Range_Color = color

		if (this.Circle_Range > 0) {
			if (!this.circleRange) {
				this.circleRange = this.runtime.pool.CreateInstance("Circle_Range", "FX_Ground", this.inst.x, this.inst.y)
				this.inst.addChild(this.circleRange, {
					transformX: true,
					transformY: true,
					destroyWithParent: true,
				})
				//console.error("CircleRange", this.circleRange)
			}

			this.circleRange.isVisible = true
			this.circleRange.opacity = 0.7

			this.circleRange.setSize(this.Circle_Range * 2, this.Circle_Range * 2)
			this.circleRange.colorRgb = this.Circle_Range_Color || [1, 0, 0]
		} else {
			if (this.circleRange) this.circleRange.isVisible = false
		}
	}

	Init() {
		this.offsetX = 0 //this.OffsetXY[0]
		this.offsetY = 0

		this.outlineColor = [1, 0, 0]

		//

		/*this.juice.Spring_StartOffset("pos2D", {
			name: "Offset_Pos2D",
		})*/

		this.juice.Spring_StartOffset("angle", {
			name: "Offset_Angle",
		})

		this.SetWalkType(this.WalkType)

		//* health
		this.healthComp = this.AddComponent(C4.Compos.Compo_Jauge, "Health", null)

		//*Tick

		//this._SetTicking(true)

		this.OnCreated()

		if (this.Has_Healthbar) this.Healthbar_Create()

		this.runtime.events.dispatchEventString("OnUnit_Created", { unit: this })
		this.runtime.events.dispatchEventString("OnUnit_PopDepop", { unit: this, pop: true })
	}

	Healthbar_Create() {
		if (this.healthBar) return
		this.healthBar = this.runtime.objects["Bar_Local"].createInstance("HUD_Local", this.inst.x, this.AnimTopY() - 15)
		this.inst.addChild(this.healthBar, {
			transformX: true,
			transformY: true,
			destroyWithParent: true,
		})
		this.healthBar.isVisible = true
		this.healthComp.AddListener(this.healthBar)

		if (this.IsHero) {
			this.healthBar.width *= 1.5
			this.healthBar.height *= 1.2
		}
	}

	SetAnimObject(name) {
		super.SetAnimObject(name)

		if (this.RandomFrame) {
			const frameCount = this.anim.animation.frameCount
			this.anim.animationFrame = Utils.randomInt(frameCount)
		}

		if (this.healthBar) {
			this.healthBar.x = this.inst.x
			this.healthBar.y = this.AnimTopY() - 15
		}

		if (this?.player?.powerBar && this.healthBar) {
			this.player.powerBar.setPosition(this.inst.x, this.unit.AnimTopY() - 15 + 7)
		}

		this.RefreshHitbox(this.Hitbox)
	}

	AnimObject_FullBody() {
		let AnimObject = this.AnimObject

		if (this.runtime.dataManager.templatesData[AnimObject + "_FullBody"]) {
			AnimObject += "_FullBody"
		}
		return AnimObject
	}

	//* VISU HELPERS

	HurtOverlay() {
		this.SetColorOverlay([1, 0, 0], 500)
		this.timerComp.Timer_Start_Args({
			id: "colorOverlay",
			duration: 0.2,
			callback: () => {
				this.SetColorOverlay(false)
			},
		})
	}

	Set_AnimTopY(override) {
		this.animTopY_override = override

		//
	}

	AnimTopY() {
		if (this.animTopY_override) return this.animTopY_override
		const bbox = this.inst.getBoundingBox()
		const bboxBottom = bbox.bottom
		if (!this.anim) return bboxBottom
		return bboxBottom - this.anim.height
	}

	SetUnitVisible(bool) {
		super.SetUnitVisible(bool)
		if (this.wepActive) this.wepActive.SetWepEnabled(bool)

		for (const autoWep of this.autoweps) {
			autoWep.SetWepEnabled(bool)
		}

		for (const mergo of this.mergos) {
			mergo.isVisible = bool
		}

		if (this.player) {
			if (bool) this.player.SetInvulnerable(0.2)
			else this.player.SetInvulnerable(true)
		}
	}

	SetWalkType(type) {
		if (this.walkType_current === type) return

		const walkType_previous = this.walkType_current
		this.walkType_current = type

		//previous

		this.juice.Sine_Stop("Height")
		this.juice.Sine_Stop("Width")

		//new

		if (this.walkType_current === "Sine") {
			this.juice.Sine_Start("Height", 0.5, 0, 8)
			this.juice.Sine_Start("Width", 0.5, 0.5, 8)
		}

		if (this.walkType_current === "Jump") {
			this.juice.Sine_Start("Height", 1.4, 0, 2)
			this.juice.Sine_Start("Width", 1.4, 0.5, 3)
		}
	}

	//*========== CONSTRUCTORS ====================

	AddAbis(abis) {
		if (!this.brainComp) return
		this.brainComp.AddAbis(abis)
	}

	SetAbis(abis) {
		if (!this.brainComp) return
		this.brainComp.SetAbis(abis)
	}

	AddItemByName(...args) {
		if (this.player) {
			this.player.AddItemByName(...args)
		} else {
			window.alert("AddItemByName, no player")
		}
	}

	SetWeapon(Wep_NameEvo, evo = null, overrideData = {}) {
		if (!this.inst) return
		if (evo) Wep_NameEvo = Utils.GetNameEvo(Wep_NameEvo, evo)

		this.wepActive = this.runtime.spawnManager.SpawnWep(Wep_NameEvo, this.inst.x, this.inst.y, overrideData)
		this.wepActive.Set_EntityUID(this.uid)

		//! justTest
		this.runtime.zOrder.LinkTo(this.wepActive.anim, this.anim, 100)

		return this.wepActive
	}

	SetStats(stats) {
		if (!this.stats) this.stats = new Stats(this.runtime, this)
	}

	//*========== FUNCTIONS ====================

	//*=== CHARA_COMP | ON CREATED / DESTROYED

	OnCreated() {
		this.OnCreated_VFX()
		this.OnCreated_AddShadow()

		this.OnCreated_Enemy()

		this.Set_Circle_Range()
	}

	RefreshHitbox(hitbox) {
		if (hitbox) {
			hitbox.removeFromParent()

			hitbox.setPosition(this.bboxMidX, this.bboxMidY)
			hitbox.width = this.inst.width * 0.7
			hitbox.height = hitbox.width

			this.inst.addChild(hitbox, {
				transformX: true,
				transformY: true,
			})

			this.uidsToDestroy.add(hitbox.uid)
		}
	}

	OnCreated_VFX() {
		const fx_poof = this.runtime.pool.CreateInstance("FX_ParticlePoof", "Objects", this.inst.x, this.inst.y + 5)
		fx_poof.setAnimation("Poof")
		fx_poof.animationFrame = 0
	}

	OnCreated_AddShadow() {
		this.shadow = this.runtime.pool.CreateInstance("Shadow", "Shadows", this.inst.x, this.inst.y)

		this.inst.addChild(this.shadow, {
			transformX: true,
			transformY: true,
			destroyWithParent: true,
		})
	}

	Add_Pseudonym(override = null, pseudoStyle = {}) {
		this.HasUsername = true

		let levelText = ""

		//*level
		const lvl = this.Lvl + Utils.choose(0, 1)
		levelText = this.runtime.translation.Get("Lvl")
		levelText = levelText.replace("{0}", lvl)

		//*pseudo

		levelText = this.runtime.main.Get_Pseudo()

		if (override) levelText = override

		let pseudoText = Utils.World_GetChild(this.inst, "Text_Game")
		if (!pseudoText) pseudoText = this.runtime.pool.CreateInstance("Text_Game", "HUD_Local", this.anim.x, this.AnimTopY() - 5)

		pseudoStyle.text = levelText

		pseudoStyle.size = pseudoStyle.size || 4.5
		pseudoStyle.color = pseudoStyle.color || "#00ff00"
		pseudoStyle.outlineBack = 6
		pseudoStyle.opacity = pseudoStyle.opacity || 0.8

		Utils.TextC3(pseudoText, pseudoStyle)

		this.inst.addChild(pseudoText, {
			transformX: true,
			transformY: true,
			destroyWithParent: true,
		})
	}

	OnCreated_Enemy() {
		if (!this.IsEnemy || this.player) return

		if (this.IsHero) {
			this.IsElite = true
			this.Has_Healthbar = true
			this.CanPseudo = false

			let heroPseudo = this.name.replace("Hero_", "").replace("Noob_", "").replace("Elite_", "")
			heroPseudo = this.runtime.translation.Get(heroPseudo)

			this.Add_Pseudonym(heroPseudo, {
				color: "#ff4545",
				size: 5.5,
				opacity: 0.95,
			})
		}

		if (this.IsElite) {
			this.Has_Healthbar = true
		}

		if (this.CanPseudo) {
			if (Math.random() < this.runtime.main.GetSharedStat_Average_Cache("Noobs_ChancePseudo")) {
				this.Add_Pseudonym()
			}
		}

		const waveManager = this.runtime.waveManager

		this.Speed_Walk *= waveManager.enemy_Speed

		if (this.IsElite) this.Speed_Walk *= waveManager.elite_Speed

		let hp = this.HP_Max + this.HP_PerWave * waveManager.waveCount
		hp = hp * waveManager.enemy_HP
		if (this.IsElite) hp *= waveManager.elite_HP
		hp = Math.floor(hp)
		this.healthComp.SetCurrentToMax(hp)

		let damageHit = 0
		damageHit = this.Damage + this.Damage_PerWave * waveManager.waveCount

		if (this.Damage_Enemy.length > 0) {
			damageHit = Utils.GetValueFromArrayCurve(this.Damage_Enemy, waveManager.waveCount)
		}

		//* always
		damageHit *= waveManager.enemy_Damage

		if (this.IsElite) damageHit *= waveManager.elite_Damage

		if (damageHit > 0) {
			this.Hitbox = this.runtime.pool.CreateInstance("Hitbox_Enemy", "Collisions_Debug", this.bboxMidX, this.bboxMidY)
			this.Hitbox.isVisible = true

			this.RefreshHitbox(this.Hitbox)

			this.Hitbox.Damage = new C4.Damage(this.runtime, 0)

			this.Hitbox.Damage.damageTick = 0
			this.Hitbox.Damage.damageAmount = damageHit
		}

		this.SetOutline(false)

		//this.SetOutline(this.runtime.colorsGame.EnemyIdle)

		//this.SetOutline([0.361, 0, 0])

		//this.NPC_PickTarget()
		/*if (this.runtime.player.inst) this.charaComp.targetUID = this.runtime.player.inst.uid
		console.error("NPC_PickTarget", this.charaComp.targetUID)*/
		this.Chara_TargetRandomUnit()
	}

	get targetUID() {
		return this.charaComp.targetUID
	}

	Chara_TargetRandomUnit() {
		//const livingPlayers = Array.from(this.runtime.playersAlive)
		//! bandage fix (just to avoid error in console)
		//! it happens when unit is destroyed the first frame it appears (due to requestAnimationFrame)
		if (!this.charaComp) return

		const allTargets = this.runtime.units.GetUnitsByTags(this.enemyTags, "Chara")
		if (allTargets.length === 0) return
		const randomTarget = Utils.Array_Random(allTargets)
		this.charaComp.targetUID = randomTarget.unit.uid
	}

	Enemy_TargetClosestPlayer() {
		//const livingPlayers = Array.from(this.runtime.playersAlive)
		let livingPlayers = this.runtime.units.GetUnitsByTags(this.enemyTags, "Chara")

		if (livingPlayers.length === 0) {
			return
		}
		livingPlayers = livingPlayers.filter((player) => player?.unit)
		const livingPlayers_NoDead = livingPlayers.filter((player) => !player.unit.Dead)
		const targetCandidates = livingPlayers_NoDead.length > 0 ? livingPlayers_NoDead : livingPlayers

		const closestPlayer = this.PickNearest(targetCandidates, this.inst.x, this.inst.y)
		if (!closestPlayer?.unit) {
			//window.alert("⛔Enemy_TargetClosestPlayer livingPlayers")
			//! TODO fix this
			//console.error("⛔Enemy_TargetClosestPlayer livingPlayers", livingPlayers)
			return
		}
		this.charaComp.targetUID = closestPlayer.unit.uid
	}

	Tick_Enemy() {
		if ((!this.IsEnemy && !this.IsMinion) || this.player) return
		this.Enemy_TargetClosestPlayer()
	}

	Health_OnChanged() {
		if (this.player) {
			this.player.Health_OnChanged()
		}
	}

	Health_OnCurrentDepleted() {
		if (this.Dead) return
		this.Dead = true
		this.OnDestroyed()
	}

	Depop() {
		if (this.destroyed) return
		this.OnDestroyed(true)
	}

	OnDestroyed_Callback() {
		//
	}

	OnDestroyed(justDepop = false) {
		if (this.destroyed) return

		this.runtime.units._unitsToDestroy.set(this, justDepop)
	}

	OnDestroyed_Actual(justDepop = false) {
		if (this.destroyed) return
		//remove as target
		/*
		const npcs = this.runtime.objects["Chara"].getAllInstances()
		npcs.filter((npc) => npc.unit.charaComp.TargetUID() === this.inst.GetUID()).forEach((npc) => {
			npc.unit.NPC_PickTarget()
		})*/

		this.runtime.events.dispatchEventString("OnUnit_PopDepop", { unit: this, pop: false })
		this.runtime.events.dispatchEventString("OnUnit_Destroyed", { unit: this })

		if (!justDepop) {
			this.OnDestroyed_Callback()
			this.OnDestroyed_VFX()

			//* LOOT (only for Enemies)

			for (const [dropWhat, dropValue] of Object.entries(this.Drop_Loot)) {
				for (let i = 0; i < dropValue; i++) {
					if (dropWhat === "Soul_Golden") {
						this.runtime.spawnManager.SpawnCoin(this.inst.x, this.inst.y, "Soul_Golden")
					} else if (dropWhat === "Chest") {
						const pickInst = this.runtime.pool.CreateInstance("Pickup_Chest", "Objects", this.inst.x, this.inst.y)
					}
				}
			}

			let soulCount = this.Drop_Souls * this.runtime.main.GetSharedStat_Average_Cache("Drop_Souls")

			soulCount = soulCount * this.runtime.coop.Coop_CoinFactor()

			soulCount = Utils.RoundRandom(soulCount)

			for (let i = 0; i < soulCount; i++) {
				this.runtime.spawnManager.SpawnCoin(this.inst.x, this.inst.y)
			}

			if (this.IsEnemy) {
				const livingPlayers = Array.from(this.runtime.playersAlive)
				for (const player of livingPlayers) {
					player.TriggerHitEvent("On_Noob_Death", this)
					if (this.HasUsername) {
						player.TriggerHitEvent("On_Noob_Username_Death", this)
					}
				}

				//console.error("OnDestroyed enemy", this.uid)

				for (let i = 0; i < 4; i++) {
					const random = Math.random() * 100

					let pickupToPop = ""
					let chance = 0

					if (i === 0) {
						pickupToPop = "Pickup_Potion"
						chance = 3.5 * this.runtime.main.GetSharedStat_Average_Cache("DropChance_Potion")
					} else if (i === 1) {
						pickupToPop = "Pickup_Soul_Flask"
						chance = 1 * this.runtime.main.GetSharedStat_Average_Cache("DropChance_Soul_Flask")
					} else if (i === 2) {
						pickupToPop = "Pickup_Chest"
						chance = 0.7 * this.runtime.main.GetSharedStat_Average_Cache("DropChance_Chest")
					} else if (i === 3) {
						const DropChance_Mushroom = this.runtime.main.GetSharedStat_Average_Cache("DropChance_Mushroom")
						if (DropChance_Mushroom > 1) {
							pickupToPop = "Pickup_Mushroom"
							chance = 2 * DropChance_Mushroom
						}
					}

					const luck = this.runtime.main.GetSharedStat_Average_Cache("Luck")
					chance = chance * (1 + luck / 100)

					//if (i === 2) console.error("Potion Drop Chance", chance)

					if (random < chance && this.runtime.objects[pickupToPop]) {
						const pickObjectCount = this.runtime.objects[pickupToPop].getAllInstances().length
						const playerCount = this.runtime.playersEnabled.size

						let baseMaxCount = 4
						if (pickupToPop === "Pickup_Chest") baseMaxCount = 2
						if (pickupToPop === "Pickup_Soul_Flask") baseMaxCount = 3

						if (pickObjectCount < baseMaxCount + playerCount) {
							const pickInst = this.runtime.pool.CreateInstance(pickupToPop, "Objects", this.inst.x, this.inst.y)
							pickInst.width *= Utils.choose(-1, 1)
							break
						}
					}
				}
			}
		}

		if (this.player) {
			//fake Destroy
			this.player.OnDeath()
		}

		if (!this.player) {
			for (const child of this.inst.children()) {
				if (this.runtime.objects["BackPool_Children"].getAllInstances().includes(child)) {
					this.runtime.pool.DestroyInstance(child)
				}
			}

			this.wepActive?.DestroyUnit()
			this.wepActive = null

			if (this.autoweps.length > 0) {
				console.error("Destroy Autoweps", this.autoweps.length)
			}

			for (const autoWep of this.autoweps) {
				autoWep.DestroyUnit()
			}

			//! VERY IMPORTANT to avoid bugs with AnimOnly?
			if (this.anim.unit) this.anim.unit.DestroyUnit()

			this.DestroyUnit()
		}
	}

	Enemy_PrepareATK() {
		//
	}

	Heal(healValue) {
		if (this.Dead) return

		if (this.player && this.player.effects.GetBool("No_Heal")) return

		this.healthComp.addCurrent(healValue)

		this.Heal_Pointburst(this.unit, healValue, 0)
	}

	Heal_Pointburst(hitUnit, damage, angle, type = "") {
		const instPoint = this.runtime.pointburst.CreatePointBurst_SpriteFont(damage, hitUnit.x, hitUnit.y - 30)

		instPoint.colorRgb = [0, 1, 0]

		const pointBurstDist = Utils.random(10, 20)

		instPoint.behaviors["Tween"].startTween("position", [instPoint.x, instPoint.y - pointBurstDist], 0.3, "out-exponential")
	}

	OnHurt() {
		this.OnHurt_VFX()
	}

	OnHurt_VFX() {
		//
	}

	TakeDamage(damageData) {
		if (typeof damageData === "number") {
			damageData = {
				Dmg: damageData,
			}
		}

		const Damage = new C4.Damage(this.runtime, 0, 0, damageData)
		Damage.DealDamage(this)
		Damage.ReleaseDamage()
	}

	OnDestroyed_VFX() {
		this.runtime.camera.Screenshake({
			Mag: 1,
			Duration: 0.5,
		})

		const sfxDeath = "Chara_Death_0" + Utils.randomInt(1, 3)
		this.runtime.audio.PlaySound(sfxDeath, 0.3, Utils.random(0.9, 1.1))

		//const sfxDeath = "Impact_Flesh_0" + Utils.randomInt(2, 8)
		//this.runtime.audio.PlaySound(sfxDeath, 0.4)

		//this.runtime.audio.PlaySound("Chara_LightDeath_0" + Utils.randomInt(3) + 1)

		const fx_bloodsplosion = this.runtime.pool.CreateInstance("FX_Bloodsplosion", "Objects", this.inst.x, this.inst.y + 2)
		fx_bloodsplosion.animationFrame = 0

		const fx_blood_ground = this.runtime.pool.CreateInstance("FX_Blood", "FX_Ground", fx_bloodsplosion.x, fx_bloodsplosion.y)
		fx_blood_ground.animationFrame = Utils.randomInt(0, 3)
		fx_blood_ground.behaviors["Fade"].restartFade()

		const fx_poof = this.runtime.pool.CreateInstance("FX_ParticlePoof", "FX_Ahead", fx_bloodsplosion.x, fx_bloodsplosion.y)
		fx_poof.setAnimation("Poof")
		fx_poof.animationFrame = 0

		const textImpact = Utils.choose("ouch", "uggh", "argh")
		this.runtime.pointburst.Create_SF_TextImpact(textImpact, "Red", fx_bloodsplosion.x, fx_bloodsplosion.y)

		//todo disable sines

		//TODO fadeout pool
		//fx_blood.addEventListener("fadeoutend", (e) => e.instance.runtime.pool.DestroyInstance(e.instance))
	}

	//====================================================================================================

	Tick(e) {
		if (this.IsEnemy || this.IsMinion) {
			this.charaComp.Set_TargetXY_ToUID()
		}
		this.Tick_Ability()
		this.Tick_MoveEntity()
		this.Tick_Enemy()
	}

	//*MOVE

	Tick_MoveEntity() {
		//window.alert("Tick_MoveEntity")
		//Move entity

		if (this.brainComp.Move_RegularLogic) {
			let moveRegularLogic = true

			if (this.kickMoving) {
				moveRegularLogic = false
			}

			if (moveRegularLogic) {
				let hasTarget = this.charaComp.targetUID > 0
				if (this.player) hasTarget = true

				if (this.FollowTargetMove && hasTarget) {
					if (this.charaComp.DistanceToTarget() > this.Target_DistanceAprox1) {
						this.moveComp.Set_AngleOfMotion(this.charaComp.Angle_OriginToTarget() + this.OffsetAngle)
						this.InputMove = true
					} else this.InputMove = false
				}
				let speed = 0
				const speedStat = this.stats?.GetStatValue("Speed")

				if (this.InputMove && !this.cantMove) {
					speed = this.Speed_Walk
					if (speedStat != undefined) speed = speed * speedStat
				}

				speed = speed * this.speedMult

				this.moveComp.Set_Speed(speed)
			}
		}

		//Move entity

		this.isMoving = false

		if (this.brainComp.Move_RegularAnim) {
			if (this.moveComp.enabled && this.moveComp.isMoving) {
				this.Set_Anim_Mirrored_FromAngle(this.charaComp.Angle_OriginToTarget() + this.OffsetAngle)

				/*if (this.player) {
					Utils.debugText("Player MoveAngle:" + this.charaComp.Angle_OriginToTarget() + this.OffsetAngle)
				}*/
			}

			//useless in this game
			/*else if (this.physicBeh && this.physicBeh.enabled) {
				this.Set_Anim_Mirrored_FromAngle(this.physicBeh.angle)
			} 
            else this.Set_Anim_Mirrored_FromAngle(this.charaComp.Angle_Aim())*/

			if (!this.Dead) {
				if (this.moveComp.isMoving && this.charaComp.DistanceToTarget() > this.Target_DistanceAprox2) {
					this.isMoving = true

					if (this.WalkJump_HeightMax) {
						this.Tween_MoveJump()
					}
				} else {
					//
				}
			}
		}

		if (this.zJumpOffset) {
			this.anim.y = this.inst.y - this.zJumpOffset
		} else if (this.tweenMove) {
			const tweenValue = this.tweenMove.value
			const tweenMoveOffset = tweenValue - this.tweenMovePrev

			if (this.WalkJump_AngleMax) {
				let angleMod = this.tweenMove_left
				if (this.WalkJump_AngleMode === "No") angleMod = 0
				else if (this.WalkJump_AngleMode === "Same") angleMod = this.mirroredMod
				else if (this.WalkJump_AngleMode === "Opposite") angleMod = -this.mirroredMod

				const tweenMoveOffset_Angle = ((tweenMoveOffset * this.WalkJump_AngleMax) / this.WalkJump_HeightMax) * angleMod
				this.anim.angleDegrees += tweenMoveOffset_Angle
			}

			this.anim.y += tweenMoveOffset
			this.tweenMovePrev = tweenValue
		}

		this.anim.zOrder = this.inst.y

		if (this.shadow && this.WalkJump_HeightMax && this.anim.isVisible) {
			const currentHeight = this.inst.y - this.anim.y
			const minScale = 0.8
			const scale = 1 - (currentHeight / this.WalkJump_HeightMax) * (1 - minScale)
			this.shadow.width = this.inst.width * this.Shadow_Width * scale
		} else {
			this.shadow.width = this.inst.width * this.Shadow_Width
		}

		this.shadow.height = this.shadow.width * 0.42

		if (this.wepActive) {
			const handComp = this.wepActive.handComp
			const currentHeight = this.inst.y - this.anim.y
			handComp.pivotOffsetY = -currentHeight * 0.5

			//this.wepActive.inst.zOrder = this.inst.y
		}
	}

	Tween_MoveJump() {
		if (this.tweenMove || !this.inst) return
		if (this.WalkType !== "Jump") return
		const tweenBeh = this.inst.behaviors["Tween"]
		if (!tweenBeh) return

		if (!this.tweenMove_left) this.tweenMove_left = Utils.choose(-1, 1)

		this.tweenMove_left = this.tweenMove_left === 1 ? -1 : 1

		this.tweenMovePrev = 0
		this.tweenMove = tweenBeh.startTween("value", -this.WalkJump_HeightMax, this.WalkJump_TweenDuration, "out-cubic", {
			pingPong: true,
		})

		this.tweenMove.finished.then(() => {
			this.tweenMove = null

			if (this.inst) {
				this.runtime.fxManager.FX_WalkStep(this.inst.x, this.inst.y)
			}

			if (this.WalkJump_StepSS) {
				this.juice.SS_SetScale(this.WalkJump_StepSS_Arr[0], this.WalkJump_StepSS_Arr[1])
			}

			if (this.isMoving) {
				this.Tween_MoveJump()
			}
		})
	}

	Anim_SetAnimation(name) {
		//
	}

	BarkTwitch_Old() {
		const msgObj = this.runtime.twitch.twitchMessages.shift()

		const userName = msgObj.username
		let message = msgObj.message
		//only keep the first 100 characters
		if (message.length > 100) {
			message = message.substring(0, 100) + "..."
		}

		this.Add_Pseudonym(userName)

		const textBark = this.runtime.pool.CreateInstance("Text_Bark", "HUD_Local", this.anim.x, this.AnimTopY() - 5)

		this.anim.addChild(textBark, {
			transformX: true,
			transformY: true,
			destroyWithParent: true,
		})

		let text = "[background=#000000] " + message + " "

		textBark.text = text

		return true
	}

	Bark_Specific(message, override = false) {
		if (this.runtime.objects["Text_Bark"].getAllInstances().length > 19) return false
		const prevBark = Utils.World_GetChild(this.anim, "Text_Bark")
		if (prevBark) {
			if (!override) return false
			prevBark.destroy()
		}

		/*const msgObj = this.runtime.twitch.twitchMessages.shift()
		const userName = msgObj.username
		let message = msgObj.message*/
		//only keep the first 100 characters
		if (message.length > 50) {
			message = message.substring(0, 50) + "..."
		}

		//this.Add_Pseudonym(userName)

		const textBark = this.runtime.pool.CreateInstance("Text_Bark", "HUD_Local", this.anim.x, this.AnimTopY() - 5)

		this.anim.addChild(textBark, {
			transformX: true,
			transformY: true,
			destroyWithParent: true,
		})

		let text = "[background=#000000] " + message + " "

		textBark.text = text

		return true
	}

	Bark_Hero(override = false) {
		this.Bark(this.charaName, override)
	}

	Bark(barkType, override = false) {
		if (this.runtime.objects["Text_Bark"].getAllInstances().length > 19) return false

		const barkKeys = this.runtime.translation.barkMap[barkType]
		const key = Utils.Array_Random(barkKeys)

		if (!key) return false

		let text = this.runtime.translation.Get(key)

		const prevBark = Utils.World_GetChild(this.anim, "Text_Bark")
		if (prevBark) {
			if (!override) return false
			prevBark.destroy()
		}

		let textBark = null

		if (key.includes("Boss")) {
			textBark = this.runtime.pool.CreateInstance("Text_Bark_Boss", "HUD_Local", this.anim.x, this.healthBar.getBoundingBox().top - 1)
		} else if (this.IsElite) {
			textBark = this.runtime.pool.CreateInstance("Text_Bark_Boss", "HUD_Local", this.anim.x, this.healthBar.getBoundingBox().top - 1)
		} else {
			textBark = this.runtime.pool.CreateInstance("Text_Bark", "HUD_Local", this.anim.x, this.AnimTopY() - 5)
		}

		const fadeBeh = textBark.behaviors["Fade"]

		if (barkType === "Noob") {
			fadeBeh.waitTime = 2.5
		}

		this.inst.addChild(textBark, {
			transformX: true,
			transformY: true,
			destroyWithParent: true,
		})

		//text = "[outlineback=#000000][lineThickness=4] " + text + " "
		text = "[background=#000000] " + text + " "

		textBark.text = text

		return true
	}

	//*ABIS

	get curAbi() {
		return this.brainComp.curAbi
	}

	Tick_Ability() {
		//set Target
		if (this.brainComp?.curAbi?.step === "AB_Start") {
			if (!this.player) {
				this.brainComp.curAbi.Set_TargetXY_ToUID()
			}
			if (this.brainComp.curAbi.LookTarget_Prepare1) {
				this.Set_Anim_Mirrored_FromAngle(this.charaComp.Angle_OriginToTarget())
			}
		}

		//for npc
		if (!this.player || this.forceAbis) {
			//todo if not Timer Projection/Stunned
			this.charaComp.Set_TargetXY_ToUID()
			this.brainComp.Check_Abilities()
		}
	}

	/*
	On_AB_Prepare2() {
		if (this.player) this.brainComp.SetTargetXY(this.charaComp.targetX, this.charaComp.targetY)
	}*/

	//*EVENTS

	OnSolidHit(event) {
		this.runtime.objects["FX_Poc"].createInstance("FX_Ahead", this.inst.x, this.inst.y)
	}

	//#region NPC

	/*
	NPC_PickTarget() {
		this.charaComp.targetUID = this.runtime.player.inst.uid
		console.error("NPC_PickTarget", this.charaComp.targetUID)

		//random 100
		const random = Math.random() * 100
		//Player
		if (random < 30) {
			this.charaComp.targetUID = this.runtime.player.inst.uid
		}
		//TV
		else if (random < 60) {
			this.charaComp.targetUID = this.runtime.units.GetUnitsByTag("TV")?.[0]?.uid
		}
		//Nearest Ally
		else if (random < 80) {
			const residents = this.runtime.units.GetUnitsByTag("Resident")
			const nearestResident = this.PickNearest(residents, this.inst.x, this.inst.y)
			this.charaComp.targetUID = nearestResident.uid
		}
		//random Ally
		else {
			const residents = this.runtime.units.GetUnitsByTag("Resident")
			if (residents.length === 0) {
				const randomResident = residents[Math.floor(Math.random() * residents.length)]
				this.charaComp.targetUID = 0
			}
		}
	}*/

	RemoveAutoWep(wep, destroy = true) {
		console.error("RemoveAutoWep", wep)
		if (!this.autoweps) return
		const index = this.autoweps.indexOf(wep)
		if (index > -1) {
			this.autoweps.splice(index, 1)
		}

		const weaponPoint = wep.inst.getParent()

		this.Orbit_Remove(weaponPoint)

		wep.inst.removeFromParent()

		if (destroy) {
			wep.DestroyUnit()
		}
	}

	AddOrbit_Mergo(animObject) {
		let templateData = this.runtime.dataManager.templatesData[animObject]
		const animData = templateData.AnimInfo

		console.error("AddOrbit_Mergo", animData)

		const inst = this.runtime.objects["Anim"].createInstance("Objects", this.x, this.y)

		this.mergos.push(inst)

		inst.setAnimation(animData.Anim[0])
		inst.animationFrame = animData.Anim[1]

		inst.setOrigin(0.5, 0.5)

		const outline = inst.effects.find((effect) => effect.name == "BetterOutline" || effect.name == "Outline")
		outline.isActive = true
		outline.setParameter(0, [1, 1, 1])
		outline.setParameter(1, 0.4)

		Utils.World_SetSizeByMax(inst, 16)

		this.Orbit_Add(inst)
	}

	AddAutoWep(wep) {
		console.error("AddAutoWep", wep)
		wep.Set_EntityUID(this.uid)
		wep.handComp.pivotParent = true
		wep.AutoShoot = true
		if (!this.autoweps) this.autoweps = []
		this.autoweps.push(wep)

		wep.handComp.MaxHoldDist = 0

		wep.outline.setParameter(1, 0.4)

		Utils.World_SetLayer(wep.anim, "Objects")

		const weaponPoint = this.runtime.objects["Square"].createInstance("Objects", this.x, this.y)
		weaponPoint.isVisible = false
		weaponPoint.addChild(wep.inst, {
			transformX: true,
			transformY: true,
			destroyWithParent: true,
		})

		wep.inst.setPosition(weaponPoint.x, weaponPoint.y)

		this.Orbit_Add(weaponPoint, wep)

		wep.Trigger("On_Autowep_Added")
	}

	Orbit_Remove(inst) {
		if (this.snakeComp) {
			this.snakeComp.Attachement_Remove(inst)
		}

		if (this.orbitWep) {
			this.orbitWep.RemoveInstances(inst)
			this.orbitWep.Update(0)
		}
	}

	Orbit_Add(inst, wep = null) {
		//*Snake Autowep
		if (this.snakeComp || (this.player && this.player.effects.GetBool("Snake_Weps"))) {
			this.CreateSnake_Autoweps()

			this.snakeComp.Attachement_Add(inst)
			return
		}

		//* Regular Orbit

		if (!this.orbitWep) {
			this.orbitWep = this.orbitComp.Orbit_Create("AutoWep", 25, 25, 0)
		}

		if (this.player) {
			this.orbitWep.SetSpeed(this.player.stats.GetStatValue("Orbit_Speed"))
		}

		this.orbitWep.AddInstances(inst)
		this.orbitWep.Update(0)

		const wepAnim = wep?.anim || inst //for mergo

		this.runtime.zOrder.LinkTo(wepAnim, this.anim, 100)

		//only for actual weapons (not mergo)
		if (wep) {
			const orbiting = this.orbitComp.GetOrbiting(inst.uid)
			wep.handComp.Override_Angle_Aim(orbiting.currentTotalAngle)
		}
	}

	On_Wave_Start() {
		super.On_Wave_Start()

		this.CreateSnake_Autoweps()
	}

	CreateSnake_Autoweps() {
		if (this.player && this.player.effects.GetBool("Snake_Weps")) {
			if (!this.snakeComp) {
				this.snakeComp = this.AddComponent(C4.Compos.Compo_Snake, "Snake", {
					Snake_Visu: "SnakePart_Player",
					Snake_Visu_Size: 13,
					Snake_DistPart: 7,
				})

				if (this.orbitWep) {
					const instances = this.orbitWep.orbitings.map((orbiting) => orbiting.inst)

					for (const inst of instances) {
						this.snakeComp.Attachement_Add(inst)
					}

					this.orbitWep.RemoveAllInstances()
				}
			}
		}
	}

	//* ======================= MINION =======================

	SetCharmed(bool, playerID) {
		this.CharmedByID = playerID

		if (this.IsCharmed === bool) return

		this.IsCharmed = bool

		if (this.IsCharmed) {
			const color = this.runtime.players[this.CharmedByID].color_

			this.SetOutline(color)

			this.anim.opacity = 0.8

			this.RemoveTags("Enemy")
			this.AddTags("Charmed")

			this.FactionID = "Player"

			this.enemyTags = ["Enemy"]

			this.Walk_Speed *= 1.1

			//Hitbox
			if (this.Hitbox) {
				const DamageHitbox = this.Hitbox.Damage

				this.Hitbox.destroy()

				this.Hitbox = this.runtime.pool.CreateInstance("Hitbox", "Collisions_Debug", this.bboxMidX, this.bboxMidY)
				this.Hitbox.Damage = DamageHitbox
				this.Hitbox.Damage.FactionID_Override = "Player"

				//console.error("SetCharmed Hitbox", this.Hitbox.Damage.FactionID, this.Hitbox.Damage)

				this.RefreshHitbox(this.Hitbox)
			}

			this.timerComp.Timer_Start("Charmed_Destroyed", 7, () => {
				this.OnDestroyed(false)
			})

			if (this.brainComp.abis.length === 0) {
				this.SetAbis({
					Charmed_Charge: {
						Type: "Dash",
						//spec
						Dash_Distance: 70,

						Dash_UseRegularHurtbox: true,

						//shared
						Priority: 10,
						Range: 60,
						CanBeInterrupted: false,

						Timer_Cooldown: "2",
						Timer_Prepare1: 0.5,
						Timer_Prepare2: 0,
						Timer_Execute: 0.3,
						Timer_Recover: 0,

						onStart: () => {
							this.juice.Shake()
							this.PlaySound("CuteMob_Prepare", 0.2, Utils.random(0.9, 1.1))
						},

						onExecute: () => {
							const atkSfx = "CuteMob_ATK_" + Utils.randomInt(6)
							this.runtime.audio.PlaySound(atkSfx, 0.2, Utils.random(0.9, 1.1))
							this.juice.SS_SetScale(1.4, 0.6)
						},
					},
				})
			}
		}
	}

	OnMinionInit() {
		//
	}

	GenerateHurtbox() {
		this.hurtbox = this.runtime.objects["Hurtbox_Player"].createInstance("Collisions_Debug", this.unit.bboxMidX, this.unit.bboxMidY)
		this.hurtbox.width = this.inst.width * 0.7
		this.hurtbox.height = this.inst.height * 0.7
		//this.hurtbox.isVisible = true
		this.inst.addChild(this.hurtbox, {
			transformX: true,
			transformY: true,
			destroyWithParent: true,
		})
	}

	SetHitboxDamageFromATK() {
		const Hitbox = this.runtime.spawnManager.SpawnBullet(this.atk_Unit.nameEvo, this.inst.x, this.inst.y)
		this.HitboxMinion_UID = Hitbox.uid

		Hitbox.SetJustHitbox()

		Hitbox.SetWeapon(this.atk_Unit)

		this.RefreshHitbox(Hitbox.inst)

		Hitbox.anim.isVisible = false

		Hitbox.Damage.charaUnit = this

		Hitbox.Damage.Angle_Hit = "EntityMotion"
		Hitbox.Damage.damageTick = 0.25

		this.Hitbox = Hitbox.inst
	}

	AddWepFromATK() {
		const ATK_Data = this.atk_Unit.data

		const MINION_WEP = ATK_Data.MINION_WEP

		//!todo: maybe handle the case where Minion Wep already has Bullet DATA (don't merge then)

		let mergedObject = JSON.parse(JSON.stringify(ATK_Data.MINION_WEP))
		/*const BULLET = JSON.parse(JSON.stringify(ATK_Data.BULLET))
		console.error("Ballista Bow BULLET", BULLET)
		mergedObject.BULLET = BULLET*/

		this.SetWeapon(MINION_WEP.WepUnit, 0, mergedObject)

		this.wepActive.FactionID = "Player"

		this.wepActive.IsPlayerATK = false
		this.wepActive.IsMinionATK = this.atk_Unit.nameEvo

		this.wepActive.atk_UID = this.atk_UID

		console.error("Ballista Bow", this.wepActive)
	}

	get atk_Unit() {
		const atkUnit = this.runtime.getUnitByUID(this.atk_UID)
		/*if (!atkUnit) {
			console.error("atk_Unit not found", this.atk_UID)
			this.OnDestroyed(true)
		}*/
		return atkUnit
	}

	get HitboxMinion() {
		return this.runtime.getUnitByUID(this.HitboxMinion_UID)
	}

	AddWep(name, data) {
		//
	}
}
