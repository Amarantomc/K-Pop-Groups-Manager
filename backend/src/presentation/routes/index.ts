import { Router } from "express";
import authRoutes from "./userAuth";
import { UserRoutes } from "./userRoutes";
import agencyRoutes from "./agencyRoutes";

const rootRouter: Router = Router();
const userRoutes = new UserRoutes();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/user", userRoutes.getRouter());
rootRouter.use("/agency", agencyRoutes);

export default rootRouter;
