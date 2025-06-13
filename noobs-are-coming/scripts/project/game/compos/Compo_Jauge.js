const props = ["MaxPoints", "CurrentPoints", "PerTick", "AllowNegative"]

export class Compo_Jauge extends C4.Component {
	constructor(unit, data = null) {
		super(unit, data)

		this.max = 100
		this.current = 100
		this.displayedHealth = this.current
		this.perSec = 0
		this.ticks = {}

		this.locked = false
		this.lockedIncrease = false
		this.lockedDecrease = false
		this.allowedNegative = false

		/*
			//delay points (addition)
			this.lerpDelay_speed = 0.3
			this.isLerpDelaying = true*/

		//delay points (substraction)
		this.delayed = 0
		this.lerpDelay = 0.3
		this.lerpDelay_speed = 0.3
		this.isLerpDelaying = true

		this.refreshBars = false

		this.healthBars = new Map()

		// Opt-in to getting calls to Tick()
		this._SetTicking(true)

		if (this.inst.objectType.name.toLowerCase() === "player") {
			this.isPlayer = true
		}
	}

	/*
	SetData() {
		this.SetVars_Default({
			JaugeStart: 1,
			JaugeMax: 100,
		})
	}

	Init() {
		this.setMax(this.JaugeMax)
		this.setCurrent(this.JaugeStart, false)
	}*/

	Tick() {
		const dt = this.inst.dt

		if (this.perSec !== 0) {
			this.setCurrent(this.current + this.perSec * dt)
		}

		//regen and decay tick
		if (this.isLerpDelaying) {
			this.refreshBars = true
			this.delayed = this.Lerp(this.delayed, 0, this.lerpDelay_speed)
			if (this.delayed < 0.01) {
				this.isLerpDelaying = false
				this.delayed = 0
			}
		}
		if (this.refreshBars) {
			this.refreshBars = false
			this.refreshListeners()
		}
	}

	//*Utils

	_TriggerSelfAndBars(method) {
		//! todo
		const unitMethodName = this.name ? this.name + "_" + method : method

		//! weirdCheck : isn't this event already called ? (maybe due to multibullet)
		this.unit.TriggerWithEvent(unitMethodName)

		for (const [uid, healthbar] of this.healthBars) {
			const healthbarMethod = healthbar._TriggerByName(method)
		}
	}

	Lerp(start, end, t) {
		return start + (end - start) * t
	}

	getData() {
		return {
			_current: this.current,
			_delayed: this.delayed,
			_max: this.max,
		}
		/*
            return {
				_current: this.current,
				_delayed: this.delayed,
				_max: this.max,
				_regen: this.getTotalRegenRemained(),
				_decay: this.getTotalDecayRemained()
			}*/
	}

	//LISTENERS

	Inst_IsPlugin(inst, pluginCtor) {
		return pluginCtor && inst.GetPlugin() instanceof pluginCtor
	}

	AddListener(inst) {
		const sdkInst = sdk_runtime.GetInstanceByUID(inst.uid)
		const isHealthbar = this.Inst_IsPlugin(sdkInst, C3.Plugins.overboy_healthbar)
		if (isHealthbar) {
			const plug_healthbar = sdkInst._sdkInst

			this.healthBars.set(inst.uid, plug_healthbar)
			plug_healthbar.ObserveHealth(this)
		}
	}

	RemoveListener(inst) {
		if (this.healthBars.has(inst.uid)) {
			this.healthBars.get(inst.uid).UnobserveHealth(this)
			this.healthBars.delete(inst.uid)
		}
	}

	RemoveAllListeners() {
		for (const [uid, healthbar] of this.healthBars) {
			healthbar.UnobserveHealth(this)
		}
	}

	refreshListeners() {
		if (this.healthBars.length > 1) console.error("😍 refreshListeners", this.healthBars.size, this.healthBars)
		for (const [uid, healthbar] of this.healthBars) {
			healthbar.ObserveHealth(this)
		}
	}

	PerSec() {
		return this.perSec
	}

	Set_PerSec(operation, value) {
		//SET
		if (operation === 0) {
			this.perSec = value
		}
		//ADD
		else if (operation === 1) {
			this.perSec += value
		}
		//REMOVE
		else if (operation === 2) {
			this.perSec -= value
		}
	}

	GetPercent() {
		return (this.current / this.max) * 100
	}

	GetPercentMissing() {
		return 100 - this.GetPercent()
	}

	//CURRENT

	SetCurrentToMax(overrideMax = 0) {
		if (overrideMax > 0) this.setMax(overrideMax)
		this.setCurrent(this.max, false)
	}

	addCurrent(val, offsetDisplay = false) {
		this.setCurrent(this.current + val, offsetDisplay)
	}

	setCurrent(val, offsetDisplay = false) {
		if (this.locked) return
		const oldAmount = this.current
		let newAmount = Math.min(this.max, val)

		if (Math.abs(oldAmount - newAmount) <= 0.01) return

		if (!this.allowedNegative) {
			newAmount = Math.max(0, newAmount)
		}

		if (this.lockedIncrease && newAmount > oldAmount) return
		if (this.lockedDecrease && newAmount < oldAmount) return
		this.current = newAmount

		const offset = this.current - oldAmount

		//if value changed
		this._TriggerSelfAndBars("OnChanged")
		this._TriggerSelfAndBars("OnCurrentChanged")
		this.refreshBars = true

		if (offset != 0) {
			//offset Display
			if (offset < 0 && offsetDisplay) {
				this.delayed += -offset
				this._startDelayTimer()
			} else if (offset > 0) {
				this.delayed = Math.max(this.delayed - offset, 0)
			}
			if (oldAmount > this.current) {
				this._TriggerSelfAndBars("OnCurrentSubtracted")
			} else if (oldAmount < this.current) {
				this._TriggerSelfAndBars("OnCurrentAdded")
			}
			if (oldAmount > 0 && this.current <= 0) {
				if (this.isPlayer) window.alert("Player Depleted")
				this._TriggerSelfAndBars("OnCurrentDepleted")
			} else if (this.current === this.max) {
				this._TriggerSelfAndBars("OnCurrentFull")
			}
		}
	}

	setMax(val) {
		let oldAmount = this.max
		//allow negative
		//this.max = Math.max(0, val)
		this.max = val
		if (oldAmount !== this.max) {
			this.refreshBars = true
			this._TriggerSelfAndBars("OnChanged")
			this._TriggerSelfAndBars("OnMaxChanged")
			if (oldAmount > this.max) {
				this._TriggerSelfAndBars("OnMaxSubtracted")
			} else {
				this._TriggerSelfAndBars("OnMaxAdded")
			}
			// check and updtae current
			if (this.current > this.max) {
				this.setCurrent(this.max, false)
			}
		}
	}

	//DELAY

	_startDelayTimer() {
		this.isLerpDelaying = false
		clearTimeout(this.delayTimer)
		this.delayTimer = setTimeout(() => {
			this.isLerpDelaying = true
		}, this.lerpDelay * 1000)
	}

	//LOCK

	SetLock(state) {
		state = !!state
		const oldLockState = this.locked
		this.locked = state
		if (oldLockState !== state) {
			if (state) {
				this._TriggerSelfAndBars("OnLocked")
			} else {
				this._TriggerSelfAndBars("OnUnlocked")
			}
		}
	}

	LockIncrease(state) {
		state = !!state
		const oldLockState = this.lockedIncrease
		this.lockedIncrease = state
		if (oldLockState !== state) {
			if (state) {
				this._TriggerSelfAndBars("OnIncreaseLocked")
			} else {
				this._TriggerSelfAndBars("OnIncreaseUnlocked")
			}
		}
	}

	LockDecrease(state) {
		state = !!state
		const oldLockState = this.lockedDecrease
		this.lockedDecrease = state
		if (oldLockState !== state) {
			if (state) {
				this._TriggerSelfAndBars("OnDecreaseLocked")
			} else {
				this._TriggerSelfAndBars("OnDecreaseUnlocked")
			}
		}
	}

	//ALOW NEGATIVE

	AllowNegative(state) {
		this.allowedNegative = !state
	}

	//#region EXPRESSIONS

	Current() {
		return this.current
	}

	Max() {
		return this.max
	}

	UID_ListenerFirst() {
		return this.healthBars.keys().next().value
	}

	//#endregion

	//#region CONDITIONS

	OnChanged() {
		return true
	}

	OnCurrentChanged() {
		return true
	}

	OnCurrentAdded() {
		return true
	}

	OnCurrentSubtracted() {
		return true
	}

	OnMaxChanged() {
		return true
	}

	OnMaxAdded() {
		return true
	}

	OnMaxSubtracted() {
		return true
	}

	OnCurrentDepleted() {
		return true
	}

	OnCurrentFull() {
		return true
	}

	//LOCK

	IsFull() {
		return this.current === this.max
	}

	IsEmpty() {
		return this.current <= 0
	}

	IsLocked() {
		return this.locked
	}

	IsIncreaseLocked() {
		return this.lockedIncrease
	}

	IsDecreaseLocked() {
		return this.lockedDecrease
	}

	OnLocked() {
		return true
	}

	OnUnlocked() {
		return true
	}

	OnIncreaseLocked() {
		return true
	}

	OnIncreaseUnlocked() {
		return true
	}

	OnDecreaseLocked() {
		return true
	}

	OnDecreaseUnlocked() {
		return true
	}

	//#endregion

	//=========== USUAL ============

	Trigger(method) {
		super.Trigger(method)
		const addonTrigger = addonTriggers.find((x) => x.method === method)
		if (addonTrigger) {
			this.GetScriptInterface().dispatchEvent(new C3.Event(addonTrigger.id))
		}
	}

	GetScriptInterfaceClass() {
		return scriptInterface
	}
}
