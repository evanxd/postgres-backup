import fs from "fs";
import path from "path";

import { google } from "googleapis";

import { googleApiCredentials, driveFolderPath } from "./config.js";

if (!googleApiCredentials.client_email || !googleApiCredentials.private_key) {
  throw new Error(
    "Google API credentials are not defined. Please check your environment variables.",
  );
}

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: googleApiCredentials.client_email,
    private_key: googleApiCredentials.private_key,
  },
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

const driveService = google.drive({ version: "v3", auth });

async function getOrCreateDriveFolderPath(folderPath: string): Promise<string> {
  let parentId = "root";

  const folders = folderPath.split("/").filter((p) => p);

  for (const folder of folders) {
    const res = await driveService.files.list({
      q: `"${parentId}" in parents and name = "${folder}" and mimeType = "application/vnd.google-apps.folder" and trashed = false`,
      fields: "files(id)",
      pageSize: 1,
    });

    if (res.data.files && res.data.files.length > 0 && res.data.files[0].id) {
      parentId = res.data.files[0].id;
    } else {
      const fileMetadata = {
        name: folder,
        mimeType: "application/vnd.google-apps.folder",
        parents: [parentId],
      };
      const file = await driveService.files.create({
        requestBody: fileMetadata,
        fields: "id",
      });
      if (!file.data.id) {
        throw new Error(`Could not create folder ${folder}`);
      }
      parentId = file.data.id;
    }
  }

  return parentId;
}

export async function uploadToDrive(localFilePath: string): Promise<void> {
  try {
    console.log("⬆️ Uploading to Google Drive...");
    const folderId = await getOrCreateDriveFolderPath(driveFolderPath);

    const fileMetadata = {
      name: path.basename(localFilePath),
      parents: [folderId],
    };

    const media = {
      mimeType: "application/octet-stream",
      body: fs.createReadStream(localFilePath),
    };

    const res = await driveService.files.create({
      requestBody: fileMetadata,
      media,
      fields: "id, name, webViewLink",
    });

    if (res.data.webViewLink) {
      console.log(`✅ Uploaded: ${res.data.name} (${res.data.webViewLink})`);
    } else {
      console.log(`✅ Uploaded: ${res.data.name} (link not available)`);
    }

    fs.unlink(localFilePath, (err) => {
      if (err) {
        console.error(`Failed to delete local file: ${localFilePath}`, err);
      } else {
        console.log(`🧹 Local file deleted: ${localFilePath}`);
      }
    });
  } catch (error) {
    console.error(`❌ Google Drive upload failed:`, error);
  }
}
