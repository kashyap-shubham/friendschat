import { AuthUser } from "./auth.types";


declare global {
    namespace Express {
        interface User extends AuthUser{}

        interface Request {
            user?: AuthUser;
        }
    }
}

export {};