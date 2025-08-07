import { inject, injectable } from "tsyringe";
import { IChangePasswordUseCase } from "../../../entities/useCaseInterfaces/user/profile/change_user_password_usecase-interface";
import { IUserRepository } from "../../../entities/repositoryInterface/user/user_repository-interface";
import { IUserEntity } from "../../../entities/models/user_entity";
import { IBcrypt } from "../../../frameworks/security/bcrypt_interface";
import { CustomError } from "../../../entities/utils/custom_error";
import { ERROR_MESSAGES, HTTP_STATUS, USER_MESSAGES } from "../../../shared/constants";

@injectable()
export class changePasswordUseCase implements IChangePasswordUseCase{
      constructor(
        @inject("IUserRepository")
        private _userRepository:IUserRepository,
        @inject("IPasswordBcrypt")
        private _passwordBcrypt : IBcrypt
      ){}

      async execute(userId: string, password: string, newPassword: string): Promise<IUserEntity | void> {
          const user = await this._userRepository.findById(userId)
              
          if(!user || !user?.password){
             throw new CustomError(USER_MESSAGES.USER_NOT_AVAILABLE,HTTP_STATUS.NOT_FOUND)
          }
          
         
         if(password && user?.password){
         const isCorrect = await this._passwordBcrypt.compare(
            password,
            user.password
         )
         
        
         if(!isCorrect){
            throw new CustomError(ERROR_MESSAGES.WRONG_CURRENT_PASSWORD,HTTP_STATUS.BAD_REQUEST)
         }
        }
           const bcryptedNewPassword = await this._passwordBcrypt.hash(newPassword)

         await this._userRepository.findByIdAndChangePassword(userId,bcryptedNewPassword) as IUserEntity
      }
}