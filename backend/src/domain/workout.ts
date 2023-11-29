import { CustomError } from "./custom-error";

export class Workout {
  constructor(readonly name: string) {
    if (!name) {
      throw CustomError.invalid("name are invalid.");
    }
  }
}
