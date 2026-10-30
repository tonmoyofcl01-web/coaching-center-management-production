import app from "./app.js";
import { env } from "./config/env.js";
import { connectOracle, closeOracle } from "./db/oracle.js";

let server;

async function startServer() {
  try {
    await connectOracle();

    server = app.listen(env.port, () => {
      console.log("--------------------------------");
      console.log(`Server running on port ${env.port}`);
      console.log(`Environment: ${env.nodeEnv}`);
      console.log("--------------------------------");
    });
  } catch (error) {
    console.error("Failed to start application:", error.message);
    process.exit(1);
  }
}

async function shutdown(signal) {
  console.log(`${signal} received. Shutting down...`);

  if (server) {
    server.close(async () => {
      try {
        await closeOracle();
        console.log("Application shut down successfully.");
        process.exit(0);
      } catch (error) {
        console.error("Shutdown error:", error.message);
        process.exit(1);
      }
    });
  } else {
    await closeOracle();
    process.exit(0);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer();
