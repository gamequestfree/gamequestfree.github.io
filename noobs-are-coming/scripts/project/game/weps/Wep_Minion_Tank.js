export class Wep_Minion_Tank extends C4.Units.Weapon {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			AnimObject: "Minion_Tank",
			WepAnimSize: 16,

			ITEM: {
				Synergies: "Minion, Protection",
				Evolutions: "1",
				Effects: {},
			},

			VARS: {
				MAIN: {
					WepTrigger: "WaveStart",

					Cooldown: 0,
				},
				WEP: {
					ShootWhere: "RandomInArea",
					ShootWhat: "Entity",
					ShootWhich: "Minion_Tank",
				},
				HAND: {
					HandType: "Inactive",
				},
			},

			BULLET: {
				DAMAGE: {
					No_Damage: true,
					Dmg: 0,
					Knockback: null,
				},
			},
		})
	}
}

export class Minion_Tank extends C4.Units.Character {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			AnimObject: "Minion_Tank",
			UnitTags: "Minion, Tank",

			VARS: {
				MAIN: {
					HP_Max: 100,
					HP_PerWave: 0,
					Damage: 0,

					IsEnemy: false,
					IsMinion: true,
					FollowTargetMove: false,
				},
			},
		})

		this.SetAbis({
			EndlessBounce: {
				Type: "Move_Rectiligne",
				//specific
				MovementType: "Recti_Random",
				Speed_Override: 50,

				//shared
				Priority: 10,
				Range: -1,
				CanBeInterrupted: false,

				Timer_Cooldown: 0,
				Timer_Prepare1: 0,
				Timer_Prepare2: 0,
				Timer_Execute: -2,
				Timer_Recover: 0,
			},
		})
	}
}
