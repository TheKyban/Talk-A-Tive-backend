const sendCookie = (res, tokenName, token, expiry) => {
	return res.cookie(tokenName, token, {
		maxAge: expiry,
		httpOnly: true,
		secure: process.env.DEVELOPMENT === "true" ? false : true,
		sameSite: process.env.DEVELOPMENT === "true" ? "lax" : "none",
	});
};

export default sendCookie;
