import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.middleware";

export const app = express();

// Middleware
app.use(cookieParser());
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Automatically import all routes
const routesPath = path.join(__dirname, "routes");
fs.readdirSync(routesPath).forEach((file) => {
	const route = require(`./routes/${file}`);
	if (typeof route.default === "function") {
		app.use("/api", route.default);
	}
});

// Use Error Handling Middleware
app.use(errorMiddleware);
