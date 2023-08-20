import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { makeDeleteFollowUseCase } from "@/use-cases/_factories/follows/make-delete-follow-use-case";

export async function deleteFollow(request: FastifyRequest, reply: FastifyReply) {
    const deleteFollowParamsSchema = z.object({
        followerId: z.string(),
        followingId: z.string(),
    });

    try {
        const { followerId, followingId } = deleteFollowParamsSchema.parse(request.params);

        const deleteFollowUseCase = makeDeleteFollowUseCase();
        await deleteFollowUseCase.execute({
            followerId,
            followingId,
        });

        reply.status(204).send();
    } catch (err) {
        if (err instanceof Error) {
            reply.status(500).send({ message: err.message });
        }

        throw err;
    }
}
