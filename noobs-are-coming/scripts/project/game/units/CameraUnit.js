C4.Units.CameraUnit = class CameraUnit extends C4.Unit {
	constructor(runtime, inst, evolution = 0, data = null) {
		super(runtime, inst, evolution, data)
	}

	//*========== CONFIG ====================

	SetData() {
		super.SetData()
		this.NoSeperateAnim = true
	}
}
