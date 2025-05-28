import { Router } from "express";
import asyncHandler from "../middlewares/asyncHandler.middleware";

import authMiddleware from "../middlewares/auth.middleware";
import { ENDPOINTS } from "../types/endpoints";
import {
	createProduct,
	searchProducts,
	updateProduct,
	deleteProduct,
	orderProduct,
	createManufacturer,
	deleteManufacturer,
	searchManufacturers,
	updateManufacturer,
} from "@controllers/product.controller";

const router = Router();

router.get(ENDPOINTS.products.base, asyncHandler(searchProducts));

router.post(
	ENDPOINTS.products.base,
	authMiddleware,
	asyncHandler(createProduct)
);

router.patch(
	ENDPOINTS.products.byId,
	authMiddleware,
	asyncHandler(updateProduct)
);

router.delete(
	ENDPOINTS.products.byId,
	authMiddleware,
	asyncHandler(deleteProduct)
);

router.patch(
	ENDPOINTS.products.order,
	authMiddleware,
	asyncHandler(orderProduct)
);

router.get(
	ENDPOINTS.products.manufacturers.base,
	asyncHandler(searchManufacturers)
);

router.post(
	ENDPOINTS.products.manufacturers.base,
	authMiddleware,
	asyncHandler(createManufacturer)
);

router.put(
	ENDPOINTS.products.manufacturers.byId,
	authMiddleware,
	asyncHandler(updateManufacturer)
);

router.delete(
	ENDPOINTS.products.manufacturers.byId,
	authMiddleware,
	asyncHandler(deleteManufacturer)
);

export default router;
