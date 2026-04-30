import { ApiError } from "@/errors/ApiError";
import { prisma } from "@/lib/prisma";
import { NextFunction, Request, Response } from "express";


export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
    
    try {

        if (!req.user) {
            return next(new ApiError(401, "Unauthorized - Please login first"));
        }

        const session = await prisma.session.findUnique({
            where: {
                sessionId: req.sessionID,
            },
            select: {
                expiresAt: true,
            }
        });

        if (!session) {
            return next(new ApiError(401, "Session Expired"));
        }

        if (session.expiresAt < new Date()) {
            await prisma.session.delete({
                where: {
                    sessionId: req.sessionID
                },
            });

            return next(new ApiError(401, "Session Expired"));
        }

        next();

    } catch (error) {
        next(error);
    }
}