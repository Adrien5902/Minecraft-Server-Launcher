import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const port = 3001;
export const serverDir = path.join(__dirname, "servers");
export const curseForgeAPIKey = "$2a$10$ykvROD8AIK7/W8AqNXESp.R7DnKOTzTWbRXgsPJR2Xy9VFpKOqVTa";

export const clientId = "1130980980136624128"
export const clientSecret = "mDYAoNqcEA1xsTWGHqTyFWTN90KkASKB"
export const redirectUri = "https://localhost/discord-auth"