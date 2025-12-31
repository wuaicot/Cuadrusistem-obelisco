import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import chalk from "chalk";
import routes from "./routes";

dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev")); // HTTP request logger

// Rutas principales
console.log(chalk.blue("-> Loading API routes under /api..."));
app.use("/api", routes);
console.log(chalk.green("✓ API routes loaded successfully."));


app.listen(PORT, () => {
  console.log(chalk.bgGreen.black(`\n ✓ Backend server is live! \n`));
  console.log(chalk.white(`   Environment: ${chalk.yellow("development")}`));
  console.log(chalk.white(`   Listening on: ${chalk.cyan(`http://localhost:${PORT}`)}\n`));
});
