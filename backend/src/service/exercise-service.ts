// exerciseService.ts
import { CustomError } from "../domain/custom-error";
import { Exercise } from "../domain/exercise";
import { Exercise_template } from "../domain/exercise-template";
import { Workout } from "../domain/workout";
import { CosmosExerciseRepository } from "../repository/cosmos-exercise-repository";

export class ExerciseService {

  private static instance: ExerciseService;

  static getInstance() {
    if (!this.instance) {
      this.instance = new ExerciseService();
    }
    return this.instance;
  }

  private async getRepo() {
    return CosmosExerciseRepository.getInstance();
  }

  async addExercise(id: number, template: Exercise_template, workout: Workout) {
    if (!id) {
      throw CustomError.invalid('Exercise ID is invalid.');
    }

    if (!template || !workout) {
      throw CustomError.invalid('Exercise template or workout are invalid.');
    }

    // if (await (await this.getRepo()).exerciseExists(id)) {
    //   throw CustomError.conflict('An exercise with this ID already exists.');
    // }

    const exercise = new Exercise(id, template, workout);
    return (await this.getRepo()).createExercise(exercise);
  }

  async getExercise(id: number) {
    if (!id) {
      throw CustomError.invalid('Exercise ID is invalid.');
    }

    return (await this.getRepo()).getExercise(id);
  }
}
