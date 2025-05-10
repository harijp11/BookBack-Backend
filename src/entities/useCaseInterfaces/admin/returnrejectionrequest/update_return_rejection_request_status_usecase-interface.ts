export interface IUpdateReturnRejectionRequestStatusUseCase {
    execute(status:string,retRejId:string):Promise<void>
}