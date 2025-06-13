export class Abi_Spawn_Chara extends C4.Abi {
	constructor(unit, abiName, abiData) {
		super(unit, abiName, abiData)
	}

	Init_Data() {
		super.Init_Data()
		this.SetVars_Default({
			Chara_Unit: "Enemy",
			Spawn_Count: 1,
			Area: 50,
			Destroy_SpawnedWithParent: false,
		})

		this.spawned_Uids = []
	}

	Step_Init() {
		//this.Range = this.wep.Range
	}

	Step_Execute() {
		for (let i = 0; i < this.Spawn_Count; i++) {
			const pos = this.runtime.spawnManager.GetPosInArea_FromCircle(this.inst.x, this.inst.y, this.Area)

			const spawnUnit = this.runtime.spawnManager.SpawnChara("Noob_Sword", pos[0], pos[1])

			this.spawned_Uids.push(spawnUnit.uid)
		}
	}

	ReleaseAbi() {
		super.ReleaseAbi()

		if (this.DestroySpawnedWithParent) {
			for (const uid of this.spawned_Uids) {
				const unit = this.runtime.getUnitByUID(uid)
				if (unit) unit.DestroyUnit()
			}
		}
	}
}
