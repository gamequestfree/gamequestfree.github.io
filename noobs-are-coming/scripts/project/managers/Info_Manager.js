export class Info_Manager {
	constructor(runtime) {
		this.runtime = runtime
	}

	/*
    Target:
        TargetMode: Within
        TargetTag: Enemy
        Range: 50
    Target:
        TargetMode: Random
        TargetTag: Enemy
        Range: 50
    */

	GetTarget(target) {
		const targetMode = target.TargetMode
		const targetTag = target.TargetTag || "Enemy"
		let targetModeText = this.tr(targetMode)

		/*
        TargetMode: Within
        Range: 50
        */
		if (targetMode === "Within") {
			targetModeKey = "Random_Target"
			let range = target.Range
		}

		let line = this.PropLine("Info_Target", target.va)
		return line
	}

	GetDamageInfo(damage) {
		//
	}

	PropLine(key, value, color = "yellow") {
		let line = this.tr(key, color) + ": " + value
		return line
	}

	trChancePrefix(chancePercent) {
		let text = "[c=#00FFFF]" + this.tr("CHANCE") + ":[/c] "
		text = text.replace("{0}", chancePercent)
		return text
	}

	tr(key, color = null) {
		let text = this.runtime.translation.Get(key)
		if (color) {
			text = "[c=" + color + "]" + text + "[/c]"
		}
		return text
	}
}
