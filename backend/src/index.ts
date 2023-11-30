import express from 'express'
import cors from 'cors'
// import { createLinkRoutes } from './routes/link-routes'
// import { LinkService } from './service/link-service'
// import { SimpleUser } from './domain/user';
import { errorHandler } from './routes/route-factory';
// import { createUserRoutes } from './routes/user-routes';
import dotenv from 'dotenv';
// import { UserService } from './service/user-service';
import { WorkoutService } from './service/workout-service';
import { createWorkoutRoutes } from './routes/workout-routes';
import { ExerciseService } from './service/exercise-service';
import { ExerciseTemplateService } from './service/exercise_template-service';
import { SetService } from './service/set-service';
import { createExerciseRoutes } from './routes/exercise-routes';
import { create } from 'domain';
import { createExerciseTemplateRoutes } from './routes/exercise-template-routes';
import { createSetRoutes } from './routes/set-routes';

dotenv.config();

declare module "express-serve-static-core" {
  // interface Request {
  //   user?: SimpleUser;
  // }
}

const app = express()
app.use(cors())
app.use(express.json());

// Init services
// const linkService = new LinkService();
// const userService = new UserService();
const exerciseService = new ExerciseService();
const exerciseTemplateService = new ExerciseTemplateService();
const setService = new SetService();
const workoutService = new WorkoutService();

// Create routes
// createUserRoutes(app, userService);
// createLinkRoutes(app, linkService, {});
createExerciseRoutes(app, exerciseService);
createExerciseTemplateRoutes(app, exerciseTemplateService);
createSetRoutes(app, setService);
createWorkoutRoutes(app, workoutService);

// Errorhandler needs to be registered last
app.use(errorHandler);

app.listen(3000, function () {
  console.log("Server listening on port 3000.");
})
