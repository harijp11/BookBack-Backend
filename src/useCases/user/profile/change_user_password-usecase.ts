import { inject, injectable } from "tsyringe";
import { IChangePasswordUseCase } from "../../../entities/useCaseInterfaces/user/profile/change_user_password_usecase-interface";
import { IUserRepository } from "../../../entities/repositoryInterface/user/user_repository-interface";
import { IUserEntity } from "../../../entities/models/user_entity";
import { IBcrypt } from "../../../frameworks/security/bcrypt_interface";
import { CustomError } from "../../../entities/utils/custom_error";

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
                console.log("check daatas coming",userId,password,newPassword)
          if(!user || !user?.password){
             throw new CustomError("User or user password is not available",404)
          }
          console.log("user for password updation",user)
         
         if(password && user?.password){
         const isCorrect = await this._passwordBcrypt.compare(
            password,
            user.password
         )
         console.log("bcrypted is corect checking",isCorrect)
        
         if(!isCorrect){
            throw new CustomError("password does not match to old password",400)
         }
        }
           const bcryptedNewPassword = await this._passwordBcrypt.hash(newPassword)

         await this._userRepository.findByIdAndChangePassword(userId,bcryptedNewPassword) as IUserEntity
      }
}