import { Router } from "express";
import authRoutes from "./userAuth";
import { UserRoutes } from "./userRoutes";

const rootRouter:Router=Router()
const userRoutes=new UserRoutes()

rootRouter.use('/auth',authRoutes)
rootRouter.use('/user',userRoutes.getRouter())
export default rootRouter