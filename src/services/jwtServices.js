import jwt from "jsonwebtoken"

class JWTservice {
    generateToken(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, { expiresIn: "5h" })
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, { expiresIn: "5d" })
        return { accessToken, refreshToken }
    }

    verifyAccessToken(token) {
        return jwt.verify(token, process.env.JWT_ACCESS_TOKEN)
    }
    verifyRefreshToken(token) {
        return jwt.verify(token, process.env.JWT_REFRESH_TOKEN)
    }
}


export default new JWTservice()