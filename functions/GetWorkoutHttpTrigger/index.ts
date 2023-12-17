import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { openRouteWrapper } from "../helpers/function-wrapper";
import { WorkoutService } from "../service/workout-service";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    await openRouteWrapper(async () => {
        const workoutName = context.bindingData.workoutName;
        const workout = await WorkoutService.getInstance().getWorkout(workoutName);

        context.res = {
            body: workout,
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }, context)
    context.log('HTTP trigger function processed a request.');
};

export default httpTrigger;