import { RequestHandler } from "express";


export const asyncHandler = <T extends RequestHandler>(fn: T): T => {
    return ((req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    }) as T;
};