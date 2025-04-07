import { ERROR_MESSAGES } from "../../../shared/constants";
import { passwordSchema } from "../../../shared/validations/password_validation";
import { z } from "zod";

export const resetPasswordValidationSchema = z.object({
	password: passwordSchema,
	token: z.string(),
	role: z.enum(["user", "admin"], {
		message: ERROR_MESSAGES.INVALID_ROLE,
	}),
});