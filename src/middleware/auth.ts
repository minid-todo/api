import type { Context, Next } from 'hono';
import { JWT, Responder } from '../libs';

export const authMiddleware = async (c: Context, next: Next) => {
  const accessToken = c.req.header('Authorization');
  const responder = new Responder(c);

  if (!accessToken) {
    return responder.unauthorized('Missing Authorization header');
  }

  const jwtService = new JWT();
  const { status, message, data } = await jwtService.verify(
    accessToken.replace('Bearer ', ''),
  );
  if (!status) {
    return responder.forbidden(message);
  }

  // Set context variable
  c.set('sub', data?.sub);
  c.set('email', data?.email);

  await next();
};
