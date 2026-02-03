import jwt from 'jsonwebtoken'

export const generateAccessToken = (user) => {
    return jwt.sign({
        id: user._id,
        role: user.role,
        userName: user.userName,
        fullName: user.fullName
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m"
    })
}

export const generateRefreshToken = (user) => {
    return jwt.sign({
        id: user._id,
        role: user.role,
        userName: user.userName,
        fullName: user.fullName
    }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d"
    })
}