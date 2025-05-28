import { searchProducts } from "./searchProducts";
import { createProduct } from "./createProduct";
import { updateProduct } from "./updateProduct";
import { deleteProduct } from "./deleteProduct";

import { createManufacturer } from "./manufacturers/createManufacturer";
import { deleteManufacturer } from "./manufacturers/deleteManufacturer";
import { searchManufacturer } from "./manufacturers/searchManufacturers";
import { updateManufacturer } from "./manufacturers/updateManufacturer";

export default {
	searchProducts,
	createProduct,
	updateProduct,
	deleteProduct,
	searchManufacturer,
	createManufacturer,
	updateManufacturer,
	deleteManufacturer,
};
