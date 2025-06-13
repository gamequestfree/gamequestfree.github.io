export class Skill_Ball extends C4.Skill {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			AnimObject: "Skill_Ball",

			ITEM: {
				Synergies: "Upgradable, Skill, Ball",
				Evolutions: "0-3",
				Effects: null,
			},

			VARS: {
				MAIN: {
					WepTrigger: "Skill",
					Duration: 2,
					Range: -1,
					Cooldown: "8/7/7/6.5",
					Size_Affected: true,
				},
				WEP: {
					ShootWhere: "BBoxBottom",
					Bullet_Outline: true,
				},
				HAND: {
					//
				},
			},

			BULLET: {
				AnimObject: "Bullet_BallRoll",
				DAMAGE: {
					Dmg: "10/15/20/25",
					"_StatBonus|Damage_Strength": "80/85/90/100",
					Knockback: 10,

					Angle_Hit: "Random",
				},
				VARS: {
					MAIN: {
						JustHitbox: true,
					},
				},
			},
		})

		this.onSolidHit = this.On_Solid_Hit.bind(this)
	}

	Tick() {
		super.Tick()

		if (this.ballBullet) {
			if (this.ballBullet?.inst) {
				this.ballBullet.anim.angleDegrees += 1000 * this.inst.dt * this.unitChara.mirroredMod
			} else {
				console.error("Ball Bullet is missing inst")
				window.alert("Ball Bullet is missing inst")
			}

			//Utils.debugText("Angle_Hit " + this.ballBullet.Damage.Angle_Hit)
		}
	}

	On_Solid_Hit() {
		//this.PlaySound("Skill_Ball_HitWall")
		this.runtime.audio.PlaySound("Wall_Impact", 0.6)
		this.runtime.camera.RotateShake()
	}

	Skill_Start() {
		console.error("Ball Bullet Skill_Start")

		super.Skill_Start()
		this.Skill_Execute()
		// barre indique le temps avant Impact/avant prochain Dash
		const charaUnit = this.unitChara

		charaUnit.SetUnitVisible(false)
		charaUnit.speedMult = 2.5

		//charaUnit.Speed_Override = 200

		this.Shoot(true)

		this.timerComp.Timer_Start("Skill_Execute", this.GetDuration_Value(), () => {
			this.Skill_End()
		})

		this.timerComp.MapBar(this.powerBar, "Skill_Execute")

		charaUnit.moveComp.SetOnSolid("Bounce")

		this.player.forceMove = true

		const newAngle = charaUnit.moveComp.AngleOfMotion() + Utils.choose(-1, 1) * Utils.random(5, 10)

		charaUnit.moveComp.Set_AngleOfMotion(newAngle)
		charaUnit.charaComp.Set_TargetXY_ByAngle("origin", newAngle, 50)

		this.player.inst.addEventListener("On_Solid_Hit", this.onSolidHit)
	}

	OnBulletSpawn(bulletUnit) {
		this.ball_UID = bulletUnit.uid
		this.unitChara.inst.addChild(bulletUnit.inst, {
			transformX: true,
			transformY: true,
			destroyWithParent: true,
		})

		bulletUnit.inst.y -= bulletUnit.inst.height / 2

		//bulletUnit.SetOutline(this.player.color_)

		console.error("Ball Bullet spawned")
	}

	get ballBullet() {
		return this.runtime.getUnitByUID(this.ball_UID)
	}

	On_Wave_End() {
		super.On_Wave_End()

		if (this.timerComp.Timer_Get("Skill_Execute")) {
			this.Skill_End()
		}
	}

	Skill_End() {
		super.Skill_End()

		this.timerComp.Timer_Stop("Skill_Execute")

		this.PlaySound("Skill_Impact_Execute")
		const charaUnit = this.unitChara

		if (this.ballBullet) {
			this.ballBullet.CallDestroy("Skill_Ball")
			this.ball_UID = 0
		}

		charaUnit.speedMult = 1
		//charaUnit.Speed_Override = null

		charaUnit.Knockback_Shockwave(75, 12)

		charaUnit.SetUnitVisible(true)

		this.player.forceMove = false

		this.player.inst.removeEventListener("On_Solid_Hit", this.onSolidHit)

		this.unitChara.juice.Roll()
	}
}
