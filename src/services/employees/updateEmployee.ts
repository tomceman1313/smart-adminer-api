import prisma from "@config/database";
import { createFile } from "@services/files/createFile";
import { updateEntityTags } from "@services/utils";
import { AppError } from "@src/middlewares/error.middleware";
import { UpdateEmployeeRequestBody } from "types/employees";
import { FOLDERS } from "types/fileFolders";

export async function updateEmployee(
	id: number,
	data: UpdateEmployeeRequestBody
) {
	const where = {
		id,
	};

	const employee = await prisma.employee.findUnique({ where });

	if (!employee) throw new AppError("Employee not found", 404);

	// update image
	const isImageUpdated = !!data.image;
	let image = undefined;

	if (isImageUpdated && data.image?.base64) {
		const newImage = await createFile({
			...data.image,
			context: FOLDERS.employee,
		});

		if (!newImage) {
			throw new AppError("Image upload failed", 500);
		}

		image = {
			image: {
				connect: {
					id: newImage.id,
				},
			},
		};
	}

	// update departments
	await updateEntityTags(
		prisma.employeeTag,
		"employeeId",
		id,
		data.departments
	);

	// update data
	return prisma.employee.update({
		where,
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
			...image,
		},
		include: {
			image: true,
			departments: true,
		},
	});
}
