import { Express, NextFunction, Request, Response } from "express";
import { unauthenticatedRoute, wrapRoute } from "./route-factory";
import { CustomError } from "../domain/custom-error";
import { SetService } from "../service/set-service";

export const createSetRoutes = (expressApp: Express, setService: SetService) => {

  expressApp.post('/sets', unauthenticatedRoute, (req: Request, res: Response, next: NextFunction) => {
    wrapRoute(async () => {
      const {
        exerciseId, number, weight, reps
      } = req.body;
      if (!exerciseId || !number || !weight || !reps) {
        throw CustomError.invalid("Please provide exercise, number, weight, and reps for the set.");
      }
      res.status(201).json(await setService.addSet(exerciseId, number, weight, reps));
    }, next);
  });

  expressApp.get('/sets/:exerciseId/:number', unauthenticatedRoute, (req: Request, res: Response, next: NextFunction) => {
    wrapRoute(async () => {
      const { exerciseId, number } = req.params;

      if (!exerciseId || !number) {
        throw CustomError.invalid("Please provide exercise ID and set number for the set.");
      }

      const set = await setService.getSet(Number(exerciseId), Number(number));
      res.json(set);
    }, next);
  });


  expressApp.get('/sets/:exerciseId', unauthenticatedRoute, (req: Request, res: Response, next: NextFunction) => {
    wrapRoute(async () => {
      const { exerciseId } = req.params;

      if (!exerciseId) {
        throw CustomError.invalid("Please provide exercise ID for the set.");
      }

      const set = await setService.getSetsByExercise(exerciseId);
      res.json(set);
    }, next);
  });


  expressApp.get('/sets', unauthenticatedRoute, (req: Request, res: Response, next: NextFunction) => {
    wrapRoute(async () => {
      const results = await setService.getSets();
      res.json(results);
    }, next);
  });
}
