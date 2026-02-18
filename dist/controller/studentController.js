"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentRegistrationFileUpload = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client_s3_1 = require("@aws-sdk/client-s3");
const region = process.env.CLOUDFLARE_REGION;
const accessKeyId = process.env.CLOUDFLARE_ACCESS_ID;
const secretAccessKey = process.env.CLOUDFLARE_SECRET_ACCESS_KEY;
const endpoint = process.env.CLOUDFLARE_ENDPOINT;
if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error("CLOUDFLARE_REGION and CLOUDFLARE_ACCESS_ KEY must be specified");
}
const s3uploadFile = (files) => __awaiter(void 0, void 0, void 0, function* () {
    const s3Client = new client_s3_1.S3Client({
        region,
        endpoint,
        credentials: {
            accessKeyId,
            secretAccessKey,
        },
    });
    const params = files.map((file) => {
        return {
            Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
            Key: `Studienstipendium/${file.originalname}`,
            Body: file.buffer,
        };
    });
    return yield Promise.all(params.map((param) => s3Client.send(new client_s3_1.PutObjectCommand(param))));
});
const studentRegistrationFileUpload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield s3uploadFile(req.files);
        if (response) {
            console.log(response);
            console.log("--------------------------------");
            res.json({ message: response });
        }
    }
    catch (err) {
        console.log(err);
    }
});
exports.studentRegistrationFileUpload = studentRegistrationFileUpload;
