import express from "express";
import cors from "cors";
import multer from "multer";
import { v4 as uuid } from "uuid";
import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { createUser } from "./controller/userController";
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage });

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!region || !accessKeyId || !secretAccessKey) {
  throw new Error("AWS_REGION and AWS_ACCESS_ KEY must be specified");
}

const s3upload = async (files: any) => {
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

app.post("/api/fileupload", upload.any(), async (req, res) => {
  try {
    const response = await s3upload(req.files);
    if (response) {
      console.log(response);
      console.log("--------------------------------");
      res.json({ message: response });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/newRegistration", createUser);


app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
