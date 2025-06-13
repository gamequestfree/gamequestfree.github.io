export class Audio_Manager {
	constructor(runtime, contextOpts) {
		this.runtime = runtime
		this.audioContext = new AudioContext(contextOpts)

		this.audioBuffers = new Map() // Store decoded AudioBuffers here
		this.failedUrls = new Set() // Store failed URLs here
		this.uidToActiveSources = new Map()

		this.masterVolume = 1
		this.soundVolume = 1
		this.musicVolume = 0.7

		// Create gain nodes for master, sound, and music volumes
		this.masterGainNode = this.audioContext.createGain()
		this.masterGainNode.gain.value = this.masterVolume

		this.soundGainNode = this.audioContext.createGain()
		this.soundGainNode.gain.value = this.soundVolume

		this.musicGainNode = this.audioContext.createGain()
		this.musicGainNode.gain.value = this.musicVolume

		// Connect gain nodes
		this.soundGainNode.connect(this.masterGainNode)
		this.musicGainNode.connect(this.masterGainNode)
		this.masterGainNode.connect(this.audioContext.destination)

		this.currentMusic = null
		this.currentMusic_url = null
		this.lastPlayedMusic = [] // To keep track of last played music tracks
		this.musicsUrl = []

		this.mute = false
	}

	Mute() {
		if (this.mute) {
			this.audioContext.resume()
		} else {
			this.audioContext.suspend()
		}
		this.mute = !this.mute
	}

	SetVolume_Master(percentage) {
		this.mute = false
		this.masterVolume = percentage / 100
		this.masterGainNode.gain.value = this.masterVolume
	}

	SetVolume_Sound(percentage) {
		this.mute = false
		this.soundVolume = percentage / 100
		this.soundGainNode.gain.value = this.soundVolume
	}

	SetVolume_Music(percentage) {
		this.mute = false
		this.musicVolume = percentage / 100
		this.musicGainNode.gain.value = this.musicVolume
	}

	async LoadAllAudioFiles() {
		let filtered = this.runtime.appFiles.filter((key) => key.endsWith(".webm"))
		console.error("audio files", filtered)

		filtered = filtered.map((key) => key.replace(this.runtime.baseUrl, ""))

		// Separate music and non-music files
		const audioFiles = filtered.filter((key) => !key.includes("Music_"))
		const musicFiles = filtered.filter((key) => key.includes("Music_"))
		//no need to await Musics
		this.LoadAudioParallel(audioFiles, "SFX")
		this.LoadAudioParallel(musicFiles, "Music")

		/*const promises = audioFiles.map((url) => this.loadAndStoreSound(url))
		await Promise.all(promises)
		console.error("Audio_Manager: All audio files loaded", audioFiles, this)*/

		//this.PlaySound("UI_Buy")
	}

	async LoadAudioParallel(files, debugName = "") {
		// Load only the provided music files
		const promises = files.map((url) => this.loadAndStoreSound(url))
		await Promise.all(promises)
		console.error("Audio_Manager: All", debugName, "audio files loaded", files, this)
	}

	async loadAndStoreSound(url) {
		if (this.failedUrls.has(url)) {
			return
		}
		try {
			const audioBuffer = await this.loadSound(url)
			const endUrl = url.split("/").pop().replace(".webm", "")
			this.audioBuffers.set(endUrl, audioBuffer) // Store AudioBuffer by URL

			if (endUrl.startsWith("Music_")) {
				this.musicsUrl.push(endUrl)
			}
		} catch (error) {
			this.failedUrls.add(url) // Add URL to failedUrls on error
		}
	}

	Predefine_Sound(args) {
		//
	}

	PlaySound_Loop(url, volume = 1, playbackRate = 1) {
		return this.PlaySound(url, volume, playbackRate, true)
	}

	StopSound(uid) {
		const audioData = this.uidToActiveSources.get(uid)
		if (audioData) {
			// Set the flag to indicate the sound was stopped manually
			audioData.stoppedManually = true
			audioData.source.stop()
			audioData.source.disconnect() // Disconnect source
			audioData.gainNode.disconnect() // Disconnect GainNode
			this.uidToActiveSources.delete(uid) // Remove reference from activeSources
		}
	}

	// Load an AudioBuffer from a project file name e.g. "sfx5.webm"
	async loadSound(url) {
		// Note that media files, including sound and music, are
		// exported under a media folder, so add that to the URL.
		//const audioUrl = this.runtime.assets.mediaFolder + url;

		// Ask the runtime to fetch the URL as an ArrayBuffer
		// for decoding.
		const arrayBuffer = await this.runtime.assets.fetchArrayBuffer(url)

		// Once the compressed audio data has been loaded as an
		// ArrayBuffer, decode it to an AudioBuffer ready for playback.
		const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)

		return audioBuffer
	}

	StopMusic() {
		// Stop any currently playing music
		if (this.currentMusic) {
			this.StopSound(this.currentMusic) // Use StopSound to stop the previous music
			this.currentMusic = null // Clear reference
			this.currentMusic_url = null // Clear reference
		}
	}

	PlaySound_Args(args) {
		let SFX = args.SFX
		let Volume = args.Volume || 1
		let Rate = args.Rate || 1
		if (Array.isArray(Rate)) {
			Rate = Utils.random(Rate[0], Rate[1])
		}
		let Loop = args.Loop || false
		let Type = args.Type || "sound"
		let OnEndedCallback = args.OnEndedCallback || null
		this.PlaySound(SFX, Volume, Rate, Loop, Type, OnEndedCallback)
	}

	/*PlayMusic_Args(url, args) {
		let SFX = args.SFX
		let Volume = args.Volume || 1
		let Rate = args.Rate || 1
		if (Array.isArray(Rate)) {
			Rate = Utils.random(Rate[0], Rate[1])
		}
		let Loop = args.Loop || false
		let OnEndedCallback = args.OnEndedCallback || null
		this.PlayMusic(url, Volume, Rate, Loop, OnEndedCallback)
	}*/

	PlayMusic_Spec(url) {
		this.PlayMusic(url, this.musicVolume, 1, false, () => {
			this.PlayRandomMusic(true)
		})
	}

	PlayMusic(url, volume = this.musicVolume, playbackRate = 1, loop = true, onEndedCallback = null) {
		if (this.currentMusic_url === url) {
			return
		}

		this.StopMusic()

		const uid = this.PlaySound(url, volume, playbackRate, loop, "music", onEndedCallback)
		if (!uid) {
			console.error(`Audio_Manager: Failed to play music from URL: ${url}`)
			return null
		}

		this.currentMusic = uid
		this.currentMusic_url = url
		return uid
	}

	PlayRandomMusic(startNewIfPlaying = false) {
		const X = 5 // Number of last played tracks to exclude

		//console.error("PlayRandomMusic")
		if (this.currentMusic && !startNewIfPlaying) {
			// If a music track is already playing and we don't want to start a new one, do nothing
			//console.error("PlayRandomMusic: ❌ Music is already playing, not starting a new one")
			return
		}

		if (!this.musicsUrl || this.musicsUrl.length === 0) {
			//console.error("PlayRandomMusic: ❌ No music tracks available to play")
			return
		}

		// Exclude the last X tracks
		let availableTracks = this.musicsUrl.filter((url) => !this.lastPlayedMusic.includes(url))

		if (availableTracks.length === 0) {
			this.lastPlayedMusic = []
			availableTracks = this.musicsUrl.slice()
		}

		// Pick a random track
		const randomIndex = Math.floor(Math.random() * availableTracks.length)
		let randomTrack = availableTracks[randomIndex]

		//randomTrack = "Music_Test"

		//console.error("PlayRandomMusic: 🎵 Playing random track:", randomTrack)

		// Play the music with onEndedCallback
		this.PlayMusic(randomTrack, this.musicVolume, 1, false, () => {
			this.StopMusic()
			this.PlayRandomMusic()
		})

		// Update the last played history
		this.lastPlayedMusic.push(randomTrack)
		if (this.lastPlayedMusic.length > X) {
			this.lastPlayedMusic.shift()
		}
	}

	PlaySound(url, volume = 1, playbackRate = 1, loop = false, type = "sound", onEndedCallback = null) {
		if (type === "sound" && playbackRate === 1) {
			playbackRate = Utils.random(0.9, 1.1)
		}

		let audioBuffer = this.audioBuffers.get(url)
		if (!audioBuffer) {
			audioBuffer = this.loadAndStoreSound(url)
		}
		if (!audioBuffer) {
			console.error("Audio_Manager: Audio buffer not found for", url)
			return null
		}
		const source = this.audioContext.createBufferSource()
		source.buffer = audioBuffer
		source.playbackRate.value = playbackRate
		source.loop = loop

		const uid = Utils.generateUID()

		// Create a GainNode
		const gainNode = this.audioContext.createGain()
		gainNode.gain.value = volume // Set the initial volume

		// Connect to the appropriate gain node
		if (type === "music") {
			gainNode.connect(this.musicGainNode)
		} else {
			gainNode.connect(this.soundGainNode)
		}

		source.connect(gainNode)
		source.start(0) // Start playback

		// Initialize the stoppedManually flag
		const audioData = {
			source,
			gainNode,
			stoppedManually: false,
		}

		this.uidToActiveSources.set(uid, audioData)

		if (!loop) {
			source.onended = () => {
				if (!audioData.stoppedManually) {
					if (onEndedCallback) {
						//window.alert("Audio onendedCallback")
						onEndedCallback()
					}
				}
				this.uidToActiveSources.delete(uid)
			}
		}
		return uid
	}
}
