import { Injectable } from '@nestjs/common';
import { pbkdf2Async, randomBytesAsync } from './crypto.utils';

@Injectable()
export class PasswordHashingService {
  // Password hashing configuration
  private readonly iterations = 10000;
  
  private readonly digest = 'sha512';
  private readonly keylen = 64;

  /**
   * Hashes a password using PBKDF2
   * @param password The plain text password to hash
   * @returns A string in the format "salt:hash"
   */
  async hash(password: string): Promise<string> {
    const saltBytes = await randomBytesAsync(16);
    const salt = saltBytes.toString('hex');
    const hashBytes = await pbkdf2Async(password, salt, this.iterations, this.keylen, this.digest);
    const hash = hashBytes.toString('hex');
    return `${salt}:${hash}`;
  }

  /**
   * Validates a password against a stored hash
   * @param password The plain text password to validate
   * @param hashedPassword The stored password hash in the format "salt:hash"
   * @returns Boolean indicating if the password is valid
   */
  async validate(password: string, hashedPassword: string): Promise<boolean> {
    const [salt, storedHash] = hashedPassword.split(':');
    const hashBytes = await pbkdf2Async(password, salt, this.iterations, this.keylen, this.digest);
    const hash = hashBytes.toString('hex');
    return storedHash === hash;
  }
} 