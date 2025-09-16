import zod from 'zod';
import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { env } from '@/lib/env';
import { v4 as uuidv4 } from 'uuid';
import { s3Client } from '@/lib/S3Client';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import arcjet, { detectBot, fixedWindow } from '@/lib/arcjet';
import { requireAdmin } from '@/app/data/admin/require-admin';

export const fileUploadSchema = zod.object({
  fileName: zod.string().min(1, 'File name is required'),
  contentType: zod.string().min(1, 'Content type is required'),
  size: zod.number().min(1, 'File size is required'),
  isImage: zod.boolean(),
});

const aj = arcjet
  .withRule(
    detectBot({
      mode: 'LIVE',
      allow: [],
    })
  )
  .withRule(
    fixedWindow({
      mode: 'LIVE',
      window: '1m',
      max: 5,
    })
  );

export async function POST(request: Request) {
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }
  const session = await requireAdmin();

  try {
    const decision = await aj.protect(request, {
      fingerprint: session?.user.id as string,
    });
    if (decision.isDenied()) {
      return NextResponse.json({ error: 'attack identified' }, { status: 429 });
    }
    const body = await request.json();

    console.log(body);
    const valildation = fileUploadSchema.safeParse(body); // check if the data is valid or not (success or failed)
    console.log(valildation, 'valildation454545454');
    if (!valildation.success) {
      return NextResponse.json(
        { error: 'Invalid form data', issues: valildation.error.issues },
        { status: 400 }
      );
    }
    const { fileName, contentType, size, isImage } = valildation.data;
    const uniqueFileName = `${uuidv4()}-${fileName}`;
    console.log(uniqueFileName, 'uniqueFileName');
    console.log('contentType--------------', contentType);
    const command = new PutObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      Key: uniqueFileName,
      ContentType: contentType,
      // ContentLength: size,
      // Body: await request.blob(),
    });
    console.log(command, 'command');
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    console.log('presignedUrl--------------', presignedUrl);
    const response = {
      presignedUrl,
      key: uniqueFileName,
    };
    console.log(
      'response--------------',
      NextResponse.json(response, { status: 200 })
    );
    const nextResponse = NextResponse.json(response, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

    console.log('next response =-=-=-=-=-=-=-=-=-=-=-=-', nextResponse);
    return nextResponse;
  } catch (error) {
    return NextResponse.json(
      { error: 'Something went wrong', issues: error },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  }
}
