import { Request } from 'express';

type signUpRequestBodyDTO = { username: string; password: string; email: string };

export type SignUpRequest = Request<unknown, unknown, signUpRequestBodyDTO, unknown>;

type loginRequestBodyDTO = { password: string; email: string };

export type LoginRequest = Request<unknown, unknown, loginRequestBodyDTO, unknown>;
