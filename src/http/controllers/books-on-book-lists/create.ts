import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { makeCreateBookOnBookListUseCase } from "@/use-cases/_factories/books-on-book-lists/make-create-book-on-book-list-use-case";

export async function create(request: FastifyRequest, reply: FastifyReply) {
    const createBookOnBookListBodySchema = z.object({
        bookId: z.string(),
        bookListId: z.string(),
    });

    try {
        const { bookId, bookListId } = createBookOnBookListBodySchema.parse(request.body);

        const createBookOnBookListUseCase = makeCreateBookOnBookListUseCase();
        const bookOnBookList = await createBookOnBookListUseCase.execute({
            bookId,
            bookListId,
        });

        reply.status(201).send(bookOnBookList);
    } catch (err) {
        throw err;
    }
}
