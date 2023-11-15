import { Express, NextFunction, Request, Response } from "express";
import { unauthenticatedRoute, wrapRoute } from "./route-factory";
import { CustomError } from "../domain/custom-error";
import { ExerciseService } from "../service/exercise-service";

export const createExerciseRoutes = (expressApp: Express, exerciseService: ExerciseService) => {

  expressApp.post('/exercises', unauthenticatedRoute, (req: Request, res: Response, next: NextFunction) => {
    wrapRoute(async () => {
      const {
        id, template, workout
      } = req.body;

      if (!id || !template || !workout) {
        throw CustomError.invalid("Please provide an ID, template, and workout for the exercise.");
      }

      await exerciseService.addExercise(id, template, workout);
      res.status(201).json({ id });
    }, next);
  });

  expressApp.get('/exercises/:id', unauthenticatedRoute, (req: Request, res: Response, next: NextFunction) => {
    wrapRoute(async () => {
      const { id } = req.params;

      if (!id) {
        throw CustomError.invalid("Please provide an ID for the exercise.");
      }

      const exercise = await exerciseService.getExercise(Number(id));
      res.json(exercise);
    }, next);
  });
}
