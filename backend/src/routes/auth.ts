import express, {type Router, type Request, type Response} from "express";
import {loginSchema, userCreateSchema} from "../validators/auth.validators.js";
import {z} from "zod";
import prisma from "../db/db.js"
import {generateToken} from "../utils/token.js";
import {validateUserAndRole} from "../middleware/user.middleware.js"
import {hashPassword} from "../utils/passwordhash.js";

export const authRouter: Router = express.Router()

authRouter.post("/login", async (req, res) => {
    const parsedLoginData = loginSchema.safeParse(req.body);
    if (!parsedLoginData.success) {
        return res.status(400).json({"status": false, "message": z.treeifyError(parsedLoginData.error)})
    }
    console.log(parsedLoginData.data)
    const user = await prisma.user.findFirst({
        where: {
            email: parsedLoginData.data?.email
        }
    })

    console.log(user)

    if (!user) {
        return res.status(400).json({"status": false, "message": "Email or password is incorrect"})
    }

    const tokens = generateToken({user_id: user.id, email: user.email, role: user.role});
    res.cookie('access_token', tokens.access_token, {
        httpOnly: process.env.NODE_ENV === 'production',        // Prevents JS access (XSS protection)
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',    // CSRF protection
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.cookie('refresh_token', tokens.refresh_token, {
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    return res.status(200). json({"status": true, "message":"login successful"})
})

authRouter.post("/add-user", validateUserAndRole, async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const parsedUserDetails = userCreateSchema.safeParse(req.body)
        if (!parsedUserDetails.success) {
            return res.status(400).json({status: false, message: z.treeifyError(parsedUserDetails.error)})
        }

        const existing_user = await prisma.user.findFirst({
            where: {
                email: parsedUserDetails.data.email
            }
        })
        if (existing_user) {
            return res.status(409).json({status: false, "message": "User already exists"})
        }
        const new_user = await prisma.user.create({
            data: {
                first_name: parsedUserDetails.data.first_name,
                last_name: parsedUserDetails.data.last_name ?? "",
                email: parsedUserDetails.data.email,
                password: await hashPassword(parsedUserDetails.data.password),
                role: parsedUserDetails.data.role,
                invited_by_id: user.id
            }
        })
        return res.status(200).json({status:true, "message": "user created successfully", data: {
            email: new_user.email, id: new_user.id, role: new_user.role
            }})
    } catch(err) {
        console.log(err)
        throw err;
         // return res.status(400).json({status: false, message: err})
    }
})

