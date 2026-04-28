import { UserRepository } from "./users.repository";


export class UserService {

    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async getUserById(userId: string) {
        const user = await this.userRepository.findById(userId);
        return user;
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findByEmail(email);
        return user;
    }

    async updateUserProfile(userId: string, data: {name?: string, image?: string | null}) {
        return this.userRepository.updateUser(userId, data);
    }
}