import { ImageBase64 } from "@mocks/test.constants";

export const prepareTestArticles = (tags: number[], userId: number) => [
	{
		title: "Testing article 1",
		description: "Description",
		body: "<p>Hello there</p>",
		isVisible: true,
		publishedAtDateTime: "2025-03-29T21:22:17.207Z",
		createdBy: userId,
		tags,
		image: {
			base64: ImageBase64,
			extension: "png",
			type: "image",
			context: "article",
		},
	},
	{
		title: "Testing article 2",
		description: "Description",
		body: "<p>Hello there</p>",
		isVisible: true,
		publishedAtDateTime: "2025-03-29T21:22:17.207Z",
		createdBy: userId,
		tags,
		image: {
			base64: ImageBase64,
			extension: "png",
			type: "image",
			context: "article",
		},
	},
];
