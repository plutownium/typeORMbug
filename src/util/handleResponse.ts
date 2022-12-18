import { Router, Request, Response } from "express";
import { DeleteResult } from "typeorm";
import { Committee } from "../db/entity/Committee";
import { Task } from "../db/entity/Task";
import { Member } from "../db/entity/Member";
import { AccessToken } from "../interface/AccessToken.interface";
import { SmallError } from "../interface/SmallError.interface";
import { TestAccountLoginResponse } from "../interface/test/TestAccountLoginResponse.interface";
import { hasError } from "./hasError";

// todo: try to replace this large list with a smaller one, while keeping the descriptiveness.
// todo: the previous TODO is important as this list is already huge.
export const handleResponse = (
    res: Response,
    data: SmallError | Committee | Member | Task | DeleteResult | Committee[] | Member[] | Task[] | AccessToken,
) => {
    // This exists (a) because I didn't want to type the same line over and over
    // (b) because the input sometimes being an error meant we had to do this thing, which is hard to look at:
    // if ("error" in updated) { <= this is not zombie code, its an example of what the alternative is.
    //     return res.json({ ...updated });
    // }
    return res.status(hasError(data) ? 400 : 200).json(data);
};
