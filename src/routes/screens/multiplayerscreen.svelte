<script lang="ts">
    import NetworkManager from "$lib/bomb/networking/networkmanager";
    import { setNetworkManager } from "$lib/bomb/static";
    import { onMount } from "svelte";
    import { currentUIElement } from "../components/game.svelte";
    import Selectionscreen from "./selectionscreen.svelte";
    
    onMount(() => {
        setNetworkManager(new NetworkManager("ws://24ae-173-95-152-41.ngrok-free.app", () => {
            console.log("Recieved Connection!");
            $currentUIElement = Selectionscreen;
        }));
    })
</script>

<h1>Connecting to server...</h1>