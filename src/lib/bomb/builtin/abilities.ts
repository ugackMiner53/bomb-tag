import Ability from "../types/ability";
import { CONSTANTS, GameObjects, Variables, playerManager } from "../static";
import type { Player } from "../player/player";

export class DashAbility extends Ability 
{
    static ID = "dash";
    static Name = "Dash";
    cooldown = 3000;
    
    Setup(player : Player) : void {
        super.Setup(player);
        this.particle = this.player.scene.add.particles(0, 0, "smoke", {
            color: [this.player.color],
            speed: 100,
            blendMode: 'ADD',
            emitting: false
        });
    }

    Use = () : void => {
        this.player.canCollide = false;
        this.player.setVelocity(this.player.body!.velocity.x*10, this.player.body!.velocity.y*2);
        
        this.particle?.explode(10, this.player.x, this.player.y);
        
        this.player.scene.time.delayedCall(100, () => {
            this.player.canCollide = true;
        })
        super.Use();
    }
}

export class PhaseAbility extends Ability 
{
    static ID = "phase";
    static Name = "Phase";
    cooldown = 5000;
    duration = 1500;

    Setup(player : Player) : void {
        super.Setup(player);
        this.particle = this.player.scene.add.particles(0, 0, "smoke", {
            color: [this.player.color],
            speed: 100,
            blendMode: 'ADD',
            emitting: false
        });
    }

    Use = () : void => {
        this.player.setAlpha(0.25);
        this.player.canCollide = false;
        this.player.speedPercentage += .25;

        this.particle?.explode(10, this.player.x, this.player.y);
        // this.player.scene.time.delayedCall(1000, () => {
        //     this.particle?.stop();
        // })

        super.Use();
    }

    End(): void {
        this.player.setAlpha(1);
        this.player.speedPercentage -= .25;
        this.player.canCollide = true;
    }
}

export class SpeedAbility extends Ability 
{
    static ID = "speed"; 
    static Name = "Speed";
    cooldown = 5000;
    duration = 1500;

    Setup(player : Player) : void {
        super.Setup(player);
        this.particle = this.player.scene.add.particles(0, 0, "smoke", {
            color: [this.player.color],
            speed: 100,
            blendMode: 'ADD',
            emitting: false,
        });
    }

    Use = () : void => {
        this.player.speedPercentage += .75;
        this.player.jumpPercentage += .5;
        this.player.setGravityY(Variables.currentMap.gravity!*2);

        this.particle?.startFollow(this.player);
        this.particle?.start();
        super.Use();
    }

    End(): void {
        if (this.player.body) {
            this.player.speedPercentage -= .75;
            this.player.jumpPercentage -= .5;
            this.player.setGravityY(Variables.currentMap.gravity!);
        }
        this.particle?.stop();
    }
}

export class RewindAbility extends Ability {
    static ID = "rewind";
    static Name = "Rewind";
    cooldown = 3000;
    duration = 2000;

    storedPosition : Phaser.Math.Vector2 | undefined;

    Setup(player: Player): void {
        super.Setup(player);
        this.particle = this.player.scene.add.particles(0, 0, "smoke", {
            color: [this.player.color],
            speed: 100,
            blendMode: 'ADD',
            emitting: false
        });
    }

    Use = () : void => {
        if (this.player.body) {
            this.storedPosition = this.player.body!.position.clone();
            this.particle?.explode(10, this.storedPosition.x, this.storedPosition.y);
        }
        super.Use();
    }

    End(): void {
        this.particle?.stop();
        this.player.setAlpha(0.5);
        if (this.player.body) {
            this.player.canMove = false;
            this.player.body!.checkCollision.none = true;
            this.player.setVelocity(0);
            this.player.scene.physics.moveTo(this.player, this.storedPosition!.x, this.storedPosition!.y, 1, 250);
            this.player.scene.time.delayedCall(250, () => {
                this.player.setAlpha(1);
                this.player.body!.checkCollision.none = false;
                this.player.canMove = true;
                this.player.setPosition(this.storedPosition?.x, this.storedPosition?.y);
                this.storedPosition = undefined;
                this.player.setVelocity(0);
            })
        }
    }
}

export class PushAbility extends Ability {
    static ID = "push";
    static Name = "Push"
    cooldown = 3000;

    Use = () : void => {
        playerManager.players.forEach((player : Player) => {
            if (player != this.player && Phaser.Math.Distance.Between(this.player.x, this.player.y, player.x, player.y) < 300) {
                const vel = Phaser.Math.Vector2.RIGHT.rotate(Phaser.Math.Angle.Between(this.player.x, this.player.y, player.x, player.y)).normalize().multiply({x: CONSTANTS.SPEED, y: CONSTANTS.SPEED});
                player.canMove = false;
                player.setVelocity(vel.x, vel.y);
                player.scene.time.delayedCall(1000, () => {
                    player.canMove = true;
                })
            }
        })
        
        
        super.Use();
    }
}

export const AbilityList : typeof Ability[] = [
    DashAbility,
    PhaseAbility,
    SpeedAbility,
    RewindAbility,
    // PushAbility
]