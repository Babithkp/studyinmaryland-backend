import { Request, Response } from "express";


import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!region || !accessKeyId || !secretAccessKey) {
  throw new Error("AWS_REGION and AWS_ACCESS_ KEY must be specified");
}

const s3uploadFile = async (files: any) => {
  const s3Client = new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
  const params = files.map((file: { originalname: any; buffer: any }) => {
    return {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${file.originalname}`,
      Body: file.buffer,
    };
  });
  return await Promise.all(
    params.map((param: PutObjectCommandInput) =>
      s3Client.send(new PutObjectCommand(param))
    )
  );
};

export const studentRegistrationFileUpload = async (
  req: Request,
  res: Response
) => {
  try {
    const response = await s3uploadFile(req.files);
    if (response) {
      console.log(response);
      console.log("--------------------------------");
      res.json({ message: response });
    }
  } catch (err) {
    console.log(err);
  }
};
