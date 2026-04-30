import { Router } from "express";
import { UserController } from "./users.controller";
import { asyncHandler } from "@/utils/asyncHandler";
import { requireAuth } from "@/middleware/requireAuth";



const userRouter: Router = Router();
const userController = new UserController();


userRouter.get("/me", userController.getCurrentUser);


userRouter.patch("/me", requireAuth, asyncHandler(userController.updateCurrentUser));


export default userRouter;