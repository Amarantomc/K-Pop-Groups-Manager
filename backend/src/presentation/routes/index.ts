import { Router } from "express";

import { AuthRoutes } from "./AuthRoutes";
import { UserRoutes } from "./userRoutes";
import { ApprenticeRoutes } from "./ApprenticeRoutes";
import { AgencyRoutes } from "./agencyRoutes";
import { ArtistRoutes } from "./ArtistRoutes";
import { ConceptRoutes } from "./ConceptRoutes";
import { ActivityRoutes } from "./ActivityRoutes";
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { AlbumRoutes } from "./AlbumRoutes";
import { SongRoutes } from "./SongRoutes";
=======
import { PopularityListRoutes } from "./PopularityListRoutes";
>>>>>>> f036841 (Some Fixes (#104))
=======
=======
>>>>>>> 0d29b15 (Crud award implementation (#117))
=======
import { VisualConceptRoutes } from "./VisualConceptRoutes";
>>>>>>> 8d68224 (Crud visual concept implemetation (#118))
import { AwardRoutes } from "./AwardRoutes";
import { PopularityListRoutes } from "./PopularityListRoutes";
<<<<<<< HEAD
>>>>>>> origin/master
>>>>>>> 6f5c07e (Crud award implementation (#116))
=======
 

>>>>>>> 0d29b15 (Crud award implementation (#117))

const rootRouter: Router = Router();
const userRoutes = new UserRoutes();
const agencyRoutes = new AgencyRoutes();
const authRoutes = new AuthRoutes();
const apprenticeRoute = new ApprenticeRoutes();
const artistRoutes = new ArtistRoutes();
const conceptRoutes = new ConceptRoutes();
const activityRoutes = new ActivityRoutes();
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
const albumRoutes = new AlbumRoutes();
const songRoutes = new SongRoutes();
=======
const popularityListRoutes=new PopularityListRoutes()
>>>>>>> f036841 (Some Fixes (#104))
=======
=======
>>>>>>> 0d29b15 (Crud award implementation (#117))
=======
const visualConceptRoutes=new VisualConceptRoutes()
>>>>>>> 8d68224 (Crud visual concept implemetation (#118))
const awardRoutes = new AwardRoutes();
const popularityListRoutes=new PopularityListRoutes()
<<<<<<< HEAD
>>>>>>> origin/master
>>>>>>> 6f5c07e (Crud award implementation (#116))
=======
 
>>>>>>> 0d29b15 (Crud award implementation (#117))

rootRouter.use("/auth", authRoutes.getRouter());
rootRouter.use("/user", userRoutes.getRouter());
rootRouter.use("/agency", agencyRoutes.getRouter());
rootRouter.use("/apprentice", apprenticeRoute.getRouter());
rootRouter.use("/artist", artistRoutes.getRouter());
rootRouter.use("/concept", conceptRoutes.getRouter());
rootRouter.use("/activity", activityRoutes.getRouter());
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
rootRouter.use("/album", albumRoutes.getRouter());
rootRouter.use("/song", songRoutes.getRouter());
=======
rootRouter.use('/populist',popularityListRoutes.getRouter())
>>>>>>> f036841 (Some Fixes (#104))
=======
=======
>>>>>>> 0d29b15 (Crud award implementation (#117))
=======
rootRouter.use("/visual-concept", visualConceptRoutes.getRouter());
>>>>>>> 8d68224 (Crud visual concept implemetation (#118))
rootRouter.use("/award", awardRoutes.getRouter());

rootRouter.use('/populist',popularityListRoutes.getRouter())
<<<<<<< HEAD
>>>>>>> origin/master
>>>>>>> 6f5c07e (Crud award implementation (#116))
=======

>>>>>>> 0d29b15 (Crud award implementation (#117))

export default rootRouter;
