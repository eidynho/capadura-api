import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { makeFetchBookListsByUserUseCase } from "@/use-cases/_factories/book-lists/make-fetch-book-lists-by-user-use-case";
import { transformKeysToCamelCase } from "@/utils/transform-keys-to-camel-case";
import { buildErrorMessage } from "@/utils/build-error-message";

export async function findByUser(request: FastifyRequest, reply: FastifyReply) {
    const fetchBookListsByUserParamsSchema = z.object({
        userId: z.string(),
    });

    const fetchBookListsByUserQuerySchema = z.object({
        q: z.string().default(""),
        bookId: z.string().optional(),
    });

    try {
        const { userId } = fetchBookListsByUserParamsSchema.parse(request.params);
        const { q, bookId } = fetchBookListsByUserQuerySchema.parse(request.query);

        const fetchBookListsByUserUseCase = makeFetchBookListsByUserUseCase();
        const bookList = await fetchBookListsByUserUseCase.execute({
            userId,
            q,
            bookId,
        });

        reply.status(200).send(transformKeysToCamelCase(bookList));
    } catch (err) {
        buildErrorMessage({
            err,
            prefix: "[BOOK LISTS - Find by user]: ",
        });
    }
}
