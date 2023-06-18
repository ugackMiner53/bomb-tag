<script lang="ts">
    import { game } from "../components/game.svelte";
    import { Player } from "$lib/bomb/player/player";
    import { SpeedAbility } from "$lib/bomb/builtin/abilities";
    import KeyboardControl from "$lib/bomb/control/keyboard";
    import { KeyConfigs } from "$lib/bomb/builtin/keyconfigs";
    import { currentUIElement } from "../components/game.svelte";
    import Selectionscreen from "./selectionscreen.svelte";

    (<any>window).game = $game;
    (<any>window).gameObjects = GameObjects;
    $game.scene.switch("uiscene", "gamescene");
</script>

<script lang="ts" context="module">
    import { GameObjects, Variables, CONSTANTS, modManager } from "$lib/bomb/static";
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
                    const thing = new Player(this, 0, 0, new SpeedAbility(), new KeyboardControl(this, KeyConfigs[0]), 0xffff00);
                    thing.Start();
                    CreateObjects(this);
                    this.time.delayedCall(3000, () => {
                        this.cameras.main.shake(350, 0.025);
                        // Add in smoke particles
                        GameObjects.smokeParticles = this.add.particles(0, 0, "smoke", {
                            speed: 100,
                            scale: { start: 1, end: 0 },
                            blendMode: 'ADD'
                        });
                        this.BombRandomPlayer();
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
            if (Variables.bombTime > Variables.maxBombTime && GameObjects.players.length > 1) {
                const player = GameObjects.players.filter((player) => {
                    return player.hasBomb === true;
                });

                if (player.length > 0) {
                    player[0].Explode();
                    GameObjects.players.splice(GameObjects.players.indexOf(player[0]), 1);
                }
                // Maybe add some more explosion FX?
                if (GameObjects.players.length > 1)
                    this.BombRandomPlayer();
                else {
                    GameObjects.smokeParticles?.stop();
                    this.time.delayedCall(2000, () => {this.WinAnimation()});
                }
            }
            Variables.bombTime++;
                    
            // TODO: Make a better formula
            // This one sucks
            Variables.flashDelay = 1 + (Variables.bombTime/Variables.maxBombTime)*6.5;
        }

        BombRandomPlayer() {
            const randomIndex = Math.floor(Math.random() * (GameObjects.players.length));
            GameObjects.players[randomIndex].Tag(true);
            Variables.bombTime = 0;
            Variables.flashDelay = 1;
        }

        WinAnimation() {
            this.time.removeAllEvents();
            GameObjects.players[0].canMove = false;
            GameObjects.players[0].setCollideWorldBounds(false);
            GameObjects.players[0].body!.checkCollision.none = true;
            GameObjects.players[0].setVelocity(0);
            GameObjects.players[0].setGravityY(-Variables.currentMap.gravity! -600);

            const playerOffscreenCheck = setInterval(() => {
                if (GameObjects.players[0].y < 0) {
                    clearInterval(playerOffscreenCheck);
                    this.cameras.main.fadeOut(1500, 0, 0, 0);
                }
            }, 500)
            
            this.cameras.main.on(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                GameObjects.players = [];
                this.scene.switch("uiscene");
                this.scene.stop("gamescene");
                currentUIElement.set(Selectionscreen);
            });
        }

        
        UpdateCamera() {
            const playersX = GameObjects.players.map(player => player.x);
            const playersY = GameObjects.players.map(player => player.y);

            const centerX = playersX.reduce((sum, x) => sum + x, 0)/GameObjects.players.length;
            const centerY = playersY.reduce((sum, y) => sum + y, 0)/GameObjects.players.length;
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
            GameObjects.players.forEach((player) => {
                player.Update();
            })
            modManager.updateMods(this);
            // Variables.networkManager?.sendPlayerData();
        }

    }
</script>

<!-- There really doesn't need to be anything here because we don't want to show anything while the game is running -->