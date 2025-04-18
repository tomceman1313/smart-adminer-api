import { PaginationQuery } from "./types";

export interface UserQuery extends PaginationQuery {
	username?: string;
	id?: number;
	email?: string;
	role?: string[];
}
