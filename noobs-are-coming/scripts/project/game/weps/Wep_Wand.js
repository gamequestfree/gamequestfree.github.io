export class Wep_Wand extends C4.Units.Weapon {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()

		this.OverrideData({
			AnimObject: "Wep_Wand",
			ITEM: {
				Synergies: "Ranged, Wizard",
			},
			VARS: {
				MAIN: {
					Cooldown: "0.4",
					Range: 98,
					Size_Affected: true,
				},
				WEP: {
					Is_Automatic: true,
					Beam: "No",
					Time_Preparation: 0,
				},
				HAND: {
					IsVisible: true,
					HandType: "Regular",
					MaxHoldDist: 10,
					AngleSpeed: 30,
					MoveSpeed: 5,
				},
			},

			BULLET: {
				DAMAGE: {
					Dmg: "5/10/15/20",
					"_StatBonus|Damage_Arcane": "100/120/140/160",
					Knockback: 3,
					Crit_Chance: 0,
				},
				VARS: {
					MAIN: {
						Speed: 400,
						Pierce: 0,
						Bounce_Solid: 0,
						Bounce_Enemy: 0,
					},
				},
			},
		})

		this.OverrideData({})
	}

	OnShoot() {
		this.PlaySound("Magic_Shot_1", 0.5)
	}
}
