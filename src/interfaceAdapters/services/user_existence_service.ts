import { inject, injectable } from "tsyringe";
import { IUserExistenceService } from "../../entities/serviceInterfaces/user_exist_service-interface";
import { IUserRepository } from "../../entities/repositoryInterface/user/user_repository-interface";

@injectable()
export class UserExistenceService implements IUserExistenceService {
   constructor(
      @inject("IClientRepository") private clientRepo:IUserRepository
   ) {}

   async emailExists(email: string): Promise<boolean> {
       const [client] = await Promise.all([
         this.clientRepo.findByEmail(email)
       ])

       return Boolean(client)
   }
}