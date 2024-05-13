const crypto = require("crypto");

const algorithm = "aes-256-cbc";

function encrypt(text) {
  const key = "*********************";
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return {encrypted, iv:iv.toString("hex")};
}

function decrypt(encrypted, ivStr) {
  const iv = Buffer.from(ivStr, "hex");
  const key = "******************";
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  console.log(decrypted);
  return decrypted;
}

// decrypt("", "")

