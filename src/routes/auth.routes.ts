import { Router } from "express";
import { logIn, refresh, logOut } from "@controllers/auth.controller";
import asyncHandler from "../middlewares/asyncHandler.middleware";
import { ENDPOINTS } from "types/endpoints";

const router = Router();

router.post(ENDPOINTS.auth.login, asyncHandler(logIn));
router.post(ENDPOINTS.auth.refresh, asyncHandler(refresh));
router.delete(ENDPOINTS.auth.logout, asyncHandler(logOut));

export default router;
