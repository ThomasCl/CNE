import {Exercise} from "./exercise";
import {CustomError} from "./custom-error";
import {Set} from "./set";


export class Performance {
    constructor(readonly exercise: Exercise, readonly sets: Set[]) {
        if (!sets || sets.length == 0) {
            throw CustomError.invalid("invalid.");
        }
    }

    getVolume(): number {
        let volume: number = 0;
        this.sets.forEach((set: Set) => {
            volume += set.getVolume();
        });
        return volume;
    }
}