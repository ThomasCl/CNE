import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { openRouteWrapper } from "../helpers/function-wrapper";
import { CustomError } from "../domain/custom-error";
import { SetService } from "../service/set-service";
import { SimpleSet } from "../domain/set";
import { ExerciseService } from "../service/exercise-service";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    await openRouteWrapper(async () => {

        if (!req.body || !req.body.weight || !context.bindingData.reps) {
            throw CustomError.invalid("Weight and reps need to be set.");
        }

        const {
            weight,
            reps
        } = req.body;
        let result = null
        const number = context.bindingData.number;
        const exerciseId = context.bindingData.exerciseId;
        const exercise = await ExerciseService.getInstance().getExerciseById(exerciseId);
        try{
            result = await SetService.getInstance().updateSet(exerciseId, number, new SimpleSet(exercise, number, weight, reps));
        }catch(e){
            throw CustomError.invalid(e.message);
        }
        context.res = {
            body: result,
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }, context);
};
export default httpTrigger;