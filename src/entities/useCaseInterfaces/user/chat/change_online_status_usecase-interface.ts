

export interface IChangeOnlineStatusUseCase {
    execute(userId:string,status:string):Promise<void>
}