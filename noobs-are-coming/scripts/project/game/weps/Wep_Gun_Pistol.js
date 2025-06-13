export class Wep_Gun_Pistol extends C4.Units.Weapon {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			AnimObject: "Wep_Gun_Pistol",

			ITEM: {
				Synergies: "Ranged, Gun",
			},

			VARS: {
				MAIN: {
					Range: 100,
					Cooldown: "1.2/1.1/1/0.9",
					Size_Affected: true,
				},
				WEP: {
					Bullet_Count: 1,
					Bullet_Spray: 0,
					Random_Spread: true,
				},
				HAND: {
					Recoil_Angle: -5,
				},
			},

			BULLET: {
				AnimObject: "Bullet_Base_Player",
				DAMAGE: {
					Dmg: "10/20/30/50",
					"_StatBonus|Damage_Dex": 100,
					Knockback: 8,
				},
				VARS: {
					MAIN: {
						Speed: 600,
						Acceleration: 0,
						AngleSpeed: 0,
						MaxDistance: 0,
						Lifetime: 0,
						OnMaxDistance: "Destroy",
						SlowOnLifetime: false,
						DestroyOnStop: true,

						Pierce: "0",
						Bounce_Solid: 0,
						Bounce_Enemy: 0,
					},
				},
			},
		})
	}

	OnShoot() {
		this.PlaySound("Wep_Pistol", 0.25)
	}
}
