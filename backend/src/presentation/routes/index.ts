import { Router } from "express";
 
 
import { AuthRoutes } from "./AuthRoutes";
import { UserRoutes } from "./userRoutes";
import { ApprenticeRoutes } from "./ApprenticeRoutes";

const rootRouter:Router=Router()
const userRoutes=new UserRoutes()
const authRoutes=new AuthRoutes()
const apprenticeRoute=new ApprenticeRoutes()

rootRouter.use('/auth',authRoutes.getRouter())
rootRouter.use('/user',userRoutes.getRouter())
rootRouter.use('/apprentice',apprenticeRoute.getRouter())
export default rootRouter