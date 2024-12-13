// src/utils/AES128.ts
import CryptoJS from "crypto-js";

class AES128 {
    private password: string;

    constructor(password: string) {
        this.password = password;
    }

    encrypt(plaintext: string): string {
        const key = CryptoJS.PBKDF2(
            this.password,
            CryptoJS.enc.Utf8.parse("salt"),
            { keySize: 128 / 32 } // Changed key size to 128 bits (16 bytes)
        ).toString(CryptoJS.enc.Hex);

        // Encrypt the data
        const ciphertext = CryptoJS.AES.encrypt(plaintext, key).toString();

        return ciphertext;
    }

    decrypt(ciphertext: string): any {
        const key = CryptoJS.PBKDF2(
            this.password,
            CryptoJS.enc.Utf8.parse("salt"),
            { keySize: 128 / 32 } // Changed key size to 128 bits (16 bytes)
        ).toString(CryptoJS.enc.Hex);

        try {
            const bytes = CryptoJS.AES.decrypt(ciphertext, key);
            const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

            if (!decryptedText) {
                throw new Error("Decryption failed: Incorrect password.");
            }

            return decryptedText;
        } catch (error) {
            return false;
        }
    }
}

export default AES128;
