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
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage });

const s3upload = async (files: any) => {
  if (
    process.env.AWS_REGION &&
    process.env.AWS_ACCESS_ID &&
    process.env.AWS_SECRET_ACCESS_KEY
  ) {
    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const params = files.map((file: { originalname: any; buffer: any }) => {
      return {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `uploads/${uuid()}-${file.originalname}`,
        Body: file.buffer,
      };
    });

    return await Promise.all(
      params.map((param: PutObjectCommandInput) =>
        s3Client.send(new PutObjectCommand(param))
      )
    );
  }
};

app.post("/", upload.any(), async (req, res) => {
  try {
    const formData = JSON.parse(req.body.data);
    console.log(formData);

    const response = await s3upload(req.files);
    if (response) {
      console.log(response);
    }
  } catch (err) {
    console.log(err);
  }

  res.send("hello world");
});

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});

