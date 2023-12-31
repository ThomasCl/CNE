import {AzureFunction, Context, HttpRequest} from "@azure/functions"
import {CustomError} from "../domain/custom-error";
import {SetService} from "../service/set-service";
import {openRouteWrapper} from "../helpers/function-wrapper";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    await openRouteWrapper(async () => {
        context.log('HTTP trigger function processed a request.');

        if (!req.body || !req.body.exerciseId || !req.body.number || !req.body.weight || !req.body.reps) {
            throw CustomError.invalid("Please provide an email and password to register.");
        }

        const {
            exerciseId,
            number,
            weight,
            reps
        } = req.body;

        const set = await SetService.getInstance().addSet(exerciseId, number, weight, reps);


        context.res = {
            status: 201,
            body: {set},
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }, context);
};

export default httpTrigger;