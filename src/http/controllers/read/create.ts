import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { makeCreateReadUseCase } from "@/use-cases/_factories/reads/make-create-read-use-case";

export async function create(request: FastifyRequest, reply: FastifyReply) {
    const createReadBodySchema = z.object({
        bookId: z.string(),
    });

    try {
        const { bookId } = createReadBodySchema.parse(request.body);

        const createReadUseCase = makeCreateReadUseCase();
        const read = await createReadUseCase.execute({
            bookId,
            userId: request.user.sub,
        });

        reply.status(201).send(read);
    } catch (err) {
        if (err instanceof Error) {
            reply.status(500).send({ message: err.message });
        }

        throw err;
    }
}
