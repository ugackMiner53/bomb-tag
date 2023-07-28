<style lang="scss">
    @use "$lib/styles/common" as common;

    @mixin inputElement {
        display: flex;
        flex-flow: column;
        width: 20%;
        position: absolute;
        color: white;
        align-items: center;
    }

    #selectionScene {
        @include common.uiElement();
        @include common.cover();
    }

    #playerList {
        position: absolute;
        display: flex;
        width: 100%;
        bottom: 0;
        justify-content: space-evenly;

        #addNewPlayer {
            width: 10%;
            
            button {
                height: 100%;
                width: 100%;
                background: none;
                border: none;
                color: white;
                font-size: 1.75em;
                transition: all 1s;
                transform: scale(1);
                cursor: pointer;

                &:hover {
                    transform: scale(2)
                }

                &:active {
                    transform: scale(1.5)
                }
            }

        }
    }

    #startGame {
        @include common.transformCenter();
        position: inherit;
        font-size: 3vw;
        font-weight: bold;
        border: none;
        border-radius: 0.75em;
        background-image: linear-gradient(135deg, #ffdb3b 10%,#FE53BB 45%, #8F51EA 67%, #0044ff 87%);
        background-size: 250% 250%;
        animation: background_gradient 5s alternate infinite;
        cursor: pointer;

        &:hover {
            animation: background_gradient .5s alternate infinite;
        }

        @keyframes background_gradient {
            0% {
                background-position: 0% 50%;
            }
            
            100% {
                background-position: 100% 50%;
            }
        }

        span {
            display: block;
            box-sizing: border-box;
            border: 2px solid black;
            border-radius: 0.75em;
            padding: 0.75em 1.5em;
            background: #e8e8e8;
            transform: translateY(-0.2em);
            transition: transform 0.1s ease;
        }

        &:hover span {
            transform: translateY(-0.33em);
        }

        &:active span {
            transform: translateY(0);
        }
    }

    .mapSelection {
        @include inputElement();
        top: 13%;
        left: 13%;
    }

    .bombTimeSelection {
        @include inputElement();
        top: 13%;
        left: 65%;
    }
</style>

<script lang="ts" context="module">
    import { currentUIElement } from "../components/game.svelte";

    export const usedControllerCount = writable(0);
    
    export const configs = writable(playerManager.playerConfigs);

    export const gameConfig = writable({
        bombTime: 30,
        map: Maps[0]
    })

    export function startGame() {
        if (playerManager.playerConfigs.length >= 2) {
            currentUIElement.set(Gamescreen);
        }
    }
    
    export function updatePlayerConfigUI() {
        console.log("Trying to rerender...");
        configs.set(playerManager.playerConfigs);
    }

    export function updateGameConfigUI() {
        gameConfig.set({
            bombTime: Variables.maxBombTime,
            map: Variables.currentMap
        })
        Variables.maxBombTime = Variables.maxBombTime;
        Variables.currentMap.id = Variables.currentMap.id;
    }
</script>

<script lang="ts">
    import Gamescreen from "./gamescreen.svelte";
    import { AbilityList } from "$lib/bomb/builtin/abilities";
    import { ControlConfigEnum, PlayerConfig } from "$lib/bomb/player/playerconfig";
    import Playerconfig from "../components/playerconfig.svelte";
    import { CONSTANTS, Variables, networkManager, playerManager } from "$lib/bomb/static";
    import { fade } from "svelte/transition";
    import { Maps } from "$lib/bomb/builtin/maps";
    import { writable } from "svelte/store";
    
    function removeByUUID(uuid : string) {
        playerManager.playerConfigs = playerManager.playerConfigs.filter(playerConfig => playerConfig.uuid != uuid);
        networkManager?.sendPlayerRemove(uuid);
        updatePlayerConfigUI();
    }

    function addNewPlayer() {
        const playerConfig = new PlayerConfig(crypto.randomUUID(), AbilityList[0].ID!, playerManager.playerConfigs.length < CONSTANTS.PLAYER_COLORS.length ? CONSTANTS.PLAYER_COLORS[playerManager.playerConfigs.length] : 0xffffff, ControlConfigEnum.KEYBOARD);
        playerManager.playerConfigs.push(playerConfig);
        playerManager.playerConfigs = playerManager.playerConfigs;
        networkManager?.sendPlayerConfig(playerConfig);
        updatePlayerConfigUI();
    }

    function updateMap(event : Event) {
        const newMap = Maps.find(map => map.id == (<HTMLSelectElement>event.target).value);
        if (!newMap) {
            throw "Could not find Map with that name!";
        } else {
            Variables.currentMap = newMap;
            networkManager?.sendGameInfo();
            updateGameConfigUI();
        }
    }

    function updateBombTime(event : Event) {
        Variables.maxBombTime = Number((<HTMLInputElement>event.target).value);
        networkManager?.sendGameInfo();
        updateGameConfigUI();   
    }
</script>

<div id="selectionScene" transition:fade>
    <div class="mapSelection">
        <label for="mapSelect">Map</label>
        <select name="Select Map" id="mapSelect" value={$gameConfig.map.id} on:change={updateMap}>
            {#each Maps as map}
                <option value={map.id}>{map.name}</option>
            {/each}
        </select>
    </div>
    <div class="bombTimeSelection">
        <label for="bombTime">Bomb Time</label>
        <input type="range" name="Bomb Time" id="bombTime" bind:value={$gameConfig.bombTime} min="1" max="60" on:change={updateBombTime}/>
    </div>
    <button id="startGame" on:click={() => {if (networkManager) {networkManager.startGame()} else {startGame()}}}>
        <span>Start Game</span>
    </button>
    <div id="playerList">
        {#each $configs as playerConfig}
            <Playerconfig removeEvent={(playerManager.playerConfigs.length > 2 || networkManager != undefined) ? removeByUUID : undefined} playerConfig={playerConfig} />
        {/each}
        {#if $configs.length < 4}
            <div id="addNewPlayer" on:click={addNewPlayer} on:keydown={addNewPlayer}>
                <button>＋</button>
            </div>
        {/if}
    </div>
</div>