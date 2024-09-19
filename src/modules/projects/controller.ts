import { and, eq } from 'drizzle-orm';
import type { Context } from 'hono';
import { db } from '../../databases';
import { accounts, projects, todos, workspaces } from '../../databases/schemas';
import { Responder } from '../../libs';
import type {
  ICreateProjectRequestBody,
  IUpdateProjectRequestBody,
} from '../../types';

export const getProjectRoute = async (c: Context) => {
  const user_id = c.get<string>('sub');
  const responder = new Responder(c);

  if (!user_id) {
    return responder.unauthorized('Unauthorized');
  }

  const [user] = await db
    .select({ id: accounts.id })
    .from(accounts)
    .where(eq(accounts.uuid, user_id));
  if (!user) {
    return responder.notFound('User not found');
  }

  const projectLists = await db
    .select({
      uuid: projects.uuid,
      name: projects.name,
      description: projects.description,
      is_archived: projects.is_archived,
      created_at: projects.created_at,
      owner: {
        uuid: accounts.uuid,
      },
      workspace: {
        uuid: workspaces.uuid,
        name: workspaces.name,
        description: workspaces.description,
      },
    })
    .from(projects)
    .innerJoin(workspaces, eq(projects.workspace_id, workspaces.id))
    .innerJoin(accounts, eq(projects.owner_id, accounts.id))
    .where(
      and(
        eq(projects.owner_id, user.id),
        eq(projects.is_archived, false),
        eq(projects.is_deleted, false),
      ),
    );

  return responder.success(projectLists, 'Success');
};

export const createProjectRoute = async (c: Context) => {
  const user_id = c.get<string>('sub');
  const email = c.get<string>('email');
  const responder = new Responder(c);
  const project = await c.req.json<ICreateProjectRequestBody>();

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

  const [workspace] = await db
    .select()
    .from(workspaces)
    .where(eq(workspaces.is_default, true));
  if (!workspace) {
    return responder.notFound('Not found default workspace');
  }

  const [newProject] = await db
    .insert(projects)
    .values({
      owner_id: user.id,
      name: project.name,
      workspace_id: workspace.id,
      description: project.description,
      created_by: email,
      created_at: new Date(),
      updated_by: email,
      updated_at: new Date(),
    })
    .returning({
      project_uid: projects.uuid,
    });

  return responder.created(newProject, 'Todo created successfully');
};

export const updateProjectRoute = async (c: Context) => {
  const user_id = c.get<string>('sub');
  const email = c.get<string>('email');
  const project_uid = c.req.param('project_uid');
  const responder = new Responder(c);
  const project = await c.req.json<IUpdateProjectRequestBody>();

  if (!user_id) {
    return responder.unauthorized('Unauthorized');
  }

  const [user] = await db
    .select()
    .from(accounts)
    .where(eq(accounts.uuid, user_id))
    .limit(1);
  if (!user) {
    return responder.notFound('User not found');
  }

  const [existProject] = await db
    .select()
    .from(projects)
    .where(eq(projects.uuid, project_uid))
    .limit(1);
  if (!existProject) {
    return responder.notFound('Project not found');
  }

  let updatedWorkspace: number = existProject.workspace_id;
  if (project.workspace_uid) {
    const [dbWorkspace] = await db.select({id: workspaces.id}).from(workspaces).where(eq(workspaces.uuid, project.workspace_uid)).limit(1);
    
    if (!dbWorkspace) {
      return responder.notFound('Workspace not found');
    }

    updatedWorkspace = dbWorkspace.id;
  }

  let updatedOwner: number = existProject.owner_id;
  if (project.owner_uid) {
    const [dbUser] = await db.select({id: accounts.id}).from(accounts).where(eq(accounts.uuid, project.owner_uid)).limit(1);
    
    if (!dbUser) {
      return responder.notFound('User not found');
    }

    updatedWorkspace = dbUser.id;
  }
  

  const [updatedProject] = await db
    .update(projects)
    .set({
      workspace_id: updatedWorkspace,
      owner_id: updatedOwner,
      name: project.name || existProject.name,
      description: project.description || existProject.description,
      is_archived: project.is_archived || existProject.is_archived,
      updated_by: email,
      updated_at: new Date(),
    })
    .where(eq(projects.uuid, project_uid))
    .returning({
      project_uid: projects.uuid,
    });

  return responder.created(updatedProject, 'Project updated successfully');
};
