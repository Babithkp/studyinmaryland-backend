import { PrismaClient, Prisma } from "@prisma/client";import { Request, Response } from "express";
import { v4 } from "uuid";
import jwt from "jsonwebtoken";

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
    "credentailsDocName",
    "birthDocName",
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
    credentailsDocName: userData.credentailsDocName,
    birthDocName: userData.birthDocName,
    motivationDocName: userData.motivationDocName,
    ieltsDocName: userData.ieltsDocName,
    englishDocName: userData.englishDocName,
    recommendationDocName: userData.recommendationDocName,
  };

  try {
    const isExitingUser = await prisma.user.findUnique({
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
      const agent = await prisma.agent.findUnique({
        where: {
          referralCode: userData.referralCode,
        },
      });

      if (agent) {
        user = await prisma.user.create({
          data: {
            ...userDataToCreate,
            Agent: {
              connect: {
                id: agent.id,
              },
            },
          },
        });
        res.status(201).json(user);
      }
    } else {
      console.log("non agent");

      user = await prisma.user.create({
        data: userDataToCreate,
      });
      res.status(201).json(user);
    }

  } catch (error) {
    console.error("Prisma error:", error);
  }
};

export const ensureAdminExists = async () => {
  const adminEmail = "admin@gmail.com";
  const adminPassword = "admin";

  const admin = await prisma.admin.findUnique({
    where: { email: adminEmail },
  });

  if (!admin) {
    await prisma.admin.create({
      data: {
        email: adminEmail,
        password: adminPassword,
      },
    });
    console.log("Admin user created");
  } else {
    console.log("Admin user already exists");
  }
};

export const createAgent = async (req: Request, res: Response) => {
  const agentData = req.body;
  
  if (!agentData) return res.json({ error: "Invalid agent data provided" });
  if (agentData.email === "admin@gmail.com")
    return res.json({ error: "Invalid agent data provided" });

  try {
    const isAgentExist = await prisma.agent.findUnique({
      where: { email: agentData.email },
    });
    if (isAgentExist) return res.json({ error: "Agent already exists" });
    const agent = await prisma.agent.create({
      data: {
        name: agentData.name,
        email: agentData.email,
        address: agentData.address,
        phone: Math.floor(agentData.phone),
        password: agentData.password,
        agentIpAddress: agentData.agentIpAddress,
        agentCountry: agentData.agentCountry,
        referralCode: v4().substring(0, 8),
      },
    });
    
    res.json({ message: "Agent account has created" });
  } catch (err) {
    console.log(err);
  }
};

export const agentLogin = async (req: Request, res: Response) => {
  const loginDetails = req.body;
  if (!loginDetails) return res.json({ error: "Login data is required" });
  try {
    const isAdmin = await prisma.admin.findUnique({
      where: { email: loginDetails.email },
    });
    if (isAdmin && isAdmin.password === loginDetails.password) {
      return res.json({ admin: "login admin" });
    } else if (isAdmin && isAdmin.password !== loginDetails.password) {
      return res.json({ wrongPassword: "wrong password" });
    }
    const response = await prisma.agent.findUnique({
      where: { email: loginDetails.email },
    });
    if (!response) {
      return res.json({ userNotFound: "user not found" });
    }
    if (response?.password !== loginDetails.password) {
      return res.json({ wrongPassword: "wrong password" });
    } else {
      const token = jwt.sign({ userId: response?.id }, "secrcet");
      return res.json({
        message: "Sign in successfully",
        agent: response?.id,
        token: token,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const getStudentData = async (req: Request, res: Response) => {
  try {
    const student = await prisma.user.findMany({});
    if (student) {
      return res.json({ student: student });
    }
    res.json({ error: "No students found" });
  } catch (err) {
    console.log(err);
  }
};

export const getAgentData = async (req: Request, res: Response) => {
  try {
    const agent = await prisma.agent.findMany({});
    if (agent) {
      return res.json({ agent: agent });
    }
    res.json({ error: "No agents found" });
  } catch (err) {
    console.log(err);
  }
};

export const getAgentbyId = async (req: Request, res: Response) => {
  const agentId = req.body.id;

  if (!agentId) return res.json({ error: "userId not provided" });
  try {
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
    });
    if (!agent) return res.json({ error: "No agents found" });
    res.json({ message: "Agent found", agent });
  } catch (err) {
    console.log(err);
  }
};

export const getStudentDetailsByAgentId = async (
  req: Request,
  res: Response
) => {
  const agentId = req.body.id;

  if (!agentId) return res.json({ error: "userId not provided" });
  try {
    const agent = await prisma.user.findMany({
      where: { agentId: agentId },
      include: {
        Agent: true,
      },
    });
    res.json(agent);
  } catch (err) {
    console.log(err);
  }
};

export const updateAgentProfileImg = async (req: Request, res: Response) => {
  const agentId = req.body.id;
  const imageUrl = req.body.imageUrl;
  if (!agentId || !imageUrl) return res.json({ error: "userId not provided" });
  try {
    await prisma.agent.update({
      where: { id: agentId },
      data: {
        profileImageUrl: imageUrl,
      },
    });
    res.json({ message: "updated successfull" });
  } catch (err) {
    res.json({ error: "user not found" });
  }
};
