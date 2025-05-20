export interface IGetChatAndNotificationUpdatesUseCase{
    execute(userId:string):Promise<{unReadMessagesCount:number,unReadNotificationsCount:number}>
}