import * as crypto from "crypto";

const algorithm = "aes-256-cbc";

export function encrypt(text:string) {
  try {
    const key = process.env.NEXT_PUBLIC_PASS_KEY;
    if(!key)return null
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return {encrypted, iv:iv.toString("hex")};
  } catch (error) {
    return null
  }
}

export function decrypt(encrypted:string, ivStr:string) {
  try {   
    const iv = Buffer.from(ivStr, "hex");
    const key = process.env.NEXT_PUBLIC_PASS_KEY;
    if(!key)return null
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    console.log(decrypted);
    return decrypted;   
  } catch (error) {
    return null
  }
}

