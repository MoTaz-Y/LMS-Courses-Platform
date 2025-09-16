import 'server-only'; // this suppresses the warning about using node-only code in client components

import { S3Client } from '@aws-sdk/client-s3';
import { env } from './env';
// this is done by jan marshal

export const s3Client = new S3Client({
  region: env.AWS_REGION,
  endpoint: env.AWS_ENDPOINT_URL_S3,
  forcePathStyle: false,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

// export const s3Client = new S3Client({
//   region: 'auto',
//   endpoint: env.AWS_ENDPOINT_URL_S3,
//   forcePathStyle: false,
// });

// export const iamClient = new S3Client({
//   region: env.AWS_REGION,
//   endpoint: env.AWS_ENDPOINT_URL_IAM,
//   forcePathStyle: false,
//   credentials: {
//     accessKeyId: env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
//   },
// });
