import { SingleBookDTO } from "../../../../shared/dto/singleBookDto";

export interface IGetUserBookDetailsUseCase{
    execute(bookId: string): Promise<SingleBookDTO | null>;
}