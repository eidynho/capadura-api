import { User } from "@prisma/client";
import { UsersRepository } from "@/repositories/users-repository";
import { ResourceNotFoundError } from "./_errors/resource-not-found-error";

interface GetUsersProfileUseCaseRequest {
    userId: string;
}

interface GetUsersProfileUseCaseResponse {
    user: User;
}

export class GetUserProfileUseCase {
    constructor(private usersRepository: UsersRepository) {}

    async execute({
        userId,
    }: GetUsersProfileUseCaseRequest): Promise<GetUsersProfileUseCaseResponse> {
        const user = await this.usersRepository.findById(userId);
        if (!user) {
            throw new ResourceNotFoundError();
        }

        return {
            user,
        };
    }
}
