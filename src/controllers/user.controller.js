import sendCookie from "../components/sendCookie.js";
import USER from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwtServices from "../services/jwtServices.js";
import TOKEN from "../models/token.model.js";
class UserControllers {
	/**
	 * Register function
	 */

	async createUser(req, res) {
		try {
			/**
			 * Get queries
			 */

			const { name, email, picture, password } = req.body;

			if (!name || !email || !password) {
				return res.json({
					message: "all fields are required",
					success: false,
				});
			}

			/**
			 * Search users in database
			 */

			const isExist = await USER.findOne({ email });

			if (isExist) {
				return res.json({
					message: "User already exist with this email!",
					success: false,
				});
			}

			/**
			 * If user not in database then create user
			 */

			// hashing password

			const hashedPassword = await bcrypt.hashSync(
				password,
				parseInt(process.env.SALT),
			);

			const createdUser = await USER.create({
				name,
				email,
				password: hashedPassword,
				picture,
			});

			/**
			 * converting user id into jwt token
			 */

			const { accessToken, refreshToken } = jwtServices.generateToken({
				token: createdUser._id,
			});

			/**
			 * saving to token to database
			 */

			await TOKEN.create({
				token: refreshToken,
				userId: createdUser._id,
			});

			const expiry = 1000 * 60 * 60 * 24; // 1 day
			const accessExpiry = 1000 * 60 * 60 * 24 * 2; // 2d

			/**
			 * Sending cookie
			 */

			sendCookie(res, "accessToken", accessToken, accessExpiry);
			sendCookie(res, "refreshToken", refreshToken, expiry);

			/**
			 * Sending response
			 */

			res.json({
				message: "Thank you for register",
				success: true,
				data: {
					_id: createdUser._id,
					name: createdUser.name,
					email: createdUser.email,
					picture: createdUser.picture,
				},
			});
		} catch (error) {
			console.log(error);
		}
	}

	/**
	 * Login function
	 */

	async loginUser(req, res) {
		try {
			const { email, password } = req.body;

			if (!email || !password) {
				return res.json({
					message: "all field required",
					success: false,
				});
			}

			/**
			 * check user exist or not
			 */

			const isUserExist = await USER.findOne({ email });

			/**
			 * if user not exist
			 */

			if (!isUserExist) {
				return res.json({
					message: "user not found",
					success: false,
				});
			}

			/**
			 * if user exist then check password
			 */

			const isPasswordMatch = await bcrypt.compareSync(
				password,
				isUserExist.password,
			);

			/**
			 * If password is wrong
			 */

			if (!isPasswordMatch) {
				return res.json({
					message: "incorrect password",
					success: false,
				});
			}

			/**
			 * converting user id into jwt token
			 */

			const { refreshToken, accessToken } = jwtServices.generateToken({
				token: isUserExist._id,
			});

			/**
			 * saving refreshToken to database
			 */

			try {
				const isTokenExist = await TOKEN.findOne({
					userId: isUserExist._id,
				});
				if (!isTokenExist) {
					// if token not available then create
					await TOKEN.create({
						token: refreshToken,
						userId: isUserExist._id,
					});
				} else {
					// if token is available then updata
					await TOKEN.updateOne(
						{ userId: isUserExist._id },
						{ token: refreshToken },
					);
				}
			} catch (error) {
				console.log(error);
			}

			const expiry = 1000 * 60 * 60 * 24 * 5; // 5 day
			const accessExpiry = 1000 * 60 * 60 * 24; // 1d

			/**
			 * Sending cookie
			 */

			sendCookie(res, "accessToken", accessToken, accessExpiry);
			sendCookie(res, "refreshToken", refreshToken, expiry);

			/**
			 * Sending response
			 */

			res.json({
				message: `Welcome back ${isUserExist.name}`,
				success: true,
				data: {
					_id: isUserExist._id,
					name: isUserExist.name,
					email: isUserExist.email,
					picture: isUserExist.picture,
				},
			});
		} catch (error) {
			console.log(error);
		}
	}

	/**
	 * Logout function
	 */

	async logoutUser(req, res) {
		try {
			let { accessToken, refreshToken } = req.cookies;

			if (!accessToken || !accessToken) {
				return res.send("invalid token");
			}

			const userId = jwtServices.verifyRefreshToken(refreshToken).token;

			/**
			 * deleting token from database
			 */

			const deleted = await TOKEN.deleteOne({ userId });

			/**
			 * Sending empty cookies
			 */

			const expiry = 0;
			sendCookie(res, "accessToken", "", expiry);
			sendCookie(res, "refreshToken", "", expiry);

			res.send("logout");
		} catch (error) {
			console.log(error);
		}
	}

	/**
	 * Refresh
	 */

	async refresh(req, res) {
		/**
		 * Get tokens form cookies
		 */

		const { refreshToken: oldRefreshToken } = req.cookies;

		/**
		 * check token is valid
		 */

		let userData;

		try {
			userData = await jwtServices.verifyRefreshToken(oldRefreshToken);
		} catch (error) {
			return res.json({
				message: "Please Login",
			});
		}

		/**
		 * check token is in database
		 */

		try {
			const isTokenExist = await TOKEN.findOne({
				userId: userData.token,
			});

			if (!isTokenExist || isTokenExist.token !== oldRefreshToken) {
				return res.json({
					message: "Invalid Token or doesn't match",
				});
			}
		} catch (error) {
			return res.status(500).json({
				message: "Internal error",
			});
		}

		/**
		 * Generate new token
		 */

		const { accessToken, refreshToken } = jwtServices.generateToken({
			token: userData.token,
		});

		/**
		 * update Refresh token
		 */

		try {
			await TOKEN.updateOne(
				{ userId: userData.token },
				{ token: refreshToken },
			);
		} catch (error) {
			console.log(error);

			return res.status(500).json({
				message: "Internal error",
			});
		}

		/**
		 * check user is valid
		 */

		const user = await USER.findById(userData.token);

		if (!user) {
			return res.status(404).json({
				message: "No user",
			});
		}

		/**
		 * Put new token in cookie
		 */

		const expiry = 1000 * 60 * 60 * 24 * 2; // 2 day
		const accessExpiry = 1000 * 60 * 60 * 24; // 1 day

		sendCookie(res, "refreshToken", refreshToken, expiry);
		sendCookie(res, "accessToken", accessToken, accessExpiry);

		/**
		 * send response
		 */

		res.json({
			message: `Welcome back ${user.name}`,
			success: true,
			data: {
				_id: user._id,
				name: user.name,
				email: user.email,
				picture: user.picture,
			},
		});
	}

	async findUsers(req, res) {
		try {
			const { search } = req.body;
			const currentUser = req.user.token;
			if (!search) {
				res.json({
					message: "query required",
				});
			}

			/**
			 * find users in database
			 */

			try {
				const users = await USER.find({
					name: { $regex: search, $options: "i" },
					_id: { $ne: currentUser },
				});

				if (!users) {
					return res.json({
						message: "user no find",
					});
				}

				return res.json({
					data: users,
				});
			} catch (error) {}
		} catch (error) {
			console.log(error);
		}
	}
}

export default new UserControllers();
