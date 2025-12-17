import jwt, {type JwtPayload} from "jsonwebtoken";

import "dotenv/config"

interface MyJwtPayload extends JwtPayload {
    id: number;
    email: string;
}

const ACCESS_TOKEN_SECRET_KEY: string = process.env["ACCESS_TOKEN_SECRET_KEY"] || "ACCESS_TOKEN_KEY_001"
const REFRESH_TOKEN_SECRET_KEY: string = process.env["REFRESH_TOKEN_SECRET_KEY"] || "REFRESH_TOKEN_KEY_01"

export const generateToken = (payload: {user_id: string, email: string, role: string}): {access_token:string, refresh_token:string} => {
    const access_token = jwt.sign(payload, ACCESS_TOKEN_SECRET_KEY, {expiresIn: '1h'})
    const refresh_token = jwt.sign(payload, REFRESH_TOKEN_SECRET_KEY, {expiresIn: '7d'})
    return {access_token: access_token, refresh_token: refresh_token}
}

export const verifyAccessToken = (access_token: string)  => {
    return jwt.verify(access_token, ACCESS_TOKEN_SECRET_KEY) as MyJwtPayload
}

