import { CustomError } from "./custom-error";
import { User } from "./user";

export class Workout {
  constructor(readonly name: string, readonly user: User) {
    if (!name || !user) {
      throw CustomError.invalid("name or user are invalid.");
    }
  }
}
