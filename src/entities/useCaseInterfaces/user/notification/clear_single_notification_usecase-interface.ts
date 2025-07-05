export interface IClearSingleNotificationUseCase {
    execute(notificationId:string):Promise<void>
}