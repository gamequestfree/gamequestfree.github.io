export class Wep_Minion_Base extends C4.Units.Weapon {
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
				},
				HAND: {
					pivotImagePoint: "Wep",
					MaxHoldDist: 0,
				},
			},

			BULLET: {
				BulletUnit: "Player",
				AnimObject: "Bullet_Base_Player",
				DAMAGE: {
					Dmg: 1,
					Knockback: 2,
				},
				VARS: {
					MAIN: {
						Speed: 200,
						Pierce: -1,
						Bounce_Solid: -1,
						Bounce_Enemy: -1,
					},
				},
			},
		})
	}
}
