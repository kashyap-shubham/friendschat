import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { ApiError } from "@/errors/ApiError";

type RequestSchema = z.ZodType<{
  body?: unknown;
  query?: unknown;
  params?: unknown;
}>;

class RequestValidator {

  validate = (schema: RequestSchema) => {

    return (

      req: Request,
      res: Response,
      next: NextFunction

    ): void => {

      const result = schema.safeParse({

        body: req.body,

        query: req.query,

        params: req.params

      });


      if (!result.success) {

        const message = result.error.issues

          .map(issue => issue.message)

          .join(", ");

        return next(new ApiError(400, message));

      }


      const data = result.data;


      if (data.body !== undefined) {

        req.body = data.body;

      }


      if (data.query !== undefined) {

        Object.assign(req.query, data.query);

      }


      if (data.params !== undefined) {

        req.params = data.params as any;

      }


      next();

    };

  };

}

const validator = new RequestValidator();

export const validate = validator.validate;