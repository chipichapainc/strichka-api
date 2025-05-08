export interface IJwtUserPayload {
    id: string;
}

export interface IJwtToken {
    header: {
        alg: string,
        typ: string
    },
    payload: {
        jti: string,
        iat: number,
        exp: number
    } & IJwtUserPayload,
    signature: string
}