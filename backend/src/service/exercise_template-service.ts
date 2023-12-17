// exerciseTemplateService.ts
import { CustomError } from "../domain/custom-error";
import { Exercise_template } from "../domain/exercise-template";
import { CosmosExerciseTemplateRepository } from "../repository/cosmos-exercise-template-repository";
const redis = require("redis");
require('dotenv').config();

export class ExerciseTemplateService {

  private static instance: ExerciseTemplateService;

  static getInstance() {
    if (!this.instance) {
      this.instance = new ExerciseTemplateService();
    }
    return this.instance;
  }

  private async getRepo() {
    return CosmosExerciseTemplateRepository.getInstance();
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

  async getExerciseTemplatesLike(name: string) {
    if (!name) {
      throw CustomError.invalid('Exercise template name is invalid.');
    }

    return (await this.getRepo()).getTemplatesLike(name);
  }

  async getExerciseTemplates() {
    try {
      const cacheHostName = process.env.AZURE_CACHE_FOR_REDIS_HOST_NAME;
      const cachePassword = process.env.AZURE_CACHE_FOR_REDIS_ACCESS_KEY;

      if (!cacheHostName) throw Error("AZURE_CACHE_FOR_REDIS_HOST_NAME is empty");
      if (!cachePassword) throw Error("AZURE_CACHE_FOR_REDIS_ACCESS_KEY is empty");

      // Connection configuration using async-redis
      const cacheConnection = redis.createClient({
        // rediss for TLS
        url: `rediss://${cacheHostName}:6380`,
        password: cachePassword
      });
      await cacheConnection.connect()
      // connected to cache
      let result = await cacheConnection.get("exercise_templates");
      if (result !== null) {
        // cache json to list of objects
        result = result.split(";")
        result = result.map((jsonString: string) => JSON.parse(jsonString, Exercise_template.reviver));
      }
  
  
      if (result === null) {
        result = await (await this.getRepo()).getAllTemplates();
        // list objects to JSON for cache
        const jsonStringList = result.map((item: Exercise_template) => JSON.stringify(item));
        await cacheConnection.set("exercise_templates", jsonStringList.join(";"));
      }
  
      return result;
    } catch (error) {
      console.error(error);
    }
  }
}