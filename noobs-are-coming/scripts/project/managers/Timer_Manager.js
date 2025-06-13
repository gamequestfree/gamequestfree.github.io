export class Timer_Manager {
	constructor(runtime) {
		this.runtime = runtime
		this.timers = [] // Array to hold all timers

		// Listen to the tick event
		this.runtime.addEventListener("tick", (e) => this.Tick())
		this.runtime.addEventListener("beforeanylayoutend", (e) => this.ClearAllTimers(e))
	}

	ClearAllTimers(e) {
		this.timers = []
	}

	// Add a new timer
	Add(duration, callback, inst = null, instDt = false) {
		const timer = {
			duration: duration,
			remainingTime: duration,
			callback: callback,
			inst: inst,
			instDt: instDt
		}
		this.timers.push(timer)
	}

	AddFromInstance(inst, instdt, duration, callback) {
		this.Add(duration, callback, inst, instdt)
	}

	Tick() {
		for (let i = this.timers.length - 1; i >= 0; i--) {
			const timer = this.timers[i]
			let dt = this.runtime.dt

			// If the timer is object-specific and should use the object's time scale
			if (timer.inst && timer.instDt) {
				dt = timer.inst.dt
			}

			// Reduce the remaining time by the adjusted delta time
			timer.remainingTime -= dt

			// Check if the timer has finished
			if (timer.remainingTime <= 0) {
				// Call the callback function
				timer.callback()

				// Remove the timer from the list
				this.timers.splice(i, 1)
			}
		}
	}
}
