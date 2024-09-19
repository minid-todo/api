import { Hono } from 'hono';
import { authMiddleware } from '../middleware';
import {
  createTodoRoute,
  createTodoValidator,
  getTodoRoute,
  updateTodoRoute,
  updateTodoValidator,
} from '../modules';

// Assign routes to Hono instance
const app = new Hono();

// Apply route
app.get('/', authMiddleware, getTodoRoute);
app.post('/', authMiddleware, createTodoValidator, createTodoRoute);
app.put('/:todo_uid', authMiddleware, updateTodoValidator, updateTodoRoute);

export default app;
