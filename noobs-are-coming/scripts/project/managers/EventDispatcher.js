export class EventDispatcher {
	constructor(runtime) {
		this.runtime = runtime
		this.dispatcher = C3.New(C3.Event.Dispatcher)
	}

	ClearEvents() {
		this.dispatcher.ClearEvents()
	}

	addEventListener(type, func, capture) {
		C3X.RequireString(type)
		C3X.RequireFunction(func)
		this.dispatcher.addEventListener(type, func, capture)
	}
	removeEventListener(type, func, capture) {
		C3X.RequireString(type)
		C3X.RequireFunction(func)
		this.dispatcher.removeEventListener(type, func, capture)
	}

	dispatchEventString(name, args) {
		const e = new C3.Event(name, true)
		if (args) {
			for (const [key, value] of Object.entries(args)) {
				e[key] = value
			}
		}
		this.dispatchEvent(e)
	}

	dispatchEvent(e) {
		this.dispatcher.dispatchEvent(e)
	}
}
