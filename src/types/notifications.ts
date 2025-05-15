import { PaginationQuery } from "./types";

export type NotificationType = "info" | "warning" | "alert";

export interface NotificationsQuery extends PaginationQuery {
	id?: number;
	type?: NotificationType;
	urlPath?: string;
	from?: string;
	to?: string;
}
