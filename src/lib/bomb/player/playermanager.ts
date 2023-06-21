import { KeyConfigs } from "../builtin/keyconfigs";
import GamepadControl from "../control/controller";
import type { Control } from "../control/input";
import KeyboardControl from "../control/keyboard";
import { NetworkPlayer } from "../networking/netplayer";
import type { Player } from "./player";
import { ControlConfigEnum, type PlayerConfig } from "./playerconfig";

export default class PlayerManager {

    playerConfigs : PlayerConfig[] = <PlayerConfig[]>[];

    players : Map<string, Player> = new Map<string, Player>();

    netPlayers : Map<string, NetworkPlayer> = new Map<string, NetworkPlayer>();
    localPlayers : Map<string, Player> = new Map<string, Player>();

    createPlayers(scene : Phaser.Scene) {
        let gamepads = 0;
        let keyboards = 0;
        this.playerConfigs.forEach((playerConfig, i) => {
            let control;
            if (playerConfig.control == ControlConfigEnum.CONTROLLER) {
                control = new GamepadControl(scene, gamepads);
                gamepads++;
            } else if (playerConfig.control == ControlConfigEnum.KEYBOARD) {
                control = new KeyboardControl(scene, KeyConfigs[keyboards]);
                keyboards++;
            } else {
                control = {} as Control;
            }
            const player = playerConfig.ConvertToPlayer(scene, control);
            player.setPosition(400, 100*i); // TODO: Change this to a dynamic system!
            this.players.set(playerConfig.uuid, player);
        })

        this.players.forEach((player, uuid) => {
            if (player instanceof NetworkPlayer) {
                console.log(`${uuid} is instance of NetworkPlayer`)
                this.netPlayers?.set(uuid, player);
            } else {
                console.log(`${uuid} is not instance of NetworkPlayer`)
                this.localPlayers?.set(uuid, player);
            }
        })
    }

    clearPlayers() {
        this.players.clear();
        this.netPlayers?.clear();
        this.localPlayers?.clear();
    }



}