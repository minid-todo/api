import { Hono } from 'hono';
import {
  getUserValidator,
  getUsersRoute,
  loginRoute,
  loginValidator,
  registerRoute,
  registerValidator,
  verifyRoute,
} from './../modules';

import { authMiddleware } from '../middleware';

// Assign routes to Hono instance
const app = new Hono();

// Apply route
app.get('/', getUserValidator, getUsersRoute);
app.post('/register', registerValidator, registerRoute);
app.post('/login', loginValidator, loginRoute);
app.post('/verify', authMiddleware, verifyRoute);

export default app;
