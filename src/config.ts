import dotenv from "dotenv";

dotenv.config();

export const databaseConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

export const driveFolderPath = process.env.DRIVE_FOLDER_PATH || "database/backups";

export const googleApiCredentials = {
  client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY,
};

export const scheduleExpression = process.env.SCHEDULE_EXPRESSION || "0 3 * * *";
