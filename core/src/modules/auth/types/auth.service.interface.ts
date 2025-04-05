import { IJwtUserPayload } from "./jwt.user.payload.interface";

export interface IAuthService {
    hashPassword(value: string): Promise<string>;
    validatePassword(value: string, hashedValue: string): Promise<boolean>;
    generateToken(payload: IJwtUserPayload): Promise<string>;
    verifyToken(token: string): Promise<IJwtUserPayload>;
}
