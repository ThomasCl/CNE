import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { openRouteWrapper } from "../helpers/function-wrapper";
import {ExerciseService} from "../service/exercise-service";
import {WorkoutService} from "../service/workout-service";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    await openRouteWrapper(async () => {
        const templateName = context.bindingData.templateName;
        const workoutName = context.bindingData.workoutName;
        const workout = await WorkoutService.getInstance().getWorkout(workoutName);
        const exercises = await ExerciseService.getInstance().getExercise(templateName, workout);

        context.res = {
            body: exercises,
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }, context)
    context.log('HTTP trigger function processed a request.');
};

export default httpTrigger;