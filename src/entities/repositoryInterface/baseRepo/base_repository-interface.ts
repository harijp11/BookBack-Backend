export interface IBaseRepository<T ,CreateDTO = unknown>{
     create(data:CreateDTO):Promise<T | null>
}