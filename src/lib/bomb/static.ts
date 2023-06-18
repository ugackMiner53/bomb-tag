import type { Player } from "./player/player";
import type { PlayerConfig } from "./player/playerconfig";
import ModManager from "./mod/manager";
import { Maps } from "./builtin/maps";

export const CONSTANTS = {
    // Screen Variables
    SCREEN_WIDTH: 1920,
    SCREEN_HEIGHT: 1080,
    CAMERA_OFFSET: 300,
    CAMERA_BG: 0xff0000,
    
    // Default Variables
    PLAYER_COLORS: [
        0x00ff00,
        0xffff00,
        0x0000ff,
        0xff00ff,
    ],
    
    // Game Variables
    GRAVITY : 600,
    JUMP_HEIGHT: 700,
    SPEED: 500,
    PLAYERS: 3,
    KNOCKBACK: 500,
}

export const Variables = {
    maxBombTime : 30,
    bombTime: NaN,           // The amount of time before the bomb explodes
    flashDelay: 1,          // The time between flashes of the bomb (as a percentage)
    tagCooldown: false,     // A temporary tag that limits how fast players can tag each other
    currentMap: Maps[0],
    mapWidth: CONSTANTS.SCREEN_WIDTH,
    mapHeight: CONSTANTS.SCREEN_HEIGHT,
    playerConfigs: <PlayerConfig[]>[],
}

export const GameObjects = <GameObjects>{players: <Player[]>[]};
interface GameObjects {
    players : Player[],
    smokeParticles : Phaser.GameObjects.Particles.ParticleEmitter,
}

export const modManager = new ModManager();