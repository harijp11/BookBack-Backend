
export interface IUpdateDealTypeUseCase{
    execute(_id:string,name:string,description:string):Promise<void>
}