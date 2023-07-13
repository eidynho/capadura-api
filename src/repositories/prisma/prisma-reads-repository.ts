import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ReadsRepository, findManyByUserIdRequest } from "../reads-repository";

export class PrismaReadRepository implements ReadsRepository {
    async findManyByUserId({ userId, bookId, status, page, perPage }: findManyByUserIdRequest) {
        const reads = await prisma.read.findMany({
            where: {
                user_id: userId,
                ...(bookId && { book_id: bookId }),
                ...(status && { status }),
            },
            orderBy: [
                {
                    end_date: "desc",
                },
                {
                    start_date: "desc",
                },
            ],
            include: {
                progress: {
                    orderBy: {
                        created_at: "desc",
                    },
                    take: 3,
                },
                book: !bookId,
            },
            take: perPage,
            skip: (page - 1) * perPage,
        });

        return reads;
    }

    async getAllReviewRatings({ bookId, userId }: { bookId?: string; userId?: string }) {
        const ratings = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

        const total = await prisma.read.count({
            where: {
                ...(bookId && { book_id: bookId }),
                ...(userId && { user_id: userId }),
                review_rating: {
                    not: null,
                },
            },
        });

        const data = await Promise.all(
            ratings.map(async (rating) => {
                const amount = await prisma.read.count({
                    where: {
                        ...(bookId && { book_id: bookId }),
                        ...(userId && { user_id: userId }),
                        review_rating: rating,
                    },
                });
                const percentage = (amount / total) * 100;
                return {
                    rating,
                    amount,
                    percentage: Number(percentage.toFixed(2)),
                };
            }),
        );

        return {
            data,
            total,
        };
    }

    async update(data: Prisma.ReadUpdateInput) {
        const { id, ...updateData } = data;

        const progress = await prisma.read.update({
            where: {
                id: id as string,
            },
            data: updateData,
        });

        return progress;
    }

    async create(data: Prisma.ReadUncheckedCreateInput) {
        const read = await prisma.read.create({
            data,
        });

        return read;
    }
}
