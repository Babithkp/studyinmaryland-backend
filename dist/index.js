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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error("AWS_REGION and AWS_ACCESS_ KEY must be specified");
}
const s3upload = (files) => __awaiter(void 0, void 0, void 0, function* () {
    const s3Client = new client_s3_1.S3Client({
        region,
        credentials: {
            accessKeyId,
            secretAccessKey,
        },
    });
    const params = files.map((file) => {
        return {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${file.originalname}`,
            Body: file.buffer,
        };
    });
    return yield Promise.all(params.map((param) => s3Client.send(new client_s3_1.PutObjectCommand(param))));
});
app.post("/api/fileupload", upload.any(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield s3upload(req.files);
        if (response) {
            console.log(response);
            console.log("--------------------------------");
            res.json({ message: response });
        }
    }
    catch (err) {
        console.log(err);
    }
}));
app.post("/api/newRegistration", (req, res) => {
    res.send(req.body);
});
app.get("/", (req, res) => {
    res.send("hello world");
});
app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
});
