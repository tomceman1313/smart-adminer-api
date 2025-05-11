import { Router } from "express";
import asyncHandler from "../middlewares/asyncHandler.middleware";
import {logIn, logOut, refresh} from "@controllers/auth.controller";
import { ENDPOINTS } from "types/endpoints";

const router = Router();

router.post(ENDPOINTS.auth.login, asyncHandler(logIn));
router.post(ENDPOINTS.auth.refresh, asyncHandler(refresh));
router.delete(ENDPOINTS.auth.logout, asyncHandler(logOut));

export default router;
