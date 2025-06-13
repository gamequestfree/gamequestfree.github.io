export class Wep_Gun_Oblivion extends C4.Units.Weapon {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			AnimObject: "Wep_Gun_Oblivion",

			ITEM: {
				Synergies: "Ranged, Gun",
			},

			VARS: {
				MAIN: {
					Range: 95,
					Cooldown: "0.35",
					Cooldown_LowestMult: 0.45,
				},
				WEP: {
					Bullet_Count: 1,
					Bullet_Spray: 15,
					Random_Spread: true,
				},
				HAND: {
					Recoil_Angle: -5,
				},
			},

			BULLET: {
				AnimObject: "Bullet_Base_Player",
				DAMAGE: {
					Dmg: "3/4/5/6",
					"_StatBonus|Damage_Dex": "40/50/60/70",
					Knockback: 0,
				},
				VARS: {
					MAIN: {
						Speed: 600,
						Acceleration: 0,
						Knockback: 0,
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
		this.PlaySound("Wep_SMG", 0.3)
	}
}
