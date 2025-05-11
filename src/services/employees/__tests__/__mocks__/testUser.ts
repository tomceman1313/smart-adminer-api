import { ImageBase64 } from "@mocks/test.constants";
import { FOLDERS } from "types/fileFolders";

export const prepareTestUserMock = (departmentIds: number[]) => {
	return {
		firstName: "Tomáš",
		lastName: "Zeman",
		jobTitle: "Fullstack developer",
		isVisible: true,
		degreeBefore: "Ing.",
		degreeAfter: "Dis.",
		phone: "+420777333444",
		phoneSecondary: "+420999888777",
		notes: "Test employee",
		departments: departmentIds,
		image: {
			base64: ImageBase64,
			extension: "png",
			type: "image",
			context: FOLDERS.employee,
		},
	};
};
