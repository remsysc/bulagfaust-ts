import { AppError } from "./AppError";

export class ConflictException extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}
