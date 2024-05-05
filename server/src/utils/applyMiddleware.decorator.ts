import { SetMetadata } from '@nestjs/common';

export const APPLY_MIDDLEWARE_KEY = 'applyMiddleware';

export const ApplyMiddleware = () => SetMetadata(APPLY_MIDDLEWARE_KEY, true);
