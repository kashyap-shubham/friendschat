import authRouter from "@/auth/auth.routes";
import userRouter from "@/modules/user/users.routes";
import { Router } from "express";

const router: Router = Router();


// Auth and user router
router.use("/auth", authRouter);
router.use("/users", userRouter);


export default router;