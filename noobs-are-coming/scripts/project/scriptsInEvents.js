

const scriptsInEvents = {

	async Shared_Event1_Act1(runtime, localVars)
	{
		runtime.progress.SetSetting("Volume_Music", 0)
	},

	async Shared_Event6_Act1(runtime, localVars)
	{
		runtime.menu.cheatButton.style.display = "flex"
	},

	async Shared_Event7_Act1(runtime, localVars)
	{
		runtime.menu.watermark.style.display = "none"
	},

	async Shared_Event8_Act1(runtime, localVars)
	{
		runtime.main.CheatBtnPressed()
		
	},

	async Shared_Event12_Act1(runtime, localVars)
	{
		runtime.audio.Mute()
	},

	async Shared_Event13_Act1(runtime, localVars)
	{
		runtime.menu.cheatButton.style.display = "none"
		runtime.main.ToggleCheats(true)
		runtime.progress.UnlockAllChallenges()
	},

	async Shared_Event15_Act2(runtime, localVars)
	{
		runtime.main.ToggleCheats(true)
	},

	async Shared_Event29_Act1(runtime, localVars)
	{
		runtime.input.Input_Update("mouse_move", "OnlyPressed")
	},

	async Shared_Event30_Act1(runtime, localVars)
	{
		runtime.input.Input_Update("mouse_left", "Pressed")
	},

	async Shared_Event31_Act1(runtime, localVars)
	{
		runtime.input.Input_Update("mouse_middle", "Pressed")
	},

	async Shared_Event32_Act1(runtime, localVars)
	{
		runtime.input.Input_Update("mouse_right", "Pressed")
	},

	async Shared_Event33_Act1(runtime, localVars)
	{
		runtime.input.Input_Update("mouse_scroll_down", "OnlyPressed")
	},

	async Shared_Event34_Act1(runtime, localVars)
	{
		runtime.input.Input_Update("mouse_scroll_up", "OnlyPressed")
	},

	async Shared_Event35_Act1(runtime, localVars)
	{
		runtime.input.Input_Update("mouse_left", "Released")
	},

	async Shared_Event36_Act1(runtime, localVars)
	{
		runtime.input.Input_Update("mouse_middle", "Released")
	},

	async Shared_Event37_Act1(runtime, localVars)
	{
		runtime.input.Input_Update("mouse_right", "Released")
	},

	async Shared_Event38_Act2(runtime, localVars)
	{
		runtime.input.Input_Update(localVars.LastKeyCode, "Pressed")
	},

	async Shared_Event39_Act2(runtime, localVars)
	{
		runtime.input.Input_Update(localVars.LastKeyCode, "Released")
	},

	async Shared_Event41_Act3(runtime, localVars)
	{
		runtime.input.Input_Update("b_"+localVars.LastButton, "Pressed")
	},

	async Shared_Event41_Act4(runtime, localVars)
	{
		runtime.input.Input_Update("b_"+localVars.LastButton+"|"+localVars.LastGamepad, "Pressed")
	},

	async Shared_Event42_Act3(runtime, localVars)
	{
		runtime.input.Input_Update("b_"+localVars.LastButton, "Released")
	},

	async Shared_Event42_Act4(runtime, localVars)
	{
		runtime.input.Input_Update("b_"+localVars.LastButton+"|"+localVars.LastGamepad, "Released")
	},

	async Title_Event2_Act1(runtime, localVars)
	{
		runtime.main.Hide_StartMenu()
	},

	async Game_Event10_Act1(runtime, localVars)
	{
		runtime.main.Toggle_HUD()
	},

	async Game_Event12_Act1(runtime, localVars)
	{
		if (runtime.timeScale === 0) runtime.timeScale = 1
		else runtime.timeScale = 0
	},

	async Game_Event14_Act1(runtime, localVars)
	{
		runtime.camera.zoomScale += 0.15
	},

	async Game_Event15_Act1(runtime, localVars)
	{
		runtime.camera.zoomScale -= 0.15
	},

	async Game_Event16_Act1(runtime, localVars)
	{
		runtime.waveManager.Update_Room_Size(true)
	},

	async Game_Event19_Act1(runtime, localVars)
	{
		runtime.player.LevelUp()
	},

	async Game_Event20_Act1(runtime, localVars)
	{
		for (const player of runtime.players) {
			if (!player.enabled) return
			player.AddCoins(100)
		}
	},

	async Game_Event21_Act1(runtime, localVars)
	{
		for (const player of runtime.players) {
			if (player.unit.healthComp.max === 9999 ) {
				const maxHPStat = player.stats.GetStatValue("HP_Max")
				player.unit.healthComp.Set_Current_To_Max(maxHPStat)
			}
			else {
		        player.unit.healthComp.Set_Current_To_Max(9000)
		    }
		}
	},

	async Game_Event24_Act1(runtime, localVars)
	{
		const player = runtime.player
		const unit = player.unit
		unit.healthComp.addCurrent(-20, true)
	},

	async Game_Event25_Act1(runtime, localVars)
	{
		runtime.spawnManager.SpawnChara("Hero_Freezard")
	},

	async Game_Event26_Act1(runtime, localVars)
	{
		const enemyUnits = runtime.units.GetUnitsByTags("Enemy", "Chara")
		for (const unit of enemyUnits) {
			unit.DestroyUnit()
		}
	},

	async Game_Event27_Act1(runtime, localVars)
	{
		runtime.player.unit.juice.Roll()
	},

	async Game_Event28_Act1(runtime, localVars)
	{
		runtime.spawnManager.SpawnRaid()
	},

	async Game_Event29_Act1(runtime, localVars)
	{
		runtime.spawnManager.SpawnCheat()
	},

	async Game_Event30_Act1(runtime, localVars)
	{
		runtime.layout.getLayer("Collisions").isVisible = !runtime.layout.getLayer("Collisions").isVisible
	},

	async Game_Event31_Act1(runtime, localVars)
	{
		runtime.layout.getLayer("HUD").isVisible = !runtime.layout.getLayer("HUD").isVisible
	},

	async Game_Event32_Act1(runtime, localVars)
	{
		runtime.player.unit.anim.angleDegrees = Math.random()*360
		runtime.player.unit.juice.currentSpring.SetCosAngle("Pos", Math.random()*360, 100)
	},

	async Game_Event33_Act1(runtime, localVars)
	{
		if (runtime.menu.CurMenu_IsShop()) return
		runtime.menu.GameOver(false, true)
	},

	async Game_Event34_Act1(runtime, localVars)
	{
		if (runtime.menu.CurMenu_IsShop()) return
		runtime.menu.GameOver(true, true)
	},

	async Game_Event35_Act1(runtime, localVars)
	{
		runtime.audio.PlayRandomMusic(5, false)
		
	},

	async Game_Event40_Act1(runtime, localVars)
	{
		runtime.waveManager.Wave_Skip(false)
	},

	async Game_Event41_Act1(runtime, localVars)
	{
		runtime.waveManager.Wave_Skip(true)
	},

	async Game_Event42_Act1(runtime, localVars)
	{
		runtime.waveManager.Wave_EndDuration()
	},

	async Game_Event43_Act1(runtime, localVars)
	{
		if (runtime.movie.IsPlaying()) {
			await runtime.movie.Scene_End()
			//runtime.waveManager.Wave_End_Actual2()
		}
		else {
			if (runtime.menu.shopPhase) {
				runtime.player.shop.ExitShop()
			}
			else {
				runtime.waveManager.Wave_End(true)
			}
		}
	},

	async Game_Event46_Act1(runtime, localVars)
	{
		let debugStats = runtime.objects["DebugText_Stats"].getFirstInstance()
		debugStats.isVisible = !debugStats.isVisible
	},

	async Game_Event63_Act1(runtime, localVars)
	{
		runtime.objects["Bullet"].getFirstPickedInstance().unit.OnCollisionWithSolid()
	},

	async Game_Event64_Act1(runtime, localVars)
	{
		const charaUnit = runtime.objects["Chara"].getFirstPickedInstance().unit
		const bulletUnit = runtime.objects["Bullet"].getFirstPickedInstance().unit
		if (!charaUnit || !bulletUnit) return
		bulletUnit.OnCollisionWithChara(charaUnit)
	},

	async Game_Event65_Act1(runtime, localVars)
	{
		const charaUnit = runtime.objects["Chara"].getFirstPickedInstance().unit
		const bulletUnit = runtime.objects["Bullet"].getFirstPickedInstance().unit
		if (!charaUnit || !bulletUnit) return
		bulletUnit.OnCollisionWithChara(charaUnit)
	},

	async Game_Event66_Act1(runtime, localVars)
	{
		const charaUnit = runtime.objects["Chara"].getFirstPickedInstance().unit
		const damageInst = runtime.objects["Hitbox"].getFirstPickedInstance().Damage
		if (!charaUnit || !damageInst) return
		damageInst.DealDamage_Test(charaUnit)
	},

	async Game_Event67_Act1(runtime, localVars)
	{
		const charaUnit = runtime.objects["Chara"].getFirstPickedInstance().unit
		const damageInst = runtime.objects["Hitbox_Enemy"].getFirstPickedInstance().Damage
		//console.error("Hitbox_Enemy", runtime.objects["Hitbox_Enemy"].getFirstPickedInstance())
		if (!charaUnit || !damageInst) return
		damageInst.DealDamage_Test(charaUnit)
	},

	async Game_Event76_Act1(runtime, localVars)
	{
		const coinInst = runtime.objects["Pickup_Coin"].getFirstPickedInstance()
		runtime.players[coinInst.instVars.PlayerIndex].Pick_Coin(coinInst.animationName)
	},

	async Start_Event1_Act2(runtime, localVars)
	{
		runtime.menu.GoTo("runScreen")
	},

	async Start_Event2_Act1(runtime, localVars)
	{
		runtime.menu.startRun.press(0, true)
	},

	async Start_Event3_Act1(runtime, localVars)
	{
		runtime.menu.startRun.press(0, false)
	},

	async Start_Event4_Act1(runtime, localVars)
	{
		runtime.menu.startRun.press(1, true)
	},

	async Start_Event5_Act1(runtime, localVars)
	{
		runtime.menu.startRun.press(1, false)
	},

	async Start_Event6_Act1(runtime, localVars)
	{
		runtime.menu.startRun.press(2, true)
	},

	async Start_Event7_Act1(runtime, localVars)
	{
		runtime.menu.startRun.press(2, false)
	},

	async Start_Event8_Act1(runtime, localVars)
	{
		runtime.menu.startRun.press(3, true)
	},

	async Start_Event9_Act1(runtime, localVars)
	{
		runtime.menu.startRun.press(3, false)
	},

	async Start_Event10_Act1(runtime, localVars)
	{
		runtime.menu.startRun.press("KEY", true)
	},

	async Start_Event11_Act1(runtime, localVars)
	{
		runtime.menu.startRun.press("KEY", false)
	}
};

self.C3.ScriptsInEvents = scriptsInEvents;
