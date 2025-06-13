/* eslint-disable */
export class UtilsColors_ {
	constructor(runtime) {
		this.runtime = runtime
	}

	ColorToRGBArray(color) {
		let r, g, b

		if (color.startsWith("rgb")) {
			// Extract the values from `rgb(...)` or `rgba(...)`
			const values = color.match(/\d+/g)
			r = parseInt(values[0]) / 255
			g = parseInt(values[1]) / 255
			b = parseInt(values[2]) / 255
		} else if (color.startsWith("#")) {
			// Convert hex to RGB values
			if (color.length === 4) {
				// Short hex notation like "#abc"
				r = parseInt(color[1] + color[1], 16) / 255
				g = parseInt(color[2] + color[2], 16) / 255
				b = parseInt(color[3] + color[3], 16) / 255
			} else if (color.length === 7) {
				// Full hex notation like "#a1fced"
				r = parseInt(color.slice(1, 3), 16) / 255
				g = parseInt(color.slice(3, 5), 16) / 255
				b = parseInt(color.slice(5, 7), 16) / 255
			}
		}

		return [r, g, b]
	}

	applyHueOverlay(element, hexColor) {
		// Apply CSS filter
		const { h, s, l } = this.hexToHsl(hexColor)

		// Calculate CSS filter properties to map grayscale to the target color
		const cssFilter = `
        grayscale(1) 
        sepia(1) 
        hue-rotate(${h}deg) 
        saturate(${(s / 100) * 5}) 
        brightness(${(l / 100) * 2})
        `

		element.style.filter = cssFilter
	}

	hexOpacity(hex, opacity) {
		const alpha = Math.round(opacity * 255)

		const alphaHex = alpha.toString(16).padStart(2, "0").toUpperCase()

		if (hex.startsWith("#") && (hex.length === 4 || hex.length === 7)) {
			// If short hex (e.g., "#abc"), expand to full hex (e.g., "#aabbcc")
			if (hex.length === 4) {
				hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
			}
			// Append the alpha to the hex color
			return hex + alphaHex
		} else {
			throw new Error("Invalid hex color format")
		}
	}

	hexModulate(hexColor, value = 1.0) {
		let { h, s, v } = this.hexToHsv(hexColor)

		// Adjust saturation and value
		s = Math.min(s + 0.5, 1.0)
		v = Math.min(v * value, 1.0)

		// Convert back to hex and return
		return this.hsvToHex(h, s, v)
	}

	hexToHsv(hex) {
		const rgb = this.hexToRgb(hex)
		return this.rgbToHsv(rgb.r, rgb.g, rgb.b)
	}

	hexToHsl(hex) {
		const rgb = this.hexToRgb(hex)
		return this.rgbToHsl(rgb.r, rgb.g, rgb.b)
	}

	hsvToHex(h, s, v) {
		const rgb = this.hsvToRgb(h, s, v)
		return this.rgbToHex(rgb.r, rgb.g, rgb.b)
	}

	hexToRgb(hex) {
		const bigint = parseInt(hex.slice(1), 16)
		const r = (bigint >> 16) & 255
		const g = (bigint >> 8) & 255
		const b = bigint & 255
		return { r, g, b }
	}

	rgbToHex(r, g, b) {
		return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
	}

	rgbToHsv(r, g, b) {
		r /= 255
		g /= 255
		b /= 255
		const max = Math.max(r, g, b),
			min = Math.min(r, g, b)
		const d = max - min
		let h,
			s = max === 0 ? 0 : d / max,
			v = max

		switch (max) {
			case min:
				h = 0
				break
			case r:
				h = (g - b) / d + (g < b ? 6 : 0)
				break
			case g:
				h = (b - r) / d + 2
				break
			case b:
				h = (r - g) / d + 4
				break
		}

		h /= 6
		return { h, s, v }
	}

	rgbToHsl(r, g, b) {
		;(r /= 255), (g /= 255), (b /= 255)

		const max = Math.max(r, g, b)
		const min = Math.min(r, g, b)
		const delta = max - min

		let h = 0

		if (delta !== 0) {
			if (max === r) {
				h = ((g - b) / delta) % 6
			} else if (max === g) {
				h = (b - r) / delta + 2
			} else if (max === b) {
				h = (r - g) / delta + 4
			}

			h = Math.round(h * 60)
			if (h < 0) h += 360
		}

		const l = (max + min) / 2
		const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))
		return { h, s, l }
	}

	hsvToRgb(h, s, v) {
		let r, g, b

		const i = Math.floor(h * 6)
		const f = h * 6 - i
		const p = v * (1 - s)
		const q = v * (1 - f * s)
		const t = v * (1 - (1 - f) * s)

		switch (i % 6) {
			case 0:
				;(r = v), (g = t), (b = p)
				break
			case 1:
				;(r = q), (g = v), (b = p)
				break
			case 2:
				;(r = p), (g = v), (b = t)
				break
			case 3:
				;(r = p), (g = q), (b = v)
				break
			case 4:
				;(r = t), (g = p), (b = v)
				break
			case 5:
				;(r = v), (g = p), (b = q)
				break
		}

		return {
			r: Math.round(r * 255),
			g: Math.round(g * 255),
			b: Math.round(b * 255),
		}
	}
}
