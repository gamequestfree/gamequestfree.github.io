export class Noob_Mage extends C4.Chara_Noob {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()

		this.OverrideData({
			VARS: {
				MAIN: {
					Lvl: 4,

					HP_Max: 8,
					HP_PerWave: 5,
					Speed_Walk: 40,

					Damage: 0,
				},
			},
		})

		this.SetAbis({
			Mage_Projectile: {
				Type: "Projectile",
				//specific

				BULLET: {
					DAMAGE: {
						Dmg: 4,
						Damage_Enemy: [
							[3, 1],
							[5, 12],
							[7, 20],
						],
					},
					VARS: {
						MAIN: {
							Speed: 100,
						},
					},
				},

				//shared
				Priority: 10,
				Range: 100,
				CanBeInterrupted: false,

				Timer_Cooldown: 1,
				Timer_Prepare1: 0.5,
				Timer_Prepare2: 0.2,
				Timer_Execute: 0,
				Timer_Recover: 0.1,

				onStart: () => {
					this.juice.Shake()
					this.PlaySound("CuteMob_Prepare", 0.65, Utils.random(0.9, 1.1))
					this.OutlineStrong(true)
				},

				onExecute: () => {
					this.PlaySound("CuteMob_ATK_1", 0.65, Utils.random(0.9, 1.1))
					this.OutlineStrong(false)
				},

				onEnd: () => {},
			},

			Mage_RunAway: {
				Type: "Move_KeepDistance",

				Flee_KeepDist: 80,
				Flee_Margin: 20,

				Priority: 0,
			},
		})
	}
}
