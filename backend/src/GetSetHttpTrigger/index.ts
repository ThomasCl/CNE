import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { openRouteWrapper } from "../helpers/function-wrapper";
import { SetService } from "../service/set-service";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    await openRouteWrapper(async () => {
        const exerciseId = context.bindingData.exerciseId;
        const number = context.bindingData.number
        const set = await SetService.getInstance().getSet(exerciseId, number);

        context.res = {
            body: set,
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }, context)
    context.log('HTTP trigger function processed a request.');
};

export default httpTrigger;