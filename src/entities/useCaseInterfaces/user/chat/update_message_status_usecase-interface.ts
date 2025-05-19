export interface IUpdateMessageStatusUseCase{
    execute(messageId: string, status: 'delivered' | 'read'): Promise<void>
}