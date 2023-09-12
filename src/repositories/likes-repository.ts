import { Like, Prisma } from "@prisma/client";

export interface LikesRepository {
    findUniqueById(likeId: string): Promise<Like | null>;
    findManyByUserId(userId: string): Promise<Like[] | null>;
    findManyByBookId(bookId: string): Promise<Like[] | null>;
    findUniqueByBookIdAndUserId(bookId: string, userId: string): Promise<Like | null>;
    delete(likeId: string, userId: string): Promise<void>;
    create(data: Prisma.LikeUncheckedCreateInput): Promise<Like>;
}
