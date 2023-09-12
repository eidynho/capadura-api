import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { makeDeleteLikeBookUseCase } from "@/use-cases/_factories/likes/make-delete-like-book-use-case";

import { ResourceNotFoundError } from "@/use-cases/_errors/resource-not-found-error";
import { UnauthorizedError } from "@/use-cases/_errors/unauthorized-error";

export async function deleteLike(request: FastifyRequest, reply: FastifyReply) {
    const deleteLikeBookParamsSchema = z.object({
        likeId: z.string().uuid(),
    });

    try {
        const { likeId } = deleteLikeBookParamsSchema.parse(request.params);

        const deleteLikeBookUseCase = makeDeleteLikeBookUseCase();
        await deleteLikeBookUseCase.execute({
            likeId,
            userId: request.user.sub,
        });

        reply.status(204).send();
    } catch (err) {
        if (err instanceof ResourceNotFoundError) {
            return reply.status(404).send({ message: err.message });
        }

        if (err instanceof UnauthorizedError) {
            return reply.status(401).send({ message: err.message });
        }

        if (err instanceof Error) {
            return reply.status(500).send({ message: err.message });
        }

        throw err;
    }
}
