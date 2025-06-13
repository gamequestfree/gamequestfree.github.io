C4.Units.AnimOnly = class AnimOnly extends C4.Unit {
	static unitType = "AnimOnly"
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	//*========== CONFIG ====================

	SetData() {
		super.SetData()

		this.AnimLayer = this.inst?.layer?.name

		this.ShadowLayer = "Shadows_BG0"
		if (this.AnimLayer === "Objects") {
			this.ShadowLayer = "Shadows"
		}

		this.NoSeperateAnim = true

		if (this.dataLoaded.moveComp) {
			this.moveComp = this.AddComponent(C4.Compos.Compo_Move, "Move")
		}

		this.SetVars_Default({})
	}

	ReleaseUnit() {
		this.moveComp = null
		if (this.shadow) {
			this.shadow.destroy()
			this.shadow = null
		}
	}

	SetAnimObject() {
		super.SetAnimObject()

		const replaces = ["Anim", "Elite", "Hero", "Boss", "Play", "Noob"]
		this.charaName = this.AnimObject
		for (const replace of replaces) {
			this.charaName = this.charaName.replace(replace + "_", "")
			this.charaName = this.charaName.replace("_FullBody", "")
		}
	}

	Init() {
		//*Anim

		this.OnCreated()

		const random = Math.random()

		this.juice.Sine_Start("Height", 1, random, 5)
		this.juice.Sine_Start("Width", 1, random + 0.5, 5)
	}

	Tick() {
		if (this.shadow) {
			this.shadow.setSize(this.inst.width * 1, this.inst.width * 0.4)
		}
	}

	OnCreated() {
		//add shadow

		this.shadow = this.runtime.pool.CreateInstance("Shadow", this.ShadowLayer, this.inst.x, this.inst.y)
		this.shadow.opacity = 0.5
		this.inst.addChild(this.shadow, {
			transformX: true,
			transformY: true,
			destroyWithParent: true,
		})

		//add test

		/*this.textLvl = this.runtime.pool.CreateInstance("Text_Game", "Objects", this.inst.x, this.inst.y - 35)
		const random = Utils.randomInt(1, 20)
		this.textLvl.text = `[outlineback=#000000][color=#3cff00][lineThickness=5]Lvl.3[/outlineback][/color][/lineThickness]
        `

		this.inst.addChild(this.textLvl, {
			transformX: true,
			transformY: true,
			destroyWithParent: true
		})*/
	}

	OnDestroyed_VFX() {
		this.runtime.camera.Screenshake({
			Mag: 1,
			Duration: 0.5,
		})

		const sfxDeath = Utils.choose("Chara_Death_01", "Chara_Death_02", "Chara_Death_03")
		this.runtime.audio.PlaySound(sfxDeath, 0.4)
		//this.runtime.audio.PlaySound("Chara_LightDeath_0" + Utils.randomInt(3) + 1)

		const fx_bloodsplosion = this.runtime.pool.CreateInstance("FX_Bloodsplosion", this.AnimLayer, this.inst.x, this.inst.y + 2)
		fx_bloodsplosion.animationFrame = 0

		const fx_blood_ground = this.runtime.pool.CreateInstance("FX_Blood", "Shadows_BG0", fx_bloodsplosion.x, fx_bloodsplosion.y)
		fx_blood_ground.animationFrame = Utils.randomInt(0, 3)
		fx_blood_ground.behaviors["Fade"].restartFade()

		const fx_poof = this.runtime.pool.CreateInstance("FX_ParticlePoof", this.AnimLayer, fx_bloodsplosion.x, fx_bloodsplosion.y)
		fx_poof.setAnimation("Poof")
		fx_poof.animationFrame = 0

		const textImpact = Utils.choose("ouch", "uggh", "argh")
		let textImpactInst = this.runtime.pointburst.Create_SF_TextImpact(textImpact, "Red", fx_bloodsplosion.x, fx_bloodsplosion.y)
		Utils.World_SetLayer(textImpactInst, this.AnimLayer)

		//*coupure

		const fx_coupure = this.runtime.pool.CreateInstance("FX_Coupure_Red", this.AnimLayer, this.bboxMidX, this.bboxMidY)
		fx_coupure.angleDegrees = Utils.random(360)

		const atkSfx = "PunchHit" + Utils.randomInt(2)
		this.runtime.audio.PlaySound(atkSfx, 0.6, Utils.random(0.8, 1.2))

		this.DestroyUnit()
	}

	AnimTopY() {
		const bbox = this.inst.getBoundingBox()
		return bbox.top
	}

	Bark_Hero() {
		this.Bark(this.charaName)
	}

	Bark(barkType, args = {}) {
		const barkKeys = this.runtime.translation.barkMap[barkType]
		const key = Utils.Array_Random(barkKeys)

		if (!key) return false

		let text = this.runtime.translation.Get(key)

		const prevBark = Utils.World_GetChild(this.inst, "Text_Bark")
		if (prevBark) {
			prevBark.destroy()
		}

		let textBark = null

		textBark = this.runtime.pool.CreateInstance("Text_Bark", this.AnimLayer, this.inst.x, this.AnimTopY() - 20)

		textBark.width = 200

		this.inst.addChild(textBark, {
			transformX: true,
			transformY: true,
			destroyWithParent: true,
		})

		//text = "[outlineback=#000000][lineThickness=4] " + text + " "
		text = "[background=#000000] " + text + " "

		textBark.text = text

		if (args.textStyle) {
			Utils.TextC3(textBark, args.textStyle)
		}

		let barkDuration = args.duration || 1.5

		this.timerComp.Timer_Start("Bark_Duration", barkDuration, () => {
			textBark.behaviors["Fade"].waitTime = 0
		})

		return true
	}
}
