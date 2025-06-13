export class Wep_Minion_Spider extends C4.Units.Weapon {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			AnimObject: "Wep_Spider",

			ITEM: {
				Synergies: "Minion, Insectoid",
				Effects: {
					Desc_Redirects_ToPlayer: null,
				},
			},

			VARS: {
				MAIN: {
					WepTrigger: "WaveStart",
					Cooldown: 0,
					Size_Affected: true,
				},
				WEP: {
					ShootWhere: "RandomInArea",
					ShootWhat: "Entity",
					ShootWhich: "Minion_Spider",

					MinionHitbox: true,
					MinionInvulnerable: true,

					Bullet_Amount: "1:5/1:5/1:4/1:4",
				},
				HAND: {
					HandType: "Inactive",
				},
			},

			BULLET: {
				DAMAGE: {
					Dmg: "15/20/25/30",
					"_StatBonus|Damage_Minions": "100/120/150/200",
					Crit_Chance: 10,
					Knockback: 4,
				},
			},
		})
	}
}

export class Chara_Minion_Spider extends C4.Units.Character {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	InitAfterComponents() {
		super.InitAfterComponents()
		/*this.spiderComp.RandomizeSpider()
		this.spiderComp.GenerateLegs()*/
	}

	OnHurt() {
		super.OnHurt()
		//Utils.debugText("Spider hurt " + this.healthComp.current)
	}

	SetData() {
		super.SetData()
		this.spiderComp = this.AddComponent(C4.Compos.Compo_Spider, "Spider", {
			//
		})

		this.OverrideData({
			UnitTags: "Minion, Spider",
			AnimObject: "Anim_Spider",
			EnemyTags: [],
			TargetSummoner: true,

			VARS: {
				MAIN: {
					IsEnemy: false,
					IsMinion: true,

					HP_Max: 100,
					HP_PerWave: 0,
					Speed_Walk: "80-90",

					FollowTargetMove: true,
				},
			},
		})

		this.SetAbis({
			MoveRecti_ToPlayer: {
				Type: "Move_Rectiligne",
				//specific
				MovementType: "Recti_Target",
				Speed_Override: 140,
				Speed_Acceleration: 350,
				Speed_Max: 320,
				Recti_EndOnWall: true,

				//MovementType: "Follow",

				//shared
				Priority: 1,
				Range: -1,
				CanBeInterrupted: false,

				Timer_Cooldown: 0,
				Timer_Prepare1: 0.15,
				Timer_Prepare2: 0,
				Timer_Execute: "0.8-1",
				Timer_Recover: 0,

				onInit: () => {
					this.moveComp.onSolid = "Bounce"
					this.curAbi.Angle_Target = Math.random() * 360
				},

				onStart: () => {
					this.juice.Shake({})
					//this.runtime.audio.PlaySound("CuteMob_Prepare")
				},

				isPrepare1: () => {
					//
				},

				onExecute: () => {
					//this.juice.SS_SetScale(1.4, 0.6)

					this.curAbi.Follow_AngleSpeed = 0

					this.timerComp.Timer_Start("Abi_Following", 1, () => {
						this.curAbi.Follow_AngleSpeed = 0
					})
				},

				onRecover: () => {
					this.timerComp.Timer_Stop_ButExecute("Abi_Following")
				},

				isExecute: () => {
					//Utils.debugText("Spider " + this.curAbi.Follow_AngleSpeed + " " + this.moveComp.AngleOfMotion().toFixed(2))
				},
			},
		})
	}
}
