<style lang="scss">
    @use "$lib/styles/common" as common;

    #game {
        position: relative;
        overflow: hidden; 
        height: auto !important;
        width: auto !important;
        max-width: 100%;
        max-height: 100%;
    }

    #backButton {
        @include common.uiElement();
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        position: absolute;
        top: 2%;
        left: 2%;
        cursor: pointer;
    }
</style>

<script lang="ts" context="module">
    import { writable, type Writable } from "svelte/store";

    export const game = writable({} as Phaser.Game);
    export let currentUIElement : Writable<ConstructorOfATypedSvelteComponent> = writable(Titlescreen);

    // Workaround for unsecure contexts
    if (!window.isSecureContext) {
        import("uuid").then((something) => {
            (<any>window).crypto.randomUUID = something.v4;
        })
    }

    // Expose variables to window and globalThis
    (<any>window).BombTag = {
        modManager: modManager,
        gameObjects: GameObjects,
        variables: Variables,
        constants: CONSTANTS,
        game: game,
    }

    Maps.forEach(map => {
        ValidateMap(map);
    })

    modManager.loadMods();

    export class UIScene extends Phaser.Scene {
        constructor() {
            super({key: "uiscene"});
        }
    }
</script>

<script lang="ts">
    import { onMount } from "svelte";
    import Titlescreen from "../screens/titlescreen.svelte";

    import { CONSTANTS, GameObjects, modManager, Variables } from "$lib/bomb/static";
    import { MainGame } from "../screens/gamescreen.svelte";
    import Gamescreen from "../screens/gamescreen.svelte";
    import { ValidateMap } from "$lib/bomb/types/map";
    import { Maps } from "$lib/bomb/builtin/maps";

    let gameElem : HTMLDivElement;

    onMount(() => {
        const config : Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            scale: {
                mode: Phaser.Scale.FIT,
                parent: gameElem,
                width: CONSTANTS.SCREEN_WIDTH,
                height: CONSTANTS.SCREEN_HEIGHT,
                autoCenter: Phaser.Scale.NO_CENTER,
                fullscreenTarget: gameElem
            },
            physics: {
                default: 'arcade',
                arcade: {
                    fps: 1000,      // Increases the internal physics tick rate
                    gravity: {y: CONSTANTS.GRAVITY},
                    tileBias: 32,   // This should be close to the tile size, but 32px still lets you clip into the floor at 10*vel
                                    // Needs more experimentation
                    // debug: true    // Change this to true in order to see some helpful info!
                }
            },
            input: {
                gamepad: true,
                keyboard: true
            },
            disableContextMenu: true, 
            scene: [UIScene, MainGame]
        }
        $game = new Phaser.Game(config)
    });


</script>

<div id="game" bind:this={gameElem}>
    <div id="ui">
        <svelte:component this={$currentUIElement} />
        {#if $currentUIElement != Titlescreen && $currentUIElement != Gamescreen}
            <button id="backButton" on:click={() => {$currentUIElement = Titlescreen}}>◀</button>
        {/if}
    </div>
    <!-- The Phaser canvas element should be injected below -->
</div>