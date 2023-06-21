<script lang="ts">
    import { game } from "../components/game.svelte";
    import type { Player } from "$lib/bomb/player/player";
    import { currentUIElement } from "../components/game.svelte";
    import Selectionscreen from "./selectionscreen.svelte";

    (<any>window).game = $game;
    (<any>window).gameObjects = GameObjects;
    $game.scene.switch("uiscene", "gamescene");
</script>

<script lang="ts" context="module">
    import { GameObjects, Variables, CONSTANTS, modManager, playerManager, networkManager } from "$lib/bomb/static";
    import { LoadAssets, LoadCustomAssets, CreateObjects } from "$lib/bomb/assets";

    export class MainGame extends Phaser.Scene 
    {
        constructor() {
            super({key: "gamescene"});
        }

        preload() {
            modManager.preloadMods(this);
            LoadAssets(this);
        }

        create() {
            LoadCustomAssets(this, () => {
                this.load.once(Phaser.Loader.Events.COMPLETE, () => {
                    CreateObjects(this);
                    GameObjects.smokeParticles = this.add.particles(0, 0, "smoke", {
                        speed: 100,
                        scale: { start: 1, end: 0 },
                        blendMode: 'ADD',
                        emitting: false
                    });
                    this.time.delayedCall(3000, () => {
                        this.cameras.main.shake(350, 0.025);
                        // Add in smoke particles
                        GameObjects.smokeParticles.start();
                        if (!networkManager)
                            this.BombRandomPlayer();
                        Variables.bombTime = 0;
                        Variables.flashDelay = 1;
                        this.time.addEvent(
                        { 
                            delay: 1000, 
                            callback: this.CheckExplode, 
                            loop: true 
                        });
                    })
                    modManager.startMods(this);
                    const zoomX = (-2*(Variables.mapWidth - CONSTANTS.SCREEN_WIDTH))/CONSTANTS.SCREEN_WIDTH + 1;
                    const zoomY = (-2*(Variables.mapHeight - CONSTANTS.SCREEN_HEIGHT))/CONSTANTS.SCREEN_HEIGHT + 1;
                    this.cameras.main.setZoom(Math.min(Math.max(zoomX, 1), Math.max(zoomY, 1)));
                    this.cameras.main.centerOn(Variables.mapWidth/2, Variables.mapHeight/2);
                    this.cameras.main.fadeIn(1000, 0, 0, 0);
                })
                this.load.tilemapTiledJSON(Variables.currentMap.id, Variables.currentMap.tilemap).start();
            });
        }

        CheckExplode = () => {
            if (Variables.bombTime > Variables.maxBombTime && playerManager.players.size > 1) {
                const bombedPlayers = <Player[]>[];
                playerManager.players.forEach(player => {
                    if (player.hasBomb == true)
                        bombedPlayers.push(player);
                })

                if (bombedPlayers.length > 0) {
                    bombedPlayers[0].Explode();
                    networkManager?.sendExplode(bombedPlayers[0]);
                    playerManager.players.delete(bombedPlayers[0].uuid);
                }


                // Maybe add some more explosion FX?
                if (playerManager.players.size > 1 && !networkManager)
                    this.BombRandomPlayer();
            }
            if (playerManager.players.size <= 1) {
                GameObjects.smokeParticles?.stop();
                this.time.delayedCall(2000, () => {this.WinAnimation()});
            }
            Variables.bombTime++;
                    
            // TODO: Make a better formula
            // This one sucks
            Variables.flashDelay = 1 + (Variables.bombTime/Variables.maxBombTime)*6.5;
        }

        BombRandomPlayer() {
            const randomIndex = Math.floor(Math.random() * (playerManager.players.size));
            [...playerManager.players.values()][randomIndex].Tag(true);
            Variables.bombTime = 0;
            Variables.flashDelay = 1;
        }

        WinAnimation() {
            console.log("Winning!");
            this.time.removeAllEvents();
            const player = [...playerManager.players.values()][0];
            player.canMove = false;
            player.setCollideWorldBounds(false);
            player.body!.checkCollision.none = true;
            player.setVelocity(0);
            player.setGravityY(-Variables.currentMap.gravity! -600);

            const playerOffscreenCheck = setInterval(() => {
                if (player.y < 0) {
                    clearInterval(playerOffscreenCheck);
                    this.cameras.main.fadeOut(1500, 0, 0, 0);
                }
            }, 500)
            
            this.cameras.main.on(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                playerManager.clearPlayers();
                this.scene.switch("uiscene");
                this.scene.stop("gamescene");
                currentUIElement.set(Selectionscreen);
            });
        }

        
        UpdateCamera() {
            const players = [...playerManager.players.values()];

            const playersX = players.map(player => player.x);
            const playersY = players.map(player => player.y);

            const centerX = playersX.reduce((sum, x) => sum + x, 0)/playerManager.players.size;
            const centerY = playersY.reduce((sum, y) => sum + y, 0)/playerManager.players.size;
            this.cameras.main.centerOn(centerX, centerY);

            const distX = Math.abs(Math.max(...playersX) - Math.min(...playersX))+CONSTANTS.CAMERA_OFFSET;
            const zoomX = (-2*(distX-CONSTANTS.SCREEN_WIDTH))/CONSTANTS.SCREEN_WIDTH + 1;
            
            const distY = Math.abs(Math.max(...playersY) - Math.min(...playersY))+CONSTANTS.CAMERA_OFFSET
            const zoomY = (-2*(distY-CONSTANTS.SCREEN_HEIGHT))/CONSTANTS.SCREEN_HEIGHT + 1;

            const zoom = Math.min(Math.max(zoomX, 1), Math.max(zoomY, 1));
            this.cameras.main.zoomTo(zoom, 100); 
        }

        // This function is run on every frame
        update() {
            this.UpdateCamera();
            playerManager.players.forEach((player) => {
                player.Update();
            })
            modManager.updateMods(this);
            networkManager?.sendPlayerData();
        }

    }
</script>

<!-- There really doesn't need to be anything here because we don't want to show anything while the game is running -->