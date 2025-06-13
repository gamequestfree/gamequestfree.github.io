export class Elite_Chevalier extends C4.Chara_Noob {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()

		this.OverrideData({
			VARS: {
				MAIN: {
					IsElite: true,
					Lvl: 8,

					HP_Max: 40,
					HP_PerWave: 15,
					Speed_Walk: "80-90",

					Damage: 8,
					Damage_Enemy: [
						[5, 1],
						[7, 10],
						[9, 20],
					],

					WalkType: "Jump",
					WalkJump_HeightMax: 5,
					WalkJump_AngleMax: 0,
					WalkJump_StepSS: false,
				},
			},
		})

		this.SetAbis({
			Rhino_Charge: {
				Type: "Move_Rectiligne",
				//specific
				MovementType: "Recti_Target",
				Speed_Override: 250,
				Recti_EndOnWall: true,

				//shared
				Priority: 10,
				Range: 100,
				CanBeInterrupted: false,

				Timer_Cooldown: "0.1-0.5",
				Timer_Prepare1: 0.5,
				Timer_Prepare2: 0.2,
				Timer_Execute: -2,
				Timer_Recover: 0,

				onStart: () => {
					this.juice.Shake()
					this.PlaySound("Dasher_Prepare", 1, Utils.random(0.9, 1.1))
					this.OutlineStrong(true)
				},

				onExecute: () => {
					//const atkSfx = "CuteMob_ATK_" + Utils.randomInt(6)
					const atkSfx = "Dasher_Dash_01"
					this.runtime.audio.PlaySound(atkSfx, 0.8)
					this.juice.SS_SetScale(1.4, 0.6)

					const rand = Math.random()
					if (rand < 0.2) {
						this.Bark("KnightLeeroy")
					} else {
						this.Bark("Knight")
					}
				},

				onEnd: () => {
					this.OutlineStrong(false)
					this.runtime.audio.PlaySound("Wall_Impact", 0.5)
					this.runtime.camera.RotateShake()
				},
			},
		})
	}
}
