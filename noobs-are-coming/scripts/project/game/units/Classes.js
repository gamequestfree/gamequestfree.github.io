C4.Sine = class SineMotion {
	// static constants shared by all instances
	static TWO_PI = 2 * Math.PI
	static HALF_PI = Math.PI / 2
	static THREE_HALF = (3 * Math.PI) / 2

	constructor(prop, period, periodOffsetPct, mag, useTriangle = false, enabled = true) {
		// property selector
		this.prop = typeof prop === "string" ? prop : propSine[prop]
		this.enabled = enabled

		// pre-bind the right waveform
		this.waveFunc = useTriangle ? SineMotion.triangleWave : Math.sin

		// phase in radians
		this.phase = periodOffsetPct * SineMotion.TWO_PI
		// angular velocity (radians per unit time)
		this.omega = period > 0 ? SineMotion.TWO_PI / period : 0

		// convert magnitude once
		if (this.prop === "Angle") {
			this.mag = C3.toRadians(mag)
		} else if (this.prop === "Width" || this.prop === "Height") {
			this.mag = mag / 100
		} else {
			this.mag = mag
		}
	}

	// single tick call
	Sine_TickValue(dt) {
		// advance phase
		this.phase += dt * this.omega
		// wrap around without costly %
		if (this.phase >= SineMotion.TWO_PI) {
			this.phase -= SineMotion.TWO_PI
		}
		// compute output
		return this.waveFunc(this.phase) * this.mag
	}

	Sine_TickDelta(dt) {
		// 1) store the previous output (fall back to current if first call)
		const prev = this.lastValue !== undefined ? this.lastValue : this.waveFunc(this.phase) * this.mag

		// 2) advance phase and compute new output
		const curr = this.Sine_TickValue(dt)

		// 3) record for next tick
		this.lastValue = curr

		// 4) return the delta
		return curr - prev
	}

	// a standalone fast triangle wave
	static triangleWave(x) {
		if (x <= SineMotion.HALF_PI) {
			return x / SineMotion.HALF_PI
		}
		if (x <= SineMotion.THREE_HALF) {
			return 1 - (2 * (x - SineMotion.HALF_PI)) / Math.PI
		}
		return (x - SineMotion.THREE_HALF) / SineMotion.HALF_PI - 1
	}
}
