import jwt from 'jsonwebtoken';
const secret = process.env.JWT_SECRET || 'secret';

export const generateToken = (payload: any) =>{
    return jwt.sign(payload, secret, { expiresIn: "10d" });
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, secret) as any;
}

export const decodeToken = (token: string) => {
    return jwt.decode(token) as any;
}