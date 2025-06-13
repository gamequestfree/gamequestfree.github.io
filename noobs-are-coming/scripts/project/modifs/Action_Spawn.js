/*
Spawn|1|Landmine:
    Pattern: Random
    SpawnEffects:
    Damage:
        Value: 10
        _StatBonus|Damage_Strength: 50*/

export class Action_Spawn extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)

		this.stackName = "Action_Spawn"

		this.SpawnData = effectData

		this.effectUID = Utils.generateUID()

		this.spawnedUID = []
	}

	On_Wave_Start() {
		this.OnSpawn()
	}

	On_Wave_End() {
		this.player.unit.timerComp.Timer_Stop(this.effectUID)
	}

	OnSpawn() {
		for (let i = 0; i < this.SpawnData.Count; i++) {
			let x = this.player.inst.x
			let y = this.player.inst.y

			if (this.SpawnData.Where === "RandomInArea") {
				const pos = this.runtime.spawnManager.GetPosInArea(30)
				x = pos[0]
				y = pos[1]
			}

			const spawning = this.runtime.spawnManager.SpawnChara(this.SpawnData.What, x, y)
			if (spawning) {
				this.spawnedUID.push(spawning.uid)
			}
		}

		if (this.SpawnData.Every) {
			let every = this.SpawnData.Every
			if (this.SpawnData.CooldownStat) {
				const cooldownValue = this.player.stats.GetStatValue("Cooldown")
				every = every * cooldownValue
			}
			this.player.unit.timerComp.Timer_Start(this.effectUID, every, () => {
				this.OnSpawn()
			})
		}
	}

	OnAdded() {
		if (this.runtime.waveManager.isWaving) {
			this.OnSpawn()
		}
	}

	OnRemoved() {
		this.player.unit.timerComp.Timer_Stop(this.effectUID)
	}

	GetInfo() {
		this.text = this.TranslateKey()
		if (this.SpawnData.Every) {
			this.text = this.runtime.translation.Get("Action_Spawn_Every")
		}
		this.ReplaceColor("0", this.SpawnData.Count, "green")

		this.ReplaceColor("1", Utils.GetItemDisplayName(this.SpawnData.What), "yellow")

		let color = ""

		if (this.SpawnData.CooldownStat) {
			let statValue = this.player.stats.GetStatValue("Cooldown") * 100
			statValue = Math.round(statValue)
			let valueText = statValue + "%"
			let color = ""
			if (statValue > 100) color = "red"
			if (statValue < 100) color = "green"

			this.text = `${this.text} (${this.TranslateStat("Cooldown")}: {valueText})`

			this.ReplaceColor("valueText", valueText, color)
		}

		this.ReplaceColor("every", this.SpawnData.Every, color)

		return this.text
	}
}
