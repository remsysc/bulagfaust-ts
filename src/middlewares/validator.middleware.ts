import { BadRequestException } from "../errors/BadRequestException";
import { NextFunction, Request, Response } from "express";
import z from "zod";
export const validate =
  (schema: z.ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse({
      ...req.params,
      ...req.body,
      ...req.query,
    });
    if (!parsed.success) {
      const pretty = z.prettifyError(parsed.error);
      return next(new BadRequestException(pretty));
    }

    req.body = parsed.data;
    next();
  };

export const validate_uuid = (id: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = z.uuid().safeParse(req.params[id]);
    if (!parsed.success) {
      const pretty = z.prettifyError(parsed.error);
      next(new BadRequestException(pretty));
    } else {
      next();
    }
  };
};

//TODO: add
