import type Ability from "../types/ability";
import type * as Input from "../control/input";
import * as Phaser from "phaser";
import { GameObjects, Variables, networkManager } from "../static";

export class Player extends Phaser.Physics.Arcade.Sprite {
    uuid : string;

    speedPercentage = 1;
    jumpPercentage = 1;
    color : number;

    hasBomb = false;
    canMove = true;
    canJump = false;
    canCollide = true;
    
    ability : Ability | null;
    control : Input.Control;
    flashTimer : Phaser.Time.TimerEvent | null = null;
    coyoteTimer : Phaser.Time.TimerEvent | null = null;

    constructor(scene : Phaser.Scene, uuid: string, x : number, y : number, ability : Ability, control : Input.Control, color : number) {
        super(scene, x, y, "player");
        this.uuid = uuid;
        
        this.color = color;
        this.setTint(color);

        this.control = control;
        
        this.ability = ability;
        this.ability.Setup(this);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }
    
    Start() {
        this.setCollideWorldBounds(true);
        this.setGravityY(Variables.currentMap.gravity!);
    }

    Update = () => {
        this.control.Poll();
        if (this.canMove)
            this.Movement();
    }

    Movement() {
        // Coyote Time!
        if (this.body?.blocked.down) {
            this.canJump = true;
        } else if (this.canJump && !this.coyoteTimer) {
            this.coyoteTimer = this.scene.time.delayedCall(150, () => {
                this.canJump = false;
                this.coyoteTimer = null;
            })
        }

        let velocityX = 0;
        if (this.control.left) {
            velocityX -= (Variables.currentMap.speed! * this.speedPercentage);
            this.setFlipX(false);
        }
        if (this.control.right) {
            velocityX += (Variables.currentMap.speed! * this.speedPercentage);
            this.setFlipX(true);
        }
        
        if (velocityX === 0) {
            this.setVelocityX(0);
            this.anims.play("turn", true);
        } else {
            this.setVelocityX(velocityX);
            this.anims.play("move", true);
        }

        if (this.control.up && this.canJump) {
            this.canJump = false;
            
            this.setVelocityY(-Variables.currentMap.jumpHeight! * this.jumpPercentage);
        }

        if (this.control.down && this.ability?.canUse) {
            this.ability.Use();
        }
    }


    // NOTE: This is called by CreateObjects() in assets.ts
    // If you want to change things, check over there first
    OnCollide(bomb : boolean, bombX : number) {
        const addVelocity = () => {
            this.canMove = false;
            if (bombX > this.x) {
                this.setVelocity(-Variables.currentMap.knockback!, -Variables.currentMap.knockback!);
            } else {
                this.setVelocity(Variables.currentMap.knockback!, -Variables.currentMap.knockback!);
            }
        }
        if (this.hasBomb || bomb) {
            addVelocity();
            this.Tag(bomb);
            if (bomb) networkManager?.sendTag(this);
        }
        
    }
    
    Tag(bomb : boolean) {
        if (bomb && !this.hasBomb) {
            this.hasBomb = true;
            GameObjects.smokeParticles.startFollow(this);
            Variables.bombTime -= 1;
            this.speedPercentage += .25;
            this.scene.time.delayedCall(1000, () => {
                this.canMove = true;
            })
            if (!this.flashTimer) {
                console.log(`No flash timer for ${this.uuid}, making new one`)
                this.flashTimer = this.scene.time.addEvent({ 
                    delay: 500, 
                    callback: () => {
                        console.log(this.hasBomb);
                        if (this.hasBomb) {
                            if (this.tintTopLeft != 0xff0000)
                                this.setTint(0xff0000);
                            else
                                this.setTint(this.color);
                            this.flashTimer!.timeScale = Variables.flashDelay;
                        } else {
                            console.log(`Flash timer callback for ${this.uuid} is now removing itself`);
                            this.setTint(this.color);
                            this.scene.time.removeEvent(this.flashTimer!);
                            this.flashTimer = null;
                        }
                    }, 
                    loop: true 
                });
            } else {

                console.log(`Existing flash timer for ${this.uuid}, not making new one`)
            }
            
        } 
        else if (!bomb && this.hasBomb) {
            this.hasBomb = false;
            this.speedPercentage -= .25;
            this.scene.time.delayedCall(500, () => {
                this.canMove = true;
            })
        }
    }

    Explode() {
        this.scene.cameras.main.shake(350, 0.025);
        const particle = this.scene.add.particles(this.x, this.y, "smoke", {
            tint: 0xff0000,
            alpha: 1,
            speed: 500,
            blendMode: 'ADD',
        });
        particle.explode(100);
        this.destroy();
    }

    destroy() {
        this.canMove = false;
        if (this.flashTimer) {
            this.scene.time.removeEvent(this.flashTimer);
            this.flashTimer = null;
        }
        this.ability = null;
        super.destroy();
    }
}