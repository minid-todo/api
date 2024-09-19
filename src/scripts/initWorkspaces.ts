import { eq } from 'drizzle-orm';
import { db } from '../databases';
import { workspaceTypes } from '../databases/schemas';

export const initWorkspace = async () => {
  const Basic = db
    .select({id: workspaceTypes.id})
    .from(workspaceTypes)
    .where(eq(workspaceTypes.workspace_type, 'BASIC'));
  const Pro = db
    .select({id: workspaceTypes.id})
    .from(workspaceTypes)
    .where(eq(workspaceTypes.workspace_type, 'PRO'));
  const Business = db
    .select({id: workspaceTypes.id})
    .from(workspaceTypes)
    .where(eq(workspaceTypes.workspace_type, 'BUSINESS'));

  const [resultBasic, resultPro, resultBusiness] = await Promise.all([
    Basic,
    Pro,
    Business,
  ]);

  if (resultBasic.length <= 0) {
    await db.insert(workspaceTypes).values([
      {
        workspace_type: 'BASIC',
        name: 'Basic Workspace',
        conf_file_upload_size: 10,
        conf_project_limit: 10,
        conf_history_limit: 10,
        conf_people_limit: 10,
        created_by: 'admin',
        created_at: new Date(),
        updated_by: 'admin',
        updated_at: new Date(),
      },
    ]);
  }

  if (resultPro.length <= 0) {
    await db.insert(workspaceTypes).values([
      {
        workspace_type: 'PRO',
        name: 'Pro Workspace',
        conf_file_upload_size: 10,
        conf_project_limit: 10,
        conf_history_limit: 10,
        conf_people_limit: 10,
        created_by: 'admin',
        created_at: new Date(),
        updated_by: 'admin',
        updated_at: new Date(),
      },
    ]);
  }

  if (resultBusiness.length <= 0) {
    await db.insert(workspaceTypes).values([
      {
        workspace_type: 'BUSINESS',
        name: 'Business Workspace',
        conf_file_upload_size: 10,
        conf_project_limit: 10,
        conf_history_limit: 10,
        conf_people_limit: 10,
        created_by: 'admin',
        created_at: new Date(),
        updated_by: 'admin',
        updated_at: new Date(),
      },
    ]);
  }
};
