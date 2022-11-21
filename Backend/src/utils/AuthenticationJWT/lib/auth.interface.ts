export interface IPayload {
    sub: string;
    iat: number;
}

export interface ICookie {
    cookieName: string;
    expiresDate: Date;
    token: string;
}
