import "dotenv/config";
import app from "./app";
import { sequelize } from "./config/database";
import "./models";

const port = process.env.PORT || 3000;

async function start() {
  await sequelize.authenticate();
  console.log("Database connected");
  app.listen(port, () => console.log(`Running on ${port}`));
}

start().catch((err) => {
  console.error("Failed to start:", err);
  process.exit(1);
});
