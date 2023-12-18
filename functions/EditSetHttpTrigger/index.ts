import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { openRouteWrapper } from "../helpers/function-wrapper";
import { CustomError } from "../domain/custom-error";
import { SetService } from "../service/set-service";
import { SimpleSet } from "../domain/set";
import { ExerciseService } from "../service/exercise-service";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    await openRouteWrapper(async () => {

        if (!req.body || !req.body.set || !context.bindingData.setId) {
            throw CustomError.invalid("A valid set and setId are required.");
        }

        const {
            weight,
            reps
        } = req.body;

        const number = context.bindingData.number;
        const exerciseId = context.bindingData.exerciseId;
        const exercise = await ExerciseService.getInstance().getExerciseById(exerciseId);

        SetService.getInstance().updateSet(exerciseId, number, new SimpleSet(exercise, number, weight, reps));

        context.res = {
            body: {},
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }, context);
};
export default httpTrigger;