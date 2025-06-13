//! TANK 🧢🧢🧢
export class Hero_Trinity_Tank extends C4.Chara_HeroMain {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			VARS: {
				MAIN: {
					Speed_Walk: "80-90",

					WalkType: "Jump",
					WalkJump_HeightMax: 5,

					Knockback_Mult: 0.3,

					HP_HeroScale: 0.8,
				},
			},
		})

		this.heroFriends = ["Hero_Trinity_DPS", "Hero_Trinity_Healer"]
	}

	Init() {
		super.Init()

		this.unit.timerComp.Timer_Start_Repeat("Spam", "5-8", () => {
			this.Bark("Tank")
		})
	}
}

//! HEALER ✅✅✅
export class Hero_Trinity_Healer extends C4.Chara_Hero {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			VARS: {
				MAIN: {
					HP_HeroScale: 0.5,
				},
			},
		})
	}

	Init() {
		super.Init()

		this.unit.timerComp.Timer_Start_Repeat("Spam", "5-8", () => {
			this.Bark("Healer")
		})

		this.SetAbis({
			Flee: {
				Type: "Move_KeepDistance",
				Flee_KeepDist: 150,

				Priority: 0,
				Range: -1,
				CanBeInterrupted: true,
			},

			Heal_Heroes: {
				Type: "Custom",

				//shared
				Priority: 10,
				Range: -1,
				CanBeInterrupted: false,

				Timer_Cooldown: "5-6",
				Timer_Prepare1: 0.5,
				Timer_Prepare2: 0,
				Timer_Execute: 0,
				Timer_Recover: 0.5,

				onStart: () => {
					this.juice.Shake()
					this.PlaySound("Femme2_Prepare_Throat_01", 1, Utils.random(0.9, 1.1))
					this.OutlineStrong(true)
				},

				onExecute: () => {
					this.runtime.audio.PlaySound("Femme2_Reflexion_Aaah", 0.8)
					this.juice.SS_SetScale(1.4, 0.6)

					this.Heal_Heroes()
				},

				onEnd: () => {
					this.OutlineStrong(false)
				},
			},
		})
	}

	Heal_Heroes() {
		const heroes = this.runtime.units.GetUnitsByTags(["Hero"], "Chara")

		//remove itself

		for (const heroUnit of heroes) {
			const healValue = Math.round(heroUnit.healthComp.max * 0.1)
			heroUnit.Heal(healValue)
		}
	}
}

//! DPS 🩸🩸🩸
export class Hero_Trinity_DPS extends C4.Chara_Hero {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			VARS: {
				MAIN: {
					HP_HeroScale: 0.5,
				},
			},
		})
	}

	Init() {
		super.Init()

		this.unit.timerComp.Timer_Start_Repeat("Spam", "5-8", () => {
			this.Bark("DPS")
		})

		this.SetAbis({
			Flee: {
				Type: "Move_KeepDistance",
				Flee_KeepDist: 100,
				KeepDist_TurnAround: true,

				//shared
				Priority: 0,
				Range: -1,
				CanBeInterrupted: true,
			},
		})

		this.SetWeapon("Wep_NPC_Base", 0, {
			AnimObject: "Wep_Default",
			VARS: {
				MAIN: {
					AutoShoot: true,

					Range: 130,
					Cooldown: 4,
				},
				WEP: {
					WepTrigger: "Range",
					//pattern
					Bullet_Count: 1,
					Bullet_Spray: 30,
					Random_Spread: false,
				},
				HAND: {
					pivotImagePoint: "Wep",
					MaxHoldDist: 0,

					HandType: "Invisible",
				},
			},

			BULLET: {
				BulletUnit: "Enemy",
				AnimObject: "Bullet_Knife",
				DAMAGE: {
					Damage: 4,
					Knockback: 0,
				},
				VARS: {
					MAIN: {
						Speed: 170,
						Pierce: 0,
					},
				},
			},
		})

		this.wepActive.OnShoot = () => {
			this.juice.Roll()
		}
	}
}
