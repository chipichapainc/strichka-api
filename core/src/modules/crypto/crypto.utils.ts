import { pbkdf2, randomBytes, scrypt, randomFill } from 'node:crypto';
import { promisify } from 'util';
import { BinaryLike, CipherKey } from 'crypto';

// Promisified cryptographic functions
export const pbkdf2Async = promisify<BinaryLike, BinaryLike, number, number, string, Buffer>(pbkdf2);
export const randomBytesAsync = promisify<number, Buffer>(randomBytes);
export const scryptAsync = promisify<BinaryLike, BinaryLike, number, CipherKey>(scrypt);
export const randomFillAsync = promisify<Uint8Array, Uint8Array>(randomFill); 