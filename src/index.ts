import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import { agentLogin, createAgent, createUser, getAgentData, getStudentData  } from "./controller/userController";
import { studentRegistrationFileUpload } from "./controller/studentController";


dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
const storage = multer.memoryStorage();
const upload = multer({ storage });

// try {
//   ensureAdminExists();
// } catch (e) {
//   console.log(e);
// }


app.post("/api/fileupload", upload.any(), studentRegistrationFileUpload);

app.post("/api/newRegistration", createUser);

app.post("/api/createAgent",createAgent)

app.post("/api/loginAgent",agentLogin)

app.get("/api/getStudentData",getStudentData)

app.get("/api/getAgentData",getAgentData)

app.get("/", (req, res) => {
  res.json("hello world");
});

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
