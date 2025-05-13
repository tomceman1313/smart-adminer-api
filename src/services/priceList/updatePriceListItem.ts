import prisma from "@config/database";
import { updateEntityTags } from "@services/utils";
import { AppError } from "@src/middlewares/error.middleware";
import { UpdatePriceListRequestBody } from "types/priceList";

export async function updatePriceListItem(
	id: number,
	data: UpdatePriceListRequestBody
) {
	const where = {
		id,
	};

	const item = await prisma.priceListItem.count({ where });

	if (!item) throw new AppError("Price list item not found", 404);

	await updateEntityTags(
		prisma.priceListItemTag,
		"priceListItemId",
		id,
		data.tags
	);

	return prisma.priceListItem.update({
		data: {
			name: data.name,
			price: data.price,
			specialPrice: data.specialPrice,
			specialPriceFromDateTime: data.specialPriceFromDateTime,
			specialPriceToDateTime: data.specialPriceToDateTime,
		},
		where,
		include: {
			tags: true,
		},
	});
}
