import { Router } from "express";
 
 
import { AuthRoutes } from "./AuthRoutes";
import { UserRoutes } from "./UserRoutes";

const rootRouter:Router=Router()
const userRoutes=new UserRoutes()
const authRoutes=new AuthRoutes()

rootRouter.use('/auth',authRoutes.getRouter())
rootRouter.use('/user',userRoutes.getRouter())
export default rootRouter