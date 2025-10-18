import cron from "node-cron";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { databaseConfig } from "./config.js";
import { uploadToDrive } from "./drive.js";
import util from "util";

const execPromise = util.promisify(exec);

async function performBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupDir = path.resolve("./backups");
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const backupFile = path.join(backupDir, `backup-${timestamp}.dump`);
  const cmd = `PGPASSWORD=${databaseConfig.password} pg_dump -h ${databaseConfig.host} -U ${databaseConfig.user} -p ${databaseConfig.port} -F c -b -v -f "${backupFile}" ${databaseConfig.database}`;

  try {
    await execPromise(cmd);
    console.log(`✅ Backup completed: ${backupFile}`);
    await uploadToDrive(backupFile);
  } catch (error) {
    console.error(`❌ Backup failed:`, error);
  }
}

cron.schedule("0 3 * * *", () => {
  console.log("⏰ Triggering daily backup job...");
  performBackup();
});
