import { IJwtToken, IJwtUserPayload } from "./jwt.token.interface";

export interface IAuthService {
    generateToken(payload: IJwtUserPayload): Promise<string>;
    verifyToken(token: string): Promise<IJwtToken>;
    deleteToken(token: string): Promise<string>;
    decodeToken(token: string): IJwtToken;
}
