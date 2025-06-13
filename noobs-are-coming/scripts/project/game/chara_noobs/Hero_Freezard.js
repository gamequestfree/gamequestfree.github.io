export class Hero_Freezard extends C4.Chara_HeroMain {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			VARS: {
				MAIN: {
					//
				},
			},
		})
	}

	Init() {
		super.Init()

		this.SetAbis({
			Flee: {
				Type: "Move_KeepDistance",
				Flee_KeepDist: 120,
				Flee_Margin: 40,

				CanBeInterrupted: true,
			},
			Boss_Freeze: {
				Type: "Custom",

				//shared
				Priority: 10,
				Range: -1,
				CanBeInterrupted: false,

				Timer_Cooldown: 7,
				Timer_Prepare1: 0.5,
				Timer_Prepare2: 0.2,
				Timer_Execute: 0,
				Timer_Recover: 0.5,

				onStart: () => {
					this.juice.Shake()
					this.PlaySound("CuteMob_Prepare", 0.65, Utils.random(0.9, 1.1))
					this.OutlineStrong(true)
				},

				onExecute: () => {
					this.PlaySound("CuteMob_ATK_1", 0.65, Utils.random(0.9, 1.1))
					this.juice.SS_SetScale(1.4, 0.6)

					this.Bark("Freezard")

					this.Freeze_Minions()
				},

				onEnd: () => {
					this.OutlineStrong(false)
				},
			},
			CrossLines: {
				Type: "Projectile",
				//specific
				ShootDirection: "Fixed",
				ShootFixedAngle: 45,

				Bullet_Unit: "GroundLine",

				Bullet_Count: 4,
				Bullet_Spray: 360,
				Random_Spread: false,

				BULLET: {
					DAMAGE: {
						Damage: 4,
						Damage_Enemy: [
							[4, 1],
							[5, 10],
						],
						Knockback: 0,
					},
					VARS: {
						MAIN: {
							Speed: 300,
						},
					},
				},

				//shared
				Priority: 11,
				Range: -1,
				CanBeInterrupted: false,

				Timer_Cooldown: 6,
				Timer_Prepare1: 0.5,
				Timer_Prepare2: 0,
				Timer_Execute: 0,
				Timer_Recover: 0.3,

				onStart: () => {
					this.juice.Shake()
					this.PlaySound("CuteMob_Prepare", 0.65, Utils.random(0.9, 1.1))
					this.OutlineStrong(true)
				},

				onExecute: () => {
					this.PlaySound("CuteMob_ATK_1", 0.65, Utils.random(0.9, 1.1))
					this.OutlineStrong(false)
				},

				onBulletSpawn: (bulletUnit) => {
					bulletUnit.ground_decoObj = "GroundLine_Ice"

					//!Debug Test doesn't work
					/*this.runtime.spawnManager.SpawnChara("Noob_Couette")
					this.timerComp.Timer_Start("DebugTest", 0.5, () => {
						this.OnDestroyed()
						this.runtime.spawnManager.SpawnChara("Noob_Couette")
					})*/
				},
			},
		})
	}

	Freeze_Minions() {
		const damageData = {
			No_Damage: true,
			DmgEffects: {
				Freeze_Ice: {},
			},
		}

		let allEnemies = this.runtime.units.GetUnitsByTags("Enemy", "Chara")
		allEnemies.filter((enemy) => !enemy.IsElite)
		const enemies = Utils.Array_Random(allEnemies, 2)

		for (const enemy of enemies) {
			enemy.TakeDamage(damageData)
		}

		/*
		const minions = this.runtime.units.GetUnitsByTags("Minion", "Chara")

		const randMinion = Utils.Array_Random(minions)

		if (randMinion) {
			randMinion.TakeDamage(damageData)
		}*/
	}
}
