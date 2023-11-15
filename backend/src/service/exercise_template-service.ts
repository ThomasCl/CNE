// exerciseTemplateService.ts
import { CustomError } from "../domain/custom-error";
import { Exercise_template } from "../domain/exercise-template";
import { MongoExerciseTemplateRepository } from "../repository/mongo-exercise-template-repository";

export class ExerciseTemplateService {

  private static instance: ExerciseTemplateService;

  static getInstance() {
    if (!this.instance) {
      this.instance = new ExerciseTemplateService();
    }
    return this.instance;
  }

  private async getRepo() {
    return MongoExerciseTemplateRepository.getInstance();
  }

  async addExerciseTemplate(name: string, group: string) {
    if (!name || name.length < 3) {
      throw CustomError.invalid('Exercise template name is invalid.');
    }

    if (!group || group.length < 3) {
      throw CustomError.invalid('Exercise template group is invalid.');
    }

    if (await (await this.getRepo()).templateExists(name)) {
      throw CustomError.conflict('An exercise template with this name already exists.');
    }

    const exerciseTemplate = new Exercise_template(name, group);
    return (await this.getRepo()).createTemplate(exerciseTemplate);
  }

  async getExerciseTemplate(name: string) {
    if (!name) {
      throw CustomError.invalid('Exercise template name is invalid.');
    }

    return (await this.getRepo()).getTemplate(name);
  }
}
