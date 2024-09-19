import { and, eq } from 'drizzle-orm';
import type { Context } from 'hono';
import { db } from '../../databases';
import { redis } from '../../databases/redis';
import {
  accounts,
  projects,
  tenants,
  workspaceTypes,
  workspaces,
} from '../../databases/schemas';
import { Hasher, JWT, Responder } from '../../libs';
import type { IRegisterRequest, IloginRequest } from '../../types';

export const getUsersRoute = async (c: Context) => {
  const user_id = c.req.query('user_id');
  const responder = new Responder(c);

  if (!user_id) {
    return responder.notFound('User not found');
  }

  // Implement logic to fetch all users from the database
  const users = await db
    .select({
      uuid: accounts.uuid,
    })
    .from(accounts)
    .where(and(eq(accounts.uuid, user_id), eq(accounts.is_deleted, false)));
  if (!users || users.length <= 0) {
    return responder.notFound('User not found');
  }

  const [user] = users;

  const filterdUser = {
    uuid: user.uuid,
  };

  return responder.success(filterdUser, 'Success');
};

export const registerRoute = async (c: Context) => {
  // Implement logic to create a new user in the database
  const { email, password } = await c.req.json<IRegisterRequest>();
  const responder = new Responder(c);
  let user: typeof accounts.$inferSelect;

  if (await redis.get(`ALREGIS_${email}`)) {
    return responder.conflict('Email already exists');
  }

  [user] = await db.select().from(accounts).where(eq(accounts.email, email));

  if (user) {
    await redis.set(`ALREGIS_${email}`, 'true', 'EX', 60 * 60);
    return responder.conflict('Email already exists');
  }

  // Hash Password
  const hashedPassword = await Hasher.hashPassword(password);

  // const workspaceType = await WorkspacesTypeModel.findOne({ name: "beginner" });
  const workspaceType = await db
    .select({ id: workspaceTypes.id })
    .from(workspaceTypes)
    .where(eq(workspaceTypes.workspace_type, 'BASIC'));

  if (!workspaceType) {
    return responder.notFound('Worksapce type not found');
  }

  const result = await db.transaction(async (tx) => {
    const user = await tx
      .insert(accounts)
      .values({
        email: email,
        password: hashedPassword,
        login_type: 'EMAIL',
        created_by: 'admin',
        created_at: new Date(),
        updated_by: 'admin',
        updated_at: new Date(),
      })
      .returning({
        id: accounts.id,
      });

    const tenant = await tx
      .insert(tenants)
      .values({
        name: `${email}-tenant`,
        code: `${email}-tenant`.toLowerCase(),
        owner_id: user[0].id,
        created_by: 'admin',
        created_at: new Date(),
        updated_by: 'admin',
        updated_at: new Date(),
      })
      .returning({
        id: tenants.id,
      });

    const workspaceType = await tx
      .select({
        id: workspaceTypes.id,
      })
      .from(workspaceTypes)
      .where(eq(workspaceTypes.workspace_type, 'BASIC'));

    const worksapce = await tx
      .insert(workspaces)
      .values({
        owner_id: user[0].id,
        name: 'My Workspace',
        tenant_id: tenant[0].id,
        workspace_type_id: workspaceType[0].id,
        created_by: 'admin',
        created_at: new Date(),
        updated_by: 'admin',
        updated_at: new Date(),
      })
      .returning({
        id: workspaceTypes.id,
      });

    await tx
      .insert(projects)
      .values({
        name: 'Inbox',
        owner_id: user[0].id,
        workspace_id: worksapce[0].id,
        is_default: true,
        created_by: 'admin',
        created_at: new Date(),
        updated_by: 'admin',
        updated_at: new Date(),
      })
      .returning({
        id: projects.id,
      });

    return user;
  });

  [user] = await db
    .select()
    .from(accounts)
    .where(eq(accounts.id, result[0].id));

  if (!user) {
    return responder.notFound('User not found');
  }

  const jwtService = new JWT();
  const accessToken = await jwtService.sign({
    sub: user.uuid,
    email: user.email,
    iss: 'minid-todo.com',
    token_use: 'access',
  });

  return responder.success({ accessToken });
};

export const loginRoute = async (c: Context) => {
  // Implement logic to create a new user in the database
  const { email, password } = await c.req.json<IloginRequest>();
  const responder = new Responder(c);

  const [user] = await db
    .select()
    .from(accounts)
    .where(eq(accounts.email, email));

  if (!user) {
    return responder.badRequest('Username or Password is incorrect');
  }

  try {
    if (!(await Hasher.verifyPassword(password, user.password))) {
      return responder.badRequest('Username or Password is incorrect');
    }
  } catch (error) {
    console.log(error);
    return responder.badRequest('Username or Password is incorrect');
  }

  const jwtService = new JWT();
  const accessToken = await jwtService.sign({
    sub: user.uuid,
    email: user.email,
    iss: 'minid-todo.com',
    token_use: 'access',
  });

  return responder.success({ accessToken });
};

export const verifyRoute = async (c: Context) => {
  const sub = c.get<string>('sub');
  const email = c.get<string>('email');
  const responder = new Responder(c);

  const [user] = await db
    .select({ id: accounts.id })
    .from(accounts)
    .where(and(eq(accounts.uuid, sub), eq(accounts.email, email)));

  if (!user) {
    return responder.notFound('User not found');
  }

  return responder.success(undefined, 'OK');
};
