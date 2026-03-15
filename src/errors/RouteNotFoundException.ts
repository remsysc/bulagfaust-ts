import { AppError } from "./AppError";

export class RouteNotFoundException extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}
