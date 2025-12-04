import { Router } from "express";

import { AuthRoutes } from "./AuthRoutes";
import { UserRoutes } from "./userRoutes";
import { ApprenticeRoutes } from "./ApprenticeRoutes";
import { AgencyRoutes } from "./agencyRoutes";
import { GroupRoutes } from "./groupRoutes";
import { ArtistRoutes } from "./ArtistRoutes";
import { ConceptRoutes } from "./ConceptRoutes";
import { ActivityRoutes } from "./ActivityRoutes";
<<<<<<< HEAD
import { AwardRoutes } from "./AwardRoutes";
=======
import { PopularityListRoutes } from "./PopularityListRoutes";
>>>>>>> origin/master

const rootRouter: Router = Router();
const userRoutes = new UserRoutes();
const agencyRoutes = new AgencyRoutes();
 
const groupRoutes = new GroupRoutes();
const authRoutes=new AuthRoutes()
const apprenticeRoute=new ApprenticeRoutes()
const artistRoutes=new ArtistRoutes()
const conceptRoutes=new ConceptRoutes()
const activityRoutes = new ActivityRoutes();
<<<<<<< HEAD
const awardRoutes = new AwardRoutes();
=======
const popularityListRoutes=new PopularityListRoutes()
>>>>>>> origin/master

rootRouter.use("/auth", authRoutes.getRouter());
rootRouter.use("/user", userRoutes.getRouter());
rootRouter.use("/agency", agencyRoutes.getRouter());
rootRouter.use("/group", groupRoutes.getRouter());

 
rootRouter.use('/apprentice',apprenticeRoute.getRouter())
rootRouter.use("/artist", artistRoutes.getRouter());
rootRouter.use("/concept", conceptRoutes.getRouter());
rootRouter.use("/activity", activityRoutes.getRouter());
<<<<<<< HEAD
rootRouter.use("/award", awardRoutes.getRouter());

=======
rootRouter.use('/populist',popularityListRoutes.getRouter())
>>>>>>> origin/master

export default rootRouter;
