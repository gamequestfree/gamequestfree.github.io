//!todo
export class Noob_Buffer extends C4.Chara_Noob {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			VARS: {
				MAIN: {
					Lvl: 5,

					HP_Max: 20,
					HP_PerWave: 5,
					Speed_Walk: 50,

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
							Speed: 110,
						},
					},
				},

				//shared
				Priority: 10,
				Range: 120,
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

				onEnd: () => {
					//this.brainComp.Brain_Abi_Start("Mage_Dash_Runaway")
				},
			},

			/*Mage_Dash_Runaway: {
				Type: "Dash",
				//spec
				Dash_Ease: "in-sine",
				Dash_Distance: 100,
				Dash_RandomDirection: true,
				Timer_Execute: 0.3,

				//shared
				Priority: -1,
				Range: -1,
				CanBeInterrupted: false,

				Timer_Cooldown: 0,
				Timer_Prepare1: 0,
				Timer_Prepare2: 0,
				Timer_Recover: 0,

				onStart: () => {
					this.juice.Shake()
					this.PlaySound("CuteMob_Prepare", 0.5, Utils.random(0.9, 1.1))
					this.OutlineStrong(true)
				},

				onExecute: () => {
					const atkSfx = "CuteMob_ATK_" + Utils.randomInt(6)
					this.runtime.audio.PlaySound(atkSfx)
					this.juice.SS_SetScale(1.4, 0.6)
				},

				onEnd: () => {
					this.OutlineStrong(false)
				},

				onWallImpact: () => {
					this.runtime.audio.PlaySound("Wall_Impact", 0.5)
					this.runtime.camera.RotateShake()
				},
			},*/

			Mage_RunAway: {
				Type: "Move_KeepDistance",

				Flee_KeepDist: 100,
				Flee_Margin: 20,

				Priority: 0,
			},
		})
	}
}
