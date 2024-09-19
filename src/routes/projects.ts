import { Hono } from 'hono';
import { authMiddleware } from '../middleware';
import {
  createProjectRoute,
  createProjectValidator,
  getProjectRoute,
  updateProjectRoute,
  updateProjectValidator,
} from '../modules';

// Assign routes to Hono instance
const app = new Hono();

// Apply route
app.get('/', authMiddleware, getProjectRoute);
app.post('/', authMiddleware, createProjectValidator, createProjectRoute);
app.put(
  '/:project_uid',
  authMiddleware,
  updateProjectValidator,
  updateProjectRoute,
);

export default app;
