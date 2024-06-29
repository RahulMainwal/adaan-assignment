const ApiHandler = require("../utils/ApiHandler");
const ApiError = require("../utils/ApiError");
const User = require("../models/user.models");

const userDataValidator = ApiHandler(async (req, res, next) => {
    // 1. check fields are not empty
    // 2. validate fields type and length
    // 3. check if user is already existed in DB 
    //   => user exists (Throw error) || user does not exist (Move on)
    // 4. Generate otp and encrypt otp into hash
    // 5. Save hash otp using bcrypt in DB for further authentication
    // 6. Send otp to user's email or phone
    // 7. Return data or message regarding sent otp


    const { name, phone, email, password, reTypedPassword } = req.body;
    const phoneInString = phone.toString();

    const existingUser = await User.findOne({phone});

    if(existingUser && existingUser.isVerified){
        return res
        .status(400)
        .json(
            new ApiError(400, {}, "This phone is already registered!")
        );
    }

    // Reg Expressions
    const characterRegExp = /^[A-Z]+$/i;
    const phoneRegExp = /^[6-9]{1}[0-9]{9}$/;
    const emailRegExp = /^[^\.\s][\w\-]+(\.[\w\-]+)*@([\w-]+\.)+[\w-]{2,}$/gm;
    const passwordRegExp = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    // Check all fields are not empty
    if (
        [name, phoneInString, email, password, reTypedPassword].some((field) => field?.trim() === "" || !field?.trim())
    ) {
        return res
            .status(400)
            .json(
                new ApiError(400, {}, "All fields are required for user!")
            );
    };

    if (name?.trim().length < 3 || name?.trim().length > 30) {
        return res
            .status(400)
            .json(
                new ApiError(400, {}, "Name must have 3-30 characters.")
            );
    }

    // if (!name.match(characterRegExp)) {
    //     return res
    //         .status(400)
    //         .json(
    //             new ApiError(400, {}, "Name must have characters only.")
    //         );
    // }

    if (phoneInString.length !== 10) {
        return res
            .status(400)
            .json(
                new ApiError(400, {}, "Phone must have 10 digits.")
            );
    }

    if (!phoneInString.match(phoneRegExp)) {
        return res
            .status(400)
            .json(
                new ApiError(400, {}, "Invalid phone number!")
            );
    }

    if (!email.match(emailRegExp)) {
        return res
            .status(400)
            .json(
                new ApiError(400, {}, "Invalid email address.")
            );
    }

    if (password?.toString().length < 6 || password?.toString().length > 20) {
        return res
            .status(400)
            .json(
                new ApiError(400, {}, "Password must have 6-20 characters.")
            );
    }

    if (!password?.toString().match(passwordRegExp)) {
        return res
            .status(400)
            .json(
                new ApiError(400,
                    {
                        contains:
                            [
                                "Requires at least one numeric digit.",
                                "Requires at least one lowercase letter",
                                "Requires at least one uppercase letter.",
                                "Matches any character between 6 and 20 times."
                            ],
                    }, "Create a strong password.")
            );
    }

    if(password?.toString() !== reTypedPassword?.toString()){
        return res
        .status(401)
        .json(
            new ApiError(401, {}, "Password does not match!")
        );
    }

    if(!existingUser){
        req.userFound = false;
    }else{
        if(existingUser.isVerified === false) {
            req.userFound = true;
            req.userId = existingUser._id;
        }
    }
    return next();
})

module.exports = {
    userDataValidator,
};