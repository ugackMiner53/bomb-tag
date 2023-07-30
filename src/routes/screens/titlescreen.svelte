<style lang="scss">
    @use "$lib/styles/common" as common;
    div {
        @include common.uiElement();
        @include common.cover();
        img {
            @include common.transformCenter();
            top: 20%;
            position: absolute;
        }
        .buttons {
            position: absolute;
            display: flex;
            width: 100%;
            height: 50%;
            top: 40%;
            flex-direction: column;
            justify-content: space-evenly;
            align-items: center;
        }
        button {
            width: 20%;
            height: 20%;
            font-size: 200%;
            background: none;
            color: white;
            border: none;
            &:hover {
                cursor: pointer;
                animation: rotate 1s linear infinite;
                @keyframes rotate {
                    0% {
                        transform: rotateZ(0deg) scale(1.3);
                    }
                    25% {
                        transform: rotateZ(15deg) scale(1.3);
                    }
                    50% {
                        transform: rotateZ(0deg) scale(1.3);
                    }
                    75% {
                        transform: rotateZ(-15deg) scale(1.3);
                    }
                    100% {
                        transform: rotateZ(0deg) scale(1.3);
                    }
                }
            }
        }
    }

</style>

<script lang="ts">
    import { currentUIElement } from "../components/game.svelte";
    import Selectionscreen from "./selectionscreen.svelte";
    import Multiplayerscreen from "./multiplayerscreen.svelte";
    import Modscreen from "./modscreen.svelte";
    import { base } from "$app/paths";
</script>

<div id="titlescreen">
    <img src="{base}/assets/logo.png" alt="Bomb Tag" />
    <div class="buttons">
        <button on:click={() => {$currentUIElement = Selectionscreen}}>Local Play</button>
        <!-- <button on:click={() => {$currentUIElement = Multiplayerscreen}}>Online Play</button> -->
        <button on:click={() => {$currentUIElement = Modscreen}}>Mods</button>
    </div>
</div>
