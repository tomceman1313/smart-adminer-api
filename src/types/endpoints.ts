const SERVICES_BASE = {
	auth: "/auth",
	articles: "/articles",
	categories: "/tags",
	employees: "/employees",
	files: "/files",
	users: "/users",
	vacancies: "/vacancies",
};

export const ENDPOINTS = {
	auth: {
		login: `${SERVICES_BASE.auth}/login`,
		refresh: `${SERVICES_BASE.auth}/refresh`,
		logout: `${SERVICES_BASE.auth}/logout`,
	},
	articles: {
		base: `${SERVICES_BASE.articles}`,
		byId: `${SERVICES_BASE.articles}/:id`,
		order: `${SERVICES_BASE.articles}/:id/order`,
	},
	employees: {
		base: `${SERVICES_BASE.employees}`,
		byId: `${SERVICES_BASE.employees}/:id`,
		order: `${SERVICES_BASE.employees}/:id/order`,
	},
	files: {
		base: `${SERVICES_BASE.files}`,
		byId: `${SERVICES_BASE.files}/:id`,
		order: `${SERVICES_BASE.files}/:id/order`,
	},
	tags: {
		base: `${SERVICES_BASE.categories}`,
		byId: `${SERVICES_BASE.categories}/:id`,
	},
	users: {
		base: `${SERVICES_BASE.users}`,
		byId: `${SERVICES_BASE.users}/:id`,
		changePassword: `${SERVICES_BASE.users}/:id/password`,
	},
	roles: {
		base: `${SERVICES_BASE.users}/roles`,
		byId: `${SERVICES_BASE.users}/roles/:id`,
		permissions: `${SERVICES_BASE.users}/permissions`,
		permissionById: `${SERVICES_BASE.users}/permissions/:id`,
	},
	vacancies: {
		base: `${SERVICES_BASE.vacancies}`,
		byId: `${SERVICES_BASE.vacancies}/:id`,
	},
};
