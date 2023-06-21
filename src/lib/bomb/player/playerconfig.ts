import type { Control } from "../control/input";
import { AbilityList } from "../builtin/abilities";
// import { NetworkPlayer } from "../player/netplayer";
import { Player } from "../player/player";
import { NetworkPlayer } from "../networking/netplayer";

export enum ControlConfigEnum {
    KEYBOARD,
    CONTROLLER,
    NETWORK
}

export class PlayerConfig {
    uuid : string;
    ability : string;
    color : number;
    control : ControlConfigEnum;

    constructor(uuid : string, ability : string, color : number, control : ControlConfigEnum) {
        this.uuid = uuid;
        this.ability = ability;
        this.color = color;
        this.control = control;
    }

    ConvertToPlayer(scene : Phaser.Scene, control : Control) : Player {
        const playerAbility = AbilityList.find(possibleAbility => possibleAbility.ID === this.ability);
        if (playerAbility) {
            // Convert the control into the type of control we need
            if (this.control == ControlConfigEnum.NETWORK) {
                return new NetworkPlayer(scene, this.uuid, 0, 0, new playerAbility(), this.color);
            } else {
                return new Player(scene, this.uuid, 0, 0, new playerAbility(), control, this.color);
            }

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