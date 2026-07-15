import { UnauthorizedException } from "../errors/UnauthorizedException";
import { JWTPayload } from "../types/entities"
import { Request } from "express";


export function assertAuthenticated (req: Request): asserts req is Request & {
  user:JWTPayload
}  {
  if(!req.user) {
    throw new UnauthorizedException('Unauthorized');
  }
}
