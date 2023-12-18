import { CustomError } from "./custom-error";
import { Exercise_template } from "./exercise-template";
import { Workout } from "./workout";

export class Exercise {
  constructor(readonly id: string, readonly template: Exercise_template, readonly workout: Workout) {
    if (!id || !template || !workout) {
      throw CustomError.invalid("Template or workout are invalid.");
    }
  }
}

export class SimpleExercise {
  constructor(readonly template: Exercise_template, readonly workout: Workout) { }
}