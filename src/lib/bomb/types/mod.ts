import type { Map } from './map';
import type Ability from "./ability";

export default interface Mod {
    onInit?(scene : Phaser.Scene) : void;
    onStart?(scene : Phaser.Scene) : void;
    onUpdate?(scene : Phaser.Scene) : void;
    onRemove?() : void;

    maps? : Map[];
    abilities? : typeof Ability[];
}

export interface ModDescription {
    id : string;
    name : string;
    version : string;
    author : string;
    description : string;
    link : string,
    mod : string;
}