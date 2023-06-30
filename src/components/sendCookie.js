const sendCookie = (res, tokenName, token, expiry) => {

	return res.cookie(tokenName, token, {
		httpOnly: true,
		maxAge: expiry,
		secure: process.env.DEVELOPMENT === "true" ? false : true,
	});
};

export default sendCookie;
