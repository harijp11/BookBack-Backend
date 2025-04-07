import { z } from "zod";

import { strongEmailRegex } from "../../../shared/validations/email_validation";
import { passwordSchema } from "../../../shared/validations/password_validation";
import { nameSchema } from "../../../shared/validations/name_validation";
import { phoneNumberSchema } from "../../../shared/validations/phone_validation";
import user from "../../../frameworks/cache/redis_client";




const adminSchema = z.object({
  Name: nameSchema, 
  email: strongEmailRegex, 
  password: passwordSchema, 
  role: z.literal("admin"), 
});


const userSchema = z.object({
  Name: nameSchema, 
  email: strongEmailRegex, 
  phoneNumber: phoneNumberSchema, 
  password: passwordSchema, 
  confirmPassword: passwordSchema,
  role: z.literal("user"), 
});



export const userSchemas = {
  admin: adminSchema,
  user: userSchema,
};