export class Wep_NPC_Bow extends C4.Bow {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			AnimObject: "Wep_Bow",

			VARS: {
				MAIN: {
					IsPlayerATK: false,

					Range: 100,
					Cooldown: 2,
				},
				WEP: {
					//pattern
					Bullet_Count: 1,
					Bullet_Amount: "",
					Bullet_Spray: 30,
					Random_Spread: false,

					hasPlugCharge: true,
					Charge_AutomaticallyShoot: true,
					Time_Preparation: 0.5,

					Bullet_Outline: false,
				},
				HAND: {
					//
				},
			},

			BULLET: {
				BulletUnit: "Enemy",
				AnimObject: "Bullet_Arrow",
				DAMAGE: {
					Dmg: 1,
					Knockback: 2,
				},
				VARS: {
					MAIN: {
						Speed: 200,
						Pierce: 0,
						Bounce_Solid: 0,
					},
				},
			},
		})
	}
}
