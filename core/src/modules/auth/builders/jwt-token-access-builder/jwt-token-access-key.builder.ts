import { IJwtToken } from "../../types/jwt.token.interface";

export class JwtTokenAccessKeyBuilder {
    private tokenId: string;

    constructor(id: string) {
        this.tokenId = id
    }

    static forId(id: string): JwtTokenAccessKeyBuilder {
        return new JwtTokenAccessKeyBuilder(id);
    }

    static forToken(token: IJwtToken): JwtTokenAccessKeyBuilder {
        return this.forId(token.payload.jti);
    }

    build(): string {
        return `a:t/${this.tokenId}`;
    }
}