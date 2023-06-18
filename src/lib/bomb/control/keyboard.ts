import type { Control } from "./input";

export default class KeyboardControl implements Control {
    up!: boolean;
    down!: boolean;
    left!: boolean;
    right!: boolean;

    keys : {
        up: Phaser.Input.Keyboard.Key,
        down: Phaser.Input.Keyboard.Key,
        left: Phaser.Input.Keyboard.Key,
        right: Phaser.Input.Keyboard.Key
    }

    constructor(scene : Phaser.Scene, keys : {up : number, down : number, left : number, right : number}) {
        this.keys = scene.input.keyboard!.addKeys(keys) as { up: Phaser.Input.Keyboard.Key; down: Phaser.Input.Keyboard.Key; left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key; };        
    }

    Poll() {
        this.up = this.keys.up.isDown;
        this.down = this.keys.down.isDown;
        this.left = this.keys.left.isDown;
        this.right = this.keys.right.isDown;
    }



}