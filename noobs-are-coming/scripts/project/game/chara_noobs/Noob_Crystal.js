export class Noob_Crystal extends C4.Chara_Noob {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()

		this.OverrideData({
			VARS: {
				MAIN: {
					Lvl: 7,

					HP_Max: 20,
					HP_PerWave: 6,
					Speed_Walk: 40,

					Damage: 0,
				},
			},
		})

		this.SetAbis({
			Crystal_Projectile: {
				Type: "Projectile",
				//specific
				ShootDirection: "Fixed",
				ShootFixedAngle: 45,

				Bullet_Count: 4,
				Bullet_Spray: 360,
				Random_Spread: false,

				BULLET: {
					DAMAGE: {
						Dmg: 4,
						Damage_Enemy: [
							[4, 1],
							[5, 10],
						],
						Knockback: 0,
					},
					VARS: {
						MAIN: {
							Speed: 100,
						},
					},
				},

				//shared
				Priority: 10,
				Range: -1,
				CanBeInterrupted: false,

				Timer_Cooldown: 3,
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

				onEnd: () => {},
			},
		})
	}
}
