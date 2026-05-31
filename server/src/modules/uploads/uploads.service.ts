import { cloudinary, CLOUDINARY_UPLOAD_FOLDER } from '../../lib/cloudinary';

function getCloudinaryCredentials() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary is not configured');
  }

  return { cloudName, apiKey, apiSecret };
}

export function createCloudinaryUploadSignature() {
  const { cloudName, apiKey, apiSecret } = getCloudinaryCredentials();
  const folder = CLOUDINARY_UPLOAD_FOLDER;
  const timestamp = Math.round(Date.now() / 1000);

  const paramsToSign = {
    timestamp,
    folder,
  };

  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

  return {
    timestamp,
    signature,
    apiKey,
    cloudName,
    folder,
  };
}
