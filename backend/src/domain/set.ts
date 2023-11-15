import { CustomError } from "./custom-error";
import { Exercise } from "./exercise";

export class Set {
  constructor(readonly exercise: Exercise, readonly number: number, readonly weight: number, readonly reps: number) {
    if (!exercise || !reps) {
      throw CustomError.invalid("invalid.");
    }
  }
}
