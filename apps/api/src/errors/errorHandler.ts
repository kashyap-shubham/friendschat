import { NextFunction, Request, Response } from "express";
import { ApiError } from "./ApiError";

export const errorHandler = (
    err: Error | ApiError,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    let statusCode = 500;
    let message = "Internal Server Error";

    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    res.status(statusCode).json({
        success: false,
        message
    });
};