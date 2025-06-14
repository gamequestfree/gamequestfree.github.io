const C3 = self.C3;
self.C3_GetObjectRefTable = function () {
	return [
		C3.Plugins.FileSystem,
		C3.Plugins.skymen_GlobalRuntime,
		C3.Plugins.Audio,
		C3.Plugins.Browser,
		C3.Plugins.gamepad,
		C3.Plugins.Keyboard,
		C3.Plugins.Mouse,
		C3.Plugins.PlatformInfo,
		C3.Plugins.Touch,
		C3.Plugins.LocalStorage,
		C3.Plugins.NodeWebkit,
		C3.Plugins.Steamworks_Ext,
		C3.Plugins.pipelabv2,
		C3.Plugins.overboy_healthbar,
		C3.Plugins.HTMLElement,
		C3.Behaviors.Tween,
		C3.Behaviors.Timer,
		C3.Plugins.Sprite,
		C3.Behaviors.scrollto,
		C3.Behaviors.Sin,
		C3.Behaviors.Fade,
		C3.Plugins.Spritefont2,
		C3.Behaviors.Flash,
		C3.Plugins.TiledBg,
		C3.Plugins.DrawingCanvas,
		C3.Plugins.Text,
		C3.Behaviors.LOS,
		C3.Behaviors.Pin,
		C3.Plugins.NinePatch,
		C3.Plugins.Particles,
		C3.Behaviors.solid,
		C3.Behaviors.Bullet,
		C3.Plugins.System.Cnds.OnLayoutStart,
		C3.Plugins.System.Acts.SetLayerVisible,
		C3.Plugins.Spritefont2.Cnds.IsBoolInstanceVarSet,
		C3.Plugins.System.Cnds.ForEach,
		C3.Plugins.Spritefont2.Acts.SetScale,
		C3.Behaviors.Tween.Exps.Value,
		C3.Plugins.Sprite.Cnds.OnCreated,
		C3.Plugins.Sprite.Acts.SetAnimFrame,
		C3.Plugins.System.Exps.random,
		C3.Plugins.Sprite.Exps.AnimationFrameCount,
		C3.Plugins.System.Acts.CreateObject,
		C3.Plugins.Sprite.Exps.X,
		C3.Plugins.Sprite.Exps.Y,
		C3.Plugins.Sprite.Acts.AddChild,
		C3.Plugins.Sprite.Acts.SetSize,
		C3.Plugins.Sprite.Exps.Width,
		C3.Plugins.System.Cnds.IsGroupActive,
		C3.Plugins.System.Cnds.IsPreview,
		C3.Plugins.System.Cnds.CompareBoolVar,
		C3.Plugins.Keyboard.Cnds.OnKey,
		C3.Plugins.Text.Acts.SetVisible,
		C3.ScriptsInEvents.Game_Event10_Act1,
		C3.ScriptsInEvents.Game_Event12_Act1,
		C3.Plugins.Browser.Acts.RequestFullScreen,
		C3.ScriptsInEvents.Game_Event14_Act1,
		C3.ScriptsInEvents.Game_Event15_Act1,
		C3.ScriptsInEvents.Game_Event16_Act1,
		C3.ScriptsInEvents.Game_Event19_Act1,
		C3.ScriptsInEvents.Game_Event20_Act1,
		C3.ScriptsInEvents.Game_Event21_Act1,
		C3.Plugins.System.Acts.SetTimescale,
		C3.Plugins.System.Exps.timescale,
		C3.Plugins.Keyboard.Cnds.IsKeyDown,
		C3.ScriptsInEvents.Game_Event24_Act1,
		C3.ScriptsInEvents.Game_Event25_Act1,
		C3.ScriptsInEvents.Game_Event26_Act1,
		C3.ScriptsInEvents.Game_Event27_Act1,
		C3.ScriptsInEvents.Game_Event28_Act1,
		C3.ScriptsInEvents.Game_Event29_Act1,
		C3.ScriptsInEvents.Game_Event30_Act1,
		C3.ScriptsInEvents.Game_Event31_Act1,
		C3.ScriptsInEvents.Game_Event33_Act1,
		C3.ScriptsInEvents.Game_Event34_Act1,
		C3.ScriptsInEvents.Game_Event35_Act1,
		C3.Plugins.System.Acts.RestartLayout,
		C3.ScriptsInEvents.Game_Event40_Act1,
		C3.ScriptsInEvents.Game_Event41_Act1,
		C3.ScriptsInEvents.Game_Event42_Act1,
		C3.ScriptsInEvents.Game_Event43_Act1,
		C3.ScriptsInEvents.Game_Event46_Act1,
		C3.Plugins.System.Acts.SetVar,
		C3.Plugins.System.Cnds.CompareVar,
		C3.Plugins.System.Acts.SetFramerateMode,
		C3.Plugins.System.Acts.SetCollisionCellSize,
		C3.Plugins.Sprite.Acts.SetOpacity,
		C3.Plugins.System.Acts.SetObjectTimescale,
		C3.Plugins.Audio.Acts.Stop,
		C3.Plugins.Sprite.Acts.SetVisible,
		C3.Behaviors.Tween.Acts.TweenOneProperty,
		C3.Behaviors.Tween.Cnds.OnTweensFinished,
		C3.Plugins.Sprite.Cnds.OnCollision,
		C3.ScriptsInEvents.Game_Event63_Act1,
		C3.Plugins.Sprite.Cnds.IsBoolInstanceVarSet,
		C3.ScriptsInEvents.Game_Event64_Act1,
		C3.ScriptsInEvents.Game_Event66_Act1,
		C3.Plugins.Sprite.Cnds.PickParent,
		C3.ScriptsInEvents.Game_Event67_Act1,
		C3.Behaviors.Flash.Acts.Flash,
		C3.Plugins.System.Cnds.Every,
		C3.Plugins.Sprite.Acts.SetPos,
		C3.Plugins.Sprite.Exps.BBoxLeft,
		C3.Plugins.Sprite.Exps.BBoxRight,
		C3.Plugins.Sprite.Exps.BBoxTop,
		C3.Plugins.Sprite.Exps.BBoxBottom,
		C3.Plugins.Sprite.Acts.SetAngle,
		C3.Behaviors.Tween.Cnds.IsPlaying,
		C3.Plugins.Sprite.Cnds.PickByUID,
		C3.Behaviors.Tween.Acts.SetTwoPropertiesTweensEndValue,
		C3.Plugins.Sprite.Acts.InstanceSignal,
		C3.Plugins.Sprite.Acts.Destroy,
		C3.Plugins.Sprite.Cnds.OnInstanceSignal,
		C3.ScriptsInEvents.Game_Event76_Act1,
		C3.Behaviors.Bullet.Acts.SetEnabled,
		C3.Behaviors.Bullet.Acts.SetAngleOfMotion,
		C3.Behaviors.Bullet.Acts.SetSpeed,
		C3.Behaviors.Bullet.Cnds.IsEnabled,
		C3.Behaviors.Bullet.Cnds.CompareSpeed,
		C3.Plugins.Sprite.Acts.SetBoolInstanceVar,
		C3.ScriptsInEvents.Shared_Event6_Act1,
		C3.ScriptsInEvents.Shared_Event7_Act1,
		C3.ScriptsInEvents.Shared_Event8_Act1,
		C3.ScriptsInEvents.Shared_Event12_Act1,
		C3.ScriptsInEvents.Shared_Event13_Act1,
		C3.Plugins.Sprite.Exps.Height,
		C3.Plugins.Sprite.Acts.SetZElevation,
		C3.Plugins.Particles.Cnds.OnCreated,
		C3.Plugins.Particles.Acts.SetInitOpacity,
		C3.Plugins.Particles.Acts.FastForward,
		C3.Plugins.System.Cnds.Repeat,
		C3.Plugins.System.Exps.viewportleft,
		C3.Plugins.Sprite.Exps.LayerName,
		C3.Plugins.System.Exps.viewportwidth,
		C3.Plugins.System.Exps.viewporttop,
		C3.Plugins.System.Exps.viewportheight,
		C3.Plugins.System.Cnds.Compare,
		C3.Plugins.System.Exps.layoutname,
		C3.Plugins.Sprite.Acts.SetInstanceVar,
		C3.Plugins.Sprite.Acts.SetScale,
		C3.Plugins.Mouse.Cnds.OnMovement,
		C3.Plugins.Mouse.Exps.MovementX,
		C3.Plugins.Mouse.Exps.MovementY,
		C3.ScriptsInEvents.Shared_Event29_Act1,
		C3.Plugins.Mouse.Cnds.OnClick,
		C3.ScriptsInEvents.Shared_Event30_Act1,
		C3.ScriptsInEvents.Shared_Event31_Act1,
		C3.ScriptsInEvents.Shared_Event32_Act1,
		C3.Plugins.Mouse.Cnds.OnWheel,
		C3.ScriptsInEvents.Shared_Event33_Act1,
		C3.ScriptsInEvents.Shared_Event34_Act1,
		C3.Plugins.Mouse.Cnds.OnRelease,
		C3.ScriptsInEvents.Shared_Event35_Act1,
		C3.ScriptsInEvents.Shared_Event36_Act1,
		C3.ScriptsInEvents.Shared_Event37_Act1,
		C3.Plugins.Keyboard.Cnds.OnAnyKey,
		C3.Plugins.Keyboard.Exps.LastKeyCode,
		C3.ScriptsInEvents.Shared_Event38_Act2,
		C3.Plugins.Keyboard.Cnds.OnAnyKeyReleased,
		C3.ScriptsInEvents.Shared_Event39_Act2,
		C3.Plugins.gamepad.Cnds.HasGamepads,
		C3.Plugins.gamepad.Cnds.OnAnyButtonDown,
		C3.Plugins.gamepad.Exps.LastButton,
		C3.Plugins.gamepad.Exps.GamepadIndex,
		C3.ScriptsInEvents.Shared_Event41_Act3,
		C3.ScriptsInEvents.Shared_Event41_Act4,
		C3.Plugins.gamepad.Cnds.OnAnyButtonUp,
		C3.ScriptsInEvents.Shared_Event42_Act3,
		C3.ScriptsInEvents.Shared_Event42_Act4,
		C3.Plugins.Sprite.Cnds.OnAnyAnimFinished,
		C3.Plugins.TiledBg.Exps.X,
		C3.Plugins.TiledBg.Exps.Y,
		C3.Plugins.TiledBg.Exps.Width,
		C3.Plugins.TiledBg.Exps.Height,
		C3.ScriptsInEvents.Title_Event2_Act1,
		C3.ScriptsInEvents.Start_Event1_Act2,
		C3.Plugins.gamepad.Cnds.IsButtonDown,
		C3.ScriptsInEvents.Start_Event2_Act1,
		C3.Plugins.System.Cnds.Else,
		C3.ScriptsInEvents.Start_Event3_Act1,
		C3.ScriptsInEvents.Start_Event4_Act1,
		C3.ScriptsInEvents.Start_Event5_Act1,
		C3.ScriptsInEvents.Start_Event6_Act1,
		C3.ScriptsInEvents.Start_Event7_Act1,
		C3.ScriptsInEvents.Start_Event8_Act1,
		C3.ScriptsInEvents.Start_Event9_Act1,
		C3.ScriptsInEvents.Start_Event10_Act1,
		C3.ScriptsInEvents.Start_Event11_Act1,
		C3.Plugins.System.Acts.SetFunctionReturnValue,
		C3.Plugins.System.Exps.objectcount
	];
};
self.C3_JsPropNameTable = [
	{FileSystem: 0},
	{GlobalRuntime: 0},
	{Audio: 0},
	{Browser: 0},
	{Gamepad: 0},
	{Keyboard: 0},
	{Mouse: 0},
	{PlatformInfo: 0},
	{Touch: 0},
	{LocalStorage: 0},
	{NWjs: 0},
	{Steamworks: 0},
	{Pipelab: 0},
	{Bar_Local: 0},
	{Tween: 0},
	{Timer: 0},
	{Pointburst: 0},
	{HTML_Coin: 0},
	{HTML_PlayerFrame: 0},
	{ScrollTo: 0},
	{Camera: 0},
	{Circle: 0},
	{Cursor: 0},
	{Cursor_Dir: 0},
	{Circle_Gradient: 0},
	{Sine: 0},
	{Sine2: 0},
	{Circle_Gradient_Sines: 0},
	{Fade: 0},
	{Circle_Fading: 0},
	{Beam_Laser_End: 0},
	{Iso_offset_always: 0},
	{ZOrder_Enable: 0},
	{Order: 0},
	{Iso_offset: 0},
	{forceBefore: 0},
	{Circle_Step_FX: 0},
	{Circle_Proj: 0},
	{Solid: 0},
	{Solid_00: 0},
	{ID: 0},
	{Solid_Border: 0},
	{FX_Ambiant: 0},
	{FX_Blood: 0},
	{major: 0},
	{FX_Bloodsplosion: 0},
	{FX_Coupure_Red: 0},
	{FX_Explosion: 0},
	{FX_Explosion_Big: 0},
	{FX_Flesh_Debris: 0},
	{FX_ParticlePoof: 0},
	{FX_Poc: 0},
	{test: 0},
	{Shadow: 0},
	{SF_TextImpact_Red: 0},
	{Flash: 0},
	{Telegraph_BirthSpawn: 0},
	{SF_TextImpact: 0},
	{Telegraph_BirthSpawn2: 0},
	{FX_Bloodsplosion_White: 0},
	{FX_Coupure_White: 0},
	{Weight: 0},
	{Area_Spawn: 0},
	{Bar: 0},
	{Beam_Laser_End_Old: 0},
	{Beam_Laser_TiledBG: 0},
	{Active: 0},
	{Chara: 0},
	{HP_Max: 0},
	{EveryWave: 0},
	{CharaPos: 0},
	{DC_Shadow: 0},
	{Debug: 0},
	{Debug2: 0},
	{DebugText: 0},
	{DebugText_Stats: 0},
	{Hit_Vignette: 0},
	{Leg: 0},
	{Side: 0},
	{Light: 0},
	{Line: 0},
	{LOS: 0},
	{Pickup_Chest: 0},
	{ActuallyPickable: 0},
	{UID_Entity: 0},
	{CanBePickup: 0},
	{PlayerIndex: 0},
	{NeedActualColl: 0},
	{Pickup_Coin: 0},
	{PlayerChara: 0},
	{SpecialPlayer: 0},
	{PlayerPos: 0},
	{PostPro_Vignette: 0},
	{scaleDown: 0},
	{SF_Pointburst: 0},
	{SF_Pointburst2: 0},
	{Square: 0},
	{Square_Bottom: 0},
	{Text_Editor: 0},
	{Text_Game: 0},
	{Text_HUD: 0},
	{TrKey: 0},
	{Text_Title: 0},
	{Pickup_Potion: 0},
	{Pickup_Soul_Flask: 0},
	{Text_Bark: 0},
	{Text_Bar: 0},
	{VignetteGame: 0},
	{InfoShake_Text: 0},
	{DungeonGround: 0},
	{Text_Bark_Boss: 0},
	{Pickup_Mushroom: 0},
	{Text_HUD2: 0},
	{DC_Glow: 0},
	{DC_Local: 0},
	{Text_Icon: 0},
	{Text_SoulPortal: 0},
	{DC_Outlines: 0},
	{TiledBG_Border: 0},
	{IsMain: 0},
	{TiledBG_DungeonOriginal: 0},
	{TiledBG_Grass_Moss: 0},
	{TiledBG_DungeonMain: 0},
	{TiledBG_Border2: 0},
	{TiledBG_Jungle: 0},
	{TiledBG_Grass_Astral_FirePink: 0},
	{TiledBG_Dungeon_FireBlue: 0},
	{TiledBG_Plank_FireGreen: 0},
	{TiledBG_Ground_Moss: 0},
	{TiledBG_Ice_Dungeon_FireBlue: 0},
	{TiledBG_Grass_Dungeon_FirePink3: 0},
	{TiledBG_Grass_Dungeon_FirePink2: 0},
	{Pin: 0},
	{Anim: 0},
	{EntityCollide: 0},
	{Bullet: 0},
	{Hitbox: 0},
	{Hitbox_Enemy: 0},
	{Hurtbox_Player: 0},
	{Wep: 0},
	{Orb: 0},
	{Goop: 0},
	{Beam_Laser: 0},
	{Pentagram: 0},
	{TitleGround: 0},
	{CuteDevil: 0},
	{Bandes: 0},
	{CamTitle: 0},
	{Cadre: 0},
	{Pic: 0},
	{Particle_Spark: 0},
	{Fireflies: 0},
	{Type: 0},
	{Particle: 0},
	{Circle_Telegraph: 0},
	{Bar_Shadow: 0},
	{frame_linetextframe_03_Demo: 0},
	{frame_tabmenu_focus_01_l: 0},
	{frame: 0},
	{scale: 0},
	{Enviro_Props: 0},
	{CharacterFrame: 0},
	{FX_Promotion: 0},
	{Sprite2: 0},
	{Chain_NoLoop: 0},
	{ezgif297312959bdefault: 0},
	{FX_SmoothFire: 0},
	{FX_SmoothFire_FullWhite: 0},
	{FX_SmoothFire_Grayscale: 0},
	{FX_SmoothFire_InGame: 0},
	{BGFond: 0},
	{Bar_Frame: 0},
	{Bar_Skull: 0},
	{Sprite22: 0},
	{FX_Apparition_Turquoise: 0},
	{FX_Spark: 0},
	{FX_Electricity: 0},
	{FX_Sparks_Grayscale: 0},
	{Raid_Telegraph: 0},
	{ChainFX: 0},
	{ChainFX_Blue: 0},
	{FX_Lightning_Strike: 0},
	{TitleLogo: 0},
	{TitleLogo_Chinese: 0},
	{Dice_Icon: 0},
	{Coin_Portal: 0},
	{FX_Walkstep: 0},
	{Corner: 0},
	{Circle_Range: 0},
	{Versus: 0},
	{Icon: 0},
	{Solids: 0},
	{DebugObjects: 0},
	{CameraTarget: 0},
	{BackPool_OnFinished: 0},
	{ZOrder: 0},
	{FX_DestroyFinished: 0},
	{BackPool_Children: 0},
	{TileBG: 0},
	{Pickup_Coins: 0},
	{Picks: 0},
	{ObjectTimescale: 0},
	{Fullscreen: 0},
	{Fullscreen_9Patch: 0},
	{WaveDepops: 0},
	{TiledBG_Spawn: 0},
	{Text_Translate: 0},
	{Framerate: 0},
	{CellState: 0},
	{Death: 0},
	{isCheating: 0},
	{IsInCheatShop: 0},
	{DontShowCheatButton: 0},
	{LastKeyCode: 0},
	{LastButton: 0},
	{LastGamepad: 0}
];

self.InstanceType = {
	FileSystem: class extends self.IInstance {},
	GlobalRuntime: class extends self.IInstance {},
	Audio: class extends self.IInstance {},
	Browser: class extends self.IInstance {},
	Gamepad: class extends self.IInstance {},
	Keyboard: class extends self.IInstance {},
	Mouse: class extends self.IInstance {},
	PlatformInfo: class extends self.IInstance {},
	Touch: class extends self.IInstance {},
	LocalStorage: class extends self.IInstance {},
	NWjs: class extends self.IInstance {},
	Steamworks: class extends C3.Plugins.Steamworks_Ext.Instance {},
	Pipelab: class extends C3.Plugins.pipelabv2.Instance {},
	Bar_Local: class extends self.IWorldInstance {},
	Pointburst: class extends self.IHTMLElementInstance {},
	HTML_Coin: class extends self.IHTMLElementInstance {},
	HTML_PlayerFrame: class extends self.IHTMLElementInstance {},
	Camera: class extends self.ISpriteInstance {},
	Circle: class extends self.ISpriteInstance {},
	Cursor: class extends self.ISpriteInstance {},
	Cursor_Dir: class extends self.ISpriteInstance {},
	Circle_Gradient: class extends self.ISpriteInstance {},
	Circle_Gradient_Sines: class extends self.ISpriteInstance {},
	Circle_Fading: class extends self.ISpriteInstance {},
	Beam_Laser_End: class extends self.ISpriteInstance {},
	Circle_Step_FX: class extends self.ISpriteInstance {},
	Circle_Proj: class extends self.ISpriteInstance {},
	Solid: class extends self.ISpriteInstance {},
	Solid_00: class extends self.ISpriteInstance {},
	Solid_Border: class extends self.ISpriteInstance {},
	FX_Ambiant: class extends self.ISpriteInstance {},
	FX_Blood: class extends self.ISpriteInstance {},
	FX_Bloodsplosion: class extends self.ISpriteInstance {},
	FX_Coupure_Red: class extends self.ISpriteInstance {},
	FX_Explosion: class extends self.ISpriteInstance {},
	FX_Explosion_Big: class extends self.ISpriteInstance {},
	FX_Flesh_Debris: class extends self.ISpriteInstance {},
	FX_ParticlePoof: class extends self.ISpriteInstance {},
	FX_Poc: class extends self.ISpriteInstance {},
	Shadow: class extends self.ISpriteInstance {},
	SF_TextImpact_Red: class extends self.ISpriteFontInstance {},
	Telegraph_BirthSpawn: class extends self.ISpriteInstance {},
	SF_TextImpact: class extends self.ISpriteFontInstance {},
	Telegraph_BirthSpawn2: class extends self.ISpriteInstance {},
	FX_Bloodsplosion_White: class extends self.ISpriteInstance {},
	FX_Coupure_White: class extends self.ISpriteInstance {},
	Area_Spawn: class extends self.ISpriteInstance {},
	Bar: class extends self.IWorldInstance {},
	Beam_Laser_End_Old: class extends self.ISpriteInstance {},
	Beam_Laser_TiledBG: class extends self.ITiledBackgroundInstance {},
	CharaPos: class extends self.ISpriteInstance {},
	DC_Shadow: class extends self.IDrawingCanvasInstance {},
	Debug: class extends self.ISpriteInstance {},
	Debug2: class extends self.ISpriteInstance {},
	DebugText: class extends self.ITextInstance {},
	DebugText_Stats: class extends self.ITextInstance {},
	Hit_Vignette: class extends self.ISpriteInstance {},
	Leg: class extends self.ISpriteInstance {},
	Light: class extends self.ISpriteInstance {},
	Line: class extends self.ISpriteInstance {},
	LOS: class extends self.ISpriteInstance {},
	Pickup_Chest: class extends self.ISpriteInstance {},
	Pickup_Coin: class extends self.ISpriteInstance {},
	PlayerPos: class extends self.ISpriteInstance {},
	PostPro_Vignette: class extends self.ISpriteInstance {},
	SF_Pointburst: class extends self.ISpriteFontInstance {},
	SF_Pointburst2: class extends self.ISpriteFontInstance {},
	Square: class extends self.ISpriteInstance {},
	Square_Bottom: class extends self.ISpriteInstance {},
	Text_Editor: class extends self.ITextInstance {},
	Text_Game: class extends self.ITextInstance {},
	Text_HUD: class extends self.ITextInstance {},
	Text_Title: class extends self.ITextInstance {},
	Pickup_Potion: class extends self.ISpriteInstance {},
	Pickup_Soul_Flask: class extends self.ISpriteInstance {},
	Text_Bark: class extends self.ITextInstance {},
	Text_Bar: class extends self.ITextInstance {},
	VignetteGame: class extends self.ISpriteInstance {},
	InfoShake_Text: class extends self.ITextInstance {},
	DungeonGround: class extends self.ISpriteInstance {},
	Text_Bark_Boss: class extends self.ITextInstance {},
	Pickup_Mushroom: class extends self.ISpriteInstance {},
	Text_HUD2: class extends self.ITextInstance {},
	DC_Glow: class extends self.IDrawingCanvasInstance {},
	DC_Local: class extends self.IDrawingCanvasInstance {},
	Text_Icon: class extends self.ITextInstance {},
	Text_SoulPortal: class extends self.ITextInstance {},
	DC_Outlines: class extends self.IDrawingCanvasInstance {},
	TiledBG_Border: class extends self.ITiledBackgroundInstance {},
	TiledBG_DungeonOriginal: class extends self.ITiledBackgroundInstance {},
	TiledBG_Grass_Moss: class extends self.ITiledBackgroundInstance {},
	TiledBG_DungeonMain: class extends self.ITiledBackgroundInstance {},
	TiledBG_Border2: class extends self.ITiledBackgroundInstance {},
	TiledBG_Jungle: class extends self.ITiledBackgroundInstance {},
	TiledBG_Grass_Astral_FirePink: class extends self.ITiledBackgroundInstance {},
	TiledBG_Dungeon_FireBlue: class extends self.ITiledBackgroundInstance {},
	TiledBG_Plank_FireGreen: class extends self.ITiledBackgroundInstance {},
	TiledBG_Ground_Moss: class extends self.ITiledBackgroundInstance {},
	TiledBG_Ice_Dungeon_FireBlue: class extends self.ITiledBackgroundInstance {},
	TiledBG_Grass_Dungeon_FirePink3: class extends self.ITiledBackgroundInstance {},
	TiledBG_Grass_Dungeon_FirePink2: class extends self.ITiledBackgroundInstance {},
	Anim: class extends self.ISpriteInstance {},
	Bullet: class extends self.ISpriteInstance {},
	Chara: class extends self.ISpriteInstance {},
	Hitbox: class extends self.ISpriteInstance {},
	Hitbox_Enemy: class extends self.ISpriteInstance {},
	Hurtbox_Player: class extends self.ISpriteInstance {},
	Wep: class extends self.ISpriteInstance {},
	Orb: class extends self.ISpriteInstance {},
	Goop: class extends self.ISpriteInstance {},
	Beam_Laser: class extends self.ISpriteInstance {},
	Pentagram: class extends self.ISpriteInstance {},
	TitleGround: class extends self.ISpriteInstance {},
	CuteDevil: class extends self.ISpriteInstance {},
	Bandes: class extends self.ISpriteInstance {},
	CamTitle: class extends self.ISpriteInstance {},
	Cadre: class extends self.IWorldInstance {},
	Pic: class extends self.ISpriteInstance {},
	Particle_Spark: class extends self.IParticlesInstance {},
	Fireflies: class extends self.IParticlesInstance {},
	Particle: class extends self.ISpriteInstance {},
	Circle_Telegraph: class extends self.ISpriteInstance {},
	Bar_Shadow: class extends self.ISpriteInstance {},
	frame_linetextframe_03_Demo: class extends self.ISpriteInstance {},
	frame_tabmenu_focus_01_l: class extends self.ISpriteInstance {},
	frame: class extends self.ISpriteInstance {},
	Enviro_Props: class extends self.ISpriteInstance {},
	CharacterFrame: class extends self.ISpriteInstance {},
	FX_Promotion: class extends self.ISpriteInstance {},
	Sprite2: class extends self.ISpriteInstance {},
	Chain_NoLoop: class extends self.ISpriteInstance {},
	ezgif297312959bdefault: class extends self.ISpriteInstance {},
	FX_SmoothFire: class extends self.ISpriteInstance {},
	FX_SmoothFire_FullWhite: class extends self.ISpriteInstance {},
	FX_SmoothFire_Grayscale: class extends self.ISpriteInstance {},
	FX_SmoothFire_InGame: class extends self.ISpriteInstance {},
	BGFond: class extends self.ISpriteInstance {},
	Bar_Frame: class extends self.ISpriteInstance {},
	Bar_Skull: class extends self.ISpriteInstance {},
	Sprite22: class extends self.ISpriteInstance {},
	FX_Apparition_Turquoise: class extends self.ISpriteInstance {},
	FX_Spark: class extends self.ISpriteInstance {},
	FX_Electricity: class extends self.ISpriteInstance {},
	FX_Sparks_Grayscale: class extends self.ISpriteInstance {},
	Raid_Telegraph: class extends self.ISpriteInstance {},
	ChainFX: class extends self.ISpriteInstance {},
	ChainFX_Blue: class extends self.ISpriteInstance {},
	FX_Lightning_Strike: class extends self.ISpriteInstance {},
	TitleLogo: class extends self.ISpriteInstance {},
	TitleLogo_Chinese: class extends self.ISpriteInstance {},
	Dice_Icon: class extends self.ISpriteInstance {},
	Coin_Portal: class extends self.ISpriteInstance {},
	FX_Walkstep: class extends self.ISpriteInstance {},
	Corner: class extends self.ISpriteInstance {},
	Circle_Range: class extends self.ISpriteInstance {},
	Versus: class extends self.ISpriteInstance {},
	Icon: class extends self.ISpriteInstance {},
	Solids: class extends self.ISpriteInstance {},
	DebugObjects: class extends self.ISpriteInstance {},
	CameraTarget: class extends self.ISpriteInstance {},
	BackPool_OnFinished: class extends self.ISpriteInstance {},
	ZOrder: class extends self.ISpriteInstance {},
	FX_DestroyFinished: class extends self.ISpriteInstance {},
	BackPool_Children: class extends self.ISpriteInstance {},
	TileBG: class extends self.ITiledBackgroundInstance {},
	Pickup_Coins: class extends self.ISpriteInstance {},
	Picks: class extends self.ISpriteInstance {},
	ObjectTimescale: class extends self.ISpriteInstance {},
	Fullscreen: class extends self.ISpriteInstance {},
	Fullscreen_9Patch: class extends self.IWorldInstance {},
	WaveDepops: class extends self.ISpriteInstance {},
	TiledBG_Spawn: class extends self.ITiledBackgroundInstance {},
	Text_Translate: class extends self.ITextInstance {}
}