import { Express, NextFunction, Request, Response } from "express";
import { unauthenticatedRoute, wrapRoute } from "./route-factory";
import { CustomError } from "../domain/custom-error";
import { WorkoutService } from "../service/workout-service";
// import { insertData } from "../insert";

export const createWorkoutRoutes = (expressApp: Express, workoutService: WorkoutService) => {

  expressApp.post('/workouts', unauthenticatedRoute, (req: Request, res: Response, next: NextFunction) => {
    wrapRoute(async () => {
      const {name} = req.body;

      if (!name) {
        throw CustomError.invalid("Please provide a name and user for the workout.");
      }

      await workoutService.addWorkout(name);
      res.status(201).json( name );
    }, next);
  });

  expressApp.get('/workouts/:name', unauthenticatedRoute, (req: Request, res: Response, next: NextFunction) => {
    wrapRoute(async () => {
      const { name } = req.params;

      if (!name) {
        throw CustomError.invalid("Please provide a name for the workout.");
      }

      const workout = await workoutService.getWorkout(name);
      res.json(workout);
    }, next);
  });

  // expressApp.get('/insertData', unauthenticatedRoute, (req: Request, res: Response, next: NextFunction) => {
  //   wrapRoute(async () => {
  //     insertData();
  //     res.json("Done");
  //   }, next);
  // });

  expressApp.get('/workouts', unauthenticatedRoute, (req: Request, res: Response, next: NextFunction) => {
    wrapRoute(async () => {
      const results = await workoutService.getWorkouts();
      res.json(results);
    }, next);
  });
}