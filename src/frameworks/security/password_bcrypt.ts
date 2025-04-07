import bcrypt from "bcrypt";
import { IBcrypt } from "./bcrypt_interface";
import { injectable } from "tsyringe";

@injectable()
export class PasswordBcrypt implements IBcrypt {
  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
  async compare(current: string, original: string): Promise<boolean> {
    return await bcrypt.compare(current, original);
  }
}