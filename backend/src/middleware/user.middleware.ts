import type {Request, Response, NextFunction} from "express";
import {verifyAccessToken} from "../utils/token.js";
import prisma from "../db/db.js"

export const validateUserAndRole = async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token;

    const tokenData = verifyAccessToken(access_token)
    if (!tokenData) {
        return res.status(400).json({"status": false, "message": "Invalid or expired token"})
    }
    console.log(tokenData, tokenData.email)
    const user = await prisma.user.findFirst({
        where: {
            email: tokenData.email
        }
    })

    console.log(user)
    if (user && user.role === "ADMIN") {
        console.log(user.role)
        req.user = user
        return next()
    }

    res.status(403).json({
        status: false,
        message: "You do not have permission to perform this action"
    });
}

export const validateUser = async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token;

    const tokenData = verifyAccessToken(access_token)
    if (!tokenData) {
        return res.status(400).json({"status": false, "message": "Invalid or expired token"})
    }
    console.log(tokenData, tokenData.email)
    const user = await prisma.user.findFirst({
        where: {
            email: tokenData.email
        }
    })

    console.log(user)
    if (user) {
        req.user = user
        return next()
    }

    res.status(403).json({
        status: false,
        message: "User Not Found"
    });
}