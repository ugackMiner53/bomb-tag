<style lang="scss">
    .player {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 12px 12px 0 0;
        text-align: center;
        width: 20%;
        height: 15vh;
        transform-origin: bottom;
        transform-style: flat;
        position: relative;

        .controlType {
            width: 20%;
            top: 0;
            right: 5%;
            position: absolute;
        }

        select, button {
            width: 50%;
        }

        .colorSelect {
            display: none;
        }
    }
</style>
<script lang="ts">
    import { AbilityList } from "$lib/bomb/builtin/abilities";    
    import { ControlConfigEnum, type PlayerConfig } from "$lib/bomb/player/playerconfig";
    import { onMount } from "svelte";
    import { usedControllerCount } from "../screens/selectionscreen.svelte";

    import Controlicons from "./controlicons.svelte";
    import { networkManager } from "$lib/bomb/static";

    export let playerConfig : PlayerConfig;
    export let removeEvent : ((uuid : string) => void)|undefined;
    
    let playerDiv : HTMLDivElement;
    let colorSelect : HTMLInputElement;
    let textColor : string;

    function changeControlType() {
        if (playerConfig.control == ControlConfigEnum.CONTROLLER) {
            playerConfig.control = ControlConfigEnum.KEYBOARD;
            $usedControllerCount--;
        } else if (playerConfig.control == ControlConfigEnum.KEYBOARD && $usedControllerCount < navigator.getGamepads().filter(gamepad => gamepad != null).length) {
            playerConfig.control = ControlConfigEnum.CONTROLLER;
            $usedControllerCount++;
        }
    }

    function updateTextColor() {
        const color = playerDiv.style.backgroundColor;
        const r = Number('0x' + color[1] + color[2]) | 0;
        const g = Number('0x' + color[3] + color[4]) | 0;
        const b = Number('0x' + color[5] + color[6]) | 0;
        const brightness = (r * 76245 + g * 149685 + b * 29070) / 1000;
        textColor = (brightness >= 128) ? "black" : "white";
    }

    onMount(() => {
        updateTextColor();
    })

</script>

<div class="player" style="background-color: {"#" + playerConfig.color.toString(16).padStart(6, "0")};" bind:this={playerDiv} on:dblclick={() => {if (playerConfig.control != ControlConfigEnum.NETWORK) {colorSelect.click()}}}>
    <div class="controlType" style:fill={textColor} on:click={changeControlType}>
        <Controlicons controlType="{playerConfig.control}" />
    </div>
    <select class="abilitySelect" bind:value={playerConfig.ability} disabled={playerConfig.control == ControlConfigEnum.NETWORK} on:change={() => {if (playerConfig.control != ControlConfigEnum.NETWORK) {networkManager?.sendPlayerConfig(playerConfig);}}}>
        {#each AbilityList as ability}
            <option value={ability.ID}>{ability.Name}</option>
        {/each}
    </select>
    {#if removeEvent != undefined && playerConfig.control != ControlConfigEnum.NETWORK}
        <button on:click={() => {if (removeEvent) {removeEvent(playerConfig.uuid)}}}>Remove</button>
    {/if}
    <input class="colorSelect" type="color" bind:this={colorSelect} on:change={() => {playerConfig.color = Number(colorSelect.value.replace("#", "0x")); playerConfig = playerConfig; updateTextColor(); if (playerConfig.control != ControlConfigEnum.NETWORK) {networkManager?.sendPlayerConfig(playerConfig);}}}> <!-- This should hopefully be hidden from the user, only appearing on dblclick -->
</div>