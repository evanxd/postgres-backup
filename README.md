# PostgreSQL Backup to Google Drive

This project provides an automated solution for backing up a PostgreSQL database and securely uploading the backup files to a specified Google Drive folder. The script is scheduled to run daily, ensuring regular backups without manual intervention.

## ✨ Features

- **Automated Backups**: Utilizes `node-cron` to schedule and perform daily database backups.
- **Secure Uploads**: Leverages Google Drive API for securely uploading backup files.
- **Customizable Configuration**: Easily configure database credentials, Google Drive folder path, and Google API credentials through environment variables.
- **Local File Cleanup**: Automatically deletes the local backup file after a successful upload to Google Drive.

## 📝 Prerequisites

- Node.js (v14 or later)
- PostgreSQL

## 🚀 Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/postgres-backup.git
   cd postgres-backup
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

## ⚙️ Configuration

1. **Create a `.env` file** in the root of the project and add the following environment variables:

   ```env
   # PostgreSQL Database Configuration
   DB_HOST=your_database_host
   DB_PORT=5432
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_DATABASE=your_database_name

   # Schedule Expression
   SCHEDULE_EXPRESSION="0 3 * * *" 

   # Google Drive Configuration
   DRIVE_FOLDER_PATH=database/backups
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email@your-project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----YOUR_PRIVATE_KEY-----END PRIVATE KEY-----"
   ```

2. **Enable the Google Drive API** and create a service account with the necessary permissions. For more information, see the [Google Cloud documentation](https://cloud.google.com/iam/docs/creating-managing-service-accounts).

## ▶️ Usage

1. **Start the application:**

   ```bash
   npm start
   ```

2. **The script will automatically perform a backup based on the `SCHEDULE_EXPRESSION` in your `.env` file.** The default is every day at 3:00 AM.

## 🙌 Contributing
Contributions are welcome! Please feel free to submit a pull request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
