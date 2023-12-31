// workoutService.ts
import { CustomError } from "../domain/custom-error";
import { Workout } from "../domain/workout";
import { CosmosWorkoutRepository } from "../repository/cosmos-workout-repository";

export class WorkoutService {

  private static instance: WorkoutService;

  static getInstance() {
    if (!this.instance) {
      this.instance = new WorkoutService();
    }
    return this.instance;
  }

  private async getRepo() {
    return CosmosWorkoutRepository.getInstance();
  }

  async addWorkout(name: string) {
    if (!name || name.length < 3) {
      throw CustomError.invalid('Workout name is invalid.');
    }

    if (await (await this.getRepo()).workoutExists(name)) {
      throw CustomError.conflict('A workout with this name already exists.');
    }

    const workout = new Workout(name);
    return (await this.getRepo()).createWorkout(workout);
  }

  async getWorkout(name: string) {
    if (!name) {
      throw CustomError.invalid('Workout name is invalid.');
    }

    return (await this.getRepo()).getWorkout(name);
  }

  async getWorkouts(){
    return (await this.getRepo()).getAllWorkouts();
  }
}
