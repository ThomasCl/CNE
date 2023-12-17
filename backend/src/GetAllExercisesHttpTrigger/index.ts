import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { openRouteWrapper } from "../helpers/function-wrapper";
import {ExerciseService} from "../service/exercise-service";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    await openRouteWrapper(async () => {
        const exercises = await ExerciseService.getInstance().getExercises();

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