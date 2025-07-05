export interface IClearAllNotificationsUseCase{
    execute(userId:string):Promise<void>
}