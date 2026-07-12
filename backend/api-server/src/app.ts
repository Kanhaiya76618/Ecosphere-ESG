import express, { type Express } from "express";
import cors from "cors";
import router from "./routes";
import { requestLogger } from "./middleware/request-logger";
import { errorHandler } from "./middleware/error-handler";

const app: Express = express();

app.use(requestLogger);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

app.use(errorHandler);

export default app;
