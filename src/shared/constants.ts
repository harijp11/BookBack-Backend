
export const ROLES = ["admin", "user"] as const;
export type TRole = typeof ROLES[number];

export enum OtpPurpose {
	LOGIN = "login",
	SIGNUP = "signup",
	PASSWORD_RESET = "password_reset",
  CREATE_CONTRACT = "create_contract"
  }

  export interface ContractRequestInput  {
    ownerId: string;
    bookId: string;
    requesterId:string;
    request_type: 'borrow' | 'buy';
  }; 


  export enum BookStatus {
    AVAILABLE = 'Available',
    SOLD_OUT = 'Sold Out',
    BORROWED = 'Borrowed',
  }

  export interface CategoryUseCaseResponse {
    success: boolean;
    message: string;
    statusCode?: number;
  }

  
  export interface DealTypeUseCaseResponse {
    success: boolean;
    message: string;
    statusCode?: number;
  }

export const HTTP_STATUS = {
	// ✅ Success responses
	OK: 200, // Request was successful (e.g., fetching data, updating without response body)
	CREATED: 201, // Resource successfully created (e.g., user registration, new booking)
	ACCEPTED: 202, // Request accepted for processing but not completed yet (e.g., background job)
	NO_CONTENT: 204, // Request successful but no content returned (e.g., deleting a resource)

	// ❌ Client errors
	BAD_REQUEST: 400, // Invalid request (e.g., missing fields, invalid data format)
	UNAUTHORIZED: 401, // Authentication required (e.g., user not logged in, invalid token)
	FORBIDDEN: 403, // Access denied (e.g., trying to access admin-only routes)
	NOT_FOUND: 404, // Requested resource not found (e.g., wrong ID, missing endpoint)
	METHOD_NOT_ALLOWED: 405, // HTTP method not supported (e.g., using GET instead of POST)
	CONFLICT: 409, // Conflict in request (e.g., duplicate email, already registered)
	PAYLOAD_TOO_LARGE: 413, // Request payload is too large (e.g., file upload exceeds limit)
	UNSUPPORTED_MEDIA_TYPE: 415, // Unsupported content type (e.g., sending XML instead of JSON)
	TOO_MANY_REQUESTS: 429, // Rate limiting (e.g., too many login attempts, API abuse)

	// ⚠️ Server errors
	INTERNAL_SERVER_ERROR: 500, // Generic server error (e.g., database failure, unhandled exception)
	NOT_IMPLEMENTED: 501, // Feature not implemented yet (e.g., unbuilt endpoint)
	BAD_GATEWAY: 502, // Server received invalid response from upstream (e.g., microservices failure)
	SERVICE_UNAVAILABLE: 503, // Server is down or overloaded (e.g., maintenance mode)
	GATEWAY_TIMEOUT: 504, // Upstream server timed out (e.g., long API response time)
} as const;

export const SUCCESS_MESSAGES = {
	BOOKING_SUCCESS: "Booking completed",
	CREATED: "Successfully created",
	LOGIN_SUCCESS: "Logged in",
	REGISTRATION_SUCCESS: "Registration completed",
	OTP_SEND_SUCCESS: "OTP sent",
	OTP_VERIFIED: "OTP verified",
	LOGOUT_SUCCESS: "Logged out",
	UPDATE_SUCCESS: "Updated",
	DELETE_SUCCESS: "Deleted",
	OPERATION_SUCCESS: "Action completed",
	PASSWORD_RESET_SUCCESS: "Password reset",
	VERIFICATION_SUCCESS: "Verification done",
	DATA_RETRIEVED: "Data loaded",
	ACTION_SUCCESS: "Action successful",
	EMAIL_SENT_SUCCESSFULLY: "Email sent",
	WAITING_FOR_ADMIN_APPROVAL: "Request submitted waiting for admin approval",
	REQUEST_APPROVED: "Request approved",
	REQUEST_REJECTED: "Request rejected",
	ACCOUNT_ACTIVATED: "Your account is now active",
	ACCOUNT_DEACTIVATED: "Your account has been deactivated",
	TRANSACTION_SUCCESS: "Transaction successful",
	REFUND_INITIATED: "Refund process started",
	PAYMENT_SUCCESS: "Payment completed",
	PAYMENT_PENDING: "Payment is being processed",
	PAYMENT_FAILED: "Payment failed please try again",
	FILE_UPLOADED: "File uploaded successfully",
	PROFILE_UPDATED: "Profile updated",
	SESSION_EXTENDED: "Session extended",
} as const;

export const ERROR_MESSAGES = {
	WRONG_ID: "Invalid ID",
	TOKEN_EXPIRED: "Session expired login again",
	TOKEN_BLACKLISTED: "Session is no longer valid",
	EMAIL_NOT_FOUND: "Email not found",
	FORBIDDEN: "You don’t have access",
	BLOCKED: "Your account is blocked",
	NOT_ALLOWED: "You can’t do this action",
	EMAIL_EXISTS: "Email already registered",
	USERNAME_EXISTS: "Username already taken",
	REQUEST_NOT_FOUND: "Request not found",
	CATEGORY_EXISTS: "Category already exists",
	CATEGORY_NOT_FOUND: "Category not found",
	INVALID_TOKEN: "Invalid session please login again",
	INVALID_ROLE: "Access denied",
	INVALID_CREDENTIALS: "Wrong email or password",
	USER_NOT_FOUND: "User not found",
	ROUTE_NOT_FOUND: "Page not found",
	UNAUTHORIZED_ACCESS: "Not authorized",
	SERVER_ERROR: "Something went wrong try again later",
	VALIDATION_ERROR: "Check your inputs and try again",
	SHOP_NOT_FOUND: "Shop not found",
	SHOP_UNDER_VERIFICATION:
		"Shop request submitted waiting for admin approval",
	SHOP_EXISTS: "You already have a registered shop",
	SHOP_BLOCKED: "This shop is blocked by admin",
	MISSING_PARAMETERS: "Some details are missing",
	WRONG_CURRENT_PASSWORD: "Current password is incorrect",
	SAME_CURR_NEW_PASSWORD:
		"New password must be different from current password",
	INSUFFICIENT_FUNDS: "Not enough balance",
	TRANSACTION_FAILED: "Transaction failed try again",
	REFUND_FAILED: "Refund process failed",
	PAYMENT_ERROR: "Payment could not be processed",
	ACCOUNT_SUSPENDED: "Your account has been suspended",
	ACCOUNT_BANNED: "Your account has been banned",
	SESSION_EXPIRED: "Your session has expired please log in again",
	TOO_MANY_ATTEMPTS: "Too many failed attempts try again later",
	UNSUPPORTED_FILE_TYPE: "Unsupported file type",
	FILE_SIZE_EXCEEDED: "File size is too large",
	RATE_LIMIT_EXCEEDED: "Too many requests try again later",
} as const;

export const VERIFICATION_MAIL_CONTENT = (otp: string) => `
<div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; background-color: #f9f7f2; border: 1px solid #d3c7b7; border-radius: 10px;">
  <!-- Logo Text Section -->
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="font-size: 42px; font-weight: bold; margin: 0; color: #5a3e2b;">
      📚 <span style="color: #8B4513;">BookBack</span> 📖
    </h1>
  </div>

  <h2 style="color: #8B4513; text-align: center; margin-bottom: 30px; font-weight: 600;">
    📖 Welcome to the World of Shared Stories! 📚
  </h2>

  <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px; color: #555; text-align: center;">
    Discover, rent, and share books effortlessly with BookBack! Whether you're finding your next great read or passing your books to fellow readers, we make book sharing simple and secure. 📖✨
  </p>

  <div style="background: linear-gradient(135deg, #c2a375 0%, #8B4513 100%); border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center; box-shadow: 0 4px 8px rgba(139, 69, 19, 0.2);">
    <p style="margin-bottom: 10px; font-size: 18px; color: white;">Your verification code is:</p>
    <h1 style="background-color: white; color: #8B4513; font-size: 36px; margin: 15px 0; padding: 20px; border-radius: 8px; letter-spacing: 8px; font-weight: bold; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      ${otp}
    </h1>
    <p style="color: #f0f0f0; font-size: 15px;">
      ⏳ Code expires in 2 minutes
    </p>
  </div>

  <div style="background-color: white; border-left: 4px solid #8B4513; padding: 15px; margin: 20px 0; border-radius: 4px;">
    <p style="font-size: 15px; color: #555; margin: 0;">
      🔐 For your security, please don't share this code with anyone.
    </p>
  </div>

  <div style="margin-top: 25px; padding: 20px; background-color: white; border-radius: 8px; text-align: center;">
    <p style="font-size: 16px; color: #8B4513; margin-bottom: 15px; font-weight: bold;">
      Start Exploring Now:
    </p>
    <ul style="list-style: none; padding: 0; text-align: left; margin: 0 20px;">
      <li style="margin-bottom: 10px; padding-left: 25px; position: relative;">
        <span style="position: absolute; left: 0;">📖</span> Browse available books
      </li>
      <li style="margin-bottom: 10px; padding-left: 25px; position: relative;">
        <span style="position: absolute; left: 0;">📚</span> Rent or purchase books with ease
      </li>
      <li style="margin-bottom: 10px; padding-left: 25px; position: relative;">
        <span style="position: absolute; left: 0;">🔄</span> Share books you no longer need
      </li>
      <li style="padding-left: 25px; position: relative;">
        <span style="position: absolute; left: 0;">💡</span> Connect with fellow readers
      </li>
    </ul>
  </div>

  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #d3c7b7; text-align: center;">
    <p style="font-size: 14px; color: #777;">
      Need help? We're here for you! 📩<br>
      Contact us at <a href="mailto:support@bookback.com" style="color: #8B4513; text-decoration: none; font-weight: bold;">support@bookback.com</a>
    </p>
  </div>

  <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #888;">
    <p style="margin-bottom: 5px;">
      Follow us: 📚 <span style="color: #8B4513; font-weight: bold;">@BookBack</span>
    </p>
    <p style="margin: 0;">
      © ${new Date().getFullYear()} BookBack. All rights reserved.
    </p>
  </div>
</div>
`;

export const PASSWORD_RESET_MAIL_CONTENT = (resetLink: string) => `
<div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; background-color: #fff8e1; border: 1px solid #f4d03f; border-radius: 10px;">
  <!-- Logo Text Section -->
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="font-size: 48px; font-weight: bold; margin: 0;">
      📚 <span style="color: #d35400;">BookBack</span> 📖
    </h1>
  </div>

  <h2 style="color: #e67e22; text-align: center; margin-bottom: 30px; font-weight: 600;">
    🔐 Password Reset Request 🔐
  </h2>

  <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px; color: #555;">
    We received a request to reset your password for your BookBack account. Click the button below to create a new password.
  </p>

  <div style="background: linear-gradient(135deg, #e67e22 0%, #d35400 100%); border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center; box-shadow: 0 4px 8px rgba(211, 84, 0, 0.2);">
    <a href="${resetLink}" style="display: inline-block; background-color: white; color: #d35400; font-size: 18px; font-weight: bold; text-decoration: none; padding: 15px 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      Reset Password
    </a>
    <p style="color: #f0f0f0; font-size: 15px; margin-top: 15px;">
      ⏱️ This link expires in 15 minutes
    </p>
  </div>

  <div style="background-color: white; border-left: 4px solid #e67e22; padding: 15px; margin: 20px 0; border-radius: 4px;">
    <p style="font-size: 15px; color: #555; margin: 0;">
      🔒 If you didn't request a password reset, please ignore this email or contact support if you have concerns.
    </p>
  </div>

  <p style="font-size: 14px; line-height: 1.5; color: #555; margin-top: 20px;">
    Having trouble with the button? Copy and paste the URL below into your web browser:
  </p>
  <div style="background-color: #f4d03f; padding: 10px; border-radius: 5px; margin-bottom: 20px; word-break: break-all;">
    <a href="${resetLink}" style="color: #d35400; font-size: 14px; text-decoration: none;">${resetLink}</a>
  </div>

  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #f4d03f; text-align: center;">
    <p style="font-size: 14px; color: #777;">
      Need assistance? We're here for you! 💬<br>
      Contact us at <a href="mailto:support@bookback.com" style="color: #e67e22; text-decoration: none; font-weight: bold;">support@bookback.com</a>
    </p>
  </div>

  <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #888;">
    <p style="margin-bottom: 5px;">
      Follow us: 📱 <span style="color: #d35400; font-weight: bold;">@BookBack</span>
    </p>
    <p style="margin: 0;">
      © ${new Date().getFullYear()} BookBack. All rights reserved.
    </p>
  </div>
</div>
`;
