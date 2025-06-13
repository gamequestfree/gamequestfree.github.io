export class Compo_Plant extends C4.Component {
	constructor(unit, data = null) {
		super(unit, data)
	}
	SetData() {
		this.SetVars_Default({
			Water_Max: 200,
		})
	}

	SetInternals() {
		this.isGrown = false
	}

	Tick() {
		super.Tick()

		const dt = this.inst.dt

		if (this.isGrown) {
			this.waterComp.setCurrent(this.waterComp.current - dt * 100, false)
			if (this.waterComp.current <= 0) {
				this.unit.OnDestroyed(false)
			}
		}
	}

	Init() {
		this.unit.AddTags("Sprout")

		this.unit.SetAnimObject(this.unit.AnimObject + "_Sprout")

		//this.juice.Spring_SetProp("size2D")

		this.waterComp = this.unit.AddComponent(C4.Compos.Compo_Jauge, "Water", {
			JaugeStart: 1,
			JaugeMax: this.Water_Max,
		})

		this.waterComp.setMax(this.Water_Max)
		this.waterComp.setCurrent(0, false)

		this.inst.addEventListener("Water_OnCurrentFull", () => this.WaterFill())

		this.waterBar = this.runtime.objects["Bar_Local"].createInstance("HUD_Local", this.unit.inst.x, this.unit.AnimTopY() - 25)
		this.waterBar.Set_Color_Current([0, 0, 1])
		//console.error("WaterBar", this.waterBar)
		this.unit.inst.addChild(this.waterBar, {
			transformX: true,
			transformY: true,
			destroyWithParent: true,
		})
		this.waterComp.AddListener(this.waterBar)

		this._SetTicking(true)
	}

	WaterFill() {
		if (this.isGrown) return
		this.isGrown = true

		this.waterBar.Set_Color_Current([0, 0.992, 1])

		const duration = this.unit.atk_Unit.GetDuration_Value() * 100

		this.waterComp.SetCurrentToMax(duration)

		//this.unit.RemoveTags("Sprout")
		//this.waterBar.isVisible = false

		this.unit.SetAnimObject(this.unit.AnimObject.replace("_Sprout", ""))

		this.runtime.audio.PlaySound("Plant_Mature")
		this.unit.juice.Shake()
		this.Trigger("Plant_OnMature")
	}
}
