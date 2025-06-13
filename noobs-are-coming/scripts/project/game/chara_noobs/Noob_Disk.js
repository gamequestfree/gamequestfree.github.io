export class Noob_Crystal extends C4.Chara_Noob {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()

		this.OverrideData({
			VARS: {
				MAIN: {
					Lvl: 1,

					HP_Max: 2,
					HP_PerWave: 3,
					Speed_Walk: "30-35",

					Damage_Enemy: [
						[1, 1],
						[4, 10],
						[7, 20],
					],
				},
			},
		})

		//! 2 Abis
		this.SetAbis({
			RectiRandomBounce: {
				Type: "Move_RectiRandom",
			},

			Disk_Projectile: {
				Type: "Projectile",

				//specific
				ShootDirection: "Random",
				Bullet_Count: 1,

				BULLET: {
					Bullet_Unit: "Projectile",
					DAMAGE: {
						Dmg: 3,
						Dmg_PerWave: 0.6,
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
			},
		})
	}
}
