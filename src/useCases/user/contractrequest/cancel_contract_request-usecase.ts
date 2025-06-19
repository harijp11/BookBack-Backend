import { inject, injectable } from "tsyringe";
import { ICancelContractRequestUseCase } from "../../../entities/useCaseInterfaces/user/contractrequest/cancel_contract_request_usecase-interface";
import { IContractRequestRepository } from "../../../entities/repositoryInterface/user/contract_request_repository-interface";
import { IContractRequestModel } from "../../../frameworks/database/models/contract_request-model";
import { CustomError } from "../../../entities/utils/custom_error";
import { INotificationRepository } from "../../../entities/repositoryInterface/user/notification_repository-interface";
import { IBookRepository } from "../../../entities/repositoryInterface/common/book_repository-interface";

@injectable()
export class CancelContractRequest implements ICancelContractRequestUseCase {
  constructor(
    @inject("IContractRequestRepository")
    private _contractRequestRepository: IContractRequestRepository,
       @inject("INotificationRepository")
        private _notificationRepository: INotificationRepository,
        @inject("IBookRepository")
        private _bookRepository:IBookRepository
  ) {}

  async execute(conReqId: string): Promise<IContractRequestModel | null> {
    const request =
      await this._contractRequestRepository.findByIdAndUpdateStatus(
        conReqId,
        "cancelled"
      );

    if (!request) {
      throw new CustomError("No request found", 404);
    }

    const book = await this._bookRepository.findByOwnerId(request.ownerId.toString())

    await this._notificationRepository.create({
      userId: request.ownerId.toString(),
      title: "Contract Request Cancelled",
      message: `Your ${request.request_type} request for the book "${book!.name}" has been cancelled by requester.`,
      type: "info",
      navlink: "/book-requests",
    });

    return request;
  }
}
