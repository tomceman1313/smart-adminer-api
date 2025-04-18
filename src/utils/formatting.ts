export function parseRequestQuery<TQuery>(query: {
	[key: string]: string;
}): TQuery {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const parsedQuery: any = {};

	Object.entries(query).forEach(([key, value]) => {
		if (value === "true") {
			parsedQuery[key] = true;
		} else if (value === "false") {
			parsedQuery[key] = false;
		} else if (!isNaN(Number(value))) {
			parsedQuery[key] = Number(value);
		} else {
			try {
				parsedQuery[key] = JSON.parse(value);
			} catch {
				parsedQuery[key] = value;
			}
		}
	});

	return parsedQuery as TQuery;
}
