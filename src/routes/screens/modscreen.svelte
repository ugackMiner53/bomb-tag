<style lang="scss">
    @use "$lib/styles/common" as common;

    #modScreen {
        @include common.uiElement();
        @include common.cover();
        color: white;
    }

    .modList {
        position: absolute;
        top: 15%;
        left: 5%;
        width: 35%;
        height: 75%;

        ul {
            height: 75%;
            overflow-y: scroll;
            li {
                transform-origin: left;
                &.disabled {
                    color: gray;
                }
                &:hover {
                    transform: scale(1.1);
                    cursor: pointer;
                }
            }
        }

    }

    #modInfo {
        position: absolute;
        width: 40%;
        height: 100%;
        left: 50%;
        top: 0%;

        #modDescription {
            overflow-y: scroll;
            max-height: 50%;
        }

    }
</style>

<script lang="ts">
    import { modManager } from "$lib/bomb/static";
    import { uiModDescriptions } from "$lib/bomb/mod/manager";
    import type { ModDescription } from "$lib/bomb/types/mod";

    enum InstallState {
        NOTHING,
        INSTALLING,
        SELECTED
    }


    let currentMod : ModDescription|null = null;
    let currentInstallState = InstallState.NOTHING;

    let fileUpload : HTMLInputElement;

    function dropHandler(event : DragEvent) {
        event.preventDefault();
        if (event.dataTransfer!.files.length! > 0) {
            for (let i = 0; i < event.dataTransfer!.items.length!; i++) {
                const dataTransferItem = event.dataTransfer?.items[i];
                if (dataTransferItem!.type.includes("javascript")) { // This works for both the standard "text/javascript" and "application/x-javascript"
                    console.log(event.dataTransfer!.files[i].name);
                    const fileReader = new FileReader();
                    fileReader.onload = async () => {
                        if (fileReader.result) {
                            currentMod = modManager.parseModDetails(fileReader.result?.toString());
                            currentInstallState = InstallState.INSTALLING;
                        }
                    }
                    fileReader.readAsBinaryString(event.dataTransfer!.files[i]);                
                } else {
                    console.log(event.dataTransfer!.files[i].type);
                }
            }
        }
    }

    function uploadHandler(event : Event) {
        const fileElement = event.target as HTMLInputElement;
        let files = fileElement.files as FileList;
        Array.from(files).forEach((file) => {
            if (file.type.includes("javascript")) { // This works for both the standard "text/javascript" and "application/x-javascript"
                console.log(file.name);
                const fileReader = new FileReader();
                fileReader.onload = async () => {
                    if (fileReader.result) {
                        currentMod = modManager.parseModDetails(fileReader.result?.toString());;
                        currentInstallState = InstallState.INSTALLING
                    }
                }
                fileReader.readAsBinaryString(file);                
            } else {
                console.log(`Rejected ${file.name} for being ${file.type}`);
            }
        })
    }

    function installMod() {
        if (currentMod) {
            modManager.installMod(currentMod);
            currentInstallState = InstallState.SELECTED;
        }
    }

    function removeMod() {
        if (currentMod) {
            modManager.uninstallMod(currentMod);
            currentMod = null;
            currentInstallState = InstallState.SELECTED;
        }
    }
</script>


<div id="modScreen" on:drop={dropHandler}>
    <div class="modList">
        <label for="modList">Mods</label>
        <ul id="modList">
            {#each $uiModDescriptions as modDescription}
                <li on:click={() => {currentMod = modDescription; currentInstallState = InstallState.SELECTED;}} on:keydown={() => {currentMod = modDescription}}>{modDescription.name}</li>
            {/each}
        </ul>
        <button>Check for updates</button>
    </div>
    <div id="modInfo">
        <h1 id="modTitle">{currentMod ? `${currentMod.name} (${currentMod.version})` : ($uiModDescriptions.length > 0 ? "" : "No mods installed")}</h1>
        <p id="modAuthor">{currentMod ? currentMod.author : ""}</p>
        <p id="modDescription">{currentMod ? currentMod.description : ($uiModDescriptions.length > 0 ? "" : "No mods are currently installed! You can install some by dragging them into this tab or clicking Browse to select a file!")}</p>
        {#if currentInstallState == InstallState.INSTALLING}
            <button id="installMod" on:click={installMod}>Install</button>
        {/if}
        <button id="findMod" on:click={() => {fileUpload.click()}}>Browse</button>
        {#if currentInstallState == InstallState.SELECTED}
            <button id="removeMod" on:click={removeMod}>Remove</button>
        {/if}
    </div>
    <input type="file" name="Mod Upload" id="modUpload" style="display: none; visibility: hidden; pointer-events: none;" bind:this={fileUpload} on:change={uploadHandler}>
</div>