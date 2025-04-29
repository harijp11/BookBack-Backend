import { IRentEntity } from "./rent_entity";
import { ISaleEntity } from "./sale_entity";

export interface RentalInput extends Omit<IRentEntity , "_id" | "status"|"renewal_status"|"renewal_details" | "requested_at" | "penalty_amount" | " created_at" | "updated_at" >{ 
}

export interface SaleInput extends Omit<ISaleEntity ,"_id" | "sale_date" | "created_at" | "updated_at">{

}

export function isSaleInput(data: RentalInput | SaleInput): data is SaleInput {
    return (data as SaleInput).price !== undefined
  }

  export function isRentInput(data: RentalInput | SaleInput): data is RentalInput {
    return (data as RentalInput).original_amount !== undefined
  }