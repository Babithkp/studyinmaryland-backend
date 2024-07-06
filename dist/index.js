"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const dotenv_1 = __importDefault(require("dotenv"));
const userController_1 = require("./controller/userController");
const studentController_1 = require("./controller/studentController");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
// try {
//   ensureAdminExists();
// } catch (e) {
//   console.log(e);
// }
app.post("/api/fileupload", upload.any(), studentController_1.studentRegistrationFileUpload);
app.post("/api/newRegistration", userController_1.createUser);
app.post("/api/createAgent", userController_1.createAgent);
app.post("/api/loginAgent", userController_1.agentLogin);
app.get("/api/getStudentData", userController_1.getStudentData);
app.get("/api/getAgentData", userController_1.getAgentData);
app.post("/api/getSingleAgentById", userController_1.getAgentbyId);
app.post("/api/getUserDetailsByAgentId", userController_1.getStudentDetailsByAgentId);
app.get("/", (req, res) => {
    res.json("hello world");
});
app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
});
