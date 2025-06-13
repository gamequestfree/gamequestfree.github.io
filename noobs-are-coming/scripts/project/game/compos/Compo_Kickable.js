//! Regression < 10 should desactivate damage

export class Compo_Kickable extends C4.Component {
	constructor(unit, data = null) {
		super(unit, data)
	}

	SetData() {
		this.SetVars_Default({
			Kick_Enabled: true,
			Tags_Kickers: ["Minion", "Tank", "Player"],
			KickDirection: "Move", // "Move", "Behind", "Nearest"
			Tags_Nearest: ["Enemy"],
			Kick_Speed: 300,
			Kick_Acc: -50,
			DamageActivation: true,

			Kick_RandomAngleOffset: 0,

			Kick_CanRekick: 0.4,

			KickOnSolid_Feedbacks: {},
		})
	}

	ReleaseComp() {
		this.unit.kickComp = null
	}

	Init() {
		this.unit.AddTags("Kickable")

		this._SetTicking(true)

		this.unit.moveComp.enabled = true
	}

	SetInternals() {
		this.lastCollideUid = null
	}

	Tick() {
		super.Tick()

		if (!this.Kick_Enabled) return

		const livingPlayers = Array.from(this.runtime.playersAlive).map((player) => player.inst)

		const minions = this.runtime.units.GetUnitsByTags(this.Tags_Kickers, "Chara").map((unit) => unit.inst)

		const candidates = livingPlayers.concat(minions)

		//remove this.inst from candidates
		const index = candidates.findIndex((inst) => inst.uid === this.inst.uid)
		if (index !== -1) {
			candidates.splice(index, 1)
		}

		const kickersCollide = Utils.testOverlap_All(this.inst, candidates)

		const kickerCollide = kickersCollide.find((inst) => inst.uid && inst.uid !== this.lastCollideUid && inst.unit)

		if (kickerCollide) {
			this.Kick_Func(kickerCollide)
			this.Set_KickMoving(true)
		}

		//for bullets that are only enabled on kick

		if (this.kickMoving) {
			//! kick_impulse
			/*
			const impulseKick = this.unit.moveComp.impulseKick
			if (!impulseKick || impulseKick.speed <= 10) {
				this.Kick_Stop()
			}*/
			//! kick_set
			if (this.unit.moveComp.speed <= 10) {
				this.Kick_Stop()
			}
		}
	}

	Set_KickMoving(bool) {
		this.kickMoving = bool
		this.unit.kickMoving = bool
		this.unit.moveComp.kickMoving = bool
	}

	Kick_Stop() {
		this.Set_KickMoving(false)

		this.Trigger("Kick_Stop")

		this.lastCollideUid = null

		//this.unit.moveComp.onSolid = "Slide"

		if (this.DamageActivation && this.unit.Damage) {
			this.unit.Damage.enabled = false
		}
	}

	Kick_Func(playerCollide) {
		if (this.timerComp.Timer_Get("KickDirection")) return

		if (this.DamageActivation && this.unit.Damage) {
			this.unit.Damage.enabled = true
		}

		this.isAttractedByPlayer = false

		const collideUnit = playerCollide.unit

		if (collideUnit.player) {
			collideUnit.player.TriggerPlayerEvent("On_Kick")
			collideUnit.Knockback_Shockwave(40, 5)
		}

		const text = "KICK" //this.runtime.translation.Get("Kick")
		this.runtime.pointburst.Create_InfoShake_Text("KICK", collideUnit.bboxMidX, collideUnit.bboxMidY)

		this.timerComp.Timer_Start("KickDirection", 0.15)

		this.timerComp.Timer_Start("Kick_CanRekick", this.Kick_CanRekick, () => {
			this.lastCollideUid = null
		})

		//window.alert("BumpDirection")
		if (!collideUnit.moveComp) {
			console.error("Uncaught Kick no moveComp", collideUnit)
		}
		let angleMotion = collideUnit.moveComp.AngleOfMotion()

		if (this.KickDirection === "Move") {
			//
		}
		if (this.KickDirection === "Behind") {
			angleMotion = collideUnit.moveComp.AngleOfMotion() + 180
		}
		if (this.KickDirection === "Nearest") {
			const targets = this.runtime.units.GetUnitsByTags(this.Tags_Nearest, "Chara")
			const target = Utils.PickNearest(targets, this.unit.x, this.unit.y)
			if (target) {
				angleMotion = Utils.angleToDeg(this.unit.x, this.unit.y, target.x, target.y)
			}
		}

		if (this.Kick_RandomAngleOffset) {
			angleMotion += Utils.random(-this.Kick_RandomAngleOffset, this.Kick_RandomAngleOffset)
		}

		const moveComp = this.unit.moveComp

		//moveComp.onSolid = "Bounce"
		moveComp.enabled = true

		//! kick_impulse
		//moveComp.Impulse_Kick(angleMotion, this.Kick_Speed, this.Kick_Acc)

		//! kick_set
		moveComp.Set_Speed(this.Kick_Speed)
		moveComp.Set_Acc(this.Kick_Acc)
		moveComp.Set_AngleOfMotion(angleMotion)

		this.lastCollideUid = playerCollide.uid

		this.juice.SS_SetScale(1.4, 0.6)

		this.runtime.audio.PlaySound("Punch_Kick")

		collideUnit.Trigger("Kicker_Func", this.uid)

		this.Trigger("Kick_Func")
	}

	//called from moveComp
	Kick_On_Solid_Hit() {
		this.lastCollideUid = null

		if (this.KickOnSolid_Feedbacks) {
			const feedbacks = this.KickOnSolid_Feedbacks
			if (feedbacks.SFX) {
				this.runtime.audio.PlaySound(feedbacks.SFX[0], feedbacks.SFX[1] || 1)
			}
			if (feedbacks.SS) {
				this.juice.SS_SetScale(feedbacks.SS[0], feedbacks.SS[1])
			}
			if (feedbacks.Shake) {
				this.runtime.camera.RotateShake()
			}
		}
	}

	PostCreate() {
		//
	}
}
