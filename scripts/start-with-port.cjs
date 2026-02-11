/**
 * Loads .env from project root and runs next start (or next dev) with PORT from env.
 * Use: node scripts/start-with-port.cjs [dev|start]
 */
const path = require("path");
const { spawnSync } = require("child_process");

const projectRoot = path.resolve(__dirname, "..");
require("dotenv").config({ path: path.join(projectRoot, ".env") });

const port = process.env.PORT || "3000";
const mode = process.argv[2] === "dev" ? "dev" : "start";
const nextBin = path.join(projectRoot, "node_modules", "next", "dist", "bin", "next");

console.log(`Starting on port ${port} (from PORT in .env or default 3000)`);

const result = spawnSync(
  process.execPath,
  [nextBin, mode, "-p", port],
  { stdio: "inherit", env: { ...process.env, PORT: port }, cwd: projectRoot }
);
process.exit(result.status ?? 1);
