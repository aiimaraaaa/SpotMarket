import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

console.log(
  "🔑 JWT_SECRET cargado:",
  process.env.JWT_SECRET ? "✅ Sí" : "❌ No",
);

export const generateToken = (payload) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET no está definido en .env");
    }
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  } catch (error) {
    throw new Error("Error generando el token: " + error.message);
  }
};

export const verifyToken = (token) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET no está definido en .env");
    }
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Error verificando el token: " + error.message);
  }
};
