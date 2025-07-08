import { Request, Response } from "express";
import prisma from "@/config/prismaConfig";

export const admin = async (req: Request, res: Response) => {
  try {
    const { id, email, role } = req.user as {
      id: string;
      email: string;
      role: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Admin access granted",
      user,
    });
  } catch (error) {
    console.error("Error accessing admin:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
