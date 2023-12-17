import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { openRouteWrapper } from "../helpers/function-wrapper";
import { SetService } from "../service/set-service";
import {ExerciseService} from "../service/exercise-service";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    await openRouteWrapper(async () => {
        const exerciseId = context.bindingData.exerciseId;
        const exercise = await ExerciseService.getInstance().getExerciseById(exerciseId);

        context.res = {
            body: exercise,
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }, context)
    context.log('HTTP trigger function processed a request.');
};

export default httpTrigger;