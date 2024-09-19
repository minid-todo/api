import { Hono } from "hono";
import { initWorkspace } from "./scripts";

// Create a new Hono application instance. This will handle HTTP requests and responses.
const app = new Hono();

// Import Route
import usersRoute from "./routes/users";
import todosRoute from "./routes/todos";
import projectsRoute from "./routes/projects";
import workspacesRoute from "./routes/workspaces";

// Add workspace type
initWorkspace();

// Assign routers
app.route("/users", usersRoute);
app.route("/todos", todosRoute);
app.route("/projects", projectsRoute);
app.route("/workspaces", workspacesRoute);

// Start the server on port 3000
console.log("Server running on http://localhost:3000");
export default app;
