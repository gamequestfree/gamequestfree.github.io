C4.WepMelee = class WepType_Melee extends C4.Units.Weapon {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	SetData() {
		super.SetData()
		this.OverrideData({
			VARS: {
				MAIN: {
					WepTrigger: "Cooldown",
				},
				WEP: {
					ShootWhere: "Melee",
				},
				HAND: {
					HandType: "Melee_Tween",
					TweenMode: "Thrust",
				},
			},
		})
	}

	Init() {
		super.Init()
		this.SetDamage_Hitbox(this.data.DAMAGE)
	}
}
