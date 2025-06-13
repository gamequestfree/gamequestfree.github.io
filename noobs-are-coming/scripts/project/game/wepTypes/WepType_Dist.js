C4.WepDist = class WepType_Dist extends C4.Units.Weapon {
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
					ShootWhere: "Hitbox",
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
	}

	GetWepInfo_Text() {
		//
	}
}
