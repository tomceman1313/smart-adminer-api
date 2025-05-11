import { ImageBase64Small } from "@mocks/test.constants";

const context = "uploadsTest";

export const prepareTestFilesData = (tags: number[]) => [
    {
        name: "testFile2",
        base64: ImageBase64Small,
        extension: "png",
        type: "image",
        context: context,
        title: "Test File",
        description: "Justing testing order",
        image: ImageBase64Small,
        tags: tags,
    },
    {
        name: "testFile",
        base64: ImageBase64Small,
        extension: "png",
        type: "image",
        context: context,
        title: "Test File",
        description: "Justing testing order",
        image: ImageBase64Small,
        tags: tags,
    }
]