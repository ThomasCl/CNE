import {AzureFunction, Context, HttpRequest} from "@azure/functions"
import {CustomError} from "../domain/custom-error";
import {WorkoutService} from "../service/workout-service";
import {openRouteWrapper} from "../helpers/function-wrapper";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    await openRouteWrapper(async () => {

        context.log('HTTP trigger function processed a request.');

        if (!req.body || !req.body.name) {
            throw CustomError.invalid("Please provide an email and password to register.");
        }

        const {
            name
        } = req.body;

        await WorkoutService.getInstance().addWorkout(name);


        context.res = {
            status: 201,
            body: {name},
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }, context);
};

export default httpTrigger;