// exerciseService.ts
import { W } from "mongodb";
import { CustomError } from "../domain/custom-error";
import { Exercise, SimpleExercise } from "../domain/exercise";
import { Exercise_template } from "../domain/exercise-template";
import { Workout } from "../domain/workout";
import { CosmosExerciseRepository } from "../repository/cosmos-exercise-repository";
import { CosmosExerciseTemplateRepository } from "../repository/cosmos-exercise-template-repository";
import { CosmosWorkoutRepository } from "../repository/cosmos-workout-repository";

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
  private async getTemplateRepo() {
    return CosmosExerciseTemplateRepository.getInstance();
  }
  private async getWorkoutRepo() {
    return CosmosWorkoutRepository.getInstance();
  }
  
  

  async addExercise(templateName: string, workoutName: string) {
    if (!templateName || !workoutName) {
      throw CustomError.invalid('Exercise template or workout are invalid.');
    }
    const template = await (await this.getTemplateRepo()).getTemplate(templateName);
    const workout = await (await this.getWorkoutRepo()).getWorkout(workoutName);
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
