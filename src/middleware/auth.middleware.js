import jwt from 'jsonwebtoken'
import prisma from '../lib/db.js'

export const verifyUser = async (req, res, next) => {
    let token
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1]

            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await prisma.user.findUnique({ where: { id: decoded.id } })
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Token is invalid or user not found'
                })
            }
            next()

        } catch (error) {
            console.error(error)
            res.status(401)
            return res.status(401).json({
                success: false,
                message: "Not authorized"
            })
        }
    }

    if (!token) {
        res.status(401)
        return res.status(401).json({
            success: false,
            message: "Not authorized"
        })
    }
}