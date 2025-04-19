
export interface IUpdateBookStatus {
    execute(bookId:string):Promise<void>
}