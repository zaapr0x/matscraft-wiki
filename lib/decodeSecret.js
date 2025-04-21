import CryptoJS from "crypto-js";

const iv = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");
const key = CryptoJS.enc.Utf8.parse(process.env.SECRET_KEY);

export const decodeSecret = (encrypted) => {
    try {
        const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        }).toString(CryptoJS.enc.Utf8);

        return JSON.parse(decrypted);
    } catch (err) {
        console.error("Failed to decode secret:", err);
        return null;
    }
};
