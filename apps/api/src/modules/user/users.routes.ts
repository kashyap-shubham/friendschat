import { Router } from "express";
import { UserController } from "./users.controller";



const userRouter: Router = Router();
const userController = new UserController();


userRouter.get("/me", userController.getCurrentUser);


userRouter.patch("/me", userController.updateCurrentUser);


export default userRouter;