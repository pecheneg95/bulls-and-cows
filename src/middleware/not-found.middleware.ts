import { Request, Response } from 'express';

import { NotFoundError, MIDDLEWARE_ERROR_MESSAGE } from '@errors';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const processNotFoundEndpoint = (_req: Request, res: Response): void => {
  throw new NotFoundError(MIDDLEWARE_ERROR_MESSAGE.API_ENDPOINT_NOT_FOUND);
};
