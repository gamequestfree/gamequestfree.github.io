//TODO Cast Faction_ID ?? (override faction ID of the entity, it was only used on U_Dash_Proj)
//TODO Action_SpawnEntity using WEP Beh ? so not spawning bullets but entities

export class Compo_Wep extends C4.Component {
	constructor(unit, data = null) {
		super(unit, data)
	}

	SetData() {
		this.SetVars_Default({
			ShootWhere: "WeaponAngle",
			//"WeaponPoint", "WeaponAngle", "AimAngle", "BBoxMid", "Hitbox", "None"

			ShootWithin: 0,
			//Target
			ShootWhat: "Bullet",
			//"Bullet", "Hitbox," "Entity", "Laser", "Orb"
			//Telegraph
			ShootWhich: "",
			WhichEntity_Anim: "",

			MinionHitbox: false,
			MinionHurtbox: false,
			MinionWep: false,
			MinionInvulnerable: false, //! not use anymore

			ShootAngleDist: 0,
			Is_Automatic: true,
			Beam: "No", //"No", "Beam", "Beam_ShootStart"
			Time_Preparation: 0,

			//Shoot config
			Bullet_ProjectileAmount: true,
			Bullet_Count: 1,
			Bullet_Amount: "",
			Bullet_Spray: 30,
			Random_Spread: true,
			Bullet_AccuracyOffset: 0,
			Entity_Recoil: 1,

			Bullet_Outline: true,
			Bullet_EvoGlow: true,
			Bullet_Color: false,

			//Prepare Plug

			hasPlugCharge: false,
			Charge_AutomaticallyShoot: false,
			//Apex
			Time_Apex: 0,
			Bullet_Apex: "",
			Apex_DamagePercent: 0,
			//ShootBefore
			ShootBefore_Bool: false,
			ShootBefore_MinTime: 0,
			Bullet_ShootBefore: "",
		})
	}

	SetInternals() {
		this.isActive = true

		this.UID_ParentCaster = 0
		this.beh_parentCaster = null
		this.UID_Item = 0

		this.unitChara = null
		this.inst_Anim = null

		this.UID_BulletLast = 0

		this.inputState = 0
		this.inputSimulate = false

		this.angleShot = 0

		this._readyToShoot = true

		this.isSprite = this.inst.animation ? true : false
		this.inst.addEventListener("animationend", (animName) => this.AnimationEnd(animName))
	}

	get atk_speed() {
		if (this.unit.player) return this.unit.GetCooldown_Value()
		return this.unit.Cooldown
	}

	//*BULLET_SPAWN
	Bullet_Spawn(x, y, angle_base = 0, angle_offset = 0, bulletType = "") {
		angle_base = angle_base + angle_offset

		let sizeScale = this.unit.GetSize_Value() //return 1 if not affected

		let data_onlySize = {
			UnitScale: sizeScale,
			DoppelSize: this.unit.DoppelSize,
		}

		if (this.ShootWhat === "Bullet") {
			let bulletUnit = null
			if (this.unit.IsPlayerATK) {
				bulletUnit = this.runtime.spawnManager.SpawnBullet(this.unit.nameEvo, x, y, data_onlySize)
			} else if (this.unit.IsMinionATK) {
				bulletUnit = this.runtime.spawnManager.SpawnBullet(this.unit.IsMinionATK, x, y, data_onlySize)
			} else {
				const BulletData = this.unit?.data?.BULLET

				if (!BulletData) {
					console.error("⛔ No Bullet Data")
					return
				}

				BulletData.UnitScale = sizeScale

				bulletUnit = this.runtime.spawnManager.SpawnBullet(BulletData.BulletUnit, x, y, BulletData)
			}

			if (!bulletUnit) {
				console.error("Failed to spawn bullet", bulletName)
			} else {
				/*if (this.UID_ParentCaster) {
					bulletUnit.SetWeapon(this.beh_parentCaster)
				} else bulletUnit.SetWeapon(this)*/

				/*if (this.unit.AnimObject === "Wep_Bow_Ballista") {
					console.error("👿 Ballista Arrow", bulletUnit)
				}*/

				bulletUnit.SetWeapon(this)

				if (this.unit.IsMinionATK) {
					//! CAREFUL: very tricky
					bulletUnit.atk_UID = this.unit.atk_UID

					//console.error("Minion Bullet atk_Unit", this.unit.atk_Unit)

					const atk_Unit = this.unit.atk_Unit

					//* very important to map wepUnit and
					bulletUnit.Damage.playerIndex = atk_Unit.unitChara.playerIndex
					bulletUnit.Damage.wepUnit = atk_Unit

					bulletUnit.playerIndex = atk_Unit.unitChara.playerIndex
					bulletUnit.wepUnit = atk_Unit

					//window.alert("Minion Bullet playerindex " + bulletUnit.Damage.playerIndex)
				} else {
					bulletUnit.atk_UID = this.unit.uid
				}

				bulletUnit.wepNameDebug = this.unit.name

				bulletUnit.angleBaseTotal = angle_base
				bulletUnit.angleOffset = angle_offset

				bulletUnit.OnShot_Init()
				bulletUnit.OnCreated()

				//? race condition, does it really execute after ?? to check
				//this.Trigger("OnBulletCreated")

				this.UID_BulletLast = bulletUnit.uid

				this.Trigger("OnBulletSpawn", bulletUnit)

				let player = null
				if (this.unit.player) player = this.unit.player
				if (typeof this.unitChara.minionPlayerIndex === "number") {
					player = this.runtime.players[this.unitChara.minionPlayerIndex]
				}

				if (player) player.Process_SpawnedEntity(bulletUnit)

				if (this.unitChara.IsCharmed) {
					Utils.Bullet_Charmed(bulletUnit)
				}

				if (this.Bullet_Outline) {
					let color = [1, 0, 0]

					if (this.unitChara.CharmedByID) {
						color = this.runtime.players[this.unitChara.CharmedByID].color_
					}

					if (player) {
						color = player.color_
						if (this.unit.evolution > 0 && this.Bullet_EvoGlow) {
							bulletUnit.anim.glowEvo = this.unit.evolution
							if (this.runtime.fxManager.drawGlow_Entities) {
								this.runtime.fxManager.Add_GlowAnim(bulletUnit.anim)
							}
						}
					}

					bulletUnit.SetOutline(color)
				}
			}
		} else if (this.ShootWhat === "Entity") {
			console.error("Shoot Spawn Entity", this.ShootWhich)

			//* If Player ATK, spawn the Minion with the same nameEvo

			const minionName = this.unit.IsPlayerATK ? this.unit.nameEvo : this.ShootWhich
			const minionUnit = this.runtime.spawnManager.SpawnChara(minionName, x, y, data_onlySize)

			const player = this.unit.player

			if (this.Bullet_Outline && player) {
				minionUnit.SetOutline(player.color_)
			}

			if (this.WhichEntity_Anim) {
				window.alert("Set Minion Anim")
				minionUnit.SetAnimObject(this.WhichEntity_Anim)
			}

			if (player) {
				minionUnit.RemoveTags("Enemy")
				minionUnit.FactionID = "Player"

				minionUnit.minionPlayerIndex = player.playerIndex
				minionUnit.AddTags("PlayerMinion" + player.playerIndex)
			}

			//window.alert("minion player index", player.playerIndex)
			minionUnit.atk_UID = this.unit.uid

			if (this.MinionHitbox) {
				minionUnit.SetHitboxDamageFromATK()
			}

			if (this.MinionHurtbox) {
				minionUnit.GenerateHurtbox()
			} else {
				minionUnit.invulnerable = true
			}

			if (this.MinionWep) {
				minionUnit.AddWepFromATK()
			}

			if (this.unit.evolution > 0 && this.Bullet_EvoGlow) {
				minionUnit.anim.glowEvo = this.unit.evolution
				//console.error("Add glowEvo", minionUnit.anim.glowEvo)
				if (this.runtime.fxManager.drawGlow_Entities) {
					this.runtime.fxManager.Add_GlowAnim(minionUnit.anim)
				}
			}

			/*if (this.MinionInvulnerable) {
				minionUnit.invulnerable = true
			}*/

			console.error("👀 Attack Spawned Entity", this.ShootWhich, minionUnit)

			this.Trigger("OnMinionSpawn", minionUnit)

			minionUnit.OnMinionInit()

			if (player) player.Process_SpawnedEntity(minionUnit)
		}
	}

	Init() {
		this.comp_handle = this.unit.GetComponent("HAND")

		this.isBeam = this.Beam === "No" ? false : true

		this.Init_Hitbox()

		this._SetTicking(true)
	}

	Init_Hitbox() {
		if (this.ShootWhere === "Melee") {
			const debug = this.runtime.objects["Square"].createInstance("Debug_Local", this.inst.x, this.inst.y)
			debug.colorRgb = [1, 0, 0]
			debug.isVisible = false
			this.inst.addChild(debug, {
				transformX: true,
				transformY: true,
				transformAngle: true,
				destroyWithParent: true,
			})

			//could be initiated in the unit via templateData

			this.Hitbox = Utils.World_GetChild(this.inst, "Hitbox")
			if (!this.Hitbox) {
				this.Hitbox = this.runtime.objects["Hitbox"].createInstance("Objects", this.inst.x, this.inst.y)
				this.Hitbox.setSize(this.inst.width, this.inst.height)
				//window.alert("Created Hitbox")
			}

			console.error("Hitbox", this.Hitbox)

			this.Hitbox.removeFromParent()
			this.inst.addChild(this.Hitbox, {
				transformX: true,
				transformY: true,
				transformAngle: true,
				destroyWithParent: true,
			})
			this.Hitbox_Toggle(false)
			this.Hitbox.isVisible = false
			this.Hitbox.Damage = new C4.Damage(this.runtime, this.unit.evolution, this.unit.evoMin)
			this.Hitbox.Damage.inst = this.Hitbox

			this.Hitbox.Damage.SetDamageFromData(this.unit.data.BULLET.DAMAGE)

			this.Hitbox.Damage.Angle_Hit = "FromEntity"
		}
	}

	ReleaseComp() {
		this.UID_Entity = 0
		this.charaComp = null
		this.unitChara = null
		this.inst_Anim = null
		this.iBeh_tween = null
		this.comp_handle = null

		this.beh_parentCaster = null
		if (this.Hitbox) {
			this.Hitbox.Damage.ReleaseDamage()
			this.Hitbox.destroy()
		}
	}

	Set_EntityUID(UID_Entity) {
		this.unitChara = this.runtime.getUnitByUID(UID_Entity)
		this.charaComp = this.unitChara.GetComponent("Character")

		if (this.Hitbox) {
			this.Hitbox.Damage.SetWeapon(this)
		}

		if (!this.comp_handle) this.comp_handle = this.unit.GetComponent("HAND")
		if (this.comp_handle) {
			this.comp_handle.Set_EntityUID(UID_Entity)
		}

		//*useful for sub weapons
		/*
		for (const subWepBeh of Inst_GetChildren_Beh(this._inst, NAMESPACE)) {
			subWepBeh.Set_EntityUID(UID_Entity)
		}*/
	}

	Init_Plug_Charge() {
		//!Todo data-driven
	}

	AnimationEnd(animName) {
		if (animName === "Shoot") {
			this.Animation_Set("Idle")
		} else if (animName === "Ready") {
			this.Animation_Set("ReadyLoop")
		}
	}

	Animation_Set(name) {
		if (!this.isSprite) return
		if (this.inst.getAnimation(name)) this.inst.setAnimation(name)
	}

	//*Utils

	Tick() {
		const timer_prepare = this.timerComp.Timer_Get("Prepare")
		if (timer_prepare) {
			this.Charge_Progress = timer_prepare.currentTime / timer_prepare.initDelay
		} else {
			this.Charge_Progress = 0
		}

		this.Tick_Input()
	}

	Tick_Input() {
		this.ListenForInput()
		if (this.inputSimulate) {
			this.Set_Input_State(2)
		} else {
			if (this.inputState >= 2) this.Set_Input_State(1)
			else this.Set_Input_State(0)
		}
		this.inputSimulate = false
	}

	SimulateInputDown() {
		if (!this.unit.wepEnabled) return
		if (this.inputState < 2) {
			this.Set_Input_State(3)
		}
		this.inputSimulate = true
	}

	Set_Input_State(state) {
		this.inputState = state
	}

	ListenForInput() {
		//?should check if Not Autoshoot and not Preview

		if (this.inputState_override !== -1) {
			this.inputState = this.inputState_override
			this.inputState_override = -1
		}
		if (this.inputState > 0) {
			// NO PREPARE
			if (this.Time_Preparation <= 0) {
				//window.alert("No Prepare")
				if (this.isBeam) {
					this.Beam_ListenForInput()
				} else {
					if (this.Is_Automatic) this.Shoot()
					else if (this.inputState === 3) this.Shoot()
				}
			}

			// PREPARE
			if (this.Time_Preparation > 0) {
				const isPreparingTimer = this.timerComp.Timer_Get("Prepare")

				if (!isPreparingTimer && this.inputState === 3 && this.Check_CanShoot()) {
					this.Timer_Prepare_Start()
				}
				//is Preparing
				if (isPreparingTimer) {
					//cancel
					if (this.inputState === 1 && !this.Charge_AutomaticallyShoot) {
						this.Timer_Prepare_Cancel()
					}
				}
				//is Ready
				else {
					if (this.isBeam) {
						this.Beam_ListenForInput()
					} else {
						//Simple and Advanced
						//! handled by Finished now
						//if (this.Is_Automatic) this.Shoot()
						//shoot on released for Non-Automatic + Prepare Weapons
						if (this.inputState === 1) {
							//if Advance Charge Apex is running
							if (this.hasPlugCharge && this.timerComp.Timer_Get("Apex_Prep")) {
								this.Trigger("OnApex_Shoot")
								this.Shoot(this.Bull_IfApex)
							}
							//if Simple Charge OR no apex
							else {
								this.Shoot()
							}
						}
					}
				}
				//on released
				if (this.inputState === 1) {
					this.Animation_Set("Idle")
				}
			}

			//to place at the right position
		}
	}

	Beam_ListenForInput() {
		//on pressed
		if (this.inputState === 3) {
			this.Trigger("OnBeam_Start")
			if (this.Beam === "Beam_ShootStart") this.Trigger("OnBeam_LoopTrigger")
			this.Call_Recoil()
		}
		// automatic
		// check can shoot because not automatically called in Shot() here
		else if (this.Is_Automatic && this.Check_CanShoot()) {
			this.Trigger("OnBeam_LoopTrigger")
			this.Call_Recoil()
		}
		if (this.inputState === 1) {
			this.Trigger("OnBeam_End")
		}
	}

	Timer_Prepare_Start() {
		if (this.unit.AnimObject === "Wep_Bow") {
			//window.alert("Prepare Start")
		}
		this.Trigger("OnPrepare_Start")
		this.Animation_Set("Prepare")
		this.timerComp.Timer_Start("Prepare", this.Time_Preparation, () => {
			this.Timer_Prepare_Finished()
		})
	}

	Timer_Prepare_Finished() {
		//Simple and Advanced
		this.Trigger("OnPrepare_Complete")
		this.Trigger("OnPrepare_End")
		this.Animation_Set("Ready")
		//Advanced Preparation only
		if (this.hasPlugCharge) {
			if (this.Charge_AutomaticallyShoot && !this.isBeam) {
				this.Shoot()

				/*
				if (this.Is_Automatic) {
					this.Timer_Prepare_Start()
				}*/

				//inputState_override
				if (!this.Is_Automatic) {
					this.inputState_override = 0
				}
			}

			//If Time_Apex
			if (this.Time_Apex > 0) {
				this.Trigger("OnApex_StartTimer")
				this.timerComp.Timer_Start("Apex_Prep", this.Time_Apex, () => {
					this.Trigger("OnApex_TooLate")
				})
			}
		}
	}

	Timer_Prepare_Cancel() {
		this.timerComp.Timer_Stop("Prepare")
		//Simple and Advanced
		this.Trigger("OnPrepare_Cancel")
		this.Trigger("OnPrepare_End")
		//Advanced Preparation only
		if (this.hasPlugCharge) {
			//Shoot even before prepare

			if (this.ShootBefore_Bool && this.ShootBefore_MinTime <= timer_prepare.currentTime) {
				this.Trigger("OnWeaker_Shoot")
				this.Shoot(this.ShootBefore_Bull)
			}
		}
	}

	Timer_Prepare_IsReady() {
		//Simple and Advanced

		//Advanced Preparation only
		if (this.hasPlugCharge) {
			//
		}
	}

	Check_CanShoot() {
		return this._readyToShoot
	}

	IntercooldownStart() {
		this._readyToShoot = false
		this.timerComp.Timer_Start("InterCooldown", this.atk_speed, () => {
			this._readyToShoot = true
			this.Trigger("OnCooldownEnd")
		})
	}

	//* SHOOT FUNCTION
	Shoot(ignoreCooldown = false) {
		if (!ignoreCooldown && !this.Check_CanShoot()) {
			return
		}
		this.Animation_Set("Shoot")
		this.IntercooldownStart()

		//visu
		if (this.comp_handle.HandType === "Inactive") {
			this.unit.juice.Shake({})
		}

		//Bullet Based Gun

		let x
		let y
		let ang

		const inst = this.inst

		//* SPECIAL SHOOTS
		if (this.ShootWithin) {
			this.Shoot_Within()
		} else if (this.ShootWhere === "Melee") {
			//this.Hitbox_Toggle(true)
		} else if (this.ShootWhere === "RandomInArea") {
			this.Shoot_RandomInArea()
		} else if (this.ShootWhere === "Target") {
			this.Shoot_Target()
		}
		//* REGULAR SHOOTS
		else if (this.ShootWhere === "WeaponPoint") {
			x = inst.getImagePointX("Shoot")
			y = inst.getImagePointY("Shoot")
			ang = inst.angleDegrees
			if (this.comp_handle.Hand_AngleOffset) ang -= this.comp_handle.Hand_AngleOffset
			this.Shoot_Spread(x, y, ang)
		} else if (this.ShootWhere === "WeaponAngle") {
			x = inst.x + Math.cos(inst.angle) * this.ShootAngleDist
			y = inst.y + Math.sin(inst.angle) * this.ShootAngleDist
			ang = C3.toDegrees(this.inst.angle)
			this.Shoot_Spread(x, y, ang)
		} else if (this.ShootWhere === "AimAngle") {
			x = this.unitChara.bboxMidX
			y = this.unitChara.bboxMidY
			if (this.charaComp) {
				ang = this.charaComp.Angle_Aim()
				x += Utils.cosDeg(ang) * this.ShootAngleDist
				y += Utils.sinDeg(ang) * this.ShootAngleDist
				this.Shoot_Spread(x, y, ang)
			} else {
				console.warn("Wep (AimAngle Mode) : No Entity Behavior Found!")
			}
		} else if (this.ShootWhere === "BBoxMid") {
			x = this.unitChara.bboxMidX
			y = this.unitChara.bboxMidY
			ang = 0
			this.Shoot_Spread(x, y, ang)
		} else if (this.ShootWhere === "BBoxBottom") {
			const bbox = this.unitChara.inst.getBoundingBox()
			x = this.unitChara.bboxMidX
			y = bbox.bottom
			ang = 0
			this.Shoot_Spread(x, y, ang)
		} else {
			//
		}

		this.angleShot = Utils.angle360(ang)
		this.Trigger("OnShoot", x, y, ang)

		this.unit.ATK_Stat("Trigger", 1)

		//Entity Recoil

		this.Call_Recoil()

		//Handling Recoil

		if (this.comp_handle) {
			this.comp_handle.UseHand()
		}
	}

	Call_Recoil() {
		if (this.charaComp && this.Entity_Recoil > 0) {
			let recoilAngleDegrees
			if (this.ShootWhere === "WeaponPoint" || this.ShootWhere === "WeaponAngle") {
				recoilAngleDegrees = this.inst.angleDegrees + 180
			} else {
				recoilAngleDegrees = this.charaComp.Angle_Aim() + 180
			}
			this.charaComp.Trigger("Recoil", 0, recoilAngleDegrees, this.Entity_Recoil)
		}
	}

	Hitbox_Toggle(bool) {
		if (bool) this.Hitbox.Damage.ResetJustHit()
		this.Hitbox.isCollisionEnabled = bool
	}

	GetAmount_FormulaInfo() {
		if (!this.Bullet_Amount) return ""
		let text
		const amountSplit = this.Bullet_Amount.split(":")
		if (amountSplit.length >= 2) {
			const add = amountSplit[0]
			const forEach = amountSplit[1]

			return ` [c=#b3b3b3][${this.Bullet_Count}[/c]+${add}/${forEach}${Utils.GetStatImg("Amount")}[c=#b3b3b3]][/c]`
		}
	}

	GetBulletCount(player = null, process = true) {
		let amountToAdd = 0
		const amountSplit = this.Bullet_Amount.split(":")

		if (amountSplit.length >= 2) {
			const add = amountSplit[0]
			const forEach = amountSplit[1]
			const amountStat = this.unit.GetAmount_Bonus(player)
			//console.error("GetBulletCount amountStat", amountStat)
			amountToAdd = Math.floor(amountStat / forEach) * add
		}

		let bulletCount = this.Bullet_Count

		if (amountToAdd) bulletCount = Utils.OffsetInterval(bulletCount, amountToAdd)
		if (process) bulletCount = Utils.ProcessInterval(bulletCount)

		return bulletCount
	}

	GetProjectileCount() {
		//if it's not ProjectileAmount, it means the stat is used for something else
		if (!this.Bullet_ProjectileAmount) return 1
		return this.GetBulletCount()
	}

	Shoot_Target() {
		let Bullet_Count = this.GetProjectileCount()
		for (let i = 0; i < Bullet_Count; i++) {
			const pos = this.runtime.spawnManager.GetPosInArea(30)
			this.Bullet_Spawn(pos[0], pos[1], 0, 0)
		}
	}

	Shoot_RandomInArea() {
		let Bullet_Count = this.GetProjectileCount()
		for (let i = 0; i < Bullet_Count; i++) {
			const pos = this.runtime.spawnManager.GetPosInArea(30)
			this.Bullet_Spawn(pos[0], pos[1], 0, 0)
		}
	}

	Shoot_Within() {
		let Bullet_Count = this.GetProjectileCount()
		for (let i = 0; i < Bullet_Count; i++) {
			const x = this.unitChara.bboxMidX
			const y = this.unitChara.bboxMidY
			const pos = this.runtime.spawnManager.GetPosInArea_FromCircle(x, y, this.ShootWithin)
			this.Bullet_Spawn(pos[0], pos[1], 0, 0)
		}
	}

	Shoot_Spread(x, y, angle_base, bulletType = "") {
		let Bullet_Count = this.GetProjectileCount()
		let Bullet_AccuracyOffset = this.Bullet_AccuracyOffset
		let Bullet_Spray = this.Bullet_Spray
		let Random_Spread = this.Random_Spread

		//TODO subbullet
		//if subbullet, override
		if (bulletType !== "") {
			//
		}

		if (Bullet_Count <= 1) {
			this.Bullet_Spawn(x, y, angle_base, 0, bulletType)
		} else {
			for (let i = 0; i < Bullet_Count; i++) {
				//random(-IndividualSpray/2,IndividualSpray/2)
				//angle_offset is first set to per bullet accuray
				let angle_offset = Math.random() * Bullet_AccuracyOffset - Bullet_AccuracyOffset / 2
				if (this.Random_Spread) {
					angle_offset += Math.random() * Bullet_Spray - Bullet_Spray / 2
				} else {
					if (Bullet_Spray === 360) {
						angle_offset += (360 / Bullet_Count) * i
						//window.alert("Bullet_Spray 360")
					} else {
						angle_offset += -Bullet_Spray / 2 + (Bullet_Spray / Bullet_Count) * i
					}
				}
				//

				this.Bullet_Spawn(x, y, angle_base, angle_offset, bulletType)
			}
		}
	}

	Bullet_JustSpawn(x, y, angle, bulletType = "") {
		this.Bullet_Spawn(x, y, angle, 0, bulletType)
	}

	Set_ParentCaster(UID_ParentCaster) {
		const beh_parentCaster = this.runtime.getInstanceByUid(UID_ParentCaster).GetBehaviorInstanceFromCtor(NAMESPACE)._sdkInst
		if (beh_parentCaster) {
			this.UID_ParentCaster = UID_ParentCaster
			this.beh_parentCaster = beh_parentCaster
		}
	}

	Set_Recoil_Entity(recoil) {
		this.Entity_Recoil = recoil
	}

	Get_LastBullet() {
		const inst = this.runtime.getInstanceByUid(this.UID_BulletLast)
	}

	Is_UID_Entity(uid) {
		return this.UID_Entity() === uid
	}

	UID_Entity() {
		return UID_Entity(this.uid)
	}

	UID_Item() {
		return this.UID_Item
	}
	UID_ParentCaster() {
		return this.UID_ParentCaster
	}
}
