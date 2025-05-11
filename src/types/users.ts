import { PaginationQuery } from "./types";

export interface User {
	username: string;
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	roleId: number;
}

export interface UserQuery extends PaginationQuery {
	username?: string;
	id?: number;
	email?: string;
	role?: string[];
}
