import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handleShutdown = async () => {
  console.log("Shutting down database connection");
  await prisma.$disconnect();
};

process.on("SIGTERM", handleShutdown);
process.on("SIGINT", handleShutdown);

export default prisma;
