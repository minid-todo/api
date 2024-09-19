DO $$ BEGIN
 CREATE TYPE "public"."login_type" AS ENUM('EMAIL', 'FACEBOOK', 'GOOGLE', 'TWITTER', 'LINKEDIN', 'GITHUB');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."workspace_types_enum" AS ENUM('BASIC', 'PRO', 'BUSINESS');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(100) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(100) NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" varchar(100),
	"uuid" uuid NOT NULL,
	"email" varchar(100) NOT NULL,
	"password" varchar(150) NOT NULL,
	"login_type" "login_type",
	CONSTRAINT "accounts_uuid_unique" UNIQUE("uuid"),
	CONSTRAINT "accounts_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(100) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(100) NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" varchar(100),
	"workspace_id" integer NOT NULL,
	"owner_id" integer NOT NULL,
	"uuid" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(255),
	"is_default" boolean DEFAULT false NOT NULL,
	"is_archived" boolean DEFAULT false NOT NULL,
	CONSTRAINT "projects_workspace_id_unique" UNIQUE("workspace_id"),
	CONSTRAINT "projects_owner_id_unique" UNIQUE("owner_id"),
	CONSTRAINT "projects_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workspace_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid NOT NULL,
	"name" varchar(100),
	"description" varchar(255),
	"workspace_type" "workspace_types_enum",
	"conf_file_upload_size" integer DEFAULT 10,
	"conf_project_limit" integer DEFAULT 10,
	"conf_history_limit" integer DEFAULT 10,
	"conf_people_limit" integer DEFAULT 10,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(100) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(100) NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" varchar(100),
	CONSTRAINT "workspace_types_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workspaces" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid NOT NULL,
	"owner_id" integer NOT NULL,
	"name" varchar(100),
	"description" varchar(255),
	"tenant_id" integer,
	"is_default" boolean DEFAULT false NOT NULL,
	"workspace_type_id" integer NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(100) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(100) NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" varchar(100),
	CONSTRAINT "workspaces_uuid_unique" UNIQUE("uuid"),
	CONSTRAINT "workspaces_owner_id_unique" UNIQUE("owner_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tenants" (
	"id" serial PRIMARY KEY NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(100) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(100) NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" varchar(100),
	"uuid" uuid,
	"name" varchar(100) NOT NULL,
	"code" varchar(100) NOT NULL,
	"owner_id" integer NOT NULL,
	"description" varchar(255),
	"is_archived" boolean DEFAULT false NOT NULL,
	CONSTRAINT "tenants_uuid_unique" UNIQUE("uuid"),
	CONSTRAINT "tenants_code_unique" UNIQUE("code"),
	CONSTRAINT "tenants_owner_id_unique" UNIQUE("owner_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sub_todos" (
	"id" serial PRIMARY KEY NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(100) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(100) NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" varchar(100),
	"todos_id" integer NOT NULL,
	"uuid" uuid NOT NULL,
	"owner_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(255),
	"priority" integer DEFAULT 4 NOT NULL,
	"start_date" date DEFAULT now(),
	"end_date" date,
	"is_completed" boolean DEFAULT false,
	CONSTRAINT "sub_todos_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "todos" (
	"id" serial PRIMARY KEY NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(100) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(100) NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" varchar(100),
	"project_id" integer NOT NULL,
	"uuid" uuid NOT NULL,
	"owner_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(255),
	"priority" integer DEFAULT 4 NOT NULL,
	"start_date" date DEFAULT now(),
	"end_date" date,
	"is_completed" boolean DEFAULT false,
	CONSTRAINT "todos_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects" ADD CONSTRAINT "projects_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects" ADD CONSTRAINT "projects_owner_id_accounts_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_owner_id_accounts_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_workspace_type_id_workspace_types_id_fk" FOREIGN KEY ("workspace_type_id") REFERENCES "public"."workspace_types"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tenants" ADD CONSTRAINT "tenants_owner_id_accounts_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sub_todos" ADD CONSTRAINT "sub_todos_todos_id_todos_id_fk" FOREIGN KEY ("todos_id") REFERENCES "public"."todos"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sub_todos" ADD CONSTRAINT "sub_todos_owner_id_accounts_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "todos" ADD CONSTRAINT "todos_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "todos" ADD CONSTRAINT "todos_owner_id_accounts_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "accounts_email_login_type_index" ON "accounts" USING btree ("email","login_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "accounts_login_type_index" ON "accounts" USING btree ("login_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "accounts_is_deleted_index" ON "accounts" USING btree ("is_deleted");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "projects_is_deleted_index" ON "projects" USING btree ("is_deleted");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "projects_is_default_index" ON "projects" USING btree ("is_default");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "projects_is_archived_index" ON "projects" USING btree ("is_archived");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "projects_workspace_id_index" ON "projects" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "projects_owner_id_index" ON "projects" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "workspaces_tenant_id_index" ON "workspaces" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "workspaces_is_deleted_index" ON "workspaces" USING btree ("is_deleted");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "workspaces_workspace_type_id_index" ON "workspaces" USING btree ("workspace_type_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "workspaces_owner_id_index" ON "workspaces" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tenants_is_deleted_index" ON "tenants" USING btree ("is_deleted");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tenants_is_archived_index" ON "tenants" USING btree ("is_archived");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tenants_owner_id_index" ON "tenants" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sub_todos_is_deleted_index" ON "sub_todos" USING btree ("is_deleted");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sub_todos_todos_id_index" ON "sub_todos" USING btree ("todos_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sub_todos_is_completed_index" ON "sub_todos" USING btree ("is_completed");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sub_todos_start_date_index" ON "sub_todos" USING btree ("start_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sub_todos_end_date_index" ON "sub_todos" USING btree ("end_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sub_todos_owner_id_index" ON "sub_todos" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sub_todos_priority_index" ON "sub_todos" USING btree ("priority");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "todos_is_deleted_index" ON "todos" USING btree ("is_deleted");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "todos_project_id_index" ON "todos" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "todos_is_completed_index" ON "todos" USING btree ("is_completed");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "todos_start_date_index" ON "todos" USING btree ("start_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "todos_end_date_index" ON "todos" USING btree ("end_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "todos_owner_id_index" ON "todos" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "todos_priority_index" ON "todos" USING btree ("priority");