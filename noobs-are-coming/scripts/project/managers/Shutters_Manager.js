export class Shutters_Manager {
	constructor(runtime) {
		this.runtime = runtime

		this.Shutters_Create()

		this.shutDuration = 150
	}

	Shutters_Create() {
		const C3htmlwrap = document.querySelector(".c3html")

		// Create the shutter elements
		this.topShutter = document.createElement("div")
		this.topShutter.id = "topShutter"
		this.bottomShutter = document.createElement("div")
		this.bottomShutter.id = "bottomShutter"

		// Style the shutters

		Object.assign(this.topShutter.style, {
			position: "fixed",
			top: "0",
			left: "0",
			width: "100vw",
			height: "50vh",
			backgroundColor: "black",
			transition: `transform ${this.shutDuration}ms ease-in-out`,
			zIndex: "9999",
			transform: "translateY(-100%)",
		})

		Object.assign(this.bottomShutter.style, {
			position: "fixed",
			bottom: "0",
			left: "0",
			width: "100vw",
			height: "50vh",
			backgroundColor: "black",
			transition: `transform ${this.shutDuration}ms ease-in-out`,
			zIndex: "9999",
			transform: "translateY(100%)",
		})

		// Append shutters to the body
		C3htmlwrap.appendChild(this.topShutter)
		C3htmlwrap.appendChild(this.bottomShutter)
	}

	Shutters_SetStateOpen(bool) {
		// Disable transitions
		this.topShutter.style.transition = "none"
		this.bottomShutter.style.transition = "none"

		// Set the position based on the desired state
		if (bool) {
			this.topShutter.style.transform = "translateY(-100%)" // Open position (top)
			this.bottomShutter.style.transform = "translateY(100%)" // Open position (bottom)
		} else {
			this.topShutter.style.transform = "translateY(0)" // Closed position (top)
			this.bottomShutter.style.transform = "translateY(0)" // Closed position (bottom)
		}

		// Force reflow to apply the styles instantly
		this.topShutter.offsetHeight // Trigger reflow
		this.bottomShutter.offsetHeight // Trigger reflow

		// Re-enable transitions for future animations
		this.topShutter.style.transition = `transform ${this.shutDuration}ms ease-in-out`
		this.bottomShutter.style.transition = `transform ${this.shutDuration}ms ease-in-out`
	}

	async Shutters_CloseOpen(type = "") {
		this.Shutters_Close()

		await new Promise((resolve) => setTimeout(resolve, this.shutDuration + 5))

		this.Shutters_Open()
	}

	Shutters_Open(force = true) {
		if (force) this.Shutters_SetStateOpen(false)

		this.runtime.audio.PlaySound("Shutters_Open")

		setTimeout(() => {
			this.topShutter.style.transform = "translateY(-100%)"
			this.bottomShutter.style.transform = "translateY(100%)"
		}, 0)
	}

	// Function to close shutters
	Shutters_Close(force = true) {
		if (force) this.Shutters_SetStateOpen(true)

		this.runtime.audio.PlaySound("Shutters_Close")

		setTimeout(() => {
			this.topShutter.style.transform = "translateY(0)"
			this.bottomShutter.style.transform = "translateY(0)"
		}, 0)
	}
}
