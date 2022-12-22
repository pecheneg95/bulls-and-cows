/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */

import { NextFunction, Request, Response } from 'express';
import 'mocha';
import { describe } from 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';

import * as jwt from 'jsonwebtoken';

import { isAuth } from '@middleware';
import { AUTHORIZATION_ERROR_MESSAGE, BadRequestError, UnauthorizedError } from '@errors';

describe('middleware/is-auth.middleware.ts', () => {
  describe('Calls "next()" with BadRequestError if:', () => {
    it('request no have "Authorization" header', () => {
      const req = {
        get: (): null => {
          return null;
        },
      };

      const next = (error?: BadRequestError): void => {};

      const nextSpy = sinon.spy(next);

      isAuth(req as unknown as Request, {} as Response, nextSpy as unknown as NextFunction);

      expect(nextSpy.calledWith(sinon.match.instanceOf(BadRequestError))).to.equal(true);
      expect(nextSpy.calledWith(sinon.match.has('message', AUTHORIZATION_ERROR_MESSAGE.HEADER_IS_MISSING))).to.equal(
        true
      );
    });

    it('token not start with "Bearer "', () => {
      const next = (error?: BadRequestError): void => {};

      const nextSpy = sinon.spy(next);

      let req = {
        get: (): string => {
          return 'Bear token';
        },
      };

      isAuth(req as unknown as Request, {} as Response, nextSpy as unknown as NextFunction);

      expect(nextSpy.calledWith(sinon.match.instanceOf(BadRequestError))).to.equal(true);
      expect(nextSpy.calledWith(sinon.match.has('message', AUTHORIZATION_ERROR_MESSAGE.INVALID_TOKEN))).to.equal(true);

      req = {
        get: (): string => {
          return 'Bearertoken';
        },
      };

      isAuth(req as unknown as Request, {} as Response, nextSpy as unknown as NextFunction);

      expect(nextSpy.calledWith(sinon.match.instanceOf(BadRequestError))).to.equal(true);
      expect(nextSpy.calledWith(sinon.match.has('message', AUTHORIZATION_ERROR_MESSAGE.INVALID_TOKEN))).to.equal(true);
    });

    it('token is empty', () => {
      const req = {
        get: (): string => {
          return 'Bearer ';
        },
      };

      const next = (error?: BadRequestError): void => {};

      const nextSpy = sinon.spy(next);

      isAuth(req as unknown as Request, {} as Response, nextSpy as unknown as NextFunction);

      expect(nextSpy.calledWith(sinon.match.instanceOf(BadRequestError))).to.equal(true);
      expect(nextSpy.calledWith(sinon.match.has('message', AUTHORIZATION_ERROR_MESSAGE.TOKEN_IS_MISSING))).to.equal(
        true
      );
    });
  });

  describe('Calls "next()" with UnauthorizedError if:', () => {
    it('token cannot be verified', () => {
      const req = {
        get: (): string => {
          return 'Bearer abc_token_xyz';
        },
      };

      const next = (error?: UnauthorizedError): void => {};

      const nextSpy = sinon.spy(next);

      isAuth(req as unknown as Request, {} as Response, nextSpy as unknown as NextFunction);

      expect(nextSpy.calledWith(sinon.match.instanceOf(UnauthorizedError))).to.equal(true);
      expect(nextSpy.calledWith(sinon.match.has('message', AUTHORIZATION_ERROR_MESSAGE.INVALID_TOKEN))).to.equal(true);
    });
  });

  describe('Calls "next()" without Error if:', () => {
    it('returns userId and role after decoding the token', function () {
      const req = {
        get: (): string => {
          return 'Bearer abc_token_xyz';
        },
      };

      const next = (error?: BadRequestError | UnauthorizedError): void => {};

      const verifyStub = sinon.stub(jwt, 'verify').callsFake(() => {
        return { userId: 1, role: 'user' };
      });

      isAuth(req as unknown as Request, {} as Response, next as NextFunction);

      expect(req).to.have.property('userId');
      expect(req).to.have.property('role');
      expect(req).to.have.property('userId', 1);
      expect(req).to.have.property('role', 'user');
      verifyStub.restore();
    });
  });
});
