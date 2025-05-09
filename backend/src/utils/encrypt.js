// encryption.utils.js
import CryptoJS from "crypto-js";

const SECRET_KEY = "your-secret-key"; // Replace with a strong secret key

export const encryptMessage = (text) => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

export const decryptMessage = (encryptedText) => {
  const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
