import { injectable,inject } from "tsyringe";
import { IDealTypeRepository } from "../../../entities/repositoryInterface/common/deal_type_repository-interface";
import { ICreateDealTypeUseCase } from "../../../entities/useCaseInterfaces/admin/dealType/create_deal_type_usecase-interface";
import { CustomError } from "../../../entities/utils/custom_error";


@injectable()
export class CreateDealTypeUseCase implements ICreateDealTypeUseCase {
   constructor(
    @inject("IDealTypeRepository")
    private dealtyperepository:IDealTypeRepository
   ){}

   async execute(name:string,description:string):Promise<void>{
    const isDealTypeExists = await this.dealtyperepository.findByName(name)

    if(isDealTypeExists){
        throw new CustomError("Deal type already existing",400)
    }
    await this.dealtyperepository.save(name,description)
   }
}