// setService.ts
import { CustomError } from "../domain/custom-error";
import { Exercise } from "../domain/exercise";
import { Set } from "../domain/set";
import { CosmosSetRepository } from "../repository/cosmos-set-repository";

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

  async getSet(exercise: Exercise, number: number) {
    if (!exercise || !number) {
      throw CustomError.invalid('Exercise or set number is invalid.');
    }

    return (await this.getRepo()).getSet(exercise, number);
  }
}
