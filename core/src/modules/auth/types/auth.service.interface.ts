import { IJwtUserPayload } from "./jwt.user.payload.interface";

export interface IAuthService {
    generateToken(payload: IJwtUserPayload): Promise<string>;
    verifyToken(token: string): Promise<IJwtUserPayload>;
}
