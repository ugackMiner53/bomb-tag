<script lang="ts">
    import NetworkManager from "$lib/bomb/networking/networkmanager";
    import { setNetworkManager } from "$lib/bomb/static";
    import { onMount } from "svelte";
    import { currentUIElement } from "../components/game.svelte";
    import Selectionscreen from "./selectionscreen.svelte";
    
    onMount(() => {
        const url = window.prompt("Please enter server address");
        if (url) {
            setNetworkManager(new NetworkManager(url, () => {
                console.log("Recieved Connection!");
                $currentUIElement = Selectionscreen;
            }));
        }
    })
</script>

<h1>Connecting to server...</h1>