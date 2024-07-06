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
exports.updateAgentProfileImg = exports.getStudentDetailsByAgentId = exports.getAgentbyId = exports.getAgentData = exports.getStudentData = exports.agentLogin = exports.createAgent = exports.ensureAdminExists = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.body;
    const requiredFields = [
        "firstName",
        "lastName",
        "gender",
        "address",
        "town",
        "state",
        "country",
        "dob",
        "nationality",
        "email",
        "phone",
        "residence",
        "programType",
        "studyProgram",
        "courseStartMonth",
        "courseStartYear",
        "identityDocName",
        "degreeDocName",
        "academicDocName",
    ];
    const missingFields = requiredFields.filter((field) => !userData[field]);
    if (missingFields.length > 0) {
        return res.json({
            error: `Missing required fields: ${missingFields.join(", ")}`,
        });
    }
    const userDataToCreate = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        gender: userData.gender,
        address: userData.address,
        town: userData.town,
        state: userData.state,
        country: userData.country,
        dob: userData.dob,
        nationality: userData.nationality,
        email: userData.email,
        phone: userData.phone,
        residence: userData.residence,
        programType: userData.programType,
        studyProgram: userData.studyProgram,
        courseStartMonth: userData.courseStartMonth,
        courseStartYear: userData.courseStartYear,
        identityDocName: userData.identityDocName,
        degreeDocName: userData.degreeDocName,
        academicDocName: userData.academicDocName,
        birthDocName: userData.birthDocName,
        motivationDocName: userData.motivationDocName,
        ieltsDocName: userData.ieltsDocName,
        englishDocName: userData.englishDocName,
        recommendationDocName: userData.recommendationDocName,
    };
    try {
        const isExitingUser = yield prisma.user.findUnique({
            where: {
                email: userData.email,
            },
        });
        if (isExitingUser) {
            console.error("Prisma error: User already exists");
            res.json({
                error: "user already exist",
            });
            return;
        }
        let user;
        if (userData.referralCode) {
            const agent = yield prisma.agent.findUnique({
                where: {
                    referralCode: userData.referralCode,
                },
            });
            if (agent) {
                user = yield prisma.user.create({
                    data: Object.assign(Object.assign({}, userDataToCreate), { Agent: {
                            connect: {
                                id: agent.id,
                            },
                        } }),
                });
            }
            else {
                user = yield prisma.user.create({
                    data: userDataToCreate,
                });
            }
        }
        res.status(201).json(user);
    }
    catch (error) {
        console.error("Prisma error:", error);
    }
});
exports.createUser = createUser;
const ensureAdminExists = () => __awaiter(void 0, void 0, void 0, function* () {
    const adminEmail = "admin@gmail.com";
    const adminPassword = "admin";
    const admin = yield prisma.admin.findUnique({
        where: { email: adminEmail },
    });
    if (!admin) {
        yield prisma.admin.create({
            data: {
                email: adminEmail,
                password: adminPassword,
            },
        });
        console.log("Admin user created");
    }
    else {
        console.log("Admin user already exists");
    }
});
exports.ensureAdminExists = ensureAdminExists;
const createAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const agentData = req.body;
    if (!agentData)
        return res.json({ error: "Invalid agent data provided" });
    if (agentData.email === "admin@gmail.com")
        return res.json({ error: "Invalid agent data provided" });
    try {
        const isAgentExist = yield prisma.agent.findUnique({
            where: { email: agentData.email },
        });
        if (isAgentExist)
            return res.json({ error: "Agent already exists" });
        yield prisma.agent.create({
            data: {
                name: agentData.name,
                email: agentData.email,
                password: agentData.password,
                agentIpAddress: agentData.agentIpAddress,
                agentCountry: agentData.agentCountry,
                referralCode: (0, uuid_1.v4)().substring(0, 8),
            },
        });
        res.json({ message: "Agent account has created" });
    }
    catch (err) {
        console.log(err);
    }
});
exports.createAgent = createAgent;
const agentLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginDetails = req.body;
    if (!loginDetails)
        return res.json({ error: "Login data is required" });
    try {
        const isAdmin = yield prisma.admin.findUnique({
            where: { email: loginDetails.email },
        });
        if (isAdmin && isAdmin.password === loginDetails.password) {
            return res.json({ admin: "login admin" });
        }
        else if (isAdmin && isAdmin.password !== loginDetails.password) {
            return res.json({ wrongPassword: "wrong password" });
        }
        const response = yield prisma.agent.findUnique({
            where: { email: loginDetails.email },
        });
        if (!response) {
            return res.json({ userNotFound: "user not found" });
        }
        if ((response === null || response === void 0 ? void 0 : response.password) !== loginDetails.password) {
            return res.json({ wrongPassword: "wrong password" });
        }
        else {
            const token = jsonwebtoken_1.default.sign({ userId: response === null || response === void 0 ? void 0 : response.id }, "secrcet");
            return res.json({
                message: "Sign in successfully",
                agent: response === null || response === void 0 ? void 0 : response.id,
                token: token,
            });
        }
    }
    catch (err) {
        console.log(err);
    }
});
exports.agentLogin = agentLogin;
const getStudentData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const student = yield prisma.user.findMany({});
        if (student) {
            return res.json({ student: student });
        }
        res.json({ error: "No students found" });
    }
    catch (err) {
        console.log(err);
    }
});
exports.getStudentData = getStudentData;
const getAgentData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const agent = yield prisma.agent.findMany({});
        if (agent) {
            return res.json({ agent: agent });
        }
        res.json({ error: "No agents found" });
    }
    catch (err) {
        console.log(err);
    }
});
exports.getAgentData = getAgentData;
const getAgentbyId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const agentId = req.body.id;
    if (!agentId)
        return res.json({ error: "userId not provided" });
    try {
        const agent = yield prisma.agent.findUnique({
            where: { id: agentId },
        });
        if (!agent)
            return res.json({ error: "No agents found" });
        res.json({ message: "Agent found", agent });
    }
    catch (err) {
        console.log(err);
    }
});
exports.getAgentbyId = getAgentbyId;
const getStudentDetailsByAgentId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const agentId = req.body.id;
    if (!agentId)
        return res.json({ error: "userId not provided" });
    try {
        const agent = yield prisma.user.findMany({
            where: { agentId: agentId },
            include: {
                Agent: true,
            },
        });
        res.json(agent);
    }
    catch (err) {
        console.log(err);
    }
});
exports.getStudentDetailsByAgentId = getStudentDetailsByAgentId;
const updateAgentProfileImg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const agentId = req.body.id;
    const imageUrl = req.body.imageUrl;
    if (!agentId || !imageUrl)
        return res.json({ error: "userId not provided" });
    try {
        yield prisma.agent.update({
            where: { id: agentId },
            data: {
                profileImageUrl: imageUrl,
            },
        });
        res.json({ message: "updated successfull" });
    }
    catch (err) {
        res.json({ error: "user not found" });
    }
});
exports.updateAgentProfileImg = updateAgentProfileImg;
