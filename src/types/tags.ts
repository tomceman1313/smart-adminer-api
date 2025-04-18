import { PaginationQuery } from "./types";

export interface TagQuery extends PaginationQuery {
	name?: string[];
	section?: string[];
	private?: boolean;
}
