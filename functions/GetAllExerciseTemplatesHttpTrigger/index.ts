import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { openRouteWrapper } from "../helpers/function-wrapper";
import { ExerciseTemplateService } from "../service/exercise_template-service";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    await openRouteWrapper(async () => {
        const exercises = await ExerciseTemplateService.getInstance().getExerciseTemplates();

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