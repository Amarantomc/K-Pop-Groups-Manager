import { Router } from "express";
 
 
import { AuthRoutes } from "./AuthRoutes";
import { UserRoutes } from "./userRoutes";
import { ApprenticeRoutes } from "./ApprenticeRoutes";
import { AgencyRoutes } from "./agencyRoutes";
import { ArtistRoutes } from "./ArtistRoutes";
import { ConceptRoutes } from "./ConceptRoutes";
import { ActivityRoutes } from "./ActivityRoutes";
import { PopularityListRoutes } from "./PopularityListRoutes";

const rootRouter: Router = Router();
const userRoutes = new UserRoutes();
const agencyRoutes = new AgencyRoutes();
const authRoutes=new AuthRoutes()
const apprenticeRoute=new ApprenticeRoutes()
const artistRoutes=new ArtistRoutes()
const conceptRoutes=new ConceptRoutes()
const activityRoutes = new ActivityRoutes();
const popularityListRoutes=new PopularityListRoutes()

rootRouter.use("/auth", authRoutes.getRouter());
rootRouter.use("/user", userRoutes.getRouter());
rootRouter.use("/agency", agencyRoutes.getRouter());
rootRouter.use('/apprentice',apprenticeRoute.getRouter())
rootRouter.use("/artist", artistRoutes.getRouter());
rootRouter.use("/concept", conceptRoutes.getRouter());
rootRouter.use("/activity", activityRoutes.getRouter());
rootRouter.use('/populist',popularityListRoutes.getRouter())

export default rootRouter;
