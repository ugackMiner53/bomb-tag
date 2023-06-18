import type { Map } from "../types/map"

export const Maps : Map[] = [
    {
        id : "cave",
        name: "Cave",
        tilemap : "tilemaps/cave/cave.json",
        images : [
            { name : "cave", data : "tilemaps/cave/tiles.png" },
            { name : "cave_background", data : "tilemaps/cave/background.png" },
        ],
        scale: 1.33
    },
    {
        id : "industrial",
        name: "Industrial",
        tilemap : "tilemaps/industrial/industrial.json",
        images : [
            { name : "industrial", data : "tilemaps/industrial/tiles.png" }
        ]
    },
    {
        id: "plains",
        name: "Plains",
        tilemap: "tilemaps/generic/plains.json",
        images : [
            {name: "tiles", data : "tilemaps/generic/tiles.png"}
        ],
        scale: 2
    }
]