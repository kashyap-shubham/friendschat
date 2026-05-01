import { Router } from "express";
import { UserController } from "./users.controller";
import { asyncHandler } from "@/utils/asyncHandler";
import { requireAuth } from "@/middleware/requireAuth";
import { validate } from "@/middleware/validate";
import { updateUserSchema } from "./schemas/update-user.schema";



const userRouter: Router = Router();
const userController = new UserController();

// get user information
userRouter.get("/me", requireAuth, asyncHandler(userController.getCurrentUser));

// update user details
userRouter.patch("/me", requireAuth, validate(updateUserSchema), asyncHandler(userController.updateCurrentUser));


export default userRouter;