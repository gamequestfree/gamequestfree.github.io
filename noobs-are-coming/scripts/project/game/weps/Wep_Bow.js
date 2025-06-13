export class Wep_Bow extends C4.Bow {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			AnimObject: "Wep_Bow",

			ITEM: {
				Synergies: "Ranged, Bow",
				Effects: null,
			},

			VARS: {
				MAIN: {
					Range: 100,
					Cooldown: "1/0.9/0.8/0.7",
					Size_Affected: true,
				},
				WEP: {
					//pattern
					Bullet_Count: "1/1/2/3",
					Bullet_Amount: "1:4",
					Bullet_Spray: 30,
					Random_Spread: false,

					hasPlugCharge: true,
					Charge_AutomaticallyShoot: true,
					Time_Preparation: 0.5,
				},
				HAND: {
					//
				},
			},

			BULLET: {
				AnimObject: "Bullet_Arrow",
				DAMAGE: {
					Dmg: "10/13/16/20",
					"_StatBonus|Damage_Dex": "80",
					"_StatBonus|Range": "20",
					Knockback: 2,
					Crit_Chance: 0,
				},
				VARS: {
					MAIN: {
						Speed: 400,
						Pierce: "1/2/3/4",

						Bounce_Solid: 1,
						Bounce_Enemy: 0,
					},
				},
			},
		})
	}
}
