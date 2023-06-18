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
    import type { PlayerConfig } from "$lib/bomb/player/playerconfig";

    export let playerConfig : PlayerConfig;
    export let removeEvent : ((uuid : string) => void)|undefined;
    
    let playerDiv : HTMLDivElement;
    let colorSelect : HTMLInputElement;
</script>

<div class="player" style="background-color: {"#" + playerConfig.color.toString(16).padStart(6, "0")};" bind:this={playerDiv} on:dblclick={() => {colorSelect.click()}}>
    <select class="abilitySelect" bind:value={playerConfig.ability}>
        {#each AbilityList as ability}
            <option value={ability.ID}>{ability.Name}</option>
        {/each}
    </select>
    {#if removeEvent != undefined}
        <button on:click={() => {if (removeEvent) {removeEvent(playerConfig.uuid)}}}>Remove</button>
    {/if}
    <input class="colorSelect" type="color" bind:this={colorSelect} on:change={() => {playerConfig.color = Number(colorSelect.value.replace("#", "0x")); playerConfig = playerConfig;}}> <!-- This should hopefully be hidden from the user, only appearing on dblclick -->
</div>