import { CustomError } from "../domain/custom-error";
import { Context } from "@azure/functions";

export enum AuthenticationType {
    Either
}

export const openRouteWrapper = async (handler: () => Promise<void>, context: Context) => {
    try {
        await handler();
    } catch (error: any) {
        errorHandler(error, context);
    }
}

const errorHandler = (error: Error | CustomError, context: Context) => {
    if ((error as any).code) {
        const cError = error as CustomError;
        context.res = {
            body: { message: cError.message },
            status: cError.code,
            headers: {
                'Content-Type': 'application/json'
            }
        }
    } else {
        context.res = {
            body: { message: (error as Error).message },
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }
}