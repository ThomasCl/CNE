// setService.ts
import { CustomError } from "../domain/custom-error";
import { Exercise } from "../domain/exercise";
import { Set } from "../domain/set";
import { CosmosSetRepository } from "../repository/cosmos-set-repository";
import { ExerciseService } from "./exercise-service";

// SetService.ts
export class SetService {

  private static instance: SetService;
  static getInstance() {
    if (!this.instance) {
      this.instance = new SetService();
    }
    return this.instance;
  }

  private async getRepo() {
    return CosmosSetRepository.getInstance();
  }

  async addSet(exercise: Exercise, number: number, weight: number, reps: number) {
    if (!exercise || !number || !weight || !reps) {
      throw CustomError.invalid('Set parameters are invalid.');
    }

    if (await (await this.getRepo()).setExists(exercise, number)) {
      throw CustomError.conflict('A set with this exercise and set number already exists.');
    }

    const set = new Set(exercise, number, weight, reps);
    return (await this.getRepo()).createSet(set);
  }

  async getSet(exerciseId: number, number: number) {
    if (!exerciseId || !number) {
      throw CustomError.invalid('ExerciseId or set number is invalid.');
    }
    const exerciseService = ExerciseService.getInstance();
    let exercise: Exercise;
    exercise = await this.getExerciseService().getExercise(exerciseId);
    if (!exercise) {
      throw CustomError.notFound('Exercise not found.');
    }
    return (await this.getRepo()).getSet(exercise, number);
  }

getExerciseService() { return ExerciseService.getInstance(); }
}
