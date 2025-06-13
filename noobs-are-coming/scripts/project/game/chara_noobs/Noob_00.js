export class Noob_1 extends C4.Chara_Noob {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}
	SetData() {
		super.SetData()
		this.OverrideData({
			VARS: {
				MAIN: {
					Lvl: 1,

					HP_Max: 2,
					HP_PerWave: 2.1,
					Speed_Walk: "30-35",

					Damage_Enemy: [
						[1, 1],
						[4, 10],
						[7, 20],
					],
				},
			},
		})
	}
}

export class Noob_Couette extends C4.Chara_Noob {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}
	SetData() {
		super.SetData()
		this.OverrideData({
			VARS: {
				MAIN: {
					Lvl: 1,

					HP_Max: 2,
					HP_PerWave: 3,
					Speed_Walk: "30-35",

					Damage_Enemy: [
						[1, 1],
						[4, 10],
						[7, 20],
					],
				},
			},
		})

		this.SetAbis({
			RectiRandomBounce: {
				Type: "Move_RectiRandom",
			},
		})
	}
}

export class Noob_2 extends C4.Chara_Noob {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}
	SetData() {
		super.SetData()
		this.OverrideData({
			VARS: {
				MAIN: {
					Lvl: 3,

					HP_Max: 5,
					HP_PerWave: 4.5,
					Speed_Walk: "40-50",

					Damage_Enemy: [
						[2, 1],
						[4, 10],
						[5, 11],
						[9, 20],
					],
				},
			},
		})
	}
}

export class Noob_3 extends C4.Chara_Noob {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}
	SetData() {
		super.SetData()
		this.OverrideData({
			VARS: {
				MAIN: {
					Lvl: 5,

					HP_Max: 5,
					HP_PerWave: 6,
					Speed_Walk: "50-60",

					Damage_Enemy: [
						[5, 1],
						[6, 10],
						[11, 20],
					],
				},
			},
		})
	}
}
