import { NetworkPlayer } from "../networking/netplayer";
import type { Player } from "../player/player";
import { networkManager } from "../static";

export default class Ability {
    static ID : string
    static Name? : string;
    player!: Player;
    cooldown! : number;
    duration? : number;
    canUse = true;
    // cooldownTimer : Phaser.Time.TimerEvent | null = null;
    particle? : Phaser.GameObjects.Particles.ParticleEmitter;

    Setup(player : Player) : void {
        this.player = player;
    }

    Use() : void {
        // this.player.setTint(this.player.color);
        this.canUse = false;
        this.player.scene.time.delayedCall(this.cooldown, () => {
            this.Recharge();
        })
        if (this.duration) {
            this.player.scene.time.delayedCall(this.duration, () => {
                this.End();
            })
        }
        if (!(this.player instanceof NetworkPlayer)) {
            networkManager?.sendAbility(this.player.uuid);
        }
    }

    End() : void {
        // Implemented for subclasses
    }
    
    Recharge() : void {
        // this.player.setTint(this.player.color);
        this.canUse = true;
    }
}