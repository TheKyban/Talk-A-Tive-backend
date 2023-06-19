const sendCookie = (res, tokenName, token, expiry) => {
    return res.cookie(tokenName, token, {
        httpOnly: true,
        maxAge: expiry
    })
}

export default sendCookie