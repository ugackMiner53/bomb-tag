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

<script lang="ts">
    import Gamescreen from "./gamescreen.svelte";
    import { AbilityList } from "$lib/bomb/builtin/abilities";
    import { PlayerConfig } from "$lib/bomb/player/playerconfig";
    import Playerconfig from "../components/playerconfig.svelte";
    import { CONSTANTS, Variables } from "$lib/bomb/static";
    import { currentUIElement } from "../components/game.svelte";
    import { fade } from "svelte/transition";
    import { Maps } from "$lib/bomb/builtin/maps";
    
    let playerConfigs = Variables.playerConfigs;

    function startGame() {
        $currentUIElement = Gamescreen;
    }

    function removeByUUID(uuid : string) {
        playerConfigs = playerConfigs.filter(playerConfig => playerConfig.uuid != uuid);
    }

    function addNewPlayer() {
        playerConfigs.push(new PlayerConfig(crypto.randomUUID(), AbilityList[0].ID!, playerConfigs.length < CONSTANTS.PLAYER_COLORS.length ? CONSTANTS.PLAYER_COLORS[playerConfigs.length] : 0xffffff));
        playerConfigs = playerConfigs;
    }

    function updateMap(event : Event) {
        const newMap = Maps.find(map => map.id == (<HTMLSelectElement>event.target).value);
        if (!newMap) {
            throw "Could not find Map with that name!";
        } else {
            Variables.currentMap = newMap;
        }
    }

</script>

<div id="selectionScene" transition:fade>
    <div class="mapSelection">
        <label for="mapSelect">Map</label>
        <select name="Select Map" id="mapSelect" value={Variables.currentMap.id} on:change={updateMap}>
            {#each Maps as map}
                <option value={map.id}>{map.name}</option>
            {/each}
        </select>
    </div>
    <div class="bombTimeSelection">
        <label for="bombTime">Bomb Time</label>
        <input type="range" name="Bomb Time" id="bombTime" bind:value={Variables.maxBombTime} min="1" max="60" />
    </div>
    <button id="startGame" on:click={startGame}>
        <span>Start Game</span>
    </button>
    <div id="playerList">
        {#each playerConfigs as playerConfig}
            <Playerconfig removeEvent={playerConfigs.length > 2 ? removeByUUID : undefined} playerConfig={playerConfig} />
        {/each}
        {#if playerConfigs.length < 4}
            <div id="addNewPlayer" on:click={addNewPlayer} on:keydown={addNewPlayer}>
                <button>＋</button>
            </div>
        {/if}
    </div>
</div>