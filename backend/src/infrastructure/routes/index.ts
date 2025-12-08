import { Router } from "express";
import authRoutes from "./userAuth";

const rootRouter:Router=Router()
rootRouter.use('/auth',authRoutes)
export default rootRouter