import {AzureFunction, Context, HttpRequest} from "@azure/functions"
import {CustomError} from "../domain/custom-error";
import {SetService} from "../service/set-service";
import {openRouteWrapper} from "../helpers/function-wrapper";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    await openRouteWrapper(async () => {
        const exerciseId = context.bindingData.exerciseId;
        context.log('HTTP trigger function processed a request.');

        if (!req.body || !req.body.name) {
            throw CustomError.invalid("Please provide an email and password to register.");
        }

        const {
            number,
            weight,
            reps
        } = req.body;

        await SetService.getInstance().addSet(exerciseId, number, weight, reps);


        context.res = {
            status: 201,
            body: {},
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }, context);
};

export default httpTrigger;