import app from "./app";
import "@cron/cleanupExpiredTokens.cron";
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
