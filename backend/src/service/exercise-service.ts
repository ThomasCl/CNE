// exerciseService.ts
import { CustomError } from "../domain/custom-error";
import { Exercise, SimpleExercise } from "../domain/exercise";
import { Exercise_template } from "../domain/exercise-template";
import { Workout } from "../domain/workout";
import { CosmosExerciseRepository } from "../repository/cosmos-exercise-repository";;
import { ExerciseTemplateService } from "./exercise_template-service";
import { WorkoutService } from "./workout-service";

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
  private async getTemplateService() {
    return ExerciseTemplateService.getInstance();
  }
  private async getWorkoutService() {
    return WorkoutService.getInstance();
  }
  
  

  async addExercise(templateName: string, workoutName: string) {
    if (!templateName || !workoutName) {
      throw CustomError.invalid('Exercise template or workout are invalid.');
    }
    const template = await (await this.getTemplateService()).getExerciseTemplate(templateName);
    const workout = await (await this.getWorkoutService()).getWorkout(workoutName);
    if(!template || !workout){
      throw CustomError.invalid('Exercise template or workout do not exist.');
    }
    const exercise = new SimpleExercise(template, workout);
    return (await this.getRepo()).createExercise(exercise);
  }

  async getExerciseById(id: string) {
    if (!id) {
      throw CustomError.invalid('Exercise ID is invalid.');
    }

    return (await this.getRepo()).getExerciseById(id);
  }

  async getExerciseByWorkout(name: string) {
    if (!name) {
      throw CustomError.invalid('Exercise ID is invalid.');
    }
    const workout = await (await this.getWorkoutService()).getWorkout(name);
    return (await this.getRepo()).getExerciseByWorkout(workout);
  }

  async getExercise(template: Exercise_template, workout: Workout) {
    if (!template || !workout) {
      throw CustomError.invalid('form is invalid.');
    }
    return (await this.getRepo()).getExercise(template,workout);
  }

  async getExercises(){
    return (await this.getRepo()).getAllExercises();
  }
}
