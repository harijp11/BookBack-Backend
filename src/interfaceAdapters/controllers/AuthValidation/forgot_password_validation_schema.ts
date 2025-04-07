import { ERROR_MESSAGES } from "../../../shared/constants";
import { strongEmailRegex } from "../../../shared/validations/email_validation";
import { z } from "zod";

export const forgotPasswordValidationSchema = z.object({
	email: strongEmailRegex,
	role: z.enum(["user", "admin"], {
		message: ERROR_MESSAGES.INVALID_ROLE,
	}),
});