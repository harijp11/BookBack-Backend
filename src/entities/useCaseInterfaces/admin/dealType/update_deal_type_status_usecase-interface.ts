export interface IUpdateDealTypeStatusUseCase{
    execute(_id:string):Promise<void>
}