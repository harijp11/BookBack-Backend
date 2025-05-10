
export interface ISubmitContractRenewalRequestUseCase {
    execute(rentalId:string,renewal_details:{days:number,amount:number,requested_at?:Date,response?:string,responded_at?:Date }):Promise<void>
}