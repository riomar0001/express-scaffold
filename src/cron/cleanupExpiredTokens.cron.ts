import cron from "node-cron";
import prisma from "@configs/prisma.config";

// Runs every hour at minute 0
cron.schedule("0 * * * *", async () => {
  console.log("Running expired token cleanup...");

  try {
    // const deleted = await prisma.refresh_token.deleteMany({
    //   where: {
    //     expires_at: {
    //       lt: new Date(),
    //     },
    //   },
    // });

    const revokeTokens = await prisma.refresh_token.updateMany({
      where: {
        expires_at: {
          lt: new Date(),
        },
      },
      data: {
        is_active: false,
        revoked_at: new Date(),
      },
    });

    console.log(`Cleaned up ${revokeTokens.count} expired tokens.`);
  } catch (error) {
    console.error("Error during expired token cleanup:", error);
  }
});
