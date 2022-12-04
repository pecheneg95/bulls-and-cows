import { NotFoundError } from '@errors';
import { Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const processNotFoundEndpoint = (_req: Request, res: Response): void => {
  throw new NotFoundError('API endpoint not found');
};
