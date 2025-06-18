import { CategoryUseCaseResponse } from "../../../../shared/constants";

export interface IcreateNewCategoryUseCase {
    execute(name:string,description:string):Promise<CategoryUseCaseResponse | void>;
}