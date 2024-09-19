import { and, eq } from 'drizzle-orm';
import type { Context } from 'hono';
import { db } from '../../databases';
import {
  accounts,
  tenants,
  workspaceTypes,
  workspaces,
} from '../../databases/schemas';
import { Responder } from '../../libs';
import type {
  ICreateWorkspaceRequestBody,
  IUpdateWorkspaceRequestBody,
} from '../../types';

export const getWorkspaceRoute = async (c: Context) => {
  const user_id: string = c.get('sub');
  const responder = new Responder(c);

  if (!user_id) {
    return responder.unauthorized('Unauthorized');
  }

  const [user] = await db
    .select({ id: accounts.id })
    .from(accounts)
    .where(eq(accounts.uuid, user_id))
    .limit(1);
  if (!user) {
    return responder.notFound('User not found');
  }

  const workspaceList = await db
    .select({
      uuid: workspaces.uuid,
      name: workspaces.name,
      description: workspaces.description,
    })
    .from(workspaces)
    .where(
      and(eq(workspaces.owner_id, user.id), eq(workspaces.is_deleted, false)),
    );

  return responder.success(workspaceList, 'Success');
};

export const createWorkspaceRoute = async (c: Context) => {
  const user_id: string = c.get('sub');
  const email: string = c.get('email');
  const responder = new Responder(c);
  const workspace = await c.req.json<ICreateWorkspaceRequestBody>();

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

  const [existTenant] = await db
    .select()
    .from(workspaces)
    .where(eq(tenants.code, `${email.toLowerCase()}-tenant`)).limit(1);
  if (!existTenant) {
    return responder.notFound('Not found default Tenant');
  }

  const [workspaceType] = await db
    .select({ id: workspaceTypes.id })
    .from(workspaceTypes)
    .where(eq(workspaceTypes.name, 'beginner'));

  if (!workspaceType) {
    return responder.notFound('Worksapce type not found');
  }

  let updatedTenant: number = existTenant.id;
  if (workspace.tenent_uid) {
    const [dbTenant] = await db.select({id: tenants.id}).from(tenants).where(eq(tenants.uuid, workspace.tenent_uid)).limit(1);
    
    if (!dbTenant) {
      return responder.notFound('Workspace not found');
    }

    updatedTenant = dbTenant.id;
  }

  const [newWorkspace] = await db
    .insert(workspaces)
    .values({
      owner_id: user.id,
      name: workspace.name,
      tenant_id: updatedTenant,
      description: workspace.description,
      workspace_type_id: workspaceType.id,
      created_by: email,
      created_at: new Date(),
      updated_by: email,
      updated_at: new Date(),
    })
    .returning({
      project_uid: workspaces.uuid,
    });

  return responder.created(newWorkspace, 'Workspace created successfully');
};

export const updateWorkspaceRoute = async (c: Context) => {
  const user_id: string = c.get('sub');
  const email: string = c.get('email');
  const workspace_uid = c.req.param('workspace_uid');
  const responder = new Responder(c);
  const workspace = await c.req.json<IUpdateWorkspaceRequestBody>();

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

  const [existWorkspace] = await db
    .select()
    .from(workspaces)
    .where(eq(workspaces.uuid, workspace_uid))
    .limit(1);
  if (!existWorkspace) {
    return responder.notFound('Workspace not found');
  }

  let updatedTenant: number = existWorkspace.tenant_id;
  if (workspace.tenent_uid) {
    const [dbTenant] = await db.select({id: tenants.id}).from(tenants).where(eq(tenants.uuid, workspace.tenent_uid)).limit(1);
    
    if (!dbTenant) {
      return responder.notFound('Workspace not found');
    }

    updatedTenant = dbTenant.id;
  }

  let updatedOwner: number = existWorkspace.owner_id;
  if (workspace.owner_uid) {
    const [dbUser] = await db.select({id: accounts.id}).from(accounts).where(eq(accounts.uuid, workspace.owner_uid)).limit(1);
    
    if (!dbUser) {
      return responder.notFound('User not found');
    }

    updatedOwner = dbUser.id;
  }

  const [updatedWorkspace] = await db
    .update(workspaces)
    .set({
      tenant_id: updatedTenant,
      owner_id: updatedOwner,
      name: workspace.name || existWorkspace.name,
      description: workspace.description || existWorkspace.description,
      updated_by: email,
      updated_at: new Date(),
    })
    .where(eq(workspaces.uuid, workspace_uid))
    .returning({
      project_uid: workspaces.uuid,
    });

  return responder.created(updatedWorkspace, 'Workspace updated successfully');
};
