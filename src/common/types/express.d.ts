import { JWTPayload, Pageable } from './entities';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
      pageable: Pageable;
    }
  }
}
export {};
