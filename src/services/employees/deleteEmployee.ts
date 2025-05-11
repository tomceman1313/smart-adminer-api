import prisma from "@config/database";
import { deleteFile } from "@services/utils/fileModifications";
import { FOLDERS } from "types/fileFolders";

export async function deleteEmployee(id: number) {
	const where = {
		id,
	};

	const employee = await prisma.employee.findUnique({
		where,
		include: { image: true, departments: true },
	});

	const result = await prisma.$transaction(async (tx) => {
		// delete image
		if (employee?.image) {
			await deleteFile(`${FOLDERS.employee}/${employee.image.name}`);
		}

		await tx.employee.delete({ where });
	});

	return result;
}
