export class Compo_Timer extends C4.Component {
	constructor(unit, data = null) {
		super(unit, data)
		this.timers = new Map()
		this._timersToAdd = []
		this._timersToRemove = new Set()
	}

	ReleaseComp() {
		this.timers.forEach((timer) => this._CleanupTimer(timer))
		this.timers.clear()
		this._timersToAdd = null
		this._timersToRemove = null
	}

	Init() {
		this._SetTicking(true)
	}

	MapBar(bar, timerID) {
		const timer = this.Timer_Get(timerID, true)
		if (!timer) return
		bar.isVisible = true
		timer.bars.push(bar)
	}

	Timer_Stop(id) {
		if (this.timers.has(id)) {
			this._timersToRemove.add(id)
		}
	}

	Timer_Stop_ButExecute(id) {
		if (this.timers.has(id)) {
			const timer = this.timers.get(id)
			if (timer.callback) {
				timer.callback()
			}
			this._timersToRemove.add(id)
		}
	}

	Timer_Start_Repeat(id, delay, callback = null) {
		this.Timer_Start(id, delay, callback, -1)
	}

	Timer_Start(id, duration, callback = null, repeat = 0) {
		if (!id) {
			id = Utils.generateUID()
		}
		const existing = this.timers.get(id)
		if (existing) {
			this.Timer_Stop(id)
		}

		const initDelay_Interval = duration
		const durationFirst = Utils.ProcessInterval(duration)

		const timer = {
			id,
			callback,
			remaining: durationFirst,
			initDelay: durationFirst,
			initDelay_Interval: initDelay_Interval,
			currentTime: 0,
			repeat,
			bars: [],
		}
		this._timersToAdd.push(timer)
		return timer
	}

	Timer_Start_Args(args) {
		let name = ""
		const { id, uid, duration, callback, repeat = 0, onlyIfLonger } = args
		if (id && uid) {
			name = id + "_" + Utils.generateUID()
		} else if (id && !uid) {
			name = id
			if (onlyIfLonger) {
				const checkPrevTimer = this.timers.get(id)
				if (checkPrevTimer && checkPrevTimer.remaining > duration) {
					return null
				}
			}
		} else {
			name = Utils.generateUID()
		}
		if (this.timers.has(name)) {
			this.Timer_Stop(name)
		}

		const initDelay_Interval = duration
		const durationFirst = Utils.ProcessInterval(duration)

		const timer = {
			id: name,
			callback: callback,
			remaining: durationFirst,
			initDelay: durationFirst,
			initDelay_Interval: initDelay_Interval,
			currentTime: 0,
			repeat: repeat,
			bars: [],
		}
		this._timersToAdd.push(timer)
		return timer
	}

	Timer_Get(id, includeToAdd = false) {
		let timer = this.timers.get(id)
		if (!timer && includeToAdd) {
			timer = this._timersToAdd.find((t) => t.id === id)
		}
		return timer
	}

	Tick() {
		let dt = 0
		try {
			dt = this.inst.dt
		} catch (e) {
			console.error("⛔ Error in Update_Timers", this.unit, this.unit.AnimObject, this.wepNameDebug, this.unit.unitType, this.unit.name, e)
			this.DestroyUnit()
			window.alert("Timer Crash")
			return
		}

		if (this._timersToRemove.size > 0) {
			for (const removeId of this._timersToRemove) {
				const timer = this.timers.get(removeId)
				if (timer) {
					this._CleanupTimer(timer)
					this.timers.delete(removeId)
				}
			}
			this._timersToRemove.clear()
		}

		if (this._timersToAdd.length > 0) {
			for (const newTimer of this._timersToAdd) {
				if (this.timers.has(newTimer.id)) {
					const oldTimer = this.timers.get(newTimer.id)
					this._CleanupTimer(oldTimer)
					this.timers.delete(newTimer.id)
				}
				this.timers.set(newTimer.id, newTimer)
			}
			this._timersToAdd.length = 0
		}

		this.timers.forEach((timer) => {
			timer.remaining -= dt
			timer.currentTime += dt
			if (timer.remaining <= 0) {
				if (timer.callback) {
					timer.callback()
				}
				if (timer.repeat > 0) {
					timer.repeat--
				}

				if (timer.repeat > 0 || timer.repeat === -1) {
					const newDelay = Utils.ProcessInterval(timer.initDelay_Interval)

					timer.initDelay = newDelay
					timer.remaining = newDelay
				} else {
					this.Timer_Stop(timer.id)
				}
			}
			for (let i = 0; i < timer.bars.length; i++) {
				const bar = timer.bars[i]
				bar.Set_Data(timer.currentTime, timer.initDelay)
			}
		})
	}

	_CleanupTimer(timer) {
		timer.bars.forEach((bar) => {
			bar.isVisible = false
		})
		timer.bars.length = 0
	}
}
