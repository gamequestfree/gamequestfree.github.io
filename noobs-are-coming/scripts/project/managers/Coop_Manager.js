import { EventDispatcher } from "./EventDispatcher.js"

export class Coop_Manager extends EventDispatcher {
	constructor(runtime) {
		super(runtime)
		this.connectedPlayers = []

		this.playerJoining = []

		this.perPlayer_AddEnemyCount = 0.3
		this.perPlayer_AddEnemyHP = 0.3
		this.perPlayer_AddEnemyDamage = 0.08

		this.coopCoin = 0.8 // if 4 players, it means the total amount of coins would be 0.8 * 4 = 3.2
	}

	Coop_CoinFactor() {
		const playerCount = this.runtime.playersAlive.size
		if (playerCount <= 1) return 1
		const enemyMult = 1 + this.perPlayer_AddEnemyCount * (playerCount - 1)
		const coinFactor = playerCount / enemyMult
		return coinFactor * this.coopCoin
	}

	ListenForInput() {
		//
	}

	AddPlayer(device, type) {
		const e = new C3.Event("connectedPlayerUpdate", true)
		e.connectedPlayers = this.connectedPlayers
		this.dispatchEvent(e)
	}
}
