import { CustomError } from "./custom-error";
import { User } from "./user";

export class Workout {
  constructor(readonly name: String, readonly user: User) {
    if (!name || !user) {
      throw CustomError.invalid("name or user are invalid.");
    }
  }
}
