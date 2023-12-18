import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { openRouteWrapper } from "../helpers/function-wrapper";
import { CustomError } from "../domain/custom-error";
import { SetService } from "../service/set-service";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    await openRouteWrapper(async () => {

        if (!req.body || !req.body.set || !context.bindingData.setId) {
            throw CustomError.invalid("A valid set and setId are required.");
        }

        const {
            newSet
        } = req.body;

        const number = context.bindingData.number;
        const exerciseId = context.bindingData.exerciseId;

        SetService.getInstance().updateSet(exerciseId, number, newSet);

        context.res = {
            body: {},
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }, context);
};
