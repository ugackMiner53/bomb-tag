import type Mod from "../types/mod";
import type { ModDescription } from "../types/mod";
import { Map } from "../types/map";
import Ability from "../types/ability";
import { ValidateMap } from "../types/map";
import { AbilityList } from "../builtin/abilities";
import { Maps } from "../builtin/maps";
import { writable } from "svelte/store";

export const uiModDescriptions = writable([] as ModDescription[]);

export default class ModManager {
    classes = {
        Ability,
        Map,
    };
    database! : IDBDatabase;
    mods : Mod[] = [];
    modDescriptions : ModDescription[] = [];

    loadMods() {
        const request = window.indexedDB.open("BombTag", 1);
        request.onerror = (event : IDBRequestEventMap["error"]) => {
            console.error("Something went wrong when opening the mod database!");
            // ModScene.UI.author.textContent = "Mod Storage disabled!";
            // ModScene.UI.description.textContent = "Check your browser's settings for more details!";
        }

        request.onupgradeneeded = (event : IDBRequestEventMap["success"]) => {
            this.database = <IDBDatabase>(<IDBRequest>event.target!).result;
            const modStore = this.database.createObjectStore("mods", { keyPath: "id" });

            modStore.createIndex("name", "name", {unique: false});
            modStore.createIndex("version", "version", {unique: false});
            modStore.createIndex("author", "author", {unique: false});
            modStore.createIndex("description", "description", {unique: false});
            modStore.createIndex("link", "link", {unique: false});
            modStore.createIndex("mod", "mod", {unique: false});

        }

        request.onsuccess = (event : IDBRequestEventMap["success"]) => {
            this.database = (<IDBRequest>event.target!).result;
            const transaction = this.database.transaction(["mods"], "readonly");
            const modStore = transaction.objectStore("mods");
            const request = modStore.getAll();

            request.onsuccess = (event : IDBRequestEventMap["success"]) => {
                request.result.forEach((mod) => this.addModDescription(mod));
                // this.resetAbilityListings();
                // this.resetMapListings();
            }
            
        }
    }

    addModDescription(mod : ModDescription) {
        this.modDescriptions.push(mod);
        uiModDescriptions.set(this.modDescriptions);
        eval(mod.mod);
    }

    addMod(mod : Mod) {
        this.mods.push(mod);
        // this.resetMapListings();
        // this.resetAbilityListings();
        this.initMod(mod);
    }

    installMod(mod : ModDescription) {
        const transaction = this.database.transaction(["mods"], "readwrite");
        const modStore = transaction.objectStore("mods");
        const request = modStore.put(mod);
        request.onerror = (event) => {console.error(`Something went wrong when adding ${mod.id}! ${event}`);}
        request.onsuccess = (event) => {
            this.addModDescription(mod);
            
        }
    }

    uninstallMod(mod : ModDescription) {
        const transaction = this.database.transaction(["mods"], "readwrite");
        const modStore = transaction.objectStore("mods");
        const request = modStore.delete(mod.id);
        request.onerror = (event) => {console.error(`Something went wrong when removing ${mod.id}! ${event}`);}
        request.onsuccess = () => {
            const modIndex = this.modDescriptions.findIndex(modDesc => modDesc.id == mod.id);
            this.mods[modIndex].onRemove?.();
            this.mods.splice(modIndex);
            this.modDescriptions.splice(modIndex);
            uiModDescriptions.set(this.modDescriptions);
        }
    }

    initMod(mod : Mod) {
        mod.maps?.forEach(map => {
            ValidateMap(map);
            Maps.push(map);
        })
        mod.abilities?.forEach(ability => {
            AbilityList.push(ability);
        })
    }

    preloadMods(scene : Phaser.Scene) {
        this.mods.forEach(mod => {
            if (mod.onInit)
                mod.onInit(scene);
        })
    }

    startMods(scene : Phaser.Scene) {
        this.mods.forEach(mod => {
            if (mod.onStart)
                mod.onStart(scene);
        })
    }

    updateMods(scene : Phaser.Scene) {
        this.mods.forEach(mod => {
            mod.onUpdate?.(scene);
        })
    }

    parseModDetails(mod : string) : ModDescription {
        return {
            id : <string>mod.split("// @id").pop()?.split("\n")[0].trim(),
            name: <string>mod.split("// @name").pop()?.split("\n")[0].trim(),
            version: mod.split("// @version").pop()?.split("\n")[0].trim() || "1.0",
            description: mod.split("// @description").pop()?.split("\n")[0].trim() || "",
            author: mod.split("// @author").pop()?.split("\n")[0].trim() || "",
            link: mod.split("// @link").pop()?.split("\n")[0].trim() || "",
            mod: mod
        };
    }

}