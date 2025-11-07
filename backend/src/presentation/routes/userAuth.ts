import { Router } from "express";
import { login } from "../../presentation/controllers/userAuthController";
const authRoutes:Router=Router()

authRoutes.get('/login',login)
export default authRoutes