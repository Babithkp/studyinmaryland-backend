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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAgent = exports.ensureAdminExists = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
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
        const user = yield prisma.user.create({
            data: {
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
            },
        });
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
