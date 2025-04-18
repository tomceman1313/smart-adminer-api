import { Router } from "express";
import {
	createRole,
	getRoles,
	createPermission,
	deleteRole,
	updatePermissions,
	deletePermission,
	updateRole,
} from "../controllers/role.controller";
import asyncHandler from "../middlewares/asyncHandler.middleware";
import authMiddleware from "../middlewares/auth.middleware";
import { ENDPOINTS } from "../types/endpoints";

const router = Router();

// roles
router.get(ENDPOINTS.roles.base, authMiddleware, asyncHandler(getRoles));
router.post(ENDPOINTS.roles.base, authMiddleware, asyncHandler(createRole));
router.put(ENDPOINTS.roles.byId, authMiddleware, asyncHandler(updateRole));
router.delete(ENDPOINTS.roles.byId, authMiddleware, asyncHandler(deleteRole));

// permissions
router.post(
	ENDPOINTS.roles.permissions,
	authMiddleware,
	asyncHandler(createPermission)
);
router.patch(
	ENDPOINTS.roles.permissions,
	authMiddleware,
	asyncHandler(updatePermissions)
);
router.delete(
	ENDPOINTS.roles.permissionById,
	authMiddleware,
	asyncHandler(deletePermission)
);

export default router;
