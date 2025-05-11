import { Router } from "express";
import asyncHandler from "../middlewares/asyncHandler.middleware";
import {
	createEmployee,
	deleteEmployee,
	orderEmployee,
	searchEmployees,
	updateEmployee,
} from "@controllers/employee.controller";
import authMiddleware from "../middlewares/auth.middleware";
import { ENDPOINTS } from "../types/endpoints";

const router = Router();

router.get(ENDPOINTS.employees.base, asyncHandler(searchEmployees));

router.post(
	ENDPOINTS.employees.base,
	authMiddleware,
	asyncHandler(createEmployee)
);

router.patch(
	ENDPOINTS.employees.byId,
	authMiddleware,
	asyncHandler(updateEmployee)
);

router.delete(
	ENDPOINTS.employees.byId,
	authMiddleware,
	asyncHandler(deleteEmployee)
);

router.patch(
	ENDPOINTS.employees.order,
	authMiddleware,
	asyncHandler(orderEmployee)
);

export default router;
