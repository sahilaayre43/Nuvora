const { spawn } = require("node:child_process");
const net = require("node:net");

const target = new URL(
  process.env.VITE_API_PROXY_TARGET || "http://127.0.0.1:5000"
);
const host = target.hostname;
const port = Number(target.port || (target.protocol === "https:" ? 443 : 80));
const timeoutMs = 120_000;
const retryIntervalMs = 500;

const isBackendReady = () =>
  new Promise((resolve) => {
    const socket = net.createConnection({ host, port });
    socket.setTimeout(1_000);
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("error", () => resolve(false));
    socket.once("timeout", () => {
      socket.destroy();
      resolve(false);
    });
  });

const waitForBackend = async () => {
  const deadline = Date.now() + timeoutMs;

  console.log(`Waiting for backend at ${host}:${port}...`);
  while (Date.now() < deadline) {
    if (await isBackendReady()) {
      console.log("Backend is ready. Starting the frontend...");
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, retryIntervalMs));
  }

  throw new Error(
    `Backend did not become available at ${host}:${port} within ${timeoutMs / 1000} seconds.`
  );
};

const startFrontend = () => {
  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  const frontend = spawn(npm, ["--prefix", "frontend", "run", "dev"], {
    env: process.env,
    shell: process.platform === "win32",
    stdio: "inherit",
  });

  process.once("SIGINT", () => frontend.kill("SIGINT"));
  process.once("SIGTERM", () => frontend.kill("SIGTERM"));

  frontend.once("error", (error) => {
    console.error("Failed to start the frontend:", error.message);
    process.exitCode = 1;
  });
  frontend.once("exit", (code, signal) => {
    process.exitCode = code ?? (signal ? 1 : 0);
  });
};

waitForBackend()
  .then(startFrontend)
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
