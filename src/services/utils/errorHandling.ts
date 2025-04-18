import { Prisma } from "@prisma/client";

export function isUniqueConstraintError(error: unknown, field: string) {
	return (
		error instanceof Prisma.PrismaClientKnownRequestError &&
		error.code === "P2002" &&
		Array.isArray(error.meta?.target) && // Ensure it's an array
		error.meta.target.includes(field) // Check if the field is affected
	);
}

export function isRecordNotFoundError(error: unknown) {
	return (
		error instanceof Prisma.PrismaClientKnownRequestError &&
		error.code === "P2025"
	);
}
