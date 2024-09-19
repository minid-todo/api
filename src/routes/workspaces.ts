import { Hono } from 'hono';
import { authMiddleware } from '../middleware';
import {
  createWorkspaceRoute,
  createWorkspaceValidator,
  getWorkspaceRoute,
  updateWorkspaceRoute,
  updateWorkspaceValidator,
} from '../modules';

// Assign routes to Hono instance
const app = new Hono();

// Apply route
app.get('/', authMiddleware, getWorkspaceRoute);
app.post('/', authMiddleware, createWorkspaceValidator, createWorkspaceRoute);
app.put(
  '/:workspace_id',
  authMiddleware,
  updateWorkspaceValidator,
  updateWorkspaceRoute,
);

export default app;
