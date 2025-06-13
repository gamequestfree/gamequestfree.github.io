export class Skill_Impact extends C4.Skill {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			AnimObject: "Skill_Impact",

			ITEM: {
				Synergies: "Upgradable, Skill, Heavy",
				Evolutions: "0-3",
				Effects: null,
				//RareATK: true,
			},

			VARS: {
				MAIN: {
					WepTrigger: "Skill",
					Duration: 1,
					Range: -1,
					Cooldown: "4.6",
					Size_Affected: true,
				},
				WEP: {
					ShootWhere: "BBoxBottom",
					ShootWhat: "Bullet",

					Bullet_Outline: false,
				},
				HAND: {
					//
				},
			},

			BULLET: {
				AnimObject: "FX_AirStrike_Impact",
				DAMAGE: {
					Dmg: "20/30/40/50",
					"_StatBonus|Damage_Strength": "100/120/140/160",
					Knockback: 20,

					Angle_Hit: "FromEntity",
				},
				VARS: {
					MAIN: {
						JustHitbox: true,
						Lifetime: 0.6,
					},
				},
			},
		})
	}

	Skill_Start() {
		super.Skill_Start()
		// barre indique le temps avant Impact/avant prochain Dash

		let timeScaleJump = 1

		if (this.runtime.singlePlayer) {
			timeScaleJump = 0.15
		}

		this.runtime.main.Set_Timescale(timeScaleJump)

		const charaUnit = this.unitChara

		charaUnit.SetUnitVisible(false)

		charaUnit.shadow.setSize(50, 20)

		charaUnit.speedMult = 1.5 / timeScaleJump

		this.PlaySound("Skill_Impact_Start")

		const fxInst = Utils.createFX("FX_AirStrike_Call", charaUnit.x, charaUnit.y)
		fxInst.timeScale = 1

		//window.alert("Skill_Impact " + unitChara.x + " " + unitChara.y)

		this.timerComp.Timer_Start("Skill_Execute", this.GetDuration_Value() * timeScaleJump, () => {
			this.Skill_Execute()
		})

		this.timerComp.MapBar(this.powerBar, "Skill_Execute")
	}

	On_Wave_End() {
		super.On_Wave_End()

		if (this.timerComp.Timer_Get("Skill_Execute")) {
			this.Skill_End()
		}
	}

	Skill_Execute() {
		super.Skill_Execute()

		this.timerComp.Timer_Stop("Skill_Execute")

		this.PlaySound("Skill_Impact_Execute")

		const charaUnit = this.unitChara

		charaUnit.speedMult = 1

		charaUnit.moveComp.Set_Speed(0)

		charaUnit.SetUnitVisible(true)

		this.runtime.camera.Screenshake({
			Mag: [1, 5],
		})

		this.runtime.main.Set_Timescale(1)

		this.Shoot(true)

		this.Skill_End()
	}

	Skill_End() {
		super.Skill_End()

		this.runtime.main.Set_Timescale(1)
	}
}
