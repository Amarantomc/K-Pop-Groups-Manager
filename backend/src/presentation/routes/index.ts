import { Router } from "express";
import authRoutes from "./userAuth";
import { UserRoutes } from "./userRoutes";
import { AgencyRoutes } from "./agencyRoutes";

const rootRouter: Router = Router();
const userRoutes = new UserRoutes();
const agencyRoutes = new AgencyRoutes();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/user", userRoutes.getRouter());
rootRouter.use("/agency", agencyRoutes.getRouter());

export default rootRouter;
