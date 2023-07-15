import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { makeFetchManyProgressByReadUseCase } from "@/use-cases/factories/make-fetch-many-progress-by-read-use-case";

export async function findManyByRead(request: FastifyRequest, reply: FastifyReply) {
    const findManyByReadParamsSchema = z.object({
        readId: z.string(),
    });
    const findManyByReadQuerySchema = z.object({
        page: z.coerce.number().default(1),
        perPage: z.coerce.number().default(20),
    });

    try {
        const { readId } = findManyByReadParamsSchema.parse(request.params);
        const { page, perPage } = findManyByReadQuerySchema.parse(request.query);

        const fetchManyProgressByReadUseCase = makeFetchManyProgressByReadUseCase();
        const { items, total } = await fetchManyProgressByReadUseCase.execute({
            readId,
            page,
            perPage,
        });

        reply.status(200).send({
            items,
            total,
        });
    } catch (err) {
        throw err;
    }
}