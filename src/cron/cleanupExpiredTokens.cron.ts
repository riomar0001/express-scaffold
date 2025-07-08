import cron from "node-cron";
import prisma from "@configs/prisma.config";

// Runs every hour at minute 0
cron.schedule("0 * * * *", async () => {
  console.log("Running expired token cleanup...");

  try {
    const deleted = await prisma.refresh_token.deleteMany({
      where: {
        expires_at: {
          lt: new Date(),
        },
      },
    });

    console.log(`Cleaned up ${deleted.count} expired tokens.`);
  } catch (error) {
    console.error("Error during expired token cleanup:", error);
  }
});
