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


}