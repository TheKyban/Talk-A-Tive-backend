const sendCookie = (res, tokenName, token, expiry) => {
	return res.cookie(tokenName, token, {
		maxAge: expiry,
		// secure: process.env.DEVELOPMENT === "true" ? false : true,
		secure: true,
		httpOnly: true,
	});
};

export default sendCookie;
