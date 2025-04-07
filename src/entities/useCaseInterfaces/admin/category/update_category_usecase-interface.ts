export interface IUpdateCategoryUseCase {
    execute(_id:string,name:string,description:string):Promise<void>
}