import { UsersRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "./_errors/user-already-exists-error";
import { User } from "@prisma/client";

interface RegisterUseCaseRequest {
    username: string;
    email: string;
    password: string;
}

interface RegisterUseCaseResponse {
    user: User;
}

export class RegisterUseCase {
    constructor(private usersRepository: UsersRepository) {}

    async execute({
        username,
        email,
        password,
    }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
        const password_hash = await hash(password, 6);

        const userWithSameEmail = await this.usersRepository.findByEmail(email);

        if (userWithSameEmail) {
            throw new UserAlreadyExistsError();
        }

        const user = await this.usersRepository.create({
            name: username,
            username,
            email,
            password_hash,
        });

        return {
            user,
        };
    }
}
