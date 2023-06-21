import jwtServices from "../services/jwtServices.js"

const authentication = async (req, res, next) => {
    /**
     * check access token
    */
    const { accessToken } = req.cookies

    console.log("You are in Middle")

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

            console.log("next ==>")
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