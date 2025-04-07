import { v2 as cloudinary } from "cloudinary";
import { injectable } from "tsyringe";
import { config } from "../../shared/config";
import { ICloudinarySignatureService } from "../../entities/serviceInterfaces/cloudinary_service-interface";

if (
  !config.cloudinary.CLOUD_NAME ||
  !config.cloudinary.API_KEY ||
  !config.cloudinary.API_SECRET
) {
  throw new Error("Cloudinary environment variables are not properly configured.");
}

cloudinary.config({
  cloud_name: config.cloudinary.CLOUD_NAME,
  api_key: config.cloudinary.API_KEY,
  api_secret: config.cloudinary.API_SECRET,
});

@injectable()
export class CloudinarySignatureService implements ICloudinarySignatureService {
  generateSignature(folder: string) {
    const timestamp = Math.floor(Date.now() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      config.cloudinary.API_SECRET!
    );

    return {
      timestamp,
      signature,
      folder,
      apiKey: config.cloudinary.API_KEY!,
      cloudName: config.cloudinary.CLOUD_NAME!,
    };
  }
}
