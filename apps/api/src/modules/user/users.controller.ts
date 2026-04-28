import { Request } from "express";
import { UserService } from "./users.service";
import { ApiError } from "@/errors/ApiError";


export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }


    getCurrentUser = async (req: Request, res: Response) => {
        const userId = req.user!.id;
        const user = await this.userService.getUserById(userId);

        if (!user) {
            throw new ApiError(404, "User not found");
        }
        
        return res.status(200).json({
            success: true,
            data: user
        });
    } 
}