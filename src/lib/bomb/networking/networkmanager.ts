import type { Player } from "../player/player";
import { Variables, playerManager } from "../static";
import { ControlConfigEnum, PlayerConfig } from "../player/playerconfig";
import { startGame, updateGameConfigUI, updatePlayerConfigUI } from "../../../routes/screens/selectionscreen.svelte";
import { Maps } from "../builtin/maps";

export default class NetworkManager {

    server : WebSocket;

    constructor(serverip : string, callback? : () => void) {
        console.log(`Connecting to ${serverip}...`);
        this.server = new WebSocket(serverip);
        this.server.onmessage = (message : MessageEvent<string>) => {
            this.HandleMessage(JSON.parse(message.data));                        
        }
        this.server.onopen = () => {
            console.log("Connected!");
            callback?.();
        }
    }

    EditPlayerConfig(newConfig : {uuid : string, ability : string, color : number}) {
        console.log(`Editing ${newConfig.uuid} to have ${newConfig.ability} and ${newConfig.color}`);
        const playerConfig = playerManager.playerConfigs.find(config => config.uuid == newConfig.uuid);
        if (!playerConfig) {
            console.log("No player, creating new one!");
            playerManager.playerConfigs.push(new PlayerConfig(newConfig.uuid, newConfig.ability, newConfig.color, ControlConfigEnum.NETWORK));
        } else {
            console.log("Editing existing player!");
            playerConfig.ability = newConfig.ability;
            playerConfig.color = newConfig.color;
        }
        updatePlayerConfigUI();
    }

    HandleMessage(data : any) {
        // console.log(data);
        switch (data.type) {

            case "start": {
                startGame();
                break;
            }

            case "gameSetting": {
                console.log("Recieved game info!");
                Variables.maxBombTime = data.maxBombTime;
                const newMap = Maps.find(map => map.id == data.map);
                if (!newMap) {
                    throw "Could not find Map with that name!";
                } else {
                    Variables.currentMap = newMap;
                }
                updateGameConfigUI();
                break;
            }

            case "playerConfig": {
                console.log("Recieved playerconfig");
                this.EditPlayerConfig(data.playerConfig);
                break;
            }

            case "allPlayerConfigs": {
                console.log("Recieved all playerConfigs");
                (<{uuid : string, ability : string, color : number}[]>data.playerConfigs).forEach(playerConfig => {
                    this.EditPlayerConfig(playerConfig);
                });
                break;
            }

            case "playerRemove": {
                playerManager.playerConfigs = playerManager.playerConfigs.filter(playerConfig => playerConfig.uuid != data.uuid);
                updatePlayerConfigUI();
                break;
            }

            // Player Events
            case "playerData": {
                playerManager.netPlayers.get(data.uuid)?.Sync(
                    {
                        x: data.position.x,
                        y: data.position.y
                    } as Phaser.Math.Vector2,
                    {
                        x: data.velocity.x,
                        y: data.velocity.y
                    } as Phaser.Math.Vector2,
                    data.hasBomb
                )
                break;
            }
            
            case "playerAbility": {
                // playerManager.netPlayers.get(data.uuid)?.ability?.Recharge(); // There *must* be some better way to do this!
                playerManager.netPlayers.get(data.uuid)?.ability?.Use();
                break;
            }

            case "playerTag": {
                playerManager.players.forEach((player, uuid) => {
                    if (uuid == data.taggedUUID) {
                        player.Tag(true);
                    } else if (player.hasBomb) {
                        player.Tag(false);
                    }
                })
                break;
            }

            case "playerExplode": {
                const player = playerManager.players.get(data.explodedUUID);
                player?.Explode();
                playerManager.players.delete(data.explodedUUID);
                playerManager.netPlayers.delete(data.explodedUUID);
                playerManager.localPlayers.delete(data.explodedUUID);
                Variables.bombTime = 0;
                Variables.flashDelay = 1;
                break;
            }

            default:
                console.log(`Unrecognized packet ${data.type}`);
        }
    }


    sendGameInfo() {
        console.log("Sending game info!");
        this.send({
            type: "gameSetting",
            maxBombTime: Variables.maxBombTime,
            map: Variables.currentMap.id
        })
    }

    sendPlayerConfig(playerConfig : PlayerConfig) {
        this.send({
            type: "playerConfig",
            uuid: playerConfig.uuid,
            ability: playerConfig.ability,
            color: playerConfig.color
        });
    }

    sendPlayerRemove(uuid : string) {
        this.send({
            type: "playerRemove",
            uuid: uuid
        });
    }

    startGame() {
        this.send({
            type: "start"
        })
    }

    sendPlayerData() {
        const localPlayerData = {
            type: "playerData",
            players: <object[]>[],
        };
        playerManager.localPlayers.forEach((player, uuid) => {
            const playerData = {
                uuid: uuid,
                position: {
                    x: player.x,
                    y: player.y
                },
                velocity: {
                    x: player.body?.velocity.x,
                    y: player.body?.velocity.y
                },
                bomb: player.hasBomb,
                canCollide: player.canCollide
            };
            localPlayerData.players.push(playerData);
        })
        this.send(localPlayerData);
    }

    sendAbility(uuid : string) {
        this.send({
            type: "playerAbility",
            uuid: uuid
        });
    }

    sendTag(taggedPlayer : Player) {
        this.send({
            type: "playerTag",
            taggedUUID: taggedPlayer.uuid
        });
    }

    sendExplode(explodedPlayer : Player) {
        this.send({
            type: "playerExplode",
            explodedUUID: explodedPlayer.uuid
        })
    }

    send(message : unknown) {
        this.server.send(JSON.stringify(message));
    }

    closeServer() {
        this.server.close();
    }

}