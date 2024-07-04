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
exports.createUser = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.body;
    // Log the received userData for debugging purposes
    console.log("Received userData:", userData);
    // Validate that all required fields are present
    const requiredFields = [
        'firstName', 'lastName', 'gender', 'address', 'town', 'state',
        'country', 'dob', 'nationality', 'email', 'phone', 'residence',
        'programType', 'studyProgram', 'courseStartMonth', 'courseStartYear',
        'identityDocName', 'degreeDocName', 'academicDocName'
    ];
    const missingFields = requiredFields.filter(field => !userData[field]);
    if (missingFields.length > 0) {
        return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }
    try {
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
                recommendationDocName: userData.recommendationDocName
            },
        });
        res.status(201).json(user);
    }
    catch (error) {
        // Detailed error logging
        if (error instanceof client_1.Prisma.PrismaClientValidationError) {
            console.error("Validation error:", error.message);
            return res.status(400).json({ error: "Validation error: " + error.message });
        }
        console.error("Prisma error:", error);
        res.status(500).json({ error: "An error occurred while creating the user" });
    }
});
exports.createUser = createUser;
