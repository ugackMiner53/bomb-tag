import type { Control } from "./input";

export default class GamepadControl implements Control {
    up!: boolean;
    down!: boolean;
    left!: boolean;
    right!: boolean;

    gamepad! : Phaser.Input.Gamepad.Gamepad;

    constructor(scene : Phaser.Scene, gamepadIndex : number) {
        console.log("Creating gamepad...")
        if (scene.input.gamepad?.getPad(gamepadIndex).connected) {
            console.log("Connected!")
            this.gamepad = scene.input.gamepad?.getPad(gamepadIndex);
        } else {
            console.error(`Gamepad #${gamepadIndex} not connected!`)
        }
    }

    Poll() {
        this.up = (this.gamepad.A || this.gamepad.B);
        this.down = (this.gamepad.X || this.gamepad.Y);
        this.left = (this.gamepad.left || this.gamepad.leftStick.x < -0.25);
        this.right = (this.gamepad.right || this.gamepad.leftStick.x > 0.25);
    }

}