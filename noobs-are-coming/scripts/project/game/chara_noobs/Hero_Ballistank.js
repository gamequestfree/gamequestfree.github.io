export class Hero_Ballistank extends C4.Chara_HeroMain {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	Init() {
		super.Init()

		this.runtime.spawnManager.SpawnChara("Siege_Ballista")
		this.runtime.spawnManager.SpawnChara("Siege_Ballista")
	}

	SetData() {
		super.SetData()

		this.OverrideData({
			VARS: {
				MAIN: {
					Speed_Walk: "50",

					HP_HeroScale: 1,
				},
			},
		})

		this.SetAbis({
			Dash: {
				Type: "Dash",
				//spec
				Dash_Ease: "in-sine",
				Dash_Distance: 200,
				Timer_Execute: 0.4,

				//shared
				Priority: 10,
				Range: 130,
				CanBeInterrupted: false,

				Timer_Cooldown: "2",
				Timer_Prepare1: 0.5,
				Timer_Prepare2: 0.1,
				Timer_Recover: 0.4,

				onStart: () => {
					this.juice.Shake()
					this.PlaySound("CuteMob_Prepare", 0.5, Utils.random(0.9, 1.1))
					this.OutlineStrong(true)
				},

				onExecute: () => {
					const atkSfx = "CuteMob_ATK_" + Utils.randomInt(6)
					this.runtime.audio.PlaySound(atkSfx)
					this.juice.SS_SetScale(1.4, 0.6)
				},

				onEnd: () => {
					this.OutlineStrong(false)
				},

				onWallImpact: () => {
					this.runtime.audio.PlaySound("Wall_Impact", 0.5)
					this.runtime.camera.RotateShake()
				},
			},
		})
	}
}

export class Siege_Ballista extends C4.Chara_Noob {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()

		this.ballistaRange = 90

		this.OverrideData({
			AnimObject: "Wep_Ballista_Base",
			UnitTags: ["Turret"],
			VARS: {
				MAIN: {
					IsElite: true,

					HP_Max: 300,
					HP_PerWave: 0,

					Speed_Walk: 0,

					WalkType: "Sine",

					CanPseudo: false,
					FollowTargetMove: false,
					Knockback_Mult: 0.4,
					Circle_Range: this.ballistaRange,
				},
			},
		})
	}

	Init() {
		super.Init()

		this.SetWeapon("Wep_NPC_Bow", 0, {
			AnimObject: "Wep_Bow_Ballista",
			VARS: {
				MAIN: {
					AutoShoot: true,

					Range: this.ballistaRange,
					Cooldown: 0,
				},
				WEP: {
					//pattern
					Bullet_Count: 1,
					Bullet_Spray: 30,
					Random_Spread: false,

					hasPlugCharge: true,
					Charge_AutomaticallyShoot: true,
					Time_Preparation: 0.45,
				},
				HAND: {
					pivotImagePoint: "Wep",
					MaxHoldDist: 0,
				},
			},

			BULLET: {
				BulletUnit: "Enemy",
				AnimObject: "Bullet_Arrow_Enemy",
				DAMAGE: {
					Damage_Enemy: [
						[3, 1],
						[5, 12],
					],
					Knockback: -1,
				},
				VARS: {
					MAIN: {
						Speed: 220,
						Pierce: 0,
						Bounce_Solid: 1,
					},
				},
			},
		})

		this.OutlineStrong(true)
		this.wepActive.SetOutline([1, 0, 0])
	}
}
