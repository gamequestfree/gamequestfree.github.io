export class Funcs_DemoFull extends C4.Funcs {
	constructor() {
		super()
		this.data = {
			Playables: {
				Spider: (unit) => {
					unit.spiderComp = unit.AddComponent(C4.Compos.Compo_Spider, "Spider")

					unit.OverrideData({
						VARS: {
							MAIN: {
								WalkType: "Spider",
							},
						},
					})
				},
				Centilegs: (unit) => {
					const randPairs = 3 //Utils.randomInt(2, 6)

					unit.spiderComp = unit.AddComponent(C4.Compos.Compo_Spider, "Spider", {
						legsPairs: randPairs,
						legsSpread: Math.min(160, Utils.random(15, 40) * randPairs),
					})

					unit.spiderComp.randomFootDist = Utils.random(0.8, 2)

					unit.OverrideData({
						VARS: {
							MAIN: {
								WalkType: "Spider",
							},
						},
					})
				},
			},
		}
	}
}
