import * as crypto from "crypto";

const algorithm = "aes-256-cbc";

export function encrypt(text:string) {
  const key = crypto.randomBytes(16).toString("hex");
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return {encrypted, key, iv:iv.toString("hex")};
}

export function decrypt(encrypted:string, key:string, ivStr:string) {
  const iv = Buffer.from(ivStr, "hex");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  console.log(decrypted);
  return decrypted;
}