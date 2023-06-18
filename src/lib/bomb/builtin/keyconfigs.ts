import * as Phaser from "phaser";

export const KeyConfigs = [
    { // Player One
        up: Phaser.Input.Keyboard.KeyCodes.W,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        right: Phaser.Input.Keyboard.KeyCodes.D,
    },
    { // Player Two
        up: Phaser.Input.Keyboard.KeyCodes.UP,
        left: Phaser.Input.Keyboard.KeyCodes.LEFT,
        down: Phaser.Input.Keyboard.KeyCodes.DOWN,
        right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
    },
    { // Player Three
        up: Phaser.Input.Keyboard.KeyCodes.I,
        left: Phaser.Input.Keyboard.KeyCodes.J,
        down: Phaser.Input.Keyboard.KeyCodes.K,
        right: Phaser.Input.Keyboard.KeyCodes.L,
    },
    { // Player Four
        up: Phaser.Input.Keyboard.KeyCodes.NUMPAD_EIGHT,
        left: Phaser.Input.Keyboard.KeyCodes.NUMPAD_FOUR,
        down: Phaser.Input.Keyboard.KeyCodes.NUMPAD_FIVE,
        right: Phaser.Input.Keyboard.KeyCodes.NUMPAD_SIX,
    },
]