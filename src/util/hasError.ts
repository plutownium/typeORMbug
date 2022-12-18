import { DeleteResult } from "typeorm";
import { Committee } from "../db/entity/Committee";
import { Task } from "../db/entity/Task";
import { Member } from "../db/entity/Member";
import { AccessToken } from "../interface/AccessToken.interface";
import { SmallError } from "../interface/SmallError.interface";
import { TestAccountLoginResponse } from "../interface/test/TestAccountLoginResponse.interface";

// todo: try to replace this large list with a smaller one, while keeping the descriptiveness.
// todo: the previous TODO is important as this list is already huge.
export function hasError(
    maybeError: SmallError | Committee | Member | Task | Committee[] | Member[] | Task[] | DeleteResult | TestAccountLoginResponse | AccessToken,
): maybeError is SmallError {
    // this function handles something called "narrowing".
    // It takes an argument of one of many types and
    // asserts that it is a specific type using
    // the condition (below) and
    // the asssertion "maybeError is SmallError"
    // to the right.
    return (maybeError as SmallError).error !== undefined;
}
