import express from "express";
import { PORT } from "./secrets";
import rootRouter from "./presentation/routes";
import { PrismaClient } from "./generated/prisma";
import cors from "cors";

const app = express();
const prismaCliente = new PrismaClient({
	log: ["query"],
});
app.use(express.json());
app.use(
	cors({
		origin: "http://localhost:5173",
	})
);
app.use("/api", rootRouter);
app.listen(PORT, () => {
	console.log("Working Server");
});
