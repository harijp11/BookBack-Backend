import { inject, injectable } from "tsyringe";
import { ISubmitContractRenewalRequestUseCase } from "../../../entities/useCaseInterfaces/user/rental/submit_contract_renewal_request_usecase-interface";
import { IRentRepository } from "../../../entities/repositoryInterface/common/rent_repository-interface";
import { CustomError } from "../../../entities/utils/custom_error";
import {
  IRentEntity,
  renewal_details,
} from "../../../entities/models/rent_entity";
import { IRentModel } from "../../../frameworks/database/models/rent_model";
import { INotificationRepository } from "../../../entities/repositoryInterface/user/notification_repository-interface";
import { IBookRepository } from "../../../entities/repositoryInterface/common/book_repository-interface";
import { RENTAL_ERROR } from "../../../shared/constants";


@injectable()
export class SubmitContractRenewalRequestUseCase
  implements ISubmitContractRenewalRequestUseCase
{
  constructor(
    @inject("IRentRepository")
    private _rentRepository: IRentRepository,
    @inject("INotificationRepository")
    private _notificationRepository: INotificationRepository,
    @inject("IBookRepository")
    private _bookRepository : IBookRepository
  ) {}

  async execute(
    rentalId: string,
    renewal_details: renewal_details,
    // renewal_status: IRentEntity["renewal_status"]
  ): Promise<void> {
    if (!renewal_details.days || !renewal_details.amount) {
      throw new CustomError(RENTAL_ERROR.RENEWAL_DEATILS_MISSING, 400);
    }
    const rentalContract = await this._rentRepository.findById(rentalId);

    if (!rentalContract) {
      throw new CustomError(RENTAL_ERROR.CONTRACT_NOT_FOUND, 404);
    }

    let book = await this._bookRepository.findById(rentalContract.bookId.toString())

    const newRenewalDetail: IRentModel["renewal_details"][0] = {
      days: renewal_details.days,
      amount: renewal_details.amount,
      requested_at: new Date(),
      response: "Pending",
      responded_at: new Date(),
    };
    
    

    if (!rentalContract.renewal_details) {
      rentalContract.renewal_details = [];
    }

    let renewal_status : IRentEntity["renewal_status"]

    if(renewal_details.response === "Accepted"){
       renewal_status = "Renewed"

        await this._notificationRepository.create({
          userId: rentalContract.borrowerId.toString() || "",
          title: "Renewed",
          message:`The rental contract for the book "${book?.name ?? "unknown"}" has been successfully renewed.`,
          type: "good",
          navlink: `/borrowed-book/details/${rentalId}`,
        });

    }else if(renewal_details.response === "Rejected"){
      renewal_status = "Renewal Rejected"

       await this._notificationRepository.create({
          userId: rentalContract.borrowerId.toString() || "",
          title: "Renewed",
          message: `The renewal request for the book "${book?.name ?? "unknown"}" has been rejected.`,
          type: "good",
          navlink: `/borrowed-book/details/${rentalId}`,
        });
    }else{
      renewal_status = "Renewal Requested"
    }

    if (renewal_status === "Renewal Requested") {
      rentalContract.renewal_details.push(newRenewalDetail);

       await this._notificationRepository.create({
          userId: rentalContract.ownerId.toString() || "",
          title: "Renewal Requested",
          message:`The borrower has requested to renewal the book "${book?.name ?? "unknown"}".`,
          type: "good",
          navlink: `/rentedout-book/details/${rentalId}`,
        });
    }


    if (renewal_status === "Renewed" || renewal_status === "Renewal Rejected") {

       if (renewal_status === "Renewed"){
      rentalContract.period_of_contract += renewal_details.days;
      rentalContract.rent_end_date = new Date(
        new Date(rentalContract.rent_end_date).setDate(
          new Date(rentalContract.rent_end_date).getDate() +
            renewal_details.days
        )
      );
      rentalContract.rent_amount += renewal_details.amount;
    }
    
      if (
        renewal_details.response &&
        rentalContract.renewal_details[
          rentalContract.renewal_details.length - 1
        ].response === "Pending"
      ) {
        rentalContract.renewal_details[
          rentalContract.renewal_details.length - 1
        ].response = renewal_details.response;
        rentalContract.renewal_details[
          rentalContract.renewal_details.length - 1
        ].responded_at = renewal_details.responded_at || new Date();
      }
    }


    rentalContract.renewal_status = renewal_status;
    await this._rentRepository.save(rentalContract);
  }
}
