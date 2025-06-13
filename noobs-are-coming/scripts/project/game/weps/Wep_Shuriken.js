export class Wep_Shuriken extends C4.Units.Weapon {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			AnimObject: "Wep_Shuriken",

			ITEM: {
				Synergies: "Ranged, Disk",
			},

			VARS: {
				MAIN: {
					Range: 90,
					Cooldown: "1.8/1.6/1.4/1.1",
					Size_Affected: true,
				},
				WEP: {
					Bullet_Count: 1,
					Bullet_Amount: "1:5",
					Bullet_Spray: 20,
					Random_Spread: true,
				},
				HAND: {
					Recoil_Angle: -5,
				},
			},

			BULLET: {
				BulletUnit: "Bullet_Disk",
				AnimObject: "Wep_Shuriken",
				DAMAGE: {
					Dmg: "5/10/15/20",
					"_StatBonus|Damage_Dex": 100,
					Knockback: 2,
				},
				VARS: {
					MAIN: {
						Speed: 300,
						AngleSpeed: 1400,
						Pierce: -3,
						Bounce_Solid: 2,
						Bounce_Enemy: 0,
					},
				},
			},
		})
	}
}
