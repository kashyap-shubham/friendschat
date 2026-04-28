import { prisma } from "@/lib/prisma";

export class UserRepository {

    async findById(id: string) {
        return prisma.user.findUnique({
            where: { id },

            select: {
                id: true,
                email: true,
                name: true,
                image: true,
                createdAt: true
            }
        });
    };

    
    async findByEmail(email: string) {
        return prisma.user.findUnique({

            where: {email},
            
            select: {
                id: true,
                email: true,
                name: true,
                image: true
            }
        });
    };

    async updateUser(userId: string, data: {
        name?: string;
        image?: string | null;
    }) {
        return prisma.user.update({
            where: {id: userId},
            data,
            select: {
                id: true,
                email: true,
                name: true,
                image: true
            }
        });
    }


}