C4.Units.Weapon = class Weapon extends C4.Unit {
	static unitType = "Wep"
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)

		this.wepEffects = {}
		this.subDamages = new Map()
	}

	//*========== CONFIG ====================

	SetData() {
		super.SetData()

		this.handComp = this.AddComponent(C4.Compos.Compo_Handle, "HAND")
		this.wepComp = this.AddComponent(C4.Compos.Compo_Wep, "WEP")

		this.SetVars_Default({
			IsPlayerATK: true,
			WepTrigger: "Range",

			ATK_Category: "",
			//"Cooldown", "Range", "Hurt", "Power", "WaveStart", "ItemEvent"
			//
			Duration: 0,
			Range: 0,
			Cooldown: 1,
			Size_Affected: false,
			/*
			Count: 1,
			Amount: "",*/

			Cooldown_Type: "", //Cooldown_Spawn

			Cooldown_LowestMult: 0.3,

			Cooldown_LongEvery: -1,
			Cooldown_Long: 3,
			//Amount: 1,
			Direction: "",

			//
			Duration_IsLifetime: false,
			Range_IsMaxDist: false,

			Minion_HasOwnCooldown: false,

			//
			AutoShoot: false,
			AimLikePlayer: false,
			CustomAutoshoot: false,

			AimMode: "Auto", //"Movement"

			TargetTags_Wep: [],

			//
			CamTilt_Dist: 3,
			CamTilt_Duration: 0.1,
			Shake: 2,

			Display_WepInfo: "Yes",
		})

		this.OverrideData({
			AnimObject: "Anim",
			ITEM: {
				ItemType: "Weapon",
				Img: "Game/Graph/Wep_[name].png",
				Evolutions: "0-3",
				Price: 0,
				Effects: {},
			},

			VARS: {
				MAIN: {},
				WEP: {
					//
				},
				HAND: {
					//
				},
			},
			BULLET: {
				AnimObject: "Bullet_Base_Player",
				DAMAGE: {
					Dmg: 1,
					Dmg_PerWave: 0,
					Crit_Mult: 2,
					LifeSteal: 0,
					Angle_Hit: "BulletMotion",
				},
				VARS: {
					MAIN: {
						//
					},
				},
			},
		})
	}

	get holderUnit() {
		if (typeof this.unitChara.minionPlayerIndex === "number") {
			return this.unitChara
		}
		return this.item.inventory.holderUnit
	}

	ReleaseUnit() {
		for (const subDamage of this.subDamages.values()) {
			subDamage.ReleaseDamage()
		}
	}

	On_Wave_Start() {
		super.On_Wave_Start()

		if (this.WepTrigger === "WaveStart") {
			this.Shoot()
		}
	}

	ATK_Stat(stat, value, hitUnit = null) {
		super.ATK_Stat(stat, value, hitUnit)
		//this.wepComp.ATK_Stat(stat, value, hitUnit)

		if (this.item) {
			if (!Array.isArray(this.item.effects)) return

			for (const effect of this.item.effects) {
				if (effect.effectName.startsWith("ATK_Every_X")) {
					if (effect.Type === stat) {
						//effect.UID_AffectedUnit = hitUnit.uid
						this.item.player.UID_AffectedUnit = hitUnit.uid
						effect.IncrementCount(value)
					}
				}

				if (effect.effectName.startsWith("On_ATK_")) {
					if (effect.effectName.endsWith(stat)) {
						//effect.UID_AffectedUnit = hitUnit.uid
						this.item.player.UID_AffectedUnit = hitUnit.uid
						effect.ActivateEffects()
					}
				}
			}
		}
	}

	InitData() {
		super.InitData()
		this.name = this.constructor.name
		if (this.data.Name) {
			//loaded from Yaml
			this.name = this.data.Name
		}
		//this.name = this.name.replace("Wep_", "")

		//*========== INIT DATA ====================

		//console.error("🌞 Create", this.name, this.evolution)

		this.Events = this.data?.Events

		this.AddTags(this.data?.ITEM?.Synergies)

		//*========== INIT DATA SPEC ====================

		//*========== CREATE ITEM ====================

		this.CreateWepItem()
	}

	SetAnimObject(...args) {
		super.SetAnimObject(...args)

		this.anim.removeFromParent()

		//autoWeps
		this.WepAnimSize = this.data?.WepAnimSize

		if (this.WepAnimSize) {
			const size = this.WepAnimSize
			this.anim.setOrigin(0.5, 0.5)
			Utils.World_SetSizeByMax(this.anim, size)

			this.inst.setSize(this.anim.width, this.anim.height)

			//console.error("SetAnimObject", this.name, size, this.inst, this.anim)
		}

		this.inst.addChild(this.anim, {
			transformX: true,
			transformY: true,
			destroyWithParent: true,
		})
	}

	Tick_SetAnimAngle() {
		this.anim.angle = this.inst.angle
	}

	InitAfterComponents() {
		super.InitAfterComponents()

		const hitbox = this.wepComp?.hitbox
		if (hitbox) {
			hitbox.setSize(this.data.Hitbox.Width, this.data.Hitbox.Height)
			hitbox.x += this.data.Hitbox.OffsetX
		}
	}

	CreateWepItem() {
		if (!this.runtime.dataManager.wepItemsToCreate) {
			//already init
			return
		}
		this.runtime.dataManager.wepItemsToCreate.add(this)
		//console.error("⭐ CreateWepItem", this.name)
	}

	SetInternals() {
		super.SetInternals()

		this.wepEnabled = true

		this.wep_Reaim_LikeTween = false
	}

	Init() {
		//this.SetOutline([0, 0, 0])
		//this.SetOutline(this.runtime.tierColors["TIER_0"])
		this.SetOutline(this.runtime.tierColors["TIER_" + this.evolution])
	}

	SetWepEnabled(bool) {
		if (this.wepEnabled === bool) return
		this.wepEnabled = bool

		this.anim.isVisible = bool
	}

	Set_EntityUID(uid) {
		this.unitChara = this.runtime.getUnitByUID(uid)

		this.wepComp.Set_EntityUID(uid)

		this.On_EntitySet()
	}

	On_EntitySet() {
		//
	}

	get player() {
		if (!this.unitChara) return null
		if (typeof this.unitChara.minionPlayerIndex === "number") {
			return this.runtime.players[this.unitChara.minionPlayerIndex]
		}
		return this.runtime.players.find((p) => p.unit === this.unitChara)
	}

	get charaComp() {
		return this.unitChara.charaComp
	}

	get BulletDataInst() {
		return this.runtime.dataInstances["Bullets"].get(this.nameEvo)
	}

	get DamageDataInst() {
		//console.error("BulletDataInst", this, this.nameEvo, this.BulletDataInst)
		return this.BulletDataInst.Damage
	}

	CreateExplosion(size, x, y, percent = 100, BULLET_Data = {}) {
		const Explosion = this.CreateAreaDamage(size, x, y, percent, BULLET_Data)

		const explosionVisu = this.runtime.objects["FX_Explosion"].createInstance("FX_Ahead", x, y)

		explosionVisu.setSize(size, size)

		Explosion.inst.addChild(explosionVisu, {
			transformX: true,
			transformY: true,
			destroyWithParent: true,
		})

		this.runtime.audio.PlaySound("Explosion_Big")

		this.runtime.camera.Screenshake({
			Mag: 1,
		})

		Explosion.timerComp.Timer_Start("Explosion_End", 0.2, () => {
			Explosion.DestroyUnit()
		})

		return Explosion
	}

	CreateAreaDamage(size, x, y, percent = 100, BULLET_Data = {}) {
		const BULLET = {
			DAMAGE: {
				Angle_Hit: "FromBullet",
			},
		}

		const Explosion = this.runtime.spawnManager.SpawnBullet(this.nameEvo, x, y, BULLET)
		if (!Explosion) {
			return
		}

		Explosion.SetWeapon(this.wepComp)

		Explosion.anim.isVisible = false
		Explosion.inst.isVisible = false

		Explosion.inst.setSize(size, size)

		return Explosion
	}

	Shoot(...args) {
		this.wepComp.Shoot(...args)
	}

	Tick() {
		if (!this.wepEnabled) return

		this.Tick_Autoshoot()
		this.Tick_SetAnimAngle()
	}

	GetDirection_Random() {
		let angle = 0
		angle = Utils.random(360)
		return angle
	}

	GetDirection_Outside() {
		let angle = this.inst.getParent().orbitingAngle

		angle = C3.toDegrees(angle)
		return angle
	}

	Tick_Autoshoot() {
		if (this.WepTrigger !== "Range" && this.WepTrigger !== "Cooldown") return

		if (!this.AutoShoot || this.CustomAutoshoot) return
		//if (this.handComp.isTweening) return

		//if cooldown just shoot no matter what
		if (this.WepTrigger === "Cooldown" && this.runtime.waveManager.isWaving) {
			if (this.wepComp.Check_CanShoot()) {
				this.wepComp.SimulateInputDown()
			}
		}

		if (this.AimMode === "Movement") {
			if (this.unitChara) {
				const moveComp = this.unitChara.moveComp

				this.handComp.Override_Angle_Aim(moveComp.moveAngle_WithoutImpulse)
				if (this.wepComp.Check_CanShoot()) {
					this.wepComp.SimulateInputDown()
				}
			}
		}
		//* Autoshoot Classic
		else if (!this.unitChara || !this.unitChara.manualAiming) {
			const unitChara = this.unitChara
			let targetTags = unitChara.enemyTags
			if (this.TargetTags_Wep.length > 0) targetTags = this.TargetTags_Wep
			const charas = this.runtime.units.GetUnitsByTags(targetTags, "Chara")

			//if (this.TargetTags_Wep.length > 0) console.error("Targets Watercan", unitChara.enemyTags, targetTags, charas)

			/*let instRayCastFrom = this.inst*/ //unitChara.inst

			let instRayCastFrom = this.inst.getParent() || this.inst

			let nearestChara = null

			this.distEnemyInRange = 0

			if (this.WepTrigger === "Range") {
				let charasInRange = charas.filter((chara) =>
					this.runtime.raycast.TryFromInstToInst(instRayCastFrom, chara.inst, this.GetRange_Value())
				)
				nearestChara = this.PickNearest(charasInRange, instRayCastFrom.x, instRayCastFrom.y)

				//for sweep with high range accuracy
				if (nearestChara) this.distEnemyInRange = C3.distanceTo(instRayCastFrom.x, instRayCastFrom.y, nearestChara.x, nearestChara.y)
			}

			let hasRange = false
			if (nearestChara) hasRange = true

			//for non range wep or if no charas in range
			if (!nearestChara) nearestChara = this.PickNearest(charas, instRayCastFrom.x, instRayCastFrom.y)

			if (nearestChara?.inst) {
				this.noTarget = false
				let angleDegrees = C3.toDegrees(
					C3.angleTo(instRayCastFrom.x, instRayCastFrom.y, nearestChara.unit.bboxMidX, nearestChara.inst.unit.bboxMidY)
				)

				//Melee Lerp  (or for other specific wep)
				if (this.handComp.isTweening || this.wep_Reaim_LikeTween) {
					angleDegrees = this.handComp.GetAngleAim()

					if (this.handComp.Tween_AngleSpeed) {
						let nearestFromMeleeWep = nearestChara

						if (this.handComp.isTweening) {
							nearestFromMeleeWep = this.PickNearest(charas, this.inst.x, this.inst.y)
						}

						if (nearestFromMeleeWep) {
							const angleNearest = C3.toDegrees(
								C3.angleTo(instRayCastFrom.x, instRayCastFrom.y, nearestFromMeleeWep.unit.bboxMidX, nearestFromMeleeWep.unit.bboxMidY)
							)

							const angleDiff = Math.abs(Utils.angleDiffDeg(this.tween_startAngle, angleNearest))

							//if (angleDiff < 45) {
							angleDegrees = Utils.angleRotateDeg(
								this.handComp.GetAngleAim(),
								angleNearest,
								this.handComp.Tween_AngleSpeed * this.inst.dt
							)
							this.tween_startAngle = angleDegrees
							//}
						}
					}
				}

				this.handComp.Override_Angle_Aim(angleDegrees)

				//this.charaComp.Set_Angle_Aim(angleDegrees) //only for certain NPC like resident

				if (this.WepTrigger === "Range" && hasRange) {
					if (this.wepComp.Check_CanShoot()) {
						this.wepComp.SimulateInputDown()
					}
				}
			}
			//* No Target
			else {
				this.noTarget = true
			}
		}
		// * Manual Mode
		else {
			this.handComp.Override_Angle_Aim_Stop()
			this.wepComp.SimulateInputDown()
		}
	}

	//*====================

	//cooldown, size, damage, crit, knockback, lifesteal, range, amount, bounce

	Get_Type_Mod(stat, player = null) {
		if (!player) player = this.player
		//console.error("🔫 Get_Type_Mod", stat, player)

		if (!player) return 0

		const stack = player.effects.GetStack("Type_Mod")

		let value = 0

		for (const effect of stack) {
			if (effect.Stat !== stat) continue
			if (!this.HasTags_All(effect.allTags)) continue
			value += effect.Value
		}

		return value
	}

	//*================= WEP INFO ====================

	get stats() {
		return this.unitChara
	}

	GetWepInfo(item, player, tooltip) {
		//* DESC LINE

		this.AddInfo_WepInfo(item, player, tooltip)
		this.AddInfo_ATK_SpecDesc(item, player, tooltip)
		this.AddInfo_RarityOrUpgrade(item, player, tooltip)
	}

	AddInfo_WepInfo(item, player, tooltip) {
		if (this.Display_WepInfo === "No") return
		if (this.Display_WepInfo === "Doppel_ForcedWep" && this.displayedStatsOf) {
			const dataInstances = this.runtime.dataManager.dataInstances

			const wepInst = dataInstances.Weps.get(this.displayedStatsOf)

			//console.error("AddInfo_WepInfo", this.displayedStatsOf, wepInst)

			wepInst.AddInfo_WepInfo(item, player, tooltip)

			return
		}

		const tooltipEffects = tooltip.querySelector(".tooltipEffects")

		const ul = document.createElement("ul")
		const li = document.createElement("li")
		ul.appendChild(li)
		tooltipEffects.appendChild(ul)

		this.wepInfo = ""
		this.GetWepInfo_Text(player)

		this.wepInfo = Utils.parseBBCode(this.wepInfo)

		li.innerHTML = this.wepInfo
	}

	AddInfo_ATK_SpecDesc(item, player, tooltip) {
		const tooltipEffects = tooltip.querySelector(".tooltipEffects")

		let descInfo = ""

		if (this.ATK_Category) {
			descInfo += this.tr("ATK_Category_" + this.ATK_Category)
		}
		let descKey = item.GetItemDisplayKey()[0] + "_Desc"

		if (this.ATK_Category || this.runtime.translation.HasKey(descKey)) {
			if (this.runtime.translation.HasKey(descKey)) {
				if (descInfo !== "") descInfo += "<br>"
				//descInfo += "[i]" + this.tr(descKey) + "[/i]"
				descInfo += this.tr(descKey)

				//find [STAT_...] and replace with the stat translation
				let matches = descInfo.match(/\[STAT_[^\]]+\]/g)
				if (matches) {
					for (const match of matches) {
						const statKey = match.replace("[", "").replace("]", "")
						descInfo = descInfo.replace(match, this.tr(statKey))
					}
				}
			}

			/*if (this.Display_WepInfo) {
				Utils.Elem_AddSeparator(tooltipEffects)
			}*/
			Utils.Elem_AddSeparator(tooltipEffects)

			const ul = document.createElement("ul")
			const li = document.createElement("li")
			ul.appendChild(li)
			tooltipEffects.appendChild(ul)
			descInfo = Utils.parseBBCode(descInfo)
			li.innerHTML = descInfo
		}
	}

	AddInfo_RarityOrUpgrade(item, player, tooltip) {
		let descInfo_Full = ""
		let descInfo = ""

		const tooltipEffects = tooltip.querySelector(".tooltipEffects")

		//console.error("AddRarityInfo", item, item.isEvoMax)

		if (item.upgradable) {
			// #f8ff7c
			const yellowGray = "#f8ff7c"

			const isInInvo = player.inventoryWeps.items.includes(item)
			const hasInInvo = player.inventoryWeps.items.find((a) => a.name === item.name)

			if (isInInvo || !hasInInvo) {
				descInfo = item.isEvoMax ? this.tr("Desc_ATK_UpgradableMax") : this.tr("Desc_ATK_Upgradable")

				descInfo = "[c=" + yellowGray + "]" + descInfo + "[/c]"
				/*
				descInfo = "[c=gray]" + this.tr("Desc_ATK_Upgradable") + "[/c]"
				const trUpgrade = this.tr("Upgradable", yellowGray) + ": "
				descInfo = descInfo.replace("{Upgradable}", trUpgrade)*/
			} else {
				descInfo = "[img=Game/Graph/Stat_Upgrade.png] " + this.tr("Desc_ATK_Upgrade")
				//descInfo = "[c=gray]" + descInfo + "[/c]"
				const trUpgrade = this.tr("Upgrade", yellowGray) + ": "
				descInfo = descInfo.replace("{Upgrade}", trUpgrade)

				const tooltipImgContain = tooltip.querySelector(".tooltipImgContain")
				tooltipImgContain.insertAdjacentHTML(
					"beforeend",
					/*html*/
					`
                    <img id="bottomLeftIcon" src="Game/Graph/Stat_Upgrade.png" 
                        style="
                            position: absolute;
                            width: ${Utils.px(8)};
                            height: ${Utils.px(8)};
                            bottom: ${Utils.px(1)};
                            left: ${Utils.px(0.5)};
                            display: flex;
                    "/> 
                    `
				)
			}

			descInfo_Full = this.AddWithPotentialLine(descInfo_Full, descInfo)
		}

		if (item.isEvoMax) {
			descInfo = this.tr("Desc_ATK_MaxEvo")
			descInfo = descInfo.replace("{tier}", this.runtime.style.GetTierLoc(item.evolution, true))
			descInfo_Full = this.AddWithPotentialLine(descInfo_Full, descInfo)
		}

		if (descInfo_Full) {
			Utils.Elem_AddSeparator(tooltipEffects)

			const ul = document.createElement("ul")
			const li = document.createElement("li")
			ul.appendChild(li)
			tooltipEffects.appendChild(ul)
			descInfo_Full = Utils.parseBBCode(descInfo_Full)
			li.innerHTML = descInfo_Full
		}
	}

	AddWithPotentialLine(descInfo_Full, descInfo) {
		if (descInfo_Full) {
			descInfo_Full += "<br>"
			descInfo_Full += descInfo
		} else {
			descInfo_Full = descInfo
		}
		return descInfo_Full
	}

	Get_WepATK_Stats(tooltip) {
		const ul = document.createElement("ul")
		const li = document.createElement("li")
		ul.appendChild(li)
		tooltip.appendChild(ul)

		let ATK_Stat_Holder = this
		if (this.ATK_Stat_Inventory) ATK_Stat_Holder = this.ATK_Stat_Inventory

		let html = /*html*/ `
            <div style="font-size: 0.9em; color:rgb(202, 202, 202);"> 
                ${this.tr("During_Last_Wave")}<br>
                ${this.tr("ATK_Stat_Damage")}: ${ATK_Stat_Holder.Get_ATK_Stat_ThisWave("Damage")}<br>
                ${this.tr("ATK_Stat_Kill")}: ${ATK_Stat_Holder.Get_ATK_Stat_ThisWave("Kill")}<br>
            </div>`

		li.innerHTML = html
	}

	GetWepInfo_Text(player) {
		const Bullet = this.BulletDataInst
		const Damage = this.DamageDataInst

		//*INFO
		/*const targetLine = this.SetLine("INFO_Target", this.Target, "pink")
		const directionLine = this.SetLine("INFO_Direction", this.tr("Direction_" + this.Direction), "pink")*/

		//*Damage
		//const countLine = this.SetLine("INFO_Count", Bullet.ProjectileCount)
		const damageLine = this.SetLine("STAT_Damage", Damage.GetDamage_Info(player))
		const criticalLine = this.SetLine("STAT_Crit_Chance", Damage.GetCritInfo(player))
		const knockbackLine = this.SetLine("STAT_Knockback", Damage.GetKnockback_Info(player))
		const lifeStealLine = this.SetLine("STAT_Life_Steal", Damage.GetLifesteal_Info(player))

		//*Wep
		let cooldownLine = this.SetLine("STAT_Cooldown", this.GetCooldown_Info(player))
		if (this.Cooldown_Type === "Cooldown_Spawn") {
			cooldownLine = this.SetLine("STAT_Cooldown_Spawn", this.GetCooldown_Info(player))
		}
		const rangeLine = this.SetLine("STAT_Range", this.GetRange_Info(player))
		const durationLine = this.SetLine("STAT_Duration", this.GetDuration_Info(player))
		const sizeLine = this.SetLine("STAT_Size_Short", this.GetSize_Info(player))

		const amountLine = this.SetLine("STAT_Amount", this.GetAmount_Info(player))

		//*Bullet
		const bounceLine = this.SetLine("STAT_Bullet_BounceWall", Bullet.GetBounce_Solid_Info(player), "orange")
		const ricochetLine = this.SetLine("STAT_Bullet_BounceEnemy", Bullet.GetBounce_Enemy_Info(player), "orange")
		const pierceLine = this.SetLine("STAT_Bullet_Pierce", Bullet.GetPierce_Info(player), "orange")

		/*if (this.Direction) {
			this.AddLine(directionLine)
		}
		if (this.Target) this.AddLine(targetLine)*/

		this.AddLine(damageLine)
		if (this.wepComp.Bullet_Count !== 1 || this.wepComp.Bullet_Amount !== "") this.AddLine(amountLine)
		if (Damage.critChance > 0) this.AddLine(criticalLine)
		if (this.Duration > 0) this.AddLine(durationLine)
		if (this.Cooldown > 0) this.AddLine(cooldownLine)
		if (Damage.knockback && Damage.knockback > 0) this.AddLine(knockbackLine)
		if (this.RangeBase > 0) this.AddLine(rangeLine)
		if (Damage.lifeSteal) this.AddLine(lifeStealLine)

		if (this.Size_Affected) this.AddLine(sizeLine)

		if (this.wepComp.ShootWhat === "Bullet") {
			if (Bullet.GetBounce_Solid_Value(player) > 0) this.AddLine(bounceLine)
			if (Bullet.GetBounce_Enemy_Value(player) > 0) this.AddLine(ricochetLine)
			const pierceValue = Bullet.GetPierce_Value(player)
			if (pierceValue > 0 || pierceValue === -3) this.AddLine(pierceLine)
		}

		if (Damage.explosionChance) {
			let line = ""
			if (Damage.explosionChance < 100) {
				line += this.trChancePrefix(Damage.explosionChance)
			}
			line += this.tr("WepEffect_Bullet_Explode")
			this.AddLine(line)
		}
	}

	//"rgb(255, 236, 109)"

	SetLine(key, value, color = "yellow") {
		let line = this.tr(key, color) + ": " + value
		return line
	}

	AddLine(line) {
		if (this.wepInfo !== "") this.wepInfo += "<br>"
		this.wepInfo += line
	}

	trChancePrefix(chancePercent) {
		let text = "[c=#00FFFF]" + this.tr("CHANCE") + ":[/c] "
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

	//* stat Utils

	GetPlayerStatObject(player, statName) {
		const stats = player ? player.stats : this.stats
		const statObj = stats?.GetStat(statName) || null
		return statObj
	}

	GetPlayerStatValue(player, statName) {
		//console.error("🔫 GetPlayerStatValue", statName, player)
		if (player === null) player = this.player
		const stats = player ? player.stats : this.stats
		const stat = stats?.GetStatValue(statName) || 0
		return stat
	}

	GetColored(current, base, fixed = 0) {
		current = Utils.GetFirstInInterval(current)
		base = Utils.GetFirstInInterval(base)

		let currentFixed = Number(current.toFixed(fixed))

		if (current === base) return currentFixed
		else if (current > base) return "[c=#00FF00]" + currentFixed + "[/c]"
		else if (current < base) return "[c=#FF0000]" + currentFixed + "[/c]"
	}

	//* Size

	GetSize_Value(player = null) {
		if (this.IsMinionATK) return this.atk_Unit.GetSize_Value(player)

		if (!this.Size_Affected) return 1
		let sizeStat = this.GetPlayerStatValue(player, "Size")
		sizeStat += this.Get_Type_Mod("Size", player) / 100

		return sizeStat
	}

	GetSize_Info(player = null) {
		return this.GetColored(this.GetSize_Value(player) * 100, 100) + "%"
	}

	//* Amount

	get AmountBase() {
		return this.wepComp.Bullet_Count
	}

	GetAmount_Bonus(player = null) {
		//! no amount base (because it's the raw bonus)
		if (player === null) player = this.player
		if (!player) return 0

		let amountStat = this.GetPlayerStatValue(player, "Amount")
		amountStat += this.Get_Type_Mod("Amount", player)

		amountStat = Math.max(0, amountStat)

		return amountStat
	}

	GetAmount_Info(player = null) {
		let text = "x" + this.GetColored(this.wepComp.GetBulletCount(player, false), this.AmountBase)
		text += this.wepComp.GetAmount_FormulaInfo()
		return text
	}

	//* Range

	get RangeBase() {
		return this.Range
	}

	GetRangeBase_Value() {
		if (this.IsMinionATK) return this.atk_Unit.GetRangeBase_Value(player)
		return this.RangeBase
	}

	//! scale differently with melee wep
	GetRange_Value(player = null) {
		if (this.IsMinionATK) return this.atk_Unit.GetRange_Value(player)

		if (player === null) player = this.player
		if (!player) return this.RangeBase

		let rangeStat = this.GetPlayerStatValue(player, "Range")
		rangeStat += this.Get_Type_Mod("Range", player)

		//! makes less sense to change melee if stat is percentage
		if (this.handComp.HandType === "Melee_Tween") {
			rangeStat = rangeStat / 2
		} else {
			rangeStat = rangeStat / 1
		}
		return this.RangeBase + rangeStat

		//return this.RangeBase * rangeStat
	}

	GetRange_Info(player = null) {
		return this.GetColored(this.GetRange_Value(player), this.RangeBase)
	}

	//* Cooldown

	get CooldownBase() {
		return this.Cooldown
	}

	GetCooldown_Value(player = null) {
		if (this.IsMinionATK && !this.Minion_HasOwnCooldown) return this.atk_Unit.GetCooldown_Value(player)

		let cooldownStat = this.GetPlayerStatValue(player, "Cooldown")
		cooldownStat += this.Get_Type_Mod("Cooldown", player) / 100
		cooldownStat = Math.max(cooldownStat, this.Cooldown_LowestMult) //0.3 is lowest by default
		return this.CooldownBase * cooldownStat
	}

	GetCooldown_Info(player = null) {
		const cooldownValue = this.GetCooldown_Value(player).toLocaleString("en-US", {
			minimumFractionDigits: 1,
			maximumFractionDigits: 2,
		})
		const cooldownText = cooldownValue + "s"
		return this.GetPlayerStatObject(player, "Cooldown").GetColorBBCode(cooldownText, cooldownValue, this.CooldownBase)
	}

	//* Duration

	GetDuration_Value(player = null) {
		let durationStat = this.GetPlayerStatValue(player, "Duration")
		durationStat += this.Get_Type_Mod("Duration", player) / 100
		return this.Duration * durationStat
	}

	GetDuration_Info(player = null) {
		const durationValue = this.GetDuration_Value(player).toLocaleString("en-US", {
			minimumFractionDigits: 1,
			maximumFractionDigits: 2,
		})
		const durationText = durationValue + "s"
		return this.GetPlayerStatObject(player, "Duration").GetColorBBCode(durationText, durationValue, this.Duration)
	}

	//minion

	get atk_Unit() {
		return this.runtime.getUnitByUID(this.atk_UID)
	}
}
