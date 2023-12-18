import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { CustomError } from "../domain/custom-error";
import { SetService } from "../service/set-service";
import { openRouteWrapper } from "../helpers/function-wrapper";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    await openRouteWrapper(async () => {
        context.log('HTTP trigger function processed a delete request.');

        const setId = context.bindingData.setId; // Retrieve setId from the URL parameter

        if (!setId) {
            throw CustomError.invalid("Set ID is required.");
        }

        await SetService.getInstance().deleteSet(setId);

        context.res = {
            status: 204, // 204 No Content is appropriate for successful DELETE requests
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }, context);
};

export default httpTrigger;
