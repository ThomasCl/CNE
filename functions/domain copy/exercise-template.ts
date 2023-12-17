import { CustomError } from "./custom-error";

export class Exercise_template {
  constructor(readonly name: string, readonly group: string) {
    if (!name || !group) {
      throw CustomError.invalid("Name or group are invalid.");
    }
  }

  static reviver = (key: any, value: any) => {
    if (typeof value === 'object' && value !== null && value._type === 'Exercise_template') {
      return new Exercise_template(value.name, value.group); // Assuming ExerciseTemplate has a constructor that accepts an object
    }
    return value;
  };
}
