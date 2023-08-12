import { Book } from "@prisma/client";
import { PutObjectCommand } from "@aws-sdk/client-s3";

import { env } from "@/env";
import { BooksRepository } from "@/repositories/books-repository";
import { S3 } from "@/lib/s3";
import { ResourceNotFoundError } from "./_errors/resource-not-found-error";

interface UpdateBookUseCaseRequest {
    id: string;
    subtitle?: string;
    authors?: string[];
    publisher?: string;
    publishDate?: Date | string;
    language?: string;
    pageCount?: number;
    description?: string;
    imageLink?: string;
}

interface UpdateBookUseCaseResponse {
    book: Book;
}

export class UpdateBookUseCase {
    constructor(private booksRepository: BooksRepository) {}

    async execute({
        id,
        subtitle,
        authors,
        publisher,
        publishDate,
        language,
        pageCount,
        description,
        imageLink,
    }: UpdateBookUseCaseRequest): Promise<UpdateBookUseCaseResponse> {
        const book = await this.booksRepository.findById(id);

        if (!book) {
            throw new ResourceNotFoundError();
        }

        // save image book on AWS S3
        if (imageLink) {
            const response = await fetch(imageLink);
            const imageBuffer: ArrayBuffer = await response.arrayBuffer();
            const imageContentType = response.headers.get("Content-Type") || undefined;

            const params = {
                Bucket: env.S3_BUCKET_NAME,
                Key: `book-${id}`,
                Body: Buffer.from(imageBuffer),
                ContentType: imageContentType,
            };
            const command = new PutObjectCommand(params);
            await S3.send(command);
        }

        const updatedBook = await this.booksRepository.update({
            id,
            subtitle,
            authors,
            publisher,
            publish_date: publishDate,
            language,
            page_count: pageCount,
            description,
            image_key: imageLink ? `book-${id}` : null,
        });

        return {
            book: updatedBook,
        };
    }
}