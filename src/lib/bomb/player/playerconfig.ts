import type { Control } from "../control/input";
import { AbilityList } from "../builtin/abilities";
// import { NetworkPlayer } from "../player/netplayer";
import { Player } from "../player/player";

export class PlayerConfig {
    uuid : string;
    ability : string;
    color : number;

    constructor(uuid : string, ability : string, color : number) {
        this.uuid = uuid;
        this.ability = ability;
        this.color = color;
    }

    ConvertToPlayer(scene : Phaser.Scene, control : Control) : Player {
        const playerAbility = AbilityList.find(possibleAbility => possibleAbility.ID === this.ability);
        if (playerAbility) {
            return new Player(scene, 0, 0, new playerAbility(), control, this.color);
        //     if (this.uuid)
        //         return new NetworkPlayer(scene, this.uuid, 0, 0, new playerAbility(), this.color);
        //     else
        } else {
            throw `Ability ${this.ability} not found!`;
        }
    }

    // ConvertToNetPlayer(scene : Phaser.Scene) {
    //     let playerAbility = AbilityList.find(possibleAbility => possibleAbility.ID === this.ability);
    //     if (playerAbility && this.uuid) {
    //     } else {
    //         throw `Ability ${this.ability} or UUID ${this.uuid} not found or not present!`;
    //     }
    // }
}