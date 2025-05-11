import {
	createEntityTags,
	EntityTagWithPosition,
	getEntityLastPosition,
} from "@services/utils";
import { CreateEmployeeRequestBody } from "types/employees";
import { PRISMA_TABLES } from "types/types";
import prisma from "../../config/database";
import { createFile } from "@services/files/createFile";
import { CreateFileBodyRequest } from "types/files";
import { FOLDERS } from "types/fileFolders";
import { AppError } from "@src/middlewares/error.middleware";

export async function createEmployee(data: CreateEmployeeRequestBody) {
	let imageId;

	if (data.image) {
		const isAlreadyCreated = data.image.id;

		const newImage = isAlreadyCreated
			? data.image
			: await createFile({
					...(data.image as CreateFileBodyRequest),
					context: FOLDERS.employee,
				});

		imageId = newImage.id;

		if (!imageId) {
			throw new AppError("Image upload failed", 500);
		}
	}

	const lastPosition = await getEntityLastPosition(
		prisma.employee,
		PRISMA_TABLES.employee
	);

	const departments = await createEntityTags<EntityTagWithPosition>(
		prisma.employeeTag,
		PRISMA_TABLES.employeeTag,
		data.departments,
		true,
		"departments"
	);

	return prisma.employee.create({
		data: {
			firstName: data.firstName,
			lastName: data.lastName,
			jobTitle: data.jobTitle,
			isVisible: data.isVisible,
			degreeBefore: data.degreeBefore,
			degreeAfter: data.degreeAfter,
			phone: data.phone,
			phoneSecondary: data.phoneSecondary,
			notes: data.notes,
			position: (lastPosition[0].position || 0) + 10,
			imageId,
			...departments,
		},
		include: {
			departments: true,
			image: true,
		},
	});
}
