import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";

export class S3PresignedUrlGenerator {
  s3Client = new S3Client({
    apiVersion: '2006-03-01',
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
  });

  generateUploadURL = async (fileName: string, fileType: string): Promise<string> => {
    console.log(`AWS_REGION: ${process.env.AWS_REGION}`);
    console.log(`AWS_ACCESS_KEY_ID: ${process.env.AWS_ACCESS_KEY_ID}`);
    console.log(`AWS_SECRET_ACCESS_KEY: ${process.env.AWS_SECRET_ACCESS_KEY}`);
    console.log(`S3_BUCKET_NAME: ${process.env.S3_BUCKET_NAME}`);
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
    };

    const command = new PutObjectCommand(params);
    return  await getSignedUrl(this.s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour
  };
}
