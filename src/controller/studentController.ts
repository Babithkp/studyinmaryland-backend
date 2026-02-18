import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";

const region = process.env.CLOUDFLARE_REGION;
const accessKeyId = process.env.CLOUDFLARE_ACCESS_ID;
const secretAccessKey = process.env.CLOUDFLARE_SECRET_ACCESS_KEY;
const endpoint = process.env.CLOUDFLARE_ENDPOINT;

if (!region || !accessKeyId || !secretAccessKey) {
  throw new Error("CLOUDFLARE_REGION and CLOUDFLARE_ACCESS_ KEY must be specified");
}

const s3uploadFile = async (files: any) => {
  const s3Client = new S3Client({
    region,
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
  const params = files.map((file: { originalname: any; buffer: any }) => {
    
    return {
      Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
      Key: `Studienstipendium/${file.originalname}`,
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
