import { AppError } from "../middlewares/error.middleware";
import { DEFAULT_PAGE_SIZE } from "types/types";

export function getTotalPages(totalElements: number, size?: number) {
	return size
		? Math.ceil(totalElements / size)
		: Math.ceil(totalElements / DEFAULT_PAGE_SIZE);
}

export function parseIdFromUrlParams(id?: string) {
	if (!id) throw new AppError("Id is missing.", 400);

	const number = parseInt(id);

	if (Number.isNaN(number)) throw new AppError("Invalid type of ID.", 400);

	return number;
}

export function generateUniqueId() {
	const crypto = require("crypto");

	return crypto.randomBytes(16).toString("hex");
}

export function findRemovedIds(
	newState: number[],
	previousState: number[]
): number[] {
	const newIds = new Set(newState.map((id) => id));
	return previousState.filter((id) => !newIds.has(id));
}
