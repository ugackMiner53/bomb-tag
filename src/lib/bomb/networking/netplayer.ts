import type { Control } from "../control/input";
import type Ability from "../types/ability";
import { Player } from "../player/player";

export class NetworkPlayer extends Player {

    // Synced Variables
    // position
    // bomb
    // velocity

    // color
    // ability
    
    constructor(scene : Phaser.Scene, uuid : string, x : number, y : number, ability : Ability, color : number) {
        super(scene, uuid, x, y, ability, {} as Control, color);
    }

    Update = () => {
        this.Movement();
    }

    Sync(position : Phaser.Math.Vector2, velocity : Phaser.Math.Vector2, bomb : boolean) {
        // console.log(`Syncing ${this.uuid}`);
        this.setPosition(position.x, position.y);
        this.setVelocity(velocity.x, velocity.y);
        this.hasBomb = bomb;
    }

    Movement() {
        // Change animation based on velocity
        if (this.body?.velocity.x === 0) {
            this.anims.play("turn", true);
        } else {
            this.setFlipX(this.body!.velocity.x > 0);
            this.anims.play("move", true);
        }
    }

}