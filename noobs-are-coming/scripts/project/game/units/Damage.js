C4.Damage = class Damage {
	constructor(runtime, evolution = 0, evoMin = 0, data = null, dataInst = false) {
		this.runtime = runtime

		this.evolution = evolution
		this.evoMin = evoMin

		this.Angle_Hit = "Random"

		this.damageAmount = 1
		this.damagePerWave = 0

		this.enabled = true
		this.damageOverride = null

		this.damageScale = 1

		this.decimal = false

		this.knockbackAlly = false

		this.knockback = 0
		this.lifeSteal = 0
		this.explosionChance = 0

		this.bulletUnit = null
		this.wepUnit = null
		this.charaUnit = null

		this.critChance = 0
		this.critMult = 2

		this.StatBonuses = []

		this.justHitUid = new Set()

		this.damageEffects = {}

		this.ATK_Stats = {}
		this.ATK_Stats_ThisWave = {}

		this.damageTick = 0.25

		this.damageTimer = 0

		this.parentDamage = null
		this.subDamages = new Map()

		this.is_StatusEffect = false
		this.statusTargetsUid = new Map()

		this.uid = Utils.generateUID()

		this.audioMod = 1

		if (!dataInst) this.runtime.main.DamagesMap.set(this.uid, this)

		if (data) {
			this.SetDamageFromData(data)
		}
	}

	//Value: 1
	//NoInvulnerability: true
	//_StatBonus|Damage_Dex: 20

	SetDamageFromData(data) {
		for (const key in data) {
			const split = key.split("|")
			if (split.length === 1) {
				if (key === "Dmg") this.damageAmount = this.ProcessNumber(data[key])
				if (key === "Dmg_PerWave") this.damagePerWave = data[key]
				if (key === "Crit_Chance") this.critChance = this.ProcessNumber(data[key])
				if (key === "Crit_Mult") this.critMult = this.ProcessNumber(data[key])
				if (key === "Knockback") this.knockback = this.ProcessNumber(data[key])
				if (key === "Knockback_NoStat") this.knockback_NoStat = data[key]
				if (key === "Life_Steal") this.lifeSteal = this.ProcessNumber(data[key])
				if (key === "Explosion_Chance") this.explosionChance = this.ProcessNumber(data[key])
				if (key === "Decimal") this.decimal = data[key]
				if (key === "DamageTick") this.damageTick = data[key]
				if (key === "Angle_Hit") this.Angle_Hit = data[key]
				if (key === "Knockback_Ally") this.knockbackAlly = data[key]
				if (key === "No_Damage") this.noDamage = data[key]
				if (key === "No_Stat_Trigger") this.noStatTrigger = data[key]
				if (key === "No_Crit") this.noCrit = data[key]
				if (key === "No_Knockback") this.noKnockback = data[key]
				if (key === "No_Invulnerability") this.noInvulnerability = data[key]
				if (key === "AudioMod") this.audioMod = data[key]

				if (key === "Damage_Enemy") this.Damage_Enemy = data[key]

				if (key === "TriggerDmgFuncs") this.TriggerDmgFuncs = data[key]

				if (key === "Is_StatusEffect") this.is_StatusEffect = data[key]
				if (key === "StatusDuration") this.statusDuration = this.ProcessNumber(data[key])
				//if (key === "Crit_Mult") this.critMult = this.ProcessNumber(data[key])
				if (key === "DmgEffects") {
					const effects = data[key]
					if (Object.keys(effects).length === 0) {
						//
					} else this.damageEffects = this.ProcessNumber_NestedObject(data[key])
				}
			}
			if (split.length === 2) {
				const type = split[0]
				const name = split[1]
				const value = this.ProcessNumber(data[key])

				if (type === "_StatBonus") {
					this.StatBonuses.push({ stat: name, value: value })
					//window.alert("statBonus")
				}
			}
		}
	}

	ReleaseDamage() {
		if (this.parentDamage) {
			this.parentDamage.subDamages.delete(this.uid)
			this.parentDamage = null
		}

		for (const subDamage of this.subDamages.values()) {
			subDamage.ReleaseDamage()
		}
		this.inst = null
		this.bulletUnit = null
		this.wepUnit = null
		this.charaUnit = null
		this.runtime.main.DamagesMap.delete(this.uid)
	}

	DamageTick() {
		this.DamageTick_Status()

		if (this.damageTick > 0) {
			this.damageTimer -= this.runtime.dt
			if (this.damageTimer <= 0) {
				this.damageTimer = this.damageTick
				this.ResetJustHit()
				this.DamageTick_Status_DealDamage()
			}
		}
	}

	DamageTick_Status() {
		if (!this.is_StatusEffect) return
		const toRemove = []
		for (const [uid, duration] of this.statusTargetsUid) {
			const newDuration = duration - this.runtime.dt
			if (newDuration <= 0) toRemove.push(uid)
			this.statusTargetsUid.set(uid, newDuration)
			//console.error("🔫 DamageTick_Status", uid, newDuration)
		}

		for (const uid of toRemove) {
			this.statusTargetsUid.delete(uid)
			this.Damage_Status_Remove(uid)
		}
	}

	DamageTick_Status_DealDamage() {
		if (!this.is_StatusEffect) return

		//spread to avoid modifying the set while iterating

		for (const uid of this.statusTargetsUid.keys()) {
			const target = this.runtime.getUnitByUID(uid)
			if (!target) {
				this.statusTargetsUid.delete(uid)
			} else {
				this.DealDamage(target)
			}
		}
	}

	Set_DamageTick(damageTick) {
		this.damageTick = damageTick
	}

	/*
    get unit() {
        if (this.bulletUnit) return this.bulletUnit
		if (this.wepUnit) return this.wepUnit
		if (this.charaUnit) return this.charaUnit
		return "bachibouzouk"
    }*/

	get FactionID() {
		if (this.FactionID_Override) return this.FactionID_Override
		if (this.parentDamage) return this.parentDamage.FactionID
		if (this.bulletUnit) return this.bulletUnit.FactionID
		if (this.wepUnit && this.wepUnit.FactionID) return this.wepUnit.FactionID
		if (this.charaUnit) return this.charaUnit.FactionID
		return "bachibouzouk"
	}

	get charaComp() {
		if (this.parentDamage) return this.parentDamage.charaComp
		if (this.charaUnit) return this.charaUnit.charaComp
		return null
	}

	get player() {
		if (this.parentDamage) return this.parentDamage.player
		//if (this.charaUnit) return this.charaUnit.player
		if (typeof this.playerIndex === "number") return this.runtime.players[this.playerIndex]

		return false
	}

	get stats() {
		if (this.parentDamage) return this.parentDamage.stats
		if (this.charaUnit) {
			return this.charaUnit.stats
		}
		return null
	}

	ATK_Stat(stat, value, hitUnit = null) {
		if (this.noStatTrigger) return

		if (this.parentDamage) return this.parentDamage.ATK_Stat(stat, value, hitUnit)
		this.ATK_Stats[stat] += value
		this.ATK_Stats_ThisWave[stat] += value

		if (this.charaUnit) this.charaUnit.ATK_Stat(stat, value, hitUnit)
		if (this.wepUnit) this.wepUnit.ATK_Stat(stat, value, hitUnit)
		if (this.bulletUnit) this.bulletUnit.ATK_Stat(stat, value, hitUnit)

		if (this.player) {
			this.player.ATK_Stat(stat, value, hitUnit)
		}
	}

	DealDamage_Test(charaUnit) {
		if (!this.enabled) return false
		if (charaUnit.unit) charaUnit = charaUnit.unit
		if (charaUnit.destroyed) return false
		const uid = charaUnit.inst?.uid
		//! CAREFUL TODO: this uid check is the only way to prevent a weird game-breaking bug
		if (!uid) return false
		if (this.damageTick > 0 && this.justHitUid.has(uid)) {
			//window.alert("Deja touché")
			//console.error("Deja touché", uid)
			return false
		}

		//!todo what about minions ?
		if (this.charaComp === charaUnit.charaComp) return false

		/*if (!this?.charaUnit?.timerComp) {
			console.error("⛔ DealDamage_Test no this.charaUnit.timerComp", this)
			return
		}*/

		this.justHitUid.add(charaUnit.inst.uid)

		//this is why minion collided with each other
		/*
		if (charaUnit.invulnerable) {
			this.DealKnockback(charaUnit)
			return false
		}*/

		let willDealDamage = false
		let willDealKnockback = false

		this.DamageEffects_Init()

		this.DamageEffects_Handle_Neutral(charaUnit)

		//! Is Enemy
		if (this.FactionID !== charaUnit.FactionID) {
			if (charaUnit.IsInvulnerable(this)) {
				return false
			}

			//chance to dodge if player
			if (charaUnit.player) {
				const dodge = charaUnit.player.stats.GetStatValue("Dodge") * 100
				if (Math.random() * 100 < dodge) {
					this.runtime.audio.PlaySound("Dodge")
					const text = this.runtime.translation.Get("STAT_Dodge")
					this.runtime.pointburst.CreatePointBurst_Icon(text, charaUnit.x, charaUnit.y - 30, "", "Dodge")

					charaUnit.player.TriggerPlayerEvent("On_Dodge")

					return false
				}
			}

			this.DealDamage(charaUnit)
			return true
		}
		//! Is Ally
		else {
			//console.error("IsAlly")

			this.DamageEffects_Handle_Ally(charaUnit)

			if (this.knockbackAlly) {
				this.DealKnockback(charaUnit, true)
			}
			return false
		}

		return false
	}

	ResetJustHit() {
		this.justHitUid.clear()
	}

	Get_Angle_Hit(hitUnit) {
		let Angle_Hit = 0
		//console.error("🔫 Get_Angle_Hit", this.Angle_Hit, this)
		if (typeof this.Angle_Hit === "number") {
			return this.Angle_Hit
		} else if (this.Angle_Hit === "BulletMotion") {
			return this.bulletUnit.moveComp.AngleOfMotion()
		} else if (this.Angle_Hit === "EntityMotion") {
			return this.charaUnit.moveComp.AngleOfMotion()
		} else if (this.Angle_Hit === "FromBullet") {
			return C3.toDegrees(C3.angleTo(this.bulletUnit.x, this.bulletUnit.y, hitUnit.x, hitUnit.y))
		} else if (this.Angle_Hit === "ToBullet") {
			return C3.toDegrees(C3.angleTo(hitUnit.x, hitUnit.y, this.bulletUnit.x, this.bulletUnit.y))
		} else if (this.Angle_Hit === "FromEntity") {
			return C3.toDegrees(C3.angleTo(this.charaUnit.x, this.charaUnit.y, hitUnit.x, hitUnit.y))
		} else if (this.Angle_Hit === "FromPlayer") {
			const playerUnit = this.player.unit
			return C3.toDegrees(C3.angleTo(playerUnit.x, playerUnit.y, hitUnit.x, hitUnit.y))
		} else if (this.Angle_Hit === "Random") {
			return Math.random() * 360
		} else {
			return Math.random() * 360
		}
	}

	DealDamage(hitUnit) {
		if (hitUnit.destroyed) return

		if (!hitUnit?.inst?.getBoundingBox()) {
			console.error("⛔ DealDamage no real inst", hitUnit, inst)
			return
		}

		if (this.parentDamage && !this.charaUnit) {
			this.charaUnit = this.parentDamage.charaUnit
		}
		/*if (!this?.charaUnit?.timerComp) {
			console.error("⛔ DealDamage no this.charaUnit.timerComp", this)
			return
		}*/

		let damage = this.GetDamage_Value()
		let type = ""

		let isCrit = false

		//* DAMAGED BY PLAYER
		const player = this.player
		if (player) {
			hitUnit.wasHitByPlayerIndex = player.playerIndex

			const timerComp = player.unit.timerComp

			//* CRIT

			if (!this.noCrit && !this.is_StatusEffect) {
				if (player.effects.GetBool("NoCrit")) {
					isCrit = false
				} else {
					const critChance = this.GetCritChance_Value()
					isCrit = Math.random() * 100 < critChance

					if (isCrit) {
						damage *= this.GetCritMult_Value()
						type = "crit"
						this.runtime.audio.PlaySound("Critical")

						this.ATK_Stat("Crit", 1, hitUnit)
					}
				}
			}

			// lifesteal
			const lifeSteal = this.GetLifesteal_Value()
			if (lifeSteal && lifeSteal > 0 && !this.is_StatusEffect) {
				if (!player.unit.timerComp.Timer_Get("LifeSteal")) {
					if (Math.random() * 100 < lifeSteal) {
						player.unit.timerComp.Timer_Start("LifeSteal", 0.1)

						player.unit.Heal(1)
						//window.alert("lifeSteal " + lifeSteal)
					}
				}
			}
		}

		//* KNOCKBACK
		const angle = this.Get_Angle_Hit(hitUnit)
		let knockback = 0
		if (!this.noKnockback && this.knockback >= 0) {
			knockback = this.GetKnockback_Value() * hitUnit.Knockback_Mult

			knockback = Math.min(knockback, 25)
			const distance = knockback * 3

			//window.alert("knockback " + this.knockback)
			if (knockback > 0) {
				const duration = Utils.remapClamp(knockback, 0, 10, 0.1, 0.4)
				hitUnit.moveComp.Impulse_Tween(angle, distance, "out-cubic", duration)
			}
		}

		// explosionChance
		if (this.explosionChance) {
			const explode = Math.random() * 100 < this.explosionChance
			if (explode) {
				//this.CreateExplosion()
				if (this.inst) this.runtime.objects["FX_Explosion"].createInstance("FX_Ahead", this.inst.x, this.inst.y)
				this.runtime.audio.PlaySound("Explosion_Little")
			}
		}

		//PlayerHit ARMOR
		if (hitUnit.player) {
			const armor = hitUnit.stats.GetStatValue("Armor")
			if (damage > 0) {
				damage = Math.round(damage * (1 - armor))
				damage = Math.max(damage, 1)
			}

			const maxDamage = hitUnit.stats.GetStatValue("MaxDamagePerHit")
			if (maxDamage > 0) {
				damage = Math.min(damage, maxDamage)
			}

			//* PREVENT ONE-SHOT
			const maxHP = hitUnit.healthComp.max
			if (hitUnit.healthComp.IsFull() && maxHP >= 20) {
				damage = Math.min(damage, maxHP - 1)
			}
		}

		if (this.noDamage) {
			damage = 0
		}

		//hitUnit.juice.GetSpring("Offset_Pos2D").SetCosAngle("Pos", angle, 5)

		hitUnit.juice.GetSpring("Offset_Angle").SetPos(Utils.random(-5, -10))

		hitUnit.anim.colorRgb = [5, 5, 5]

		let hitPos = [hitUnit.x, hitUnit.bboxMidY]

		//!todo: takeDamage On Entity

		const healthComp = hitUnit.healthComp

		let actualDamage = Math.max(healthComp.current, damage)

		let kill = false
		if (actualDamage >= healthComp.current) kill = true

		if (hitUnit.player) {
			const hitPlayer = hitUnit.player
			type = "playerHit"

			hitPlayer.stats.Stat_Add("HitsTaken", 1)
			hitPlayer.stats.Stat_Add("ThisWave_HitsTaken", 1)
			hitPlayer.stats.Stat_Add("DamagesTaken", 1)
			hitPlayer.stats.Stat_Add("ThisWave_DamagesTaken", actualDamage)

			if (!this.noInvulnerability) {
				hitPlayer.OnHurt()
				hitUnit.HurtOverlay()
				hitPlayer.SetInvulnerable(1)
			}
		}
		hitUnit.Trigger("OnHurt")

		//hit

		//const atkSfx = "PunchHit" + Utils.randomInt(2)
		const atkSfx = "Impact_Body_0" + Utils.randomInt(1, 8)
		this.runtime.audio.PlaySound(atkSfx, 0.3 * this.audioMod, Utils.random(0.9, 1))

		let pointBurstInst = null

		if (damage !== 0) {
			const fx_coupure = this.runtime.pool.CreateInstance("FX_Coupure_Red", "Objects", hitUnit.bboxMidX, hitUnit.bboxMidY)
			fx_coupure.angleDegrees = Utils.random(360)

			pointBurstInst = this.DealDamage_Pointburst(hitUnit, damage, angle, type)
		} else if (knockback !== 0) {
			const fx_coupure = this.runtime.pool.CreateInstance("FX_Coupure_White", "Objects", hitUnit.bboxMidX, hitUnit.bboxMidY)
			fx_coupure.angleDegrees = Utils.random(360)
		}

		const hitData = {
			hitUnit: hitUnit,
			hitPos: hitPos,
			damage: damage,
			actualDamage: actualDamage,
			isCrit: isCrit,
			angle: angle,
			hit: true,
			kill: kill,
			pointBurstInst: pointBurstInst,
		}

		//! actuallize actual damage
		actualDamage = Math.max(healthComp.current, damage)

		//! POTENTIAL UNIT DEATH DESTROY HERE (delayed)

		healthComp.addCurrent(-damage, true)

		//if (!wasDestroyed) {
		this.ATK_Stat("Hit", 1, hitUnit)
		this.ATK_Stat("Damage", actualDamage, hitUnit)
		if (kill) this.ATK_Stat("Kill", 1, hitUnit)
		if (kill && isCrit) this.ATK_Stat("Kill_Crit", 1, hitUnit)
		//}

		//!* Doing Extra Stuff
		this.DamageEffects_Init()
		this.DamageEffects_Handle(hitUnit, hitData)
		this.TriggerDamageFunctions(hitUnit, hitData)
	}

	DealDamage_Pointburst(hitUnit, damage, angle, type = "") {
		let text = damage
		let x = hitUnit.x
		let y = hitUnit.y - 30
		if (type === "playerHit") {
			text = "-" + damage
			y = hitUnit.healthBar.getBoundingBox().top - 5
		}

		const instPoint = this.runtime.pointburst.CreatePointBurst_SpriteFont(text, x, y)

		//instPoint.characterScale = 0.3

		//yellow
		if (type === "playerHit") {
			instPoint.colorRgb = [1, 0, 0]
			instPoint.characterScale = 0.45
		} else if (type === "crit") {
			instPoint.colorRgb = [1, 1, 0]
			instPoint.characterScale = 0.35
		}

		if (type !== "playerHit") {
			const pointBurstDist = Utils.random(10, 20)

			instPoint.behaviors["Tween"].startTween(
				"position",
				[instPoint.x + Utils.cosDeg(angle) * pointBurstDist, instPoint.y + Utils.sinDeg(angle) * pointBurstDist],
				0.3,
				"out-exponential"
			)
		}

		return instPoint
	}

	TriggerDamageFunctions(hitUnit, hitData) {
		if (!this.TriggerDmgFuncs) return
		for (const dmgFunc of this.TriggerDmgFuncs) {
			const split = dmgFunc.split("|")
			const unitType = split[0]
			const unitFunc = split[1]
			if (unitType === "Bullet") {
				this.bulletUnit.Trigger(unitFunc, hitData)
			}
			if (unitType === "Minion") {
				//this.bulletUnit.Trigger(unitFunc, hitData)
			}
			if (unitType === "Chara") {
				console.error(unitFunc, "this.charaUnit", this.charaUnit)
				this.charaUnit.Trigger(unitFunc, hitData)
			}
			if (unitType === "Wep") {
				this.wepUnit.Trigger(unitFunc, hitData)
			}
		}
	}

	SubDamage_Create(name, damageEffect) {
		let hasDamage = false
		if (damageEffect.damageCategory === "DmgStatus") {
			hasDamage = true
		} else if (damageEffect.damageCategory === "Chain") {
			hasDamage = true
		}

		if (!hasDamage) return

		if (damageEffect.IsWep_SubDamage && this.wepUnit) {
			//* check if subdamage already created on wep

			for (const dmgInst of this.wepUnit.subDamages.values()) {
				if (dmgInst.selfDamageEffect.damageName === damageEffect.damageName) {
					const damageInst = dmgInst
					damageEffect.damageInst = damageInst
					damageEffect.uid = damageInst.uid

					//console.error("SubDamage_Found On Weapon")

					return
				}
			}
		}

		const damageInst = new C4.Damage(this.runtime, this.evolution, this.evoMin)
		damageEffect.damageInst = damageInst
		damageEffect.uid = damageInst.uid

		damageInst._debugName = damageEffect.damageCategory

		damageInst.charaUnit = this.charaUnit
		if (damageInst.charaUnit === null) {
			console.error("⛔ SubDamage_Create no charaUnit", damageEffect, "parent", this)
		}
		//damageInst.wepUnit = this.wepUnit
		damageInst.parentDamage = this

		damageInst.selfDamageEffect = damageEffect

		if (damageEffect.damageCategory === "DmgStatus") {
			damageInst.is_StatusEffect = true
			damageInst.decimal = true
			damageInst.audioMod = 0.5
			damageInst.statusDuration = 2 //default but might be overriden by DAMAGE
			damageInst.noKnockback = true
		}

		if (damageEffect.damageName === "ChainArcane") {
			damageEffect.ChainColor = [1, 0, 1]
		}

		//override if needed
		damageInst.SetDamageFromData(damageEffect.DAMAGE)

		//console.error("SubDamage_Create wepUnit", this.wepUnit)

		if (damageEffect.IsWep_SubDamage && this.wepUnit) {
			this.wepUnit.subDamages.set(damageInst.uid, damageInst)
			//console.error("SubDamage_Create On Weapon", damageEffect.damageName)
		} else {
			this.subDamages.set(damageInst.uid, damageInst)
		}
	}

	DamageEffects_Init() {
		if (this.DmgEffects_AreInit) return

		this.damageEffects_neutral = {}
		this.damageEffects_ally = {}

		for (const [name, damageEffect] of Object.entries(this.damageEffects)) {
			const split = name.split("|")
			damageEffect.damageCategory = split[0]
			damageEffect.damageName = split[1]

			if (!damageEffect.damageName) {
				damageEffect.damageName = damageEffect.damageCategory
			}

			this.SubDamage_Create(name, damageEffect)
			//console.error("DamageEffects_Init", name, damageEffect, damageEffect.damageInst)

			if (!damageEffect.Chance) damageEffect.Chance = 100

			//ally and neutral

			if (damageEffect.damageCategory === "Watering") {
				this.damageEffects_neutral[name] = damageEffect
			}
		}

		this.DmgEffects_AreInit = true
	}

	DamageEffects_Handle(unit, hitData) {
		for (const [name, damageEffect] of Object.entries(this.damageEffects)) {
			if (Math.random() * 100 > damageEffect.Chance) continue

			if (damageEffect.damageCategory === "Chain") {
				this.Chain_Damage(damageEffect, unit)
			} else if (damageEffect.damageCategory === "DmgStatus") {
				this.Damage_Status_Apply(damageEffect, unit)
			} else if (damageEffect.damageCategory === "Freeze_Ice") {
				this.Unit_Freeze(unit, "Frozen")
			} else if (damageEffect.damageCategory === "Freeze_Gold") {
				this.Unit_Freeze(unit, "Golden")
			} else if (damageEffect.damageCategory === "Sheepify") {
				this.Unit_Sheepify(unit)
			} else if (damageEffect.damageCategory === "HealEffect") {
				this.Unit_Sheepify(unit)
			} else if (damageEffect.damageCategory === "Charm") {
				this.Unit_Charm(unit)
			} else if (damageEffect.damageCategory === "Mining") {
				this.Unit_Mining(damageEffect, unit, hitData)
			}
		}
	}

	Unit_Mining(damageEffect, unit, hitData) {
		if (unit.HasTag("Ore") || unit.HasTag("Statue")) {
			unit.TakeDamage((hitData.damage * damageEffect.MiningDmg) / 100)
		}
	}

	Unit_Charm(unit) {
		if (unit.IsElite || unit.transformed || unit.sheepUnit || unit.frozenUnit || unit.noTransfo) return
		this.runtime.audio.PlaySound("Charmed")

		//unit.SetCharmed(true, this.playerIndex)

		const charmedUnit = this.runtime.spawnManager.SpawnChara(unit.name, unit.x, unit.y)
		charmedUnit.SetCharmed(true, this.playerIndex)

		Utils.World_MatchFrame(charmedUnit.anim, unit.anim)

		unit.transformed = true
		unit.Depop()
	}

	Unit_Sheepify(unit) {
		if (unit.IsElite || unit.transformed || unit.sheepUnit || unit.noTransfo) return
		this.runtime.audio.PlaySound("Sheep")
		const sheepUnit = this.runtime.spawnManager.SpawnChara("Noob_Sheepify", unit.x, unit.y)

		unit.transformed = true
		unit.Depop()
	}

	Unit_Freeze(unit, type = "Frozen") {
		if (unit.player || unit.IsElite || unit.transformed || unit.frozenUnit || unit.noTransfo) return

		const frozenUnit = this.runtime.spawnManager.SpawnChara("Noob_Frozen", unit.x, unit.y)

		frozenUnit.Set_FrozenType(type)

		frozenUnit.SetAnimObject(unit.AnimObject)

		Utils.World_MatchInst(frozenUnit.anim, unit.anim)
		frozenUnit.anim.setPosition(unit.x, unit.y)

		unit.transformed = true
		unit.Depop()
	}

	DamageEffects_Handle_Neutral(hitUnit) {
		//console.error("DamageEffects_Handle_Neutral")

		for (const [name, damageEffect] of Object.entries(this.damageEffects_neutral)) {
			if (Math.random() * 100 > damageEffect.Chance) continue

			if (damageEffect.damageCategory === "Watering") {
				const waterComp = hitUnit.GetComponent("Water")

				if (waterComp) {
					waterComp.addCurrent(damageEffect.Water_Amount || 1)
					//*

					if (this.charaUnit) {
						this.charaUnit.Trigger("Watering_Sprout")
					}
				}
			}
		}
	}

	DamageEffects_Handle_Ally(hitUnit) {
		for (const [name, damageEffect] of Object.entries(this.damageEffects_ally)) {
			if (Math.random() * 100 > damageEffect.Chance) continue

			if (damageEffect.damageCategory === "HealEffect") {
				//
			}
		}
	}

	DamageEffects_GetText(itemEffect, player) {
		this.DamageEffects_Init()
		let index = 0
		for (const [name, damageEffect] of Object.entries(this.damageEffects)) {
			if (index > 0) itemEffect.text += "<br>"

			index++

			const dmgInst = damageEffect.damageInst

			//chance
			itemEffect.text += this.trChancePrefix(damageEffect.Chance)

			itemEffect.text += this.tr(damageEffect.damageName, "orange") + ": "

			if (damageEffect.damageCategory === "Chain") {
				itemEffect.text += this.tr("DmgFX_Chain")

				const [chainInterval, color] = this.Chain_GetChainInterval(damageEffect)

				itemEffect.ReplaceColor("chain", chainInterval, color)
			} else if (damageEffect.damageCategory === "DmgStatus") {
				if (damageEffect.damageName === "Burn") {
					itemEffect.text += this.tr("DmgFX_Burn")
				}
				if (damageEffect.damageName === "Poison") {
					itemEffect.text += this.tr("DmgFX_Poison")
				}

				const dmgTick = dmgInst.damageTick
				const duration = dmgInst.GetStatusDuration_Value(player)

				const times = Math.floor(duration / dmgTick)

				itemEffect.ReplaceColor("times", times, "")
				itemEffect.Replace("duration", dmgInst.GetStatusDuration_Info(player))
			} else if (damageEffect.damageCategory === "Mining") {
				itemEffect.text += this.tr("DmgFX_Mining")

				itemEffect.ReplaceColor("0", damageEffect.MiningDmg + "%", "green")
			} else if (damageEffect.damageCategory === "Watering") {
				itemEffect.text += `${damageEffect.Water_Amount} | `

				itemEffect.text += this.tr("DmgFX_Watering")
			} else {
				itemEffect.text += this.tr("DmgFX_" + damageEffect.damageName)
			}

			if (dmgInst) itemEffect.Replace("dmg", dmgInst.GetDamage_Info(player))
		}
	}

	trChancePrefix(chancePercent) {
		if (!chancePercent) return ""
		if (chancePercent >= 100) return ""
		if (chancePercent <= 0) return ""
		let text = "[c=#00FFFF](" + this.tr("CHANCE") + ")[/c] "
		text = text.replace("{0}", chancePercent)
		return text
	}

	tr(key, color = null) {
		let text = this.runtime.translation.Get(key)
		if (color) {
			text = "[c=" + color + "]" + text + "[/c]"
		}
		return text
	}

	Damage_Status_Apply(statusEffect, hitUnit) {
		//! important: check if the unit is still alive
		/*if (hitUnit?.inst?.x === undefined) {
			return
		}*/

		if (statusEffect.damageName === "Poison") {
			if (hitUnit.frozenUnit) {
				return
			}
		}

		//! feedback when burning entity dies

		const statusDamage = statusEffect.damageInst

		const prevStatusEffect = hitUnit.statusDamages_NameToUID.get(statusEffect.damageName)
		//! to do pick the best duration and damage
		if (prevStatusEffect) {
			const prevStatusDamage = this.runtime.main.DamagesMap.get(prevStatusEffect)
			prevStatusDamage.statusTargetsUid.delete(hitUnit.uid)
		} else {
			const hitInst = hitUnit.inst
			const hitAnim = hitUnit.anim

			if (statusEffect.damageName === "Burn") {
				const statusFX = this.runtime.objects["FX_SmoothFire"].createInstance("Objects", hitInst.x, hitInst.y)
				this.runtime.zOrder.LinkTo(statusFX, hitAnim, 1)
				hitInst.addChild(statusFX, {
					transformX: true,
					transformY: true,
					destroyWithParent: true,
				})
			}

			if (statusEffect.damageName === "Poison") {
				//window.alert("Apply Poison")

				const Tint = Utils.World_GetEffect(hitAnim, "Tint")
				Tint.isActive = true
				Tint.setParameter(0, [0, 1, 0])
			}
		}

		hitUnit.statusDamages_NameToUID.set(statusEffect.damageName, statusEffect.uid)
		statusDamage.statusTargetsUid.set(hitUnit.uid, statusDamage.statusDuration)
	}

	Damage_Status_Remove(unitUID, args = {}) {
		const unit = this.runtime.getUnitByUID(unitUID)
		if (!unit) return
		const inst = unit.inst
		const anim = unit.anim

		const damageEffect = this.selfDamageEffect
		if (damageEffect.damageCategory === "DmgStatus") {
			if (damageEffect.damageName === "Burn") {
				const statusFX = Utils.World_GetChild(inst, "FX_SmoothFire")
				if (statusFX) statusFX.destroy()
			}

			if (damageEffect.damageName === "Poison") {
				const Tint = Utils.World_GetEffect(anim, "Tint")
				Tint.isActive = false
			}
		}

		unit.statusDamages_NameToUID.delete(damageEffect.damageName)
	}

	Chain_GetChainInterval(chainData) {
		let ChainBounces_Interval = chainData.ChainBounces
		let color = null

		let chainStat = this.GetStatValue("Chaining")
		if (chainStat) {
			ChainBounces_Interval = Utils.OffsetInterval(ChainBounces_Interval, chainStat)
			if (chainStat > 0) color = "green"
			else if (chainStat < 0) color = "red"
		}

		return [ChainBounces_Interval, color]
	}

	Chain_Damage(chainData, unit) {
		let curChain = 0

		const [chainInterval, color] = this.Chain_GetChainInterval(chainData)

		let maxChain = Math.round(Utils.ProcessInterval(chainInterval))

		const exclude = new Set()

		let pos = [unit.x, unit.y]

		exclude.add(unit)

		while (curChain < maxChain) {
			const charas = this.runtime.units.GetUnitsByTags("Enemy", "Chara")
			const charasInRange = Utils.GetInCircle(charas, pos[0], pos[1], chainData.ChainRange)
			const validTargets = charasInRange.filter((chara) => !exclude.has(chara))

			if (validTargets.length === 0) break
			const target = Utils.Array_Random(validTargets)
			exclude.add(target)

			curChain++

			const chainFX = this.runtime.objects["ChainFX"].createInstance("FX_Ahead", pos[0], pos[1])
			chainFX.width = C3.distanceTo(pos[0], pos[1], target.x, target.y)
			chainFX.angle = C3.angleTo(pos[0], pos[1], target.x, target.y)

			chainFX.colorRgb = chainData.ChainColor || [1, 1, 0]

			//console.error("🔫 Chain_Damage", curChain, maxChain, chainData.damageInst)

			this.runtime.audio.PlaySound("Chain_Lightning", 0.5)

			//create chainFX

			pos = [target.x, target.y]

			chainData.damageInst.DealDamage(target)
		}
	}

	SetWeapon(wepComp) {
		this.wepUnit = wepComp.unit
		this.charaUnit = wepComp.charaComp.unit

		this.playerIndex = this.charaUnit.playerIndex

		if (typeof this.charaUnit.minionPlayerIndex === "number") {
			this.playerIndex = this.charaUnit.minionPlayerIndex
		}
	}

	//! todo
	DealKnockback(hitUnit, toAlly = false) {
		// knockback
		const angle = this.Get_Angle_Hit(hitUnit)
		if (this.knockback >= 0) {
			const baseKnockback = this.GetKnockback_Value()
			let knockback = baseKnockback

			if (toAlly) {
				knockback = baseKnockback * 0.5
			}

			if (hitUnit.player) {
				//! temp disable
				return
				knockback = baseKnockback * 0.4
				//const atkSfx = "PunchHit" + Utils.randomInt(2)
				const atkSfx = "Impact_Body_0" + Utils.randomInt(1, 8)
				this.runtime.audio.PlaySound(atkSfx, 0.2 * this.audioMod, Utils.random(0.9, 1))
			}

			//! todo diminish based on cooldown?

			knockback = Math.min(knockback, 16)
			const distance = knockback * 3.5

			//window.alert("knockback " + this.knockback)
			if (knockback > 0) {
				const duration = Utils.remapClamp(knockback, 0, 10, 0.1, 0.4)
				hitUnit.moveComp.Impulse_Tween(angle, distance, "out-cubic", duration)
			}
		}
	}

	ProcessNumber(value) {
		return Utils.ProcessEvoNumber(value, this.evolution, this.evoMin)
	}

	ProcessNumber_NestedObject(value) {
		return Utils.ProcessEvoNumber_NestedObject(value, this.evolution, this.evoMin)
	}

	GetColored(current, base) {
		if (current === base) return current
		else if (current > base) return "[c=#00FF00]" + current + "[/c]"
		else if (current < base) return "[c=#FF0000]" + current + "[/c]"
	}

	//* TYPE_MOD

	Get_Type_Mod(stat, player = null) {
		let wepUnit = this.wepUnit
		if (this.WepDataInst) {
			wepUnit = this.WepDataInst
		}
		if (wepUnit) {
			return wepUnit.Get_Type_Mod(stat, player)
		}
		return 0
	}

	GetStatValue(stat, player = null, defaultValue = 0) {
		if (!player) player = this.player
		const stats = player ? player.stats : this.stats
		let value = stats?.GetStatValue(stat)
		if (value === undefined) value = defaultValue
		return value
	}

	StatIsPercent(statName) {
		return this.runtime.player.stats?.GetStat(statName)?.IsPercent
	}

	GetDamage_Info(player = null) {
		const damageCurrent = this.GetDamage_Value(player)
		let text
		if (damageCurrent === this.damageAmount) text = damageCurrent
		else text = this.GetColored(damageCurrent, this.damageAmount)

		if (this.StatBonuses.length > 0) {
			text += " [c=#b3b3b3][" + this.damageAmount + "[/c]"
			for (const bonus of this.StatBonuses) {
				const value = bonus.value
				//text += ""
				text += value > 0 ? "+" + value : value
				text += "%"
				//text += ""
				text += Utils.GetStatImg(bonus.stat)
			}
			text += "[c=#b3b3b3]][/c] "
		}

		return text
	}

	GetDamage_ExtraEffectsInfo(player = null) {
		//
	}

	GetDamage_Value(player = null) {
		if (this.noDamage) return 0

		const waveManager = this.runtime.waveManager
		let damage = this.damageAmount

		if (this.damagePerWave) damage += this.damagePerWave * waveManager.waveCount

		//override
		if (this.Damage_Enemy && this.Damage_Enemy.length > 0) {
			damage = Utils.GetValueFromArrayCurve(this.Damage_Enemy, waveManager.waveCount)
		}

		for (const bonus of this.StatBonuses) {
			const statName = bonus.stat
			const statValue = this.GetStatValue(statName, player)

			if (statValue) {
				let damageBonus = statValue * bonus.value
				if (!this.StatIsPercent(statName)) damageBonus = damageBonus / 100
				damage += damageBonus
			}
		}

		if (!player) player = this.player

		if (player) {
			const stack = player.effects.GetStack("DamageBonus_PercentStat")
			for (const bonus of stack) {
				const statName = bonus.Stat
				const statValue = this.GetStatValue(statName, player)

				if (statValue) {
					let damageBonus = statValue * bonus.Percent
					if (!this.StatIsPercent(statName)) damageBonus = damageBonus / 100
					damage += damageBonus
				}
			}
		}

		//apply damageScale
		damage *= this.damageScale

		let damageStat = this.GetStatValue("Damage", player, 1)

		//typeMod
		damageStat += this.Get_Type_Mod("Damage", player) / 100

		damage *= damageStat //default 1

		if (!this.decimal) {
			damage = Math.round(damage)
			damage = Math.max(damage, 1)
		} else {
			//only 1 decimal
			damage = Math.round(damage * 10) / 10
			damage = Math.max(damage, 0.1)
		}

		return damage
	}

	GetCritInfo(player = null) {
		const critCurrent = this.GetCritDamage(player)
		const critMult = this.GetCritMult_Value(player)
		const critChance = this.GetCritChance_Value(player)

		//let text = critCurrent + " | X" + critMult
		/*
		let text = "X" + critMult

		let chanceText = this.runtime.translation.Get("CHANCE")
		chanceText = chanceText.replace("{0}", this.GetColored(critChance, this.critChance))
		text += " (" + chanceText + ")"*/

		/*
		let chanceText = this.runtime.translation.Get("CHANCE")
		chanceText = chanceText.replace("{0}", this.GetColored(critChance, this.critChance))
		let text = chanceText*/

		let text = this.GetColored(critChance, this.critChance) + "%"

		return text
	}

	GetCritDamage(player = null) {
		return this.GetDamage_Value(player) * this.GetCritMult_Value(player)
	}

	GetCritMult_Value(player = null) {
		let critMult = this.critMult

		const stat = this.GetStatValue("Crit_Mult", player)
		if (stat) critMult *= stat

		return critMult
	}

	GetCritChance_Value(player = null) {
		let critChance = this.critChance

		const stat = this.GetStatValue("Crit_Chance", player) * 100
		critChance += stat

		critChance += this.Get_Type_Mod("Crit_Chance", player)

		return critChance
	}

	//* WepInfo

	GetStatusDuration_Value(player = null) {
		let statusDuration = this.statusDuration

		const stat = this.GetStatValue("Duration", player)
		if (stat) statusDuration *= stat

		//statusDuration *= this.Get_Type_Mod("Duration", player)

		return statusDuration
	}

	GetStatusDuration_Info(player = null) {
		let durationValue = this.GetStatusDuration_Value(player)

		return this.GetColored(durationValue, this.statusDuration).toLocaleString("en-US", {
			minimumFractionDigits: 1,
			maximumFractionDigits: 2,
		})
	}

	GetKnockback_Value(player = null) {
		let knockback = this.knockback

		if (this.knockback_NoStat) return knockback

		const stat = this.GetStatValue("Knockback", player)
		if (stat) knockback += stat

		knockback += this.Get_Type_Mod("Knockback", player)

		return knockback
	}

	GetKnockback_Info(player = null) {
		return this.GetColored(this.GetKnockback_Value(player), this.knockback)
	}

	GetLifesteal_Value(player = null) {
		let lifeSteal = this.lifeSteal

		const stat = this.GetStatValue("Life_Steal", player) * 100
		lifeSteal += stat

		lifeSteal += this.Get_Type_Mod("Life_Steal", player)

		return lifeSteal
	}

	GetLifesteal_Info(player = null) {
		return this.GetColored(this.GetLifesteal_Value(player), this.lifeSteal)
	}
}
