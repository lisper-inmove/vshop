import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

export function sign(email: string, phone: string) {
  const token = jwt.sign(
    { email: email, phone: phone, timestamp: Date.now() },
    process.env.JWT_SECRET!,
    { expiresIn: "4h" },
  );
  return token;
}

export function verify(authorization: string) {
  try {
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return true;
  } catch (error) {
    return false;
  }
}
