export class Compo_Picker extends C4.Component {
	constructor(unit, data = null) {
		super(unit, data)
	}

	SetData() {
		this.SetVars_Default({
			PlayerPickerIndex: 0,
		})
	}

	Init() {
		//this.pickerInst = null
		this._SetTicking(true)
	}

	Tick() {
		super.Tick()

		const player = this.runtime.players[this.PlayerPickerIndex]
		if (!player) return

		const pickupClass = this.runtime.objects["Pickup_Coins"]

		const pickerInst = this.pickerInst || this.inst
		const rect = pickerInst.getBoundingBox()

		const candidates = this.runtime.collisions.getCollisionCandidates(pickupClass, rect)
		for (const candidate of candidates) {
			if (candidate.unpickable) continue

			const vars = candidate.instVars
			if (vars.UID_Entity > 0 && vars.UID_Entity !== player.inst.uid) {
				continue
			}
			if (this.runtime.collisions.testOverlap(pickerInst, candidate)) {
				this.Pickup_Coin(candidate, this.uid)
			}
		}
	}

	Pickup_Coin(coinInst, tweenAwayUID = null) {
		//coinInst.destroy()
		const tweenBeh = coinInst.behaviors["Tween"]
		const bulletBeh = coinInst.behaviors["Bullet"]
		if (bulletBeh.isEnabled || !coinInst.instVars.CanBePickup) return

		for (const tween of tweenBeh.tweensByTags("soulPortal")) {
			tween.stop()
		}

		coinInst.instVars.CanBePickup = false

		let pickerInst = null
		if (tweenAwayUID) {
			pickerInst = this.runtime.getInstanceByUid(tweenAwayUID)
		}
		if (!pickerInst) pickerInst = this.pickerInst || this.inst

		const x = coinInst.x + Math.cos(C3.angleTo(pickerInst.x, pickerInst.y, coinInst.x, coinInst.y)) * 20
		const y = coinInst.y + Math.sin(C3.angleTo(pickerInst.x, pickerInst.y, coinInst.x, coinInst.y)) * 20
		const tweenWay = tweenBeh.startTween("position", [x, y], 0.2, "out-cubic", {
			tags: "Away",
		})

		const player = this.runtime.players[this.PlayerPickerIndex]
		if (!player) return

		const playerInst = player.inst

		coinInst.instVars.UID_Entity = playerInst.uid
		coinInst.instVars.PlayerIndex = player.playerIndex

		tweenWay.finished.then(() => {
			const dist = C3.distanceTo(playerInst.x, playerInst.y, coinInst.x, coinInst.y)
			const tweenDuration = Utils.remap(dist, 60, 180, 0.2, 0.5)

			coinInst.instVars.ActuallyPickable = true
			tweenBeh.startTween("position", [playerInst.x, playerInst.y], tweenDuration, "out-cubic", {
				tags: "ToEntity",
			})
		})
	}
}
