import { PrismaClient, Prisma } from "@prisma/client";import { Request, Response } from "express";

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response) => {
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
    const isExitingUser = await prisma.user.findFirst({
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

    const user = await prisma.user.create({
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
  } catch (error) {
    console.error("Prisma error:", error);
  }
};
