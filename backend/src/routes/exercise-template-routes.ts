import { Express, NextFunction, Request, Response } from "express";
import { unauthenticatedRoute, wrapRoute } from "./route-factory";
import { CustomError } from "../domain/custom-error";
import { ExerciseTemplateService } from "../service/exercise_template-service";

export const createExerciseTemplateRoutes = (expressApp: Express, exerciseTemplateService: ExerciseTemplateService) => {

  expressApp.post('/exercise-templates', unauthenticatedRoute, (req: Request, res: Response, next: NextFunction) => {
    wrapRoute(async () => {
      const {
        name, group
      } = req.body;

      if (!name || !group) {
        throw CustomError.invalid("Please provide a name and group for the exercise template.");
      }

      await exerciseTemplateService.addExerciseTemplate(name, group);
      res.status(201).json({ name, group });
    }, next);
  });

  expressApp.get('/exercise-templates/:name', unauthenticatedRoute, (req: Request, res: Response, next: NextFunction) => {
    wrapRoute(async () => {
      const { name } = req.params;

      if (!name) {
        throw CustomError.invalid("Please provide a name for the exercise template.");
      }

      const exerciseTemplate = await exerciseTemplateService.getExerciseTemplate(name);
      res.json(exerciseTemplate);
    }, next);
  });
}
