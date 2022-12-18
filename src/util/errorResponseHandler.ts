import { Response } from "express";

export function handleErrorResponse(res: Response, error: string | unknown) {
    // 2 benefits of using this: (1) it's always "error" never "err" or "msg". (2) we save time typing
    return res.status(400).json({ error });
}
