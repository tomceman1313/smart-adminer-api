import { Router } from "express";
import asyncHandler from "../middlewares/asyncHandler.middleware";
import {
	createVacancy,
	searchVacancies,
	updateVacancy,
	deleteVacancy,
} from "../controllers/vacancy.controller";
import authMiddleware from "../middlewares/auth.middleware";
import { ENDPOINTS } from "../types/endpoints";

const router = Router();

router.get(ENDPOINTS.vacancies.base, asyncHandler(searchVacancies));

router.post(
	ENDPOINTS.vacancies.base,
	authMiddleware,
	asyncHandler(createVacancy)
);

router.patch(
	ENDPOINTS.vacancies.byId,
	authMiddleware,
	asyncHandler(updateVacancy)
);

router.delete(
	ENDPOINTS.vacancies.byId,
	authMiddleware,
	asyncHandler(deleteVacancy)
);

export default router;
