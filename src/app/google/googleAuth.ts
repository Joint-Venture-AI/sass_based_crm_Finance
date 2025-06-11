import { google } from "googleapis";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config();

const SCOPES = [
  "https://www.googleapis.com/auth/forms.body",
  "https://www.googleapis.com/auth/forms.responses.readonly",
];

export const getAuthClient = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, "secret.json"),
    scopes: SCOPES,
  });

  return await auth.getClient();
};
