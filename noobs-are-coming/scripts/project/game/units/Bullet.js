C4.Units.Bullet = class Bullet extends C4.Unit {
	static unitType = "Bullet"

	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	//*========== CONFIG ====================

	SetData() {
		super.SetData()

		this.moveComp = this.AddComponent(C4.Compos.Compo_Move, "Move")

		this.moveComp.onSolid = "Bounce"

		const isDataInst = !this.inst

		this.Damage = new C4.Damage(this.runtime, this.evolution, this.evoMin, null, isDataInst)
		this.Damage.inst = this.inst
		this.Damage.bulletUnit = this

		this.SetVars_Default({
			FactionID: null,

			JustHitbox: false,

			EntityCollide: true,
			Bullet_Visible: true,

			//𝗦𝗘𝗧𝗨𝗣
			Speed: 400,
			Acceleration: 0,

			AngleSpeed: 0,
			MaxDistance: 0,
			Lifetime: 0,
			OnMaxDistance: "None", //None, Destroy, Slow
			SlowOnLifetime: false,
			DestroyOnStop: false,

			SetBulletAngle: true,
			SetBulletAngle_Force: false,
			SetMirrored: false,
			TickDuration: 0,

			//#𝗘𝗫𝗧𝗥𝗔𝗦𝗧𝗔𝗧𝗦

			/*
            Pierce: 0 = No pierce but can augment
            Pierce: -1 = No pierce at all
            Pierce: -2 = Just hitbox
            Pierce: -3 = Infinite pierce
            */

			Pierce: -1,
			Bounce_Solid: -1,
			Bounce_Enemy: -1,

			Dmg_Pierce: 0,
			Dmg_BounceSolids: 0,
			Dmg_BounceEnnemies: 0,
			Crit_Pierce: 0,
			Crit_BounceEnnemies: 0,
			Crit_BounceSolids: 0,
		})

		this.OverrideData({
			DAMAGE: {
				Dmg: 1,
			},
		})
	}

	SetInternals() {
		this.wepUnit = null
		this.charaUnit = null

		this.UID_Weapon = 0
		this.inst_Weapon = null
		this.beh_Weapon = null

		this.UID_Item = 0

		this.angleBaseTotal = 0
		this.angleOffset = 0
	}

	InitData() {
		this.Damage.SetDamageFromData(this.data.DAMAGE)
	}

	Init() {
		this.inst.instVars["EntityCollide"] = this.EntityCollide

		this.anim.isVisible = this.Bullet_Visible

		if (this.JustHitbox) this.SetJustHitbox()

		//! important for JustHitbox situation
		if (this.SetBulletAngle_Force) this.SetBulletAngle = true
		this.moveComp.setAngle = this.SetBulletAngle

		if (this.Pierce <= -2) this.Pierce = Infinity

		//tick
		if (this.TickDuration > 0) {
			this.timerComp.Timer_Start_Args({
				repeat: Infinity,
				duration: this.TickDuration,
				callback: () => {
					this.BulletTick()
				},
			})
		}
	}

	BulletTick() {
		/*
		if (this.Damage) this.Damage.ResetJustHit()
		if (this.inst.isCollisionEnabled) {
			this.inst.isCollisionEnabled = false
			this.inst.isCollisionEnabled = true
		}*/
	}

	SetJustHitbox() {
		this.moveComp.enabled = false
		this.Speed = 0
		this.Pierce = -2
		this.Bounce_Solid = -1
		this.Bounce_Enemy = -1
		this.SetBulletAngle = false

		this.pierce = this.Pierce
		this.bounceSolids = this.Bounce_Solid
		this.bounceEnemy = this.Bounce_Enemy
	}

	ReleaseUnit() {
		this.wepUnit = null
		this.compWep = null
		this.charaComp = null
		this.charaUnit = null

		this.Damage.ReleaseDamage()
	}

	//* GETTERS

	get player() {
		if (typeof this.playerIndex === "number") return this.runtime.players[this.playerIndex]

		if (this.wepUnit) return this.wepUnit.player

		//!CAREFUL, this was added to fix a bug for Disk Kickable, is there regression?
		//! might be an issue for a long time that was fixed by this
		if (this.charaUnit) return this.charaUnit.player

		return false
	}

	get stats() {
		if (this.charaUnit) {
			return this.charaUnit.stats
		}
		return null
	}

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

	GetStatValue(stat, player = null) {
		if (!player) player = this.player
		const stats = player ? player.stats : this.stats
		const value = stats?.GetStatValue(stat) || 0
		return value
	}

	GetColored(current, base) {
		if (current === base) return current
		else if (current > base) return "[c=#00FF00]" + current + "[/c]"
		else if (current < base) return "[c=#FF0000]" + current + "[/c]"
	}

	//* BULLET STATS

	GetPierce_Info(player = null) {
		let pierceDisplayedValue = this.GetPierce_Value(player)

		if (pierceDisplayedValue === -3) return "∞"

		return this.GetColored(pierceDisplayedValue, this.Pierce)
	}

	GetPierce_Value(player = null) {
		let Pierce = this.Pierce

		if (Pierce < 0) return Pierce

		const stat = this.GetStatValue("Bullet_Pierce", player)
		if (stat) Pierce += stat

		Pierce += this.Get_Type_Mod("Bullet_Pierce", player)

		return Pierce
	}

	GetBounce_Solid_Info(player = null) {
		return this.GetColored(this.GetBounce_Solid_Value(player), this.Bounce_Solid)
	}

	GetBounce_Solid_Value(player = null) {
		let Bounce_Solid = this.Bounce_Solid

		if (Bounce_Solid === -1) return -1

		const stat = this.GetStatValue("Bullet_BounceWall", player)
		if (stat) Bounce_Solid += stat

		Bounce_Solid += this.Get_Type_Mod("Bullet_BounceWall", player)

		//console.error("GetBounce_Solid_Value", Bounce_Solid, player)

		return Bounce_Solid
	}

	GetBounce_Enemy_Info(player = null) {
		return this.GetColored(this.GetBounce_Enemy_Value(player), this.Bounce_Enemy)
	}

	GetBounce_Enemy_Value(player = null) {
		let Bounce_Enemy = this.Bounce_Enemy

		if (Bounce_Enemy === -1) return -1

		const stat = this.GetStatValue("Bullet_BounceEnemy", player)
		if (stat) Bounce_Enemy += stat

		Bounce_Enemy += this.Get_Type_Mod("Bullet_BounceEnemy", player)

		return Bounce_Enemy
	}

	//*========== FUNCTIONS ====================

	get atk_Unit() {
		return this.runtime.getUnitByUID(this.atk_UID)
	}

	OnCreated() {
		//
	}

	OnShot_Init() {
		this.bounceSolids = this.GetBounce_Solid_Value()
		this.bounceEnemy = this.GetBounce_Enemy_Value()
		this.pierce = this.GetPierce_Value()

		//will automatically find
		this.rangeWep = this?.wepUnit?.Range || -1
		this.rangeActual = this?.wepUnit?.GetRange_Value() || -1
		//console.error("OnShot_Init", this.name, this.rangeActual, this.wepUnit.Range)

		this.moveComp.Set_AngleOfMotion(this.angleBaseTotal)
		this.moveComp.Set_Speed(this.Speed)
		this.moveComp.Set_Acc(this.Acceleration)

		if (this.Lifetime > 0) {
			this.timerComp.Timer_Start("Lifetime", this.Lifetime, () => {
				this.OnLifetime()
			})
		}

		//this.range = this.wepUnit.range
	}

	SetWeapon(wepComp) {
		//todo Inst_Set_UID_Entity(bulletBeh._inst, this.UID_Entity())
		this.wepUnit = wepComp.unit
		this.compWep = wepComp
		this.charaComp = wepComp.charaComp
		this.charaUnit = wepComp.charaComp.unit

		this.Damage.SetWeapon(wepComp)

		this.UID_Weapon = wepComp.inst.uid
		this.UID_Item = wepComp.UID_Item

		//this.SetFactionID(this.wepUnit.FactionID)
		this.SetFactionID(this.charaUnit.FactionID)

		//TODO
		//!Careful: Bullet sometimes need to be child of something else (Mortar)
		//this.wi.AddChild(bulletBeh._inst.GetWorldInfo())
	}

	SetBulletAbi(abi) {
		this.Damage.charaUnit = abi.unit
		this.SetFactionID(abi.unit.FactionID)
	}

	SetFactionID(factionID) {
		this.FactionID = factionID
	}

	Tick() {
		this.Tick_Collision()
		this.Tick_Move()
		this.Tick_AngleSpeed()
	}

	Tick_AngleSpeed() {
		if (this.AngleSpeed !== 0) {
			this.anim.angleDegrees += this.AngleSpeed * this.inst.dt
		}
	}

	Tick_Collision() {
		//
	}

	Tick_Move() {
		if (this.DestroyOnStop && this.moveComp.Speed() < 1) {
			this.CallDestroy("OnStop")
		}

		//console.error("this.moveComp.distTravel", this.moveComp.distTravel, this.rangeActual)

		if (!this.maxDistanceReached && this.rangeWep > 0) {
			if (this.moveComp.distTravel > this.rangeActual) {
				this.maxDistanceReached = true
				if (this.OnMaxDistance === "Destroy") {
					this.CallDestroy("MaxDistance")
				} else {
					this.OnMaxDistanceReach()
				}
			}
		}

		if (this.SetMirrored) this.SetMirroredToMotion()
	}

	OnLifetime() {
		if (this.SlowOnLifetime) {
			this.DestroyOnStop = true
			this.moveComp.Set_Acc(-10 * this.moveComp.Speed())
		} else this.CallDestroy("Lifetime")
	}

	OnHitEnemy(hitUnit) {
		if (this.pierce === 0 && this.bounceEnemy <= 0) {
			this.CallDestroy("NoPierce")
		}
		if (this.bounceEnemy > 0) {
			this.bounceEnemy--

			const targetTags = ["Enemy"]
			const targets = this.runtime.units.GetUnitsByTags(targetTags, "Chara")
			//remove the hitUnit from the targets
			const index = targets.indexOf(hitUnit)
			if (index > -1) {
				targets.splice(index, 1)
			}
			const target = Utils.PickNearest(targets, this.unit.x, this.unit.y)
			if (target) {
				this.moveComp.Set_AngleOfMotion(Utils.angleToDeg(this.unit.x, this.unit.y, target.bboxMidX, target.bboxMidY))
			} else {
				this.moveComp.Set_AngleOfMotion(Math.random() * 360)
			}
		} else if (this.pierce > 0) {
			this.pierce--
		}
	}

	OnCollisionWithSolid() {
		if (this.bounceSolids > 0) {
			this.bounceSolids--
			this.OnRebound()

			this.Damage.ResetJustHit()

			if (this.bounceSolids === 0) {
				this.OnRebound_Last()
			}
		} else if (this.bounceSolids === 0) {
			this.CallDestroy("OnSolid")
		}
	}

	OnCollisionWithChara(charaUnit) {
		const bool = this.Damage.DealDamage_Test(charaUnit)
		if (bool) this.OnHitEnemy(charaUnit)
	}

	CallDestroy(method) {
		//console.error("Bullet", this.nameEvo, "CallDestroy", method)
		this.OnDestroyed()
		if (method === "OnSolid") {
			this.OnDestroyed_OnSolid()
		} else if (method === "OnStop") {
			this.OnDestroyed_OnStop()
		} else if (method === "Lifetime") {
			this.OnDestroyed_Lifetime()
		} else if (method === "NoPierce") {
			this.OnDestroyed_NoPierce()
		} else if (method === "MaxDistance") {
			this.OnDestroyed_MaxDistance
		}
		this.DestroyUnit()

		/*
		if (this.AnimObject === "Bullet_BallRoll") {
			window.alert("Ball Bullet destroyed " + method)
		}*/
	}

	//*========== WEP INFO ====================

	//*========== EVENTS ====================

	OnDamageTick() {
		//
	}

	OnRebound() {
		//
	}

	OnRebound_Last() {
		//
	}

	OnMaxDistanceReach() {
		//
	}

	OnDestroyed() {
		//
	}

	OnDestroyed_ByEntity() {
		//
	}

	OnDestroyed_OnSolid() {
		//
	}

	OnDestroyed_OnStop() {
		//
	}

	OnDestroyed_Lifetime() {
		//
	}

	OnDestroyed_NoPierce() {
		//
	}

	OnDestroyed_MaxDistance() {
		//
	}
}
