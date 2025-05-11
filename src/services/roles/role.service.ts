import { createPermission } from "./createPermission";
import { createRole } from "./createRole";
import { deletePermission } from "./deletePermission";
import { deleteRole } from "./deleteRole";
import { getAllRoles } from "./getAllRoles";
import { updatePermissions } from "./updatePermissions";
import { updateRole } from "./updateRole";

export default {
	getAllRoles,
	createRole,
	updateRole,
	deleteRole,
	// permissions
	createPermission,
	updatePermissions,
	deletePermission,
};
