import { Request, Response } from "express";
import roleService from "../services/role/role.service";
import { validateRequestBody } from "../services/utils";
import {
	createPermissionSchema,
	createRoleSchema,
	updatePermissionsSchema,
} from "../schema/role.schema";
import { parseIdFromUrlParams } from "../utils/helpers";

// get roles
export async function getRoles(req: Request, res: Response): Promise<void> {
	const roles = await roleService.getAllRoles();

	res.json(roles);
}

// create role
export async function createRole(req: Request, res: Response): Promise<void> {
	await validateRequestBody(createRoleSchema, req.body);

	const role = await roleService.createRole(req.body);

	res.status(201).json(role);
}

// update role
export async function updateRole(req: Request, res: Response): Promise<void> {
	await validateRequestBody(createRoleSchema, req.body);

	const role = await roleService.updateRole(
		parseIdFromUrlParams(req.params.id),
		req.body
	);

	res.json(role);
}

// delete role
export async function deleteRole(req: Request, res: Response): Promise<void> {
	const role = await roleService.deleteRole(
		parseIdFromUrlParams(req.params.id)
	);

	res.json(role);
}

// create permission
export async function createPermission(
	req: Request,
	res: Response
): Promise<void> {
	await validateRequestBody(createPermissionSchema, req.body);

	const permission = await roleService.createPermission(req.body);

	res.status(201).json(permission);
}

// update permissions
export async function updatePermissions(
	req: Request,
	res: Response
): Promise<void> {
	await validateRequestBody(updatePermissionsSchema, req.body);

	await roleService.updatePermissions(req.body);

	res.json();
}

// delete permission
export async function deletePermission(
	req: Request,
	res: Response
): Promise<void> {
	const permission = await roleService.deletePermission(
		parseIdFromUrlParams(req.params.id)
	);

	res.json(permission);
}
