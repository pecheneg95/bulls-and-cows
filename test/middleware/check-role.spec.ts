/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { NextFunction, Request, Response } from 'express';
import 'mocha';
import { describe } from 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';

import { checkRole } from '@middleware';
import { AUTHORIZATION_ERROR_MESSAGE, ForbiddenError } from '@errors';
import { USER_ROLE } from '@users';

describe('middleware/check-role.middleware.ts', () => {
  describe('Calls "next()" with ForbiddenError if:', () => {
    it('allowed role does not match req.role', () => {
      const permittedRole = USER_ROLE.ADMIN;
      const req = {
        role: USER_ROLE.USER,
      };

      const next = (error?: ForbiddenError): void => {};

      const nextSpy = sinon.spy(next);

      checkRole(permittedRole)(req as unknown as Request, {} as Response, nextSpy as unknown as NextFunction);

      expect(nextSpy.calledWith(sinon.match.instanceOf(ForbiddenError))).to.equal(true);
      expect(
        nextSpy.calledWith(sinon.match.has('message', AUTHORIZATION_ERROR_MESSAGE.NOT_AVAILABLE_FOR_YOU_ROLE))
      ).to.equal(true);
    });
  });
});
