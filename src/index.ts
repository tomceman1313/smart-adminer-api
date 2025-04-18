import dotenv from "dotenv";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { app } from "./app";

dotenv.config();
const PORT = process.env.PORT || 5000;

// Swagger Setup
const swaggerOptions = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "My REST API",
			version: "1.0.0",
			description: "API documentation",
		},
	},
	apis: ["./src/routes/*.ts"], // Path to your routes
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
