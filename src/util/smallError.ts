import { SmallError } from "../interface/SmallError.interface";

export function smallErrorMaker(message: string): SmallError {
    // might be nicer to type "smallError" instead of "{ error: 'message' }" over and over
    return { error: message };
}
