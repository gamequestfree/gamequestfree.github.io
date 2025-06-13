const sineObjects = {
	Light: {
		Opacity: {
			period: [8, 12],
			mag: [16, 24],
			randInitCycle: true,
		},
		Height: {
			period: [8, 12],
			mag: [8, 12],
			randInitCycle: true,
		},
	},
	Particle: {
		Opacity: {
			period: [3, 4],
			mag: [20, 40],
			randInitCycle: true,
		},
		Horizontal: {
			period: [20, 50],
			mag: [5, 50],
			randInitCycle: true,
		},
		Vertical: {
			period: [20, 50],
			mag: [5, 50],
			randInitCycle: true,
		},
	},
	Chain_NoLoop: {
		Horizontal: {
			period: [10, 20],
			mag: [1, 2],
			randInitCycle: true,
		},
		Vertical: {
			period: [10, 20],
			mag: [1, 2],
			randInitCycle: true,
		},
	},
}

export class Sine_Manager {
	constructor(runtime) {
		this._motions = new Map()

		this.runtime = runtime

		this.runtime.addEventListener("beforeanylayoutend", () => {
			this.OnBeforeLayoutEnd()
		})

		this.runtime.addEventListener("tick", () => {
			this.Tick()
		})
	}

	Init_Sine_ObjectTypes() {
		for (const [objectName, sinesData] of Object.entries(sineObjects)) {
			this.runtime.objects[objectName].addEventListener("instancecreate", (e) => {
				this.OnInstanceCreate(e.instance, sinesData)
			})
			this.runtime.objects[objectName].addEventListener("instancedestroy", (e) => {
				this.OnInstanceDestroy(e.instance)
			})
		}
	}

	OnInstanceCreate(inst, sinesData) {
		const motions = []

		for (const [propName, cfg] of Object.entries(sinesData)) {
			// pick a random period & magnitude in their configured ranges
			const period = cfg.period[0] + Math.random() * (cfg.period[1] - cfg.period[0])
			const mag = cfg.mag[0] + Math.random() * (cfg.mag[1] - cfg.mag[0])
			const offsetPct = cfg.randInitCycle ? Math.random() : 0

			// create the sine motion
			const sine = new C4.Sine(propName, period, offsetPct, mag)

			motions.push(sine)
		}

		this._motions.set(inst, motions)
	}

	OnInstanceDestroy(inst) {
		this._motions.delete(inst)
	}

	OnBeforeLayoutEnd() {
		this._motions.clear()
	}

	Tick() {
		for (const [inst, motions] of this._motions.entries()) {
			const dt = inst.dt // in seconds

			for (const sine of motions) {
				const delta = sine.Sine_TickDelta(dt)

				switch (sine.prop) {
					case "Horizontal":
						inst.x += delta
						break
					case "Vertical":
						inst.y += delta
						break
					case "Angle":
						inst.angle += delta
						break
					case "Height":
						inst.height += delta
						break
					case "Width":
						inst.width += delta
						break
					case "Opacity":
						inst.opacity += delta / 100
						break
				}
			}
		}
	}
}
