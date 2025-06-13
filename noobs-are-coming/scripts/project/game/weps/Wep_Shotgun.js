export class Wep_Shotgun extends C4.Units.Weapon {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			AnimObject: "Wep_Shotgun",

			ITEM: {
				Synergies: "Ranged, Gun",
			},

			VARS: {
				MAIN: {
					Range: 90,
					Cooldown: "1.37/1.26/1.2/1.2",
				},
				WEP: {
					Bullet_Count: "3/4/4/6",
					Bullet_Spray: 40,
					Random_Spread: true,
				},
				HAND: {
					Recoil_Angle: -5,
				},
			},

			BULLET: {
				AnimObject: "Bullet_Base_Player",
				DAMAGE: {
					Dmg: "3/6/9/9",
					"_StatBonus|Damage_Dex": "80/85/90/100",
					Knockback: 6,
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

						Pierce: "1/1/2/2",
						Bounce_Solid: 0,
						Bounce_Enemy: 0,
					},
				},
			},
		})
	}

	OnShoot() {
		this.PlaySound("Wep_Shotgun", 0.2)
	}
}
