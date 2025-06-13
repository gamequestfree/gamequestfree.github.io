export class Action_Create_Circle extends C4.Item_Effect {
	constructor(item, effectName, effectData, parent) {
		super(item, effectName, effectData, parent)

		this.stackName = "Create_Circle"
	}

	OnAction() {
		const baseSize = 74
		let size = baseSize * this.player.stats.GetStatValue("Size")

		const pentagram = this.runtime.spawnManager.SpawnInstance("Pentagram", "Ground_Marks", size)

		pentagram.setSize(size, size)
	}

	UpdateStack() {
		if (this.GetStackCount() > 0) {
			//
		} else {
			//
		}
	}

	Tick_Pentagram() {
		const collidingCharas = Utils.testOverlapOpti_All(this.player.unit.inst, this.runtime.objects["Pentagram"])
		//* Outside circle
		if (collidingCharas.length === 0) {
			//
		}
		//* Inside circle
		for (const chara of collidingCharas) {
			Damage.DealDamage_Test(chara)
		}
	}

	GetInfo() {
		this.text = this.Translate("Action_Create_Circle")

		let statValue = this.player.stats.GetStatValue("Size") * 100
		statValue = Math.round(statValue)
		let valueText = statValue + "%"
		let color = ""
		if (statValue > 100) color = "green"
		if (statValue < 100) color = "red"

		this.ReplaceColor("size", valueText, color)
		return this.text
	}
}
