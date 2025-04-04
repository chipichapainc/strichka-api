import { Injectable } from '@nestjs/common';
import { promisify } from 'util'
import { createCipheriv, createDecipheriv, scrypt, randomFill, CipherKey } from 'node:crypto';
import { BinaryLike } from 'crypto';

// Before touching read - https://nodejs.org/api/crypto.html
// After touching run - npm run test
@Injectable()
export class CryptoService {
    private readonly scryptAsync = promisify<BinaryLike, BinaryLike, number, CipherKey>(scrypt);
    private readonly randomFillAsync = promisify<Uint8Array, Uint8Array>(randomFill);

    // aes-256-gcm will be enough for now :3
    // PS: if u changed ALGORITHM for some reason - it will NOT just start working
    // lookup needed params and params bitlength for that algo on OpenSSL
    private readonly ALGORITHM = 'aes-256-gcm';

    /**
     * aes-256 = 32
     * aes-192 = 24
     * aes-128 = 16 
     * :3
     */
    private readonly KEY_LENGTH = 32;
    private readonly IV_LENGTH = 12;
    private readonly SALT_LENGTH = 16;

    // -gcm only
    private readonly AUTH_TAG_LENGTH = 16;

    public async encrypt<T>(secret: string, data: T) {
        // Initialization vector (some random shit to start from)
        const iv = await this.randomFillAsync(new Uint8Array(this.IV_LENGTH));
        // Another random vector to add dispersion
        const salt = await this.randomFillAsync(new Uint8Array(this.SALT_LENGTH));
        // Salted secret
        const key = await this.scryptAsync(secret, salt, this.KEY_LENGTH);
        // Generator
        const cipher = createCipheriv(this.ALGORITHM, key, iv);

        // Concat everything to single token to be able to decrypt shit. 
        // Caution! they should have fixed length :3
        const encrypted = Buffer
            .concat([
                iv,
                salt,
                cipher.update(JSON.stringify(data), 'utf8'),
                cipher.final(),
                cipher.getAuthTag()
            ]);
        return encrypted.toString('hex')
    }

    public async decrypt<T = any>(secret: string, data: string): Promise<T> {
        // Reversed encryption steps
        // If u updated encrypt() DO NOT FORGET to change this too
        const encryptedData = Buffer.from(data, 'hex');
        const iv: Buffer = encryptedData.subarray(
            0,
            this.IV_LENGTH
        );
        const salt: Buffer = encryptedData.subarray(
            this.IV_LENGTH,
            this.IV_LENGTH + this.SALT_LENGTH
        );
        const ciphertext: Buffer = encryptedData.subarray(
            this.IV_LENGTH + this.SALT_LENGTH,
            encryptedData.length - this.AUTH_TAG_LENGTH
        );
        const authTag: Buffer = encryptedData.subarray(
            encryptedData.length - this.AUTH_TAG_LENGTH
        );

        const key = await this.scryptAsync(secret, salt, this.KEY_LENGTH);
        const decipher = createDecipheriv(this.ALGORITHM, key, iv);
        decipher.setAuthTag(authTag)
        const decrypted = Buffer
            .concat([decipher.update(ciphertext), decipher.final()])
            .toString('utf8')
        try {
            return JSON.parse(decrypted)
        } catch (e) {
            throw new Error("Invalid encrypted JSON object")
        }
    }
}
