import { CustomError } from "./custom-error";

export class Exercise_template {
  constructor(readonly name: string, readonly group: string) {
    if (!name || !group) {
      throw CustomError.invalid("Name or group are invalid.");
    }
  }
}
