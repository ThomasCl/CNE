// setService.ts
import { CustomError } from "../domain/custom-error";
import { Exercise } from "../domain/exercise";
import { Set, SimpleSet } from "../domain/set";
import { CosmosSetRepository } from "../repository/cosmos-set-repository";
import { ExerciseService } from "./exercise-service";
import { ExerciseTemplateService } from "./exercise_template-service";
import { WorkoutService } from "./workout-service";

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

  async addSet(exerciseName: string, workoutName: string, number: number, weight: number, reps: number) {
    if (!exerciseName || !workoutName || !number || !weight || !reps) {
      throw CustomError.invalid('Set parameters are invalid.');
    }
    const  exercise = await this.getExerciseService().getExercise(await this.getTemplateService().getExerciseTemplate(exerciseName), await this.getWorkoutService().getWorkout(workoutName))
    if (await (await this.getRepo()).setExists(exercise, number)) {
      throw CustomError.conflict('A set with this exercise and set number already exists.');
    }

    const set = new SimpleSet(exercise, number, weight, reps);
    return (await this.getRepo()).createSet(set);
  }

  async getSet(exerciseId: number, number: number) {
    if (!exerciseId || !number) {
      throw CustomError.invalid('ExerciseId or set number is invalid.');
    }
    const exerciseService = ExerciseService.getInstance();
    let exercise: Exercise;
    exercise = await this.getExerciseService().getExerciseById(exerciseId.toString());
    if (!exercise) {
      throw CustomError.notFound('Exercise not found.');
    }
    return (await this.getRepo()).getSet(exercise, number);
  }

  getExerciseService() { return ExerciseService.getInstance(); }
  getTemplateService(){ return ExerciseTemplateService.getInstance(); }
  getWorkoutService(){ return WorkoutService.getInstance(); }

  async getSets(){
    return (await this.getRepo()).getAllSets();
  }
}
