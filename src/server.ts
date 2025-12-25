import "module-alias/register";
import { env } from "@/configs/env.config";
import app from "./app";
import "@cron/cleanupExpiredTokens.cron";

app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
  console.log(`Environment: ${env.NODE_ENV}`);
});
