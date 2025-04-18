import { z } from "zod";

export const createRoleSchema = z.object({
	name: z.string(),
});

export const createPermissionSchema = z.object({
	roleId: z.number(),
	section: z.string(),
	canView: z.boolean().optional(),
	canEdit: z.boolean().optional(),
	canDelete: z.boolean().optional(),
});

export const updatePermissionSchema = z.object({
	section: z.string().optional(),
	canView: z.boolean().optional(),
	canEdit: z.boolean().optional(),
	canDelete: z.boolean().optional(),
});

export const updatePermissionsSchema = z.array(
	z.object({
		id: z.number(),
		canView: z.boolean().optional(),
		canEdit: z.boolean().optional(),
		canDelete: z.boolean().optional(),
	})
);
