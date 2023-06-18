export interface Control {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;

    Poll() : void;
}