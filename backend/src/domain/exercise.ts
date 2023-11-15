import { CustomError } from "./custom-error";
import { Exercise_template } from "./exercise_template";
import { Workout } from "./workout";

export class Exercise {
  constructor(readonly id: number, readonly template: Exercise_template, readonly workout: Workout) {
    if (!id || !template || !workout) {
      throw CustomError.invalid("Template or workout are invalid.");
    }
  }
}
