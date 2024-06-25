export enum ENUM_COLLIDER_TAG {
    BASKET_TRIGGER = 1,
    GROUND_TRIGGER,
    GROUND,
    SCORE,
}

export const SCENE_TO_RESOURCES_MAPPING: {[key: string]: string} = {
    "Gameplay_Snow": "resources_Snow",
    "Gameplay_Sport": "resources_Sport",
    "Gameplay_Street": "resources_Street",
};

export enum ENUM_GAME_EVENT {
    SPAWN_NEW_BALL = "spawn-new-ball",
    THROW_BALL = "throw-ball",
    START_GAME = "start-game",
    UPDATE_SCORE = 'update-score',
    SHOW_TUTORIAL = 'show-tutorial',
}

export enum ENUM_AUDIO_CLIP {
    BGM = 'BGM',
    
    SFX_BOUNCE = 'sfx_bounce',
    SFX_COMBO = 'sfx_combo',
    SFX_ENDGAME = 'sfx_endgame',
    SFX_HIT = 'sfx_hit',
    SFX_ROLL = 'sfx_roll',
    SFX_SCORE = 'sfx_score',
    SFX_START = 'sfx_start',
    SFX_TIMEUP = 'sfx_timeup'
}


export enum GameState {
    Loading,
    MainMenu,
    Playing,
    Replay,
    EndGame
}