import { and, eq } from 'drizzle-orm';
import type { Context } from 'hono';
import { db } from '../../databases';
import { accounts, projects, todos } from '../../databases/schemas';
import { Responder } from '../../libs';
import type { ICreateTodoRequest, IUpdateTodoRequestBody } from '../../types';

export const getTodoRoute = async (c: Context) => {
  const user_id = c.get<string>('sub');
  const responder = new Responder(c);

  if (!user_id) {
    return responder.unauthorized('Unauthorized');
  }

  const [user] = await db
    .select()
    .from(accounts)
    .where(eq(accounts.uuid, user_id));
  if (!user) {
    return responder.notFound('User not found');
  }

  const todoLists = await db
    .select()
    .from(todos)
    .where(eq(todos.owner_id, user.id));

  return responder.success(todoLists, 'Success');
};

export const createTodoRoute = async (c: Context) => {
  const user_id = c.get<string>('sub');
  const email = c.get<string>('email');
  const responder = new Responder(c);
  const todo = await c.req.json<ICreateTodoRequest>();

  if (!user_id) {
    return responder.unauthorized('Unauthorized');
  }

  const [user] = await db
    .select()
    .from(accounts)
    .where(eq(accounts.uuid, user_id)).limit(1);
  if (!user) {
    return responder.notFound('User not found');
  }

  const [existProject] = await db
    .select()
    .from(projects)
    .where(eq(projects.is_default, true)).limit(1);
  if (!existProject) {
    return responder.notFound('Not found default project');
  }

  let updatedProject: number = existProject.id;
  if (todo.project_uid) {
    const [dbProject] = await db.select({id: projects.id}).from(projects).where(eq(projects.uuid, todo.project_uid)).limit(1);
    
    if (!dbProject) {
      return responder.notFound('Project not found');
    }

    updatedProject = dbProject.id;
  }

  const [newTodo] = await db
    .insert(todos)
    .values({
      owner_id: user.id,
      name: todo.name,
      description: todo.description,
      priority: todo.priority || 4,
      project_id: updatedProject,
      created_by: email,
      created_at: new Date(),
      updated_by: email,
      updated_at: new Date(),
    })
    .returning({
      todo_uid: todos.uuid,
    });

  return responder.created(newTodo, 'Todo created successfully');
};

export const updateTodoRoute = async (c: Context) => {
  const user_id = c.get<string>('sub');
  const email = c.get<string>('email');
  const todo_uid = c.req.param('todo_uid');
  const responder = new Responder(c);
  const todo = await c.req.json<IUpdateTodoRequestBody>();

  if (!user_id) {
    return responder.unauthorized('Unauthorized');
  }

  const [user] = await db
    .select()
    .from(accounts)
    .where(eq(accounts.uuid, user_id));
  if (!user) {
    return responder.notFound('User not found');
  }

  const [checkTodoRight] = await db
    .select()
    .from(todos)
    .where(and(eq(todos.uuid, todo_uid), eq(todos.owner_id, user.id)))
    .limit(1);
  if (!checkTodoRight) {
    return responder.forbidden(
      'Forbidden: You are not authorized to update this todo',
    );
  }

  const [existsTodo] = await db
    .select()
    .from(todos)
    .where(eq(todos.uuid, todo_uid))
    .limit(1);
  if (!existsTodo) {
    return responder.notFound('Todo not found');
  }

  let updatedProject: number = existsTodo.project_id;
  if (todo.project_uid) {
    const [dbProject] = await db.select({id: projects.id}).from(projects).where(eq(projects.uuid, todo.project_uid)).limit(1);
    
    if (!dbProject) {
      return responder.notFound('Project not found');
    }

    updatedProject = dbProject.id;
  }

  const [updatedTodo] = await db
    .update(todos)
    .set({
      project_id: updatedProject,
      name: todo.name || existsTodo.name,
      description: todo.description || existsTodo.description,
      priority: todo.priority || existsTodo.priority,
      start_date: todo.start_date || existsTodo.start_date,
      end_date: todo.start_date || existsTodo.end_date,
      is_completed: todo.is_completed || existsTodo.is_completed,
      updated_at: new Date(),
      updated_by: email,
    })
    .where(eq(todos.uuid, todo_uid))
    .returning({
      todo_uid: todos.uuid,
    });

  return responder.success(updatedTodo, 'Todo updated successfully');
};
