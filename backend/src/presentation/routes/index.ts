import { Router } from "express";

import { AuthRoutes } from "./AuthRoutes";
import { UserRoutes } from "./userRoutes";
import { ApprenticeRoutes } from "./ApprenticeRoutes";
import { AgencyRoutes } from "./agencyRoutes";
import { GroupRoutes } from "./groupRoutes";

const rootRouter: Router = Router();
const userRoutes = new UserRoutes();
const agencyRoutes = new AgencyRoutes();
const authRoutes = new AuthRoutes();
const apprenticeRoute = new ApprenticeRoutes();
const groupRoutes = new GroupRoutes();

rootRouter.use("/auth", authRoutes.getRouter());
rootRouter.use("/user", userRoutes.getRouter());
rootRouter.use("/agency", agencyRoutes.getRouter());
rootRouter.use("/group", groupRoutes.getRouter());

rootRouter.use("/apprentice", apprenticeRoute.getRouter());
export default rootRouter;
