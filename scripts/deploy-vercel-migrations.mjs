import { spawnSync } from "node:child_process";

const vercelEnvironment = process.env.VERCEL_ENV?.trim().toLowerCase();
const previewMigrationsEnabled =
  process.env.ALLOW_PREVIEW_MIGRATIONS?.trim().toLowerCase() === "true";
const shouldDeploy =
  vercelEnvironment === "production" ||
  (vercelEnvironment === "preview" && previewMigrationsEnabled);

if (!shouldDeploy) {
  const reason =
    vercelEnvironment === "preview"
      ? "Preview migrations are disabled. Set ALLOW_PREVIEW_MIGRATIONS=true only after assigning a separate Preview database."
      : `No migration policy is defined for VERCEL_ENV=${vercelEnvironment || "unset"}.`;

  console.log(`Skipping database migrations. ${reason}`);
  process.exit(0);
}

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const result = spawnSync(npmCommand, ["run", "db:deploy"], {
  stdio: "inherit",
  env: process.env,
});

if (result.error) {
  throw result.error;
}

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
