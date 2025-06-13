const frozenColor = [0.365, 0.953, 0.996]
const goldenColor = [1, 0.918, 0]

export class Noob_Frozen extends C4.Chara_Noob {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()

		this.OverrideData({
			VARS: {
				MAIN: {
					AnimObject: "Anim_Default",

					Damage: 0,
					Damage_PerWave: 0,

					HP_Max: 10,
					HP_PerWave: 10,
					Speed_Walk: 0,
					Has_Healthbar: true,
					CanPseudo: false,

					WalkType: "No",
				},
			},
		})

		//*Kickable
		this.kickComp = this.AddComponent(C4.Compos.Compo_Kickable, "Kickable", {
			Kick_Enabled: true,
			KickDirection: "Move",
			DamageActivation: false,
			Kick_RandomAngleOffset: 20,
		})

		/*console.error("== Frozen kickComp will be dynamically", this.activateComps)
		console.error("Frozen kickComp", this.kickComp)
		console.error("Frozen moveComp", this.moveComp)*/
	}

	Init() {
		super.Init()

		this.AddTags("Ore")
		this.AddTags("Statue")

		this.frozenUnit = true

		this.outline.isActive = false

		/*const outline = Utils.World_GetEffect(this.anim, "Outline2")
		outline.isActive = true*/

		const Grayscale = Utils.World_GetEffect(this.anim, "Grayscale")
		Grayscale.isActive = true

		const Tint = Utils.World_GetEffect(this.anim, "Tint")
		Tint.isActive = true

		/*this.shineEffect = Utils.World_GetEffect(this.anim, "Shine")
		this.shineEffect.isActive = true

		this.Tween_Shine()*/
	}

	get frozenColor() {
		if (this.frozenType === "Frozen") {
			return frozenColor
		} else if (this.frozenType === "Golden") {
			return goldenColor
		}
		return frozenColor
	}

	Set_FrozenType(type) {
		this.frozenType = type

		const Tint = Utils.World_GetEffect(this.anim, "Tint")
		if (Tint) {
			Tint.setParameter(0, this.frozenColor)
			this.healthBar.Set_Color_Current(this.frozenColor)
		}

		if (this.frozenType === "Frozen") {
			this.runtime.audio.PlaySound("Frozen")

			this.kickComp.Kick_Speed = 280
			this.kickComp.Kick_Acc = -120
		}
		if (this.frozenType === "Golden") {
			this.runtime.audio.PlaySound("Golden")
			this.kickComp.Kick_Speed = 300
			this.kickComp.Kick_Acc = -120

			this.HP_Max = 100
			this.healthComp.SetCurrentToMax()
		}
	}

	OnDestroyed_Callback() {
		if (this.frozenType === "Frozen") {
			//this.runtime.audio.PlaySound("Frozen_Break")
		} else if (this.frozenType === "Golden") {
			//this.runtime.audio.PlaySound("Golden_Break")
			this.runtime.spawnManager.SpawnCoin(this.inst.x, this.inst.y, "Soul_Golden")
		}
	}

	On_Solid_Hit() {
		//
	}

	Kick_On_Solid_Hit() {
		let damageValue = this.healthComp.max * 0.5

		if (this.frozenType === "Frozen") {
			damageValue = this.healthComp.current
		}

		this.TakeDamage(damageValue)

		console.error("🧊🧊")
	}

	OnDestroyed_VFX() {
		this.runtime.camera.Screenshake({
			Mag: 1,
			Duration: 0.5,
		})

		this.runtime.audio.PlaySound("Glass_Break", 0.6)

		const fx_bloodsplosion = this.runtime.pool.CreateInstance("FX_Bloodsplosion_White", "Objects", this.inst.x, this.inst.y + 2)
		fx_bloodsplosion.animationFrame = 0
		fx_bloodsplosion.colorRgb = this.frozenColor
	}

	/*
	Tick() {
		super.Tick()

		if (this.tweenShine) {
			this.shineEffect.setParameter(4, this.tweenShine.value)

			Utils.debugText("shine effect " + this.tweenShine.value)
		}
	}*/

	/*Tween_Shine() {
		const tweenBeh = this.inst.behaviors["Tween"]

		this.tweenShine = tweenBeh.startTween("value", 100, 0.7, "out-sine", {
			pingPong: true,
			startValue: 0,
		})

		this.tweenShine.finished.then(() => {
			this.tweenShine = null
		})

		
		this.tweenShine.finished.then(() => {
			this.tweenShine = null

			
			this.timerComp.Timer_Start("Tween_Shine_Again", Utils.random(0.7, 1), () => {
				this.Tween_Shine()
			})
		})

		
	}*/
}
