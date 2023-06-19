import jwtServices from "../services/jwtServices.js"

const authentication = async (req, res, next) => {
    /**
     * check access token
    */
    const { accessToken } = req.cookies

    process.stdout.write("In Middleware...... ")

    console.log(accessToken)

    if (!accessToken) {
        return res.status(401).json({
            success: false,
            message: "token expired or invalid"
        })
    }

    try {
        const userData = await jwtServices.verifyAccessToken(accessToken)
        
        console.log(userData)

        if (userData) {
            req.user = userData

            process.stdout.write("calling next....")

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