import { AppError } from './AppError';

export class DuplicateResourceException extends AppError {
  constructor(
    public resource: string,
    public field: string,
  ) {
    super(`This ${resource} ${field} is already taken`, 409);
  }
}
