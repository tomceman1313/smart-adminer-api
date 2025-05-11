import { Request, Response } from "express";
import {
	createVacancySchema,
	updateVacancySchema,
} from "@schema/vacancy.schema";
import { validateRequestBody } from "@services/utils";
import vacancyService from "@services/vacancies/vacancy.service";
import { ExtendedRequest } from "types/types";
import { CreateVacancyRequestBody, VacancyQuery } from "types/vacancies";
import { parseRequestQuery } from "@utils/formatting";
import { parseIdFromUrlParams } from "@utils/helpers";

// search vacancies
export async function searchVacancies(
	req: ExtendedRequest,
	res: Response
): Promise<void> {
	const parsedQuery = parseRequestQuery<VacancyQuery>(req.query);

	const vacancies = await vacancyService.searchVacancies(parsedQuery);

	res.json(vacancies);
}

// create vacancy
export async function createVacancy(
	req: ExtendedRequest<{}, {}, {}, CreateVacancyRequestBody>,
	res: Response
): Promise<void> {
	await validateRequestBody(createVacancySchema, req.body);

	const vacancy = await vacancyService.createVacancy(req.body);

	res.status(201).json(vacancy);
}

// update vacancy
export async function updateVacancy(
	req: Request,
	res: Response
): Promise<void> {
	await validateRequestBody(updateVacancySchema, req.body);

	const vacancy = await vacancyService.updateVacancy(
		parseIdFromUrlParams(req.params.id),
		req.body
	);

	res.json(vacancy);
}

// delete vacancy
export async function deleteVacancy(
	req: Request,
	res: Response
): Promise<void> {
	const tag = await vacancyService.deleteVacancy(
		parseIdFromUrlParams(req.params.id)
	);

	res.json(tag);
}
