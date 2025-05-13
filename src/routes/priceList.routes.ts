import { Router } from "express";
import asyncHandler from "../middlewares/asyncHandler.middleware";

import authMiddleware from "../middlewares/auth.middleware";
import { ENDPOINTS } from "../types/endpoints";
import {
	searchPriceListItems,
	createPriceListItem,
	deletePriceListItem,
	orderPriceListItem,
	updatePriceListItem,
} from "@controllers/priceList.controller";

const router = Router();

router.get(ENDPOINTS.priceList.base, asyncHandler(searchPriceListItems));

router.post(
	ENDPOINTS.priceList.base,
	authMiddleware,
	asyncHandler(createPriceListItem)
);

router.patch(
	ENDPOINTS.priceList.byId,
	authMiddleware,
	asyncHandler(updatePriceListItem)
);

router.delete(
	ENDPOINTS.priceList.byId,
	authMiddleware,
	asyncHandler(deletePriceListItem)
);

router.patch(
	ENDPOINTS.priceList.order,
	authMiddleware,
	asyncHandler(orderPriceListItem)
);

export default router;
