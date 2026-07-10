import { PostFilters } from '@/modules/post/post.types';
import { JWTPayload, Pageable } from './entities';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
      pageable: Pageable;
      filters?: PostFilters;
    }
  }
}
export {};
