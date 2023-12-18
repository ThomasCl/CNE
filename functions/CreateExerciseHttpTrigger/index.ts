import {AzureFunction, Context, HttpRequest} from "@azure/functions"
import {CustomError} from "../domain/custom-error";
import {ExerciseService} from "../service/exercise-service";
import {openRouteWrapper} from "../helpers/function-wrapper";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    await openRouteWrapper(async () => {

        context.log('HTTP trigger function processed a request.');

        if (!req.body) {
            throw CustomError.invalid("Please provide a template and workout to create.");
        }

        const {
            template, workout
        } = req.body;

        const exercise = await ExerciseService.getInstance().addExercise(template, workout)

        context.res = {
            status: 201,
            body: {exercise},
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }, context);
};

export default httpTrigger;