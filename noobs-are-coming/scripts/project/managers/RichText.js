export class RichText {
	constructor(runtime) {
		this.runtime = runtime
	}

	parseBBCode(input) {
		// Preprocess [br] tags: if a [br] tag isn't immediately followed by a [/br], append a closing tag.
		input = input.replace(/\[br\](?!\[\/br\])/gi, "[br][/br]")

		// Set of tags that don't need (or shouldn't have) a closing tag
		const singleTagNames = new Set(["img"])

		// 1) TOKENIZE
		// -------------------------------------------
		const tagRegex = /\[(\/)?([a-z]+[^\]]*)\]/gi
		let tokens = []
		let lastIndex = 0
		let match

		while ((match = tagRegex.exec(input)) !== null) {
			// If there's text before this tag, push it as a text token
			if (match.index > lastIndex) {
				tokens.push({
					type: "text",
					value: input.slice(lastIndex, match.index),
				})
			}

			// Check if it’s a closing tag or opening tag
			const isClosing = !!match[1]
			const tagContent = match[2].trim() // e.g. "b", "img=path.png|1.3", etc.

			tokens.push({
				type: "tag",
				name: tagContent,
				closing: isClosing,
			})

			lastIndex = tagRegex.lastIndex
		}

		// If there's text after the last tag, push it
		if (lastIndex < input.length) {
			tokens.push({
				type: "text",
				value: input.slice(lastIndex),
			})
		}

		// 2) PARSE TOKENS INTO A TREE
		// -------------------------------------------
		function createNode(name, attrs = {}) {
			return { type: "tag", name, attrs, children: [] }
		}

		function createTextNode(text) {
			return { type: "text", value: text }
		}

		let rootNode = createNode("root")
		let stack = [rootNode]

		for (let i = 0; i < tokens.length; i++) {
			const token = tokens[i]
			const currentParent = stack[stack.length - 1]

			if (token.type === "text") {
				// Just add text node to the current parent
				currentParent.children.push(createTextNode(token.value))
			} else if (token.type === "tag") {
				// If it's a closing tag
				if (token.closing) {
					// e.g. [/b]
					let closedTagName = token.name.toLowerCase().split("=")[0]
					while (stack.length > 1) {
						let popped = stack.pop()
						let poppedName = popped.name.toLowerCase().split("=")[0]
						if (poppedName === closedTagName) {
							// matched the correct tag
							break
						}
					}
				} else {
					// Opening tag: e.g. [b], [color=red], [img=path.png|1.3], etc.
					let [tagName, ...rest] = token.name.split("=")
					tagName = tagName.toLowerCase()

					const newNode = createNode(tagName)

					if (rest.length) {
						const attrValue = rest.join("=")
						if (tagName === "color" || tagName === "c") {
							newNode.attrs.color = attrValue
						} else if (tagName === "img") {
							const [imgPath, scaleStr] = attrValue.split("|")
							newNode.attrs.src = imgPath
							if (scaleStr) {
								newNode.attrs.scale = scaleStr
							}
						} else {
							newNode.attrs.rawAttr = attrValue
						}
					}

					// Add node to parent's children
					currentParent.children.push(newNode)

					// If it's a single/self-closing tag, don't push onto the stack
					if (!singleTagNames.has(tagName)) {
						// It's a normal container tag, so push it
						stack.push(newNode)
					}
				}
			}
		}

		// 3) RENDER THE TREE BACK TO HTML
		// -------------------------------------------
		function renderNode(node) {
			// If it's just text, return it
			if (node.type === "text") return node.value

			// Otherwise it's a tag node
			const tagName = node.name
			const innerHTML = node.children.map(renderNode).join("")

			switch (tagName) {
				case "b":
					return `<strong>${innerHTML}</strong>`
				case "i":
					return `<em>${innerHTML}</em>`
				case "u":
					return `<u>${innerHTML}</u>`
				case "wave":
					return wrapLettersWave(innerHTML)
				case "rainbow":
					return wrapLettersRainbow(innerHTML)
				case "color":
				case "c":
					if (node.attrs.color) {
						return `<span style="color:${node.attrs.color}">${innerHTML}</span>`
					}
					return innerHTML
				case "img": {
					const src = node.attrs.src || ""
					const scale = node.attrs.scale ? node.attrs.scale : "1"
					return `<img src="${src}" style="height:${scale}em; width:auto;" />`
				}
				case "br":
					return `<br>`
				default:
					return innerHTML
			}
		}

		// Helper functions for rainbow/wave
		function wrapLettersRainbow(text) {
			return text
				.split("")
				.map((char, index) => {
					return `<span class="rainbow-color-${index % 7}">${char}</span>`
				})
				.join("")
		}

		function wrapLettersWave(text) {
			return text
				.split("")
				.map((char, index) => {
					return `<span class="wave-letter" style="animation-delay:${index * 0.1}s">${char}</span>`
				})
				.join("")
		}

		// Return everything inside the root, rendered as HTML
		return rootNode.children.map(renderNode).join("")
	}

	removeBBCode(text) {
		const bbCodeRegex = /\[\/?\w+(?:=[^\]]*)?\]/g
		const spanTagRegex = /<\/?span\b[^>]*>/gi

		text = text.replace(bbCodeRegex, "").replace(spanTagRegex, "")

		return text
	}

	// Helper function to wrap each letter in span with animation delay
	wrapLettersInSpans(text, className) {
		return text
			.split("")
			.map((char, i) => `<span class="${className}" style="--i:${i}">${char}</span>`)
			.join("")
	}

	wrapLettersRainbow(text) {
		return text
			.split("")
			.map((char, i) => `<span style="display:inline-block; animation:rainbow-colors 2s infinite; animation-delay:${i * 0.1}s;">${char}</span>`)
			.join("")
	}

	wrapLettersWave(text) {
		return text
			.split("")
			.map((char, i) => `<span style="display:inline-block; animation:wave 1.5s infinite; animation-delay:${i * 0.1}s;">${char}</span>`)
			.join("")
	}
}
