const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const ApiHandler = require("../utils/ApiHandler");
const User = require("../models/user.models");
const authUser = ApiHandler(async (req, res, next) => {
    const loginToken = req.headers.logintoken;

    if (!loginToken) {
        return res
            .status(401)
            .json(
                new ApiError(401, {isLoggedIn: false}, "Token does not exist")
            )
    }

    try {
        const tokenVerfication = await jwt.verify(loginToken, process.env.JWT_SECRET_KEY);

        if (!tokenVerfication?.userId) {
            return res
                .status(400)
                .json(
                    new ApiError(400, {}, "Something went wrong in token and login again!")
                )
        }

        const user = await User.findById({ _id: tokenVerfication?.userId }).select("-password -__v -createdAt -updatedAt -isVerified");

        if (!user) {
            return res
                .status(400)
                .json(
                    new ApiError(400, {isLoggedIn: false}, "Invalid token!")
                )
        }

        req.user = user;
        return next();
    } catch (error) {
        return res
            .status(500)
            .json(
                new ApiError(500, {}, error?.message)
            )
    }

})

module.exports = authUser;