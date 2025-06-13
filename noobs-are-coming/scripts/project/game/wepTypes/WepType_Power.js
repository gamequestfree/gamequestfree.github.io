C4.Skill = class WepType_Power extends C4.Units.Weapon {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)

		this.powerAlone = true
	}

	SetInternals() {
		super.SetInternals()
		this.orbsUid = new Set()

		this.powerState = ""
	}

	DestroyUnit() {
		super.DestroyUnit()
		for (const uid of this.orbsUid) {
			const orb = this.runtime.getInstanceByUid(uid)
			if (orb) {
				orb.destroy()
			}
		}
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			VARS: {
				MAIN: {
					WepTrigger: "Skill",
				},
				WEP: {
					//
				},
				HAND: {
					HandType: "Inactive",
				},
			},
		})
	}

	get powerBar() {
		return this.player.powerBar
	}

	On_Wave_Start() {
		this.timerComp.Timer_Stop("Skill_Cooldown")
		this.timerComp.Timer_Start("Skill_Delay", Math.random(2), () => this.Skill_Cooldown_End())
	}

	/*
	On_EntitySet() {
		this.CreateOrb()
	}*/

	Skill_Cooldown_End(first = false) {
		if (!this.runtime.waveManager.isWaving) return
		this.CreateOrb()

		const cooldown = this.GetCooldown_Value()

		this.unit.timerComp.Timer_Start("Skill_Cooldown", cooldown, () => {
			this.Skill_Cooldown_End()
		})
	}

	CreateOrb() {
		if (this.orbsUid.size >= 3) return

		const orb = this.runtime.spawnManager.SpawnInstance("Orb", "Objects", 30)

		orb.powerUID = this.uid

		const orbAnim = Utils.createAnim(this.AnimObject, orb.x, orb.y)
		orbAnim.setSize(orb.width * 0.9, orb.height * 0.9)
		orbAnim.setPosition(orb.x, orb.y - orb.height / 2)

		orb.addChild(orbAnim, {
			transformX: true,
			transformY: true,
			transformHeight: true,
			transformWidth: true,
			destroyWithParent: true,
		})

		//!Todo fix race condition
		if (this.player) {
			const color = this.player.color_
			const colorRGB = this.runtime.colorUtils.ColorToRGBArray(color)
			const outline = orb.effects.find((effect) => effect.name == "BetterOutline" || effect.name == "Outline")
			outline.setParameter(0, colorRGB)
		} else {
			window.alert("Power.CreateOrb: this.player is undefined")
		}

		orb.playerIndex = this.player.playerIndex

		//orbAnim.colorRgb = colorRGB

		this.runtime.zOrder.LinkTo(orbAnim, orb, 1)

		this.orbsUid.add(orb.uid)

		orb.addEventListener("Orb_Skill_Activate", () => this.Skill_Activate(orb))

		orb.addEventListener("orb_wrongPlayer", () => this.WrongPlayer(orb))
	}

	WrongPlayer(orb) {
		//TODO feedback
	}

	Tick() {
		super.Tick()
		this.UpdateOrbs()
	}

	UpdateOrbs() {
		for (const uid of this.orbsUid) {
			const orb = this.runtime.getInstanceByUid(uid)
			if (orb) this.UpdateOrb(orb)
			else this.orbsUid.delete(uid)
		}
	}

	UpdateOrb(orb) {
		//
	}

	Skill_Activate(orb) {
		if (this.powerAlone && this.player.powerActiveAlone) {
			return
		}

		this.player.TriggerPlayerEvent("On_Pickup_PowerOrb")

		orb.destroy()

		this.Skill_Start()
	}

	Skill_Start() {
		this.powerState = "Start"
		this.player.powerActive = true
		this.player.powerActiveAlone = this.powerAlone
		//window.alert("powerActiveAlone: " + this.player.powerActiveAlone)
	}
	Skill_Execute() {
		this.powerState = "Execute"
	}

	Skill_End() {
		this.powerState = "Cooldown"
		this.player.powerActive = false
		this.player.powerActiveAlone = false
	}
}
