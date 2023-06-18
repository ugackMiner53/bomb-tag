// import type { Player } from "../player/player";
// import type { NetworkPlayer } from "./netplayer";
// import { GameObjects, Variables } from "../static";
// import { PlayerConfig } from "../player/playerconfig";

// export default class NetworkManager {

//     server : WebSocket;

//     uuid : string;
//     netPlayers = {} as {[uuid : string] : NetworkPlayer};
//     last : {
//         position : Phaser.Math.Vector2;
//         abilityUse : boolean;
//         bomb : boolean;
//     }

//     constructor(serverip : string) {
//         console.log(`Connecting to ${serverip}...`);
//         this.server = new WebSocket(serverip);
//         this.server.onmessage = (message : MessageEvent<string>) => {
//             this.HandleMessage(JSON.parse(message.data));                        
//         }
//         this.server.onopen = () => {
//             console.log("Connected!");
//         }
//     }

//     HandleMessage(data : any) {
//         // console.log(data);
//         switch (data.type) {
//             // User Events
//             case "uuid":
//                 this.uuid = data.uuid;
//                 break;

//             // Game Events
//             case "start":
//                 SelectionScene.instance.StartGameEvent();
//                 break;

//             case "playerInfo":
//                 console.log("Recieved playerinfo");
//                 const playerInfo = Variables.playerConfigs.find(config => config.uuid == data.uuid);
//                 if (!playerInfo) {
//                     SelectionScene.instance.AddNewPlayerUI();
//                     Variables.playerConfigs.push(new PlayerConfig(data.ability, data.color, data.uuid));
//                 } else {
//                     playerInfo.ability = data.ability;
//                     playerInfo.color = data.color;
//                 }
//                 break;

//             // Player Events
//             case "playerData":
//                 this.netPlayers[data.uuid].Sync(
//                     {
//                         x: data.position.x,
//                         y: data.position.y
//                     } as Phaser.Math.Vector2,
//                     {
//                         x: data.velocity.x,
//                         y: data.velocity.y
//                     } as Phaser.Math.Vector2,
//                 )
//                 break;
            
//             case "playerAbility":
//                 this.netPlayers[data.uuid].ability?.Recharge();
//                 this.netPlayers[data.uuid].ability?.Use();
//                 break;
            
//             case "playerTag":
//                 if (data.uuid == this.uuid) {
//                     Variables.mainPlayer?.Tag(true);
//                 }
//                 Object.keys(this.netPlayers).forEach(uuid => {
//                     if (uuid == data.uuid) {
//                         this.netPlayers[data.uuid].Tag(true);
//                     } else if (this.netPlayers[data.uuid].hasBomb) {
//                         this.netPlayers[data.uuid].Tag(false);
//                     }
//                 })
//                 break;

//             default:
//                 console.log(`Unrecognized packet ${data.type}`);
//         }
//     }

//     sendGameInfo() {
//         // dont wanna
//     }

//     sendPlayerInfo() {
//         this.send({
//             type: "playerInfo",
//             ability: (<HTMLSelectElement>SelectionScene.UI.playerList.children[0].querySelector(".abilitySelect")).value,
//             color: parseInt((<HTMLInputElement>SelectionScene.UI.playerList.children[0].querySelector('.colorSelect')).value.slice(1), 16)
//         });
//     }

//     startGame() {
//         this.send({
//             type: "start"
//         })
//     }

//     sendPlayerData() {
//         if (Variables.mainPlayer) {
//             this.send({
//                 type: "playerData",
//                 position: {
//                     x: Variables.mainPlayer.x,
//                     y: Variables.mainPlayer.y
//                 },
//                 velocity: {
//                     x: Variables.mainPlayer.body?.velocity.x,
//                     y: Variables.mainPlayer.body?.velocity.y
//                 },
//                 bomb: Variables.mainPlayer.hasBomb
//             })
//         } else {
//             console.log("Attempting to send playerData, but finding no main player!");
//         }

//     }

//     sendAbility() {
//         this.send({
//             type: "playerAbility"
//         });
//     }

//     sendTag(taggedPlayer : Player) {
//         const uuid = Object.keys(this.netPlayers).find(uuid => this.netPlayers[uuid] == taggedPlayer);
//         this.send({
//             type: "playerTag",
//             uuid: uuid
//         });
//     }

//     send(message : any) {
//         this.server.send(JSON.stringify(message));
//     }

//     closeServer() {
//         this.server.close();
//     }

// }