import { CONSTANTS } from "../static";

export class Map 
{
    id! : string;
    tilemap! : string | JSON;
    images! : {name : string, data : string}[];
    
    name? : string;
    scale? : number;
    gravity? : number;
    jumpHeight? : number;
    speed? : number;
    knockback? : number;
}

export function ValidateMap(map : Map) {
    map.name ??= map.id;
    map.speed ??= CONSTANTS.SPEED;
    map.jumpHeight ??= CONSTANTS.JUMP_HEIGHT;
    map.gravity ??= CONSTANTS.GRAVITY;
    map.knockback ??= CONSTANTS.KNOCKBACK;
    map.scale ??= 1;
}