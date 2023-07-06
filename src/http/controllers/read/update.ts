import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { makeUpdateReadUseCase } from "@/use-cases/factories/make-update-read-use-case";

export async function update(request: FastifyRequest, reply: FastifyReply) {
    const updateProgressBodySchema = z.object({
        readId: z.string().uuid(),
        status: z.enum(["ACTIVE", "FINISHED", "CANCELLED", "DELETED"]).optional(),
        isPrivate: z.boolean().optional(),
        reviewRating: z
            .number()
            .nonnegative()
            .max(5, "Review rating maximum value exceeded.")
            .optional(),
        reviewContent: z.string().optional(),
        reviewIsSpoiler: z.boolean().optional(),
        endRead: z.boolean().default(false),
    });

    try {
        const { readId, status, isPrivate, reviewRating, reviewContent, reviewIsSpoiler, endRead } =
            updateProgressBodySchema.parse(request.body);

        const updateReadUseCase = makeUpdateReadUseCase();
        const read = await updateReadUseCase.execute({
            readId,
            status,
            isPrivate,
            reviewRating,
            reviewContent,
            reviewIsSpoiler,
            endRead,
        });

        reply.status(200).send(read);
    } catch (err) {
        throw err;
    }
}