import prisma from "../lib/db.js";
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { generateToken, isPasswordCorrect } from "../utils/auth.js";

const userSchema = z.object({
    email: z.string(),
    password: z.string()
})

export const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validUser = userSchema.safeParse(req.body)
        if (!validUser) {
            return res.status(400).json({
                success: false,
                message: 'Data is invalid or missing'
            })
        }
        let hashedPassword;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10)
        }

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword
            }
        })
        return res.status(201).json({
            success: true,
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const validData = userSchema.safeParse(req.body)
        if (!validData) {
            res.status(400).json({
                success: true,
                message: 'Data is invalid or missing'
            })
        }
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'user not found'
            })
        }
        const isPasswordValid = await isPasswordCorrect(password, user?.password)
        if (user && !isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Password is not correct'
            })
        }

        const token = await generateToken(user)
        console.log(token, 'TOKEN HERE')

        console.log(user)
        return res.status(200).json({
            success: true,
            user,
            token
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}