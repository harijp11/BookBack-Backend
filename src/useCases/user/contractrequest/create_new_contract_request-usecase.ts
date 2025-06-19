import { inject, injectable } from "tsyringe";
import { ICreateNewContractRequestUseCase } from "../../../entities/useCaseInterfaces/user/contractrequest/create_new_contract_request_usecase-interface";
import { ContractRequestInput } from "../../../shared/constants";
import { IContractRequestRepository } from "../../../entities/repositoryInterface/user/contract_request_repository-interface";
import { CustomError } from "../../../entities/utils/custom_error";
import { IBookRepository } from "../../../entities/repositoryInterface/common/book_repository-interface";
import { INotificationRepository } from "../../../entities/repositoryInterface/user/notification_repository-interface";

@injectable()
export class CreateNewContractRequest
  implements ICreateNewContractRequestUseCase
{
  constructor(
    @inject("IContractRequestRepository")
    private _contractRequestRepository: IContractRequestRepository,
    @inject("IBookRepository")
    private _bookRepository: IBookRepository,
    @inject("INotificationRepository")
    private _notitficationRepository: INotificationRepository
  ) {}

  async execute(data: ContractRequestInput): Promise<void> {
    if (
      !data.bookId ||
      !data.request_type ||
      !data.requesterId ||
      !data.ownerId
    ) {
      throw new CustomError("please check the datas", 400);
    }

    const book = await this._bookRepository.findByOwnerId(data.ownerId);

    if (!book || !book.isActive || book.status !== "Available") {
      await this._notitficationRepository.create({
        userId: data.requesterId,
        message: `Your book "${book?.name ?? "Unknown"}" for deal "${
          data.request_type
        }" is not available now.`,
        type: "info",
      });

      throw new CustomError("Book not Available now", 404);
    }

    await this._notitficationRepository.create({
      userId: data.ownerId,
      title: "New Book Request",
      message: `You have received a ${data.request_type} request for your book "${book.name}".`,
      type: "good",
      navlink: "/owner/contract-request",
    });

    const exist = await this._contractRequestRepository.checkExist(
      data.requesterId,
      data.bookId
    );

    if (exist) {
      await this._contractRequestRepository.deleteRequest(exist._id);
    }

    await this._contractRequestRepository.create(data);
  }
}
