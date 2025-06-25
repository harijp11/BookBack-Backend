export interface IAddUserNotifyForBook {
    execute(bookId:string,userId:string):Promise<string | void>
}