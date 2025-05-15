import { Prisma } from "@prisma/client";
import { CreateFileBodyRequest } from "./files";

export interface CreatePageRequestBody
	extends Omit<Prisma.PageCreateInput, "images" | "image"> {
	image?: CreateFileBodyRequest & { id?: number };
	images: Array<CreateFileBodyRequest & { id?: number }>;
}
