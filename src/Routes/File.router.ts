import Router from "koa-router";
import {S3PresignedUrlGenerator} from "../Utils/S3PresignedUrlGenerator";

const router = new Router();
router.get('/files/presigned-url',async (ctx) => {
  try {
    const {fileName, fileType} = ctx.request.query;
    if (!fileName || !fileType) {
      ctx.status = 400;
      ctx.body = {
        message: 'Missing fileName or fileType!'
      }
      return;
    }
    const s3PresignedUrlGenerator = new S3PresignedUrlGenerator();
    const url = await s3PresignedUrlGenerator.generateUploadURL(fileName as string, fileType as string);
    ctx.body = {
      message: 'success',
      data: {
        url: url
      }
    }
  } catch (e) {
    console.error(e);
  }
});

export default router;
