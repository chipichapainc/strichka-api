export interface IJwtUserPayload {
    id: string;
}

export interface IJwtPayload {
    jti: string,
    iat: number,
    exp: number
}

export interface IJwtHeader {
    alg: string,
    typ: string
}

export interface IJwtToken {
    header: IJwtHeader,
    payload: IJwtPayload & IJwtUserPayload,
    signature: string
}