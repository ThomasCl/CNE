import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { openRouteWrapper } from "../helpers/function-wrapper";
import { WorkoutService } from "../service/workout-service";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    await openRouteWrapper(async () => {
        const workouts = await WorkoutService.getInstance().getWorkouts();

        context.res = {
            body: workouts,
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }, context);
    context.log('HTTP trigger function processed a request.');
};

export default httpTrigger;