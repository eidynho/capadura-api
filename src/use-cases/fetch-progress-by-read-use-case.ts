import { Progress } from "@prisma/client";
import { ProgressRepository } from "@/repositories/progress-repository";

interface FetchManyProgressByReadUseCaseRequest {
    readId: string;
    page: number;
    perPage: number;
}

interface FetchManyProgressByReadUseCaseResponse {
    items: Progress[];
    total: number;
}

export class FetchManyProgressByReadUseCase {
    constructor(private progressRepository: ProgressRepository) {}

    async execute({
        readId,
        page,
        perPage,
    }: FetchManyProgressByReadUseCaseRequest): Promise<FetchManyProgressByReadUseCaseResponse> {
        const { progress, total } = await this.progressRepository.findManyByRead({
            readId,
            page,
            perPage,
        });

        return {
            items: progress,
            total,
        };
    }
}
