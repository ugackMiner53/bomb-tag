import { Variables, playerManager } from "./static";
import type { Player } from "./player/player";
// Load in the assets from the assets/ folder
export function LoadAssets(scene : Phaser.Scene) {
    // Set the folder with the files in it
    scene.load.setBaseURL("assets/");

    // Load in the images from the folder
    scene.load.image("smoke", "particles/smoke.png");
    scene.load.spritesheet("player", "player.png", {frameWidth: 32, frameHeight: 48});
}


export function LoadCustomAssets(scene : Phaser.Scene, callback : VoidFunction) {
    // Load tilemap
    let customMapFlag = false;

    let loadedTextures = 0;
    scene.textures.on(Phaser.Textures.Events.LOAD, () => {
        if (customMapFlag) {
            loadedTextures++;
            if (loadedTextures >= Variables.currentMap.images.length) {
                scene.textures.off(Phaser.Textures.Events.LOAD);
                callback();
            }
        }
    });

    Variables.currentMap.images.forEach((image) => {
        if (image.data.startsWith("data:image")) {
            // The image is base64 encoded data from a mod, and we have to handle that >:(
            customMapFlag = true;
            if (scene.textures.exists(image.name)) {
                scene.textures.remove(image.name);
            }
            scene.textures.addBase64(image.name, image.data);
        } else {
            scene.load.image(image.name, image.data)
        }
    })

    if (!customMapFlag) {
        callback();
    }
}

// Add the objects to the current scene
export function CreateObjects(scene : Phaser.Scene) {
    // Add the tilemap    
    const map = scene.make.tilemap({key: Variables.currentMap.id});
    scene.game.config.physics.arcade!.tileBias = (map.tileWidth + map.tileHeight)/2;
    map.tilesets.forEach((tileset) => {map.addTilesetImage(tileset.name, tileset.name)})


    // These are MANUAL properties which you have to add by hand in Tiled
    interface tilesetProperties {
        name : string,
        type : string,
        value : any
    }
    
    // Add in the tilemap layers and add collision to those who want it
    const collideTileLayers : Phaser.Tilemaps.TilemapLayer[] = []; 
    map.layers.forEach((layer) => {
        const tilelayer = map.createLayer(layer.name, (<tilesetProperties[]>layer.properties).find(e => e.name === "tileset")?.value);
        tilelayer?.setScale(Variables.currentMap.scale || 1.0);
        if ((<tilesetProperties[]>layer.properties).some(e => e.name === "collides" && e.value == true)) {
            tilelayer?.setCollisionByExclusion([-1]);
            collideTileLayers.push(tilelayer!);
        }
    })
    
    scene.physics.world.setBounds(0, 0, map.widthInPixels * (Variables.currentMap.scale || 1.0), map.heightInPixels * (Variables.currentMap.scale || 1.0));
    scene.cameras.main.setBounds(0, 0, map.widthInPixels * (Variables.currentMap.scale || 1.0), map.heightInPixels * (Variables.currentMap.scale || 1.0));

    Variables.mapWidth = map.widthInPixels * (Variables.currentMap.scale || 1.0);
    Variables.mapHeight = map.heightInPixels * (Variables.currentMap.scale || 1.0);

    // Create the players
    const players = scene.physics.add.group();
    playerManager.createPlayers(scene);
    playerManager.players.forEach(player => {
        players.add(player);
        player.Start();
    })

    // Add collisions
    scene.physics.add.collider(players, collideTileLayers);

    // scene.physics.add.collider(players, platforms);
    scene.physics.add.collider(players, players, (bodyOne, bodyTwo) => {
        if (Variables.tagCooldown) return;
        const [playerOne, playerTwo] = [<Player>bodyOne, <Player>bodyTwo];
        const [playerOneBomb, playerTwoBomb] = [playerOne.hasBomb, playerTwo.hasBomb];

        if (playerOneBomb || playerTwoBomb) {
            playerOne.OnCollide(playerTwoBomb, playerTwo.x);
            playerTwo.OnCollide(playerOneBomb, playerOne.x);
            Variables.tagCooldown = true;
            scene.time.delayedCall(1000, () => {
                Variables.tagCooldown = false;
            })
        }
    }, (playerOne, playerTwo) => {
        return ((<Player>playerOne).canCollide && (<Player>playerTwo).canCollide);
    });

    // Create the player animations
    scene.anims.create({
        key: "move",
        frames: scene.anims.generateFrameNumbers("player", {start: 1, end: 2}),
        frameRate: 10,
        repeat: -1
    });
    scene.anims.create({
        key: "turn",
        frames: [ { key: "player", frame: 0 } ],
        frameRate: 20
    });
}