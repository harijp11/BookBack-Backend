import { inject, injectable } from "tsyringe";
import {
  ContractResponse,
  ICreateNewContractUseCase,
} from "../../../entities/useCaseInterfaces/user/rental/create_new_contract_usecase-interface";
import { IRentRepository } from "../../../entities/repositoryInterface/common/rent_repository-interface";
import { ISaleRepository } from "../../../entities/repositoryInterface/common/sale_repository-interface";
import {
  isRentInput,
  isSaleInput,
  RentalInput,
  SaleInput,
} from "../../../entities/models/contract_input_entity";
import { IPurseRepository } from "../../../entities/repositoryInterface/user/purse_repository-interface";
import { generateUniqueTrsasactionId } from "../../../frameworks/security/uniqueid_bcrypt";
import { IBookRepository } from "../../../entities/repositoryInterface/common/book_repository-interface";
import { IContractRequestRepository } from "../../../entities/repositoryInterface/user/contract_request_repository-interface";
import { INotificationRepository } from "../../../entities/repositoryInterface/user/notification_repository-interface";
import { title } from "process";
import { CustomError } from "../../../entities/utils/custom_error";

@injectable()
export class CreateNewContractUseCase implements ICreateNewContractUseCase {
  constructor(
    @inject("IRentRepository")
    private _rentRepository: IRentRepository,
    @inject("ISaleRepository")
    private _saleRepository: ISaleRepository,
    @inject("IPurseRepository")
    private _purseRepository: IPurseRepository,
    @inject("IBookRepository")
    private _bookRepository: IBookRepository,
    @inject("IContractRequestRepository")
    private _contractRepository: IContractRequestRepository,
    @inject("INotificationRepository")
    private _notitficationRepository: INotificationRepository
  ) {}

  async execute(
    data: RentalInput | SaleInput,
    request_type: string,
    conReqId: string
  ): Promise<ContractResponse | void> {
    const conReq = await this._contractRepository.findById(conReqId)
    if(!conReq || conReq.status !== "accepted"){
      
       throw new CustomError("Request not available or Cancelled",400)

    }else if (request_type === "buy") {
      if (isSaleInput(data)) {
        let purse = await this._purseRepository.findById(data.buyerId);

        if (!purse) {
          purse = await this._purseRepository.create({userId:data.buyerId});
        }
        if ((purse?.balance ?? 0) < data.price) {
          return {
            message: `your purse have only ${purse?.balance}`,
            success: false,
          };
        }

        if ((purse?.balance ?? 0) - (purse?.hold_amount ?? 0) < data.price) {
          return {
            message: `your have A hold amount of ${
              (purse?.balance ?? 0) - (purse?.hold_amount ?? 0)
            } you can't create deal now`,
            success: false,
          };
        }

        const book = await this._bookRepository.findById(data.bookId);

        if (book?.status !== "Available" || !book?.isActive) {
          await this._contractRepository.deleteRequest(conReqId);

          return {
            message: `The Book ${book?.name} is not available for deal`,
            success: false,
          };
        }
        await this._saleRepository.create(data);

        const tsId = generateUniqueTrsasactionId();

        const description = `Amount debited Due to  bought a book`;

        await this._purseRepository.addTransaction(data.buyerId, {
          tsId,
          type: "debit",
          amount: data.price,
          status: "completed",
          description,
        });

        await this._purseRepository.updateBalance(data.buyerId, -data.price);
        await this._notitficationRepository.create({
          userId: data.buyerId,
          title: "Update your balance",
          message:
            "A amount of " + data.price + " has been debited from your purse",
          type: "info",
          navlink: "/purse",
        });

        //Payment to owner

        let ownerPurse = await this._purseRepository.findById(data.ownerId);

        if (!ownerPurse) {
          ownerPurse = await this._purseRepository.create({userId:data.ownerId});
        }

        await this._purseRepository.addTransaction(data.ownerId, {
          tsId,
          type: "credit",
          amount: data.price,
          status: "completed",
          description: "Amount credited through Sale of a book",
        });

        await this._purseRepository.updateBalance(data.ownerId, data.price);

        //Update book details and request
        await this._bookRepository.findByIdAndUpdateLiveStatus(
          data.bookId,
          "Sold Out"
        );

        await this._contractRepository.deleteRequest(conReqId);

        await this._notitficationRepository.create({
          userId: data.buyerId,
          title: "Sold Out",
          message: `You have purchased the book titled "${book.name}" for ₹${book.originalAmount}.`,
          type: "good",
          navlink: "/bought-books",
        });

        await this._notitficationRepository.create({
          userId: data.ownerId,
          title: "Book Sold",
          message: `Your book titled "${book.name}" has been sold for ₹${book.originalAmount}.`,
          type: "info",
          navlink: "/sold-books",
        });

        return {
          message: `New Sale contract created successfully`,
          success: true,
        };
      }
    } else if (request_type === "borrow") {
      if (isRentInput(data)) {
        
        let purse = await this._purseRepository.findById(data.borrowerId);

        if (!purse) {
          purse = await this._purseRepository.create({userId:data.borrowerId});
        }
        if ((purse?.balance ?? 0) < data.original_amount) {
          return {
            message: `your purse have only ${purse?.balance}`,
            success: false,
          };
        }

        if (
          (purse?.balance ?? 0) - (purse?.hold_amount ?? 0) <
          data.original_amount
        ) {
          return {
            message: `your have A hold amount of ${
              purse?.hold_amount ?? 0
            } you can't create deal now`,
            success: false,
          };
        }

        const book = await this._bookRepository.findById(data.bookId);

        if (book?.status !== "Available" || !book?.isActive) {
          await this._contractRepository.deleteRequest(conReqId);

          return {
            message: `The Book ${book?.name} is not available for deal`,
            success: false,
          };
        }

        await this._rentRepository.create(data);

        await this._bookRepository.findByIdAndUpdateLiveStatus(
          data.bookId,
          "Borrowed"
        );

        await this._purseRepository.AddHoldAmount(
          data.borrowerId,
          data.original_amount
        );

        await this._notitficationRepository.create({
          userId: data.borrowerId,
          title: "Hold Amount Placed",
          message: `An amount of ₹${data.original_amount} has been held for renting the book "${book?.name}".`,
          type: "warning",
          navlink: "/purse",
        });

        await this._contractRepository.deleteRequest(conReqId);

        await this._notitficationRepository.create({
          userId: data.ownerId,
          title: "Book Borrowed",
          message: `Your book "${book?.name}" has been rented out for ₹${data.original_amount}.`,
          type: "info",
          navlink: "/rented-books",
        });

        await this._notitficationRepository.create({
          userId: data.borrowerId,
          title: "Book Rented",
          message: `You have successfully rented the book "${book?.name}" by holding ₹${data.original_amount}.`,
          type: "good",
          navlink: "/borrowed-books",
        });
        return {
          message: `New Rental contract created successfully`,
          success: true,
        };
      }
    }
  }
}
