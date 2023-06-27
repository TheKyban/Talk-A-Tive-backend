import jwtServices from "../services/jwtServices.js"

const authentication = async (req, res, next) => {
    /**
     * check access token
    */
    const { accessToken } = req.cookies


    if (!accessToken) {
        return res.status(401).json({
            success: false,
            message: "token expired or invalid"
        })
    }

    try {
        const userData = await jwtServices.verifyAccessToken(accessToken)


        if (userData) {
            req.user = userData

            next()
        }

    } catch (error) {
        return res.json({
            success: false,
            message: "token expired or invalid"
        })
    }

}


export { authentication }