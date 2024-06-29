const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const OneTimePassword = require("../models/otp.models");
const User = require("../models/user.models");
const ApiError = require("../utils/ApiError");
const ApiHandler = require("../utils/ApiHandler");
const ApiResponse = require("../utils/ApiResponse");
const storageBucket = require("../config/cloudinary");

// ********************************************************************

// Register User => Name, Phone, Email, Password, Re-type password && Verification via otp
// Login User => Phone, password || Login via Otp
// Get User => Photo, Name, Email, Phone, Past Experience, skill sets, Education Qualification, gender, DOB, Location
// Update User => Don't change PHONE or Use as primary key

// ********************************************************************

const registerUser = ApiHandler(async (req, res) => {

    const { name, phone, email, password } = req.body;
    const otp = req.otp;
    const now = new Date();
    const expireTime = now.getTime() + 10 * 60 * 1000;

    try {

        if (req.userFound) {
            await User.findByIdAndDelete({ _id: req.userId });
        }

        const savedUser = await User.create({ name, phone, email, password, passwordLength: password.length });

        await OneTimePassword.deleteOne({ phoneNumber: phone });

        const savedOtp = await OneTimePassword.create({ phoneNumber: phone, phoneOtp: otp, phoneOtpExpiredAt: expireTime });

        return res
            .status(200)
            .json(
                new ApiResponse(200, {
                    name: savedUser.name,
                    email: savedUser.email,
                    phone: savedUser.phone,
                    otpExpiredAt: savedOtp.phoneOtpExpiredAt,
                }, "Otp sent successfully!", true)
            )

    } catch (error) {
        console.log(error)
        return res
            .status(500)
            .json(
                new ApiError(500, {}, error?.message)
            )
    }
})

const verifyRegisteringUser = ApiHandler(async (req, res) => {
    const { phone, otp } = req.body;
    const now = new Date();
    const currentTime = now.getTime();

    const existingUser = await User.findOne({ phone });

    if (existingUser.isVerified) {
        return res
            .status(400)
            .json(
                new ApiError(400, {}, "This phone is already registered!")
            );
    }

    if (!phone) {
        return res
            .status(400)
            .json(
                new ApiError(400, {}, "Phone is required for authentication!")
            );
    }

    if (!otp) {
        return res
            .status(400)
            .json(
                new ApiError(400, {}, "OTP is required for user!")
            );
    }

    const foundOtp = await OneTimePassword.findOne({ phoneNumber: phone });

    if (!foundOtp) {
        return res
            .status(404)
            .json(
                new ApiError(404, {}, "User's OTP not found. Resend otp or register again!")
            );
    }


    const otpVerification = await bcrypt.compare(otp.toString(), foundOtp.phoneOtp);

    if (!otpVerification) {
        return res
            .status(401)
            .json(
                new ApiError(401, {}, "Invalid OTP!")
            );
    }

    if (currentTime > foundOtp.phoneOtpExpiredAt) {
        return res
            .status(401)
            .json(
                new ApiError(401, {}, "OTP has been expired!")
            );
    }

    const updateUserVerified = await User.findByIdAndUpdate({ _id: existingUser._id }, { isVerified: true }, { new: true });
    const deleteOtp = await OneTimePassword.deleteOne({ phoneNumber: phone });

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "User registered successfully!", true)
        );
})

const loginUser = ApiHandler(async (req, res) => {

    try {

        const { phone, password } = req.body;

        if (!phone) {
            return res
                .status(400)
                .json(
                    new ApiError(400, {}, "Phone is required for user!")
                )
        }

        if (!password) {
            return res
                .status(400)
                .json(
                    new ApiError(400, {}, "Password is required for user!")
                )
        }

        const existingUser = await User.findOne({ phone: phone });

        if (!existingUser || !existingUser.isVerified) {
            return res
                .status(404)
                .json(
                    new ApiError(404, {}, "Phone is not registered!")
                )
        }

        const passwordVerification = await bcrypt.compare(password, existingUser.password);

        if (!passwordVerification) {
            return res
                .status(401)
                .json(
                    new ApiError(401, {}, "Invalid phone or password!")
                )
        }

        const loginToken = await jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET_KEY);

        const options = {
            httpOnly: true,
            secure: true,
        };

        return res
            .status(200)
            .cookie("loginToken", loginToken, options)
            .json(
                new ApiResponse(200, { loginToken }, "Logged in successfully!", true)
            )

    } catch (error) {
        return res
            .status(500)
            .json(
                new ApiError(500, {}, error?.message)
            )
    }

})

const logoutUser = ApiHandler(async (req, res) => {
    return res
        .status(200)
        .clearCookie("loginToken")
        .json(
            new ApiResponse(200, {}, "User logged out successfully!", true)
        )
})

const getUserProfile = ApiHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            new ApiResponse(200, req.user, "", true)
        )
})

const updateUserProfile = ApiHandler(async (req, res) => {

    const { name, email, gender, dob, location } = req.body;

    if ([name, email, gender, dob, location].some(x => !x)) {
        return res
            .status(400)
            .json(
                new ApiError(400, {}, `Fill all basic details.`)
            )
    }

    try {
        const updatedUser = await User.findByIdAndUpdate({ _id: req.user._id },
            {
                name, email, gender, dob, location
            }
        )

        return res
            .status(200)
            .json(
                new ApiResponse(200, updatedUser, "Basic details has been updated successfully!", true)
            )
    } catch (error) {
        return res
            .status(500)
            .json(
                new ApiError(500, {}, error?.message)
            )
    }
})

const userProfilePhoto = ApiHandler(async (req, res) => {
    if (!req.file) {
        return res
            .status(404)
            .json(
                new ApiError(0, {}, "Please add a profile photo.")
            )
    }

    try {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

        if (req.user?.photoUrl) {
            const filteredUrl = req.user.photoUrl.replace("https://res.cloudinary.com/mahatmaji-storage/image/upload/", "").split(".")[0].split("/").slice(1).join("/");
            storageBucket.uploader
                .destroy(filteredUrl, { resource_type: 'image' })
                .then(result => console.log(result))
        }

        const uploadedFile = await storageBucket.uploader.upload(
            dataURI,
            {
                folder: "adaan_assignment/profile"
            },
            async function (err, result) {
                if (err) return null;
                return result;
            }
        );

        if (!uploadedFile) {
            return res
                .status(404)
                .json(
                    new ApiError(0, {}, "Photo is not uploaded.")
                )
        }

        const data = await User.findByIdAndUpdate({ _id: req.user._id }, { photoUrl: uploadedFile.secure_url }, { new: true });

        return res
            .status(200)
            .json(
                new ApiResponse(200, { photoUrl: data.photoUrl }, "Photo is uploaded successfully!", true)
            )

    } catch (error) {
        return res
            .status(500)
            .json(
                new ApiError(500, {}, error?.message)
            )
    }

});

const changeUserPassword = ApiHandler(async (req, res) => {
    const { password, reTypedPassword } = req.body;
    const passwordRegExp = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    if (!password) {
        return res
            .status(400)
            .json(
                new ApiError(400, {}, "Password is required for user!")
            )
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

    if (password?.toString() !== reTypedPassword?.toString()) {
        return res
            .status(401)
            .json(
                new ApiError(401, {}, "Password does not match!")
            );
    }

    try {
        const hashPassword = await bcrypt.hash(password.toString(), 12);

        const data = await User.findByIdAndUpdate({ _id: req.user._id }, { password: hashPassword, passwordLength: password.length }, { new: true });

        return res
            .status(200)
            .json(
                new ApiResponse(200, { _id: data._id }, "Password changed successfully!", true)
            )

    } catch (error) {
        return res
            .status(500)
            .json(
                new ApiError(500, {}, error?.message)
            );
    }
});

const addPastExperience = ApiHandler(async (req, res) => {
    const { company, post, joiningDate, exitDate } = req.body;

    if ([company, post, joiningDate, exitDate].some(x => x === "")) {
        return res
            .status(400)
            .json(
                new ApiError(400, {}, "All fields are required for user.")
            )
    }

    try {
        const experience = await User.findOneAndUpdate({ _id: req.user._id },
            {
                $push: {
                    pastExprience: [
                        {
                            company, post, joiningDate, exitDate
                        }
                    ]
                }
            },
            {
                new: true,
            }
        )
        return res
            .status(201)
            .json(
                new ApiResponse(201, experience.pastExprience, "A new Experience saved successfully!", true)
            )
    } catch (error) {
        return res
            .status(500)
            .json(
                new ApiError(500, {}, error?.message)
            )
    }

});

const updatePastExperience = ApiHandler(async (req, res) => {
    const { id, company, post, joiningDate, exitDate } = req.body;

    if ([company, post, joiningDate, exitDate].some(x => x === "")) {
        return res
            .status(400)
            .json(
                new ApiError(400, {}, "All fields are required for user.")
            )
    }

    try {
        const experience = await User.updateOne({ _id: req.user._id, "pastExprience._id": id },
            {
                $set: {
                    "pastExprience.$": {
                        company, post, joiningDate, exitDate
                    }
                }
            },
            {
                new: true,
            }
        )

        const userExperience = await User.findById({ _id: req.user._id });

        return res
            .status(201)
            .json(
                new ApiResponse(201, userExperience.pastExprience, "Experience updated successfully!", true)
            )
    } catch (error) {
        return res
            .status(500)
            .json(
                new ApiError(500, {}, error?.message)
            )
    }
});

const deletePastExperience = ApiHandler(async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res
            .status(400)
            .json(
                new ApiError(400, {}, "Please enter an ID for deleting experience")
            )
    }

    try {
        const deleteExperience = await User.updateOne({ _id: req.user._id },
            {
                $pull: {
                    pastExprience: {
                        _id: id
                    }
                }
            }
        );

        const userExperience = await User.findById({ _id: req.user._id });

        return res
            .status(200)
            .json(
                new ApiResponse(200, userExperience.pastExprience, "Experience deleted successfully!", true)
            )
    } catch (error) {
        return res
            .status(500)
            .json(
                new ApiError(500, {}, error?.message)
            )
    }
});

const addSkill = ApiHandler(async (req, res) => {
    const { skill } = req.body;

    if (!skill) {
        return res
            .status(400)
            .json(
                new ApiError(400, {}, "Please, enter anyone skill.")
            )
    }

    try {
        const addedSkill = await User.findByIdAndUpdate({ _id: req.user._id },
            {
                $push: {
                    skillSet: [
                        {
                            skill
                        }
                    ]
                }
            },
            {
                new: true
            }
        )

        return res
            .status(201)
            .json(
                new ApiResponse(201, addedSkill.skillSet, "A new Experience saved successfully!", true)
            )
    } catch (error) {
        return res
            .status(500)
            .json(
                new ApiError(500, {}, error?.message)
            )
    }
});

const deleteSkill = ApiHandler(async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res
            .status(400)
            .json(
                new ApiError(400, {}, "Please enter an ID for deleting experience")
            )
    }

    try {
        const deleteSkill = await User.updateOne({ _id: req.user._id },
            {
                $pull: {
                    skillSet: {
                        _id: id
                    }
                }
            }
        );

        const userSkills = await User.findById({ _id: req.user._id });

        return res
            .status(200)
            .json(
                new ApiResponse(200, userSkills.skillSet, "Skill deleted successfully!", true)
            )
    } catch (error) {
        return res
            .status(500)
            .json(
                new ApiError(500, {}, error?.message)
            )
    }
});

const addUserQualification = ApiHandler(async (req, res) => {
    const {
        board,
        stream,
        passingYear,
        marks,
    } = req.body;


    if ([board,
        stream,
        passingYear,
        marks].some(x => x === "")) {
        return res
            .status(400)
            .json(
                new ApiError(400, {}, "All fields are required for user.")
            )
    }

    try {
        const userEduQualification = await User.findOneAndUpdate({ _id: req.user._id },
            {
                $push: {
                    educationQualification: [
                        {
                            board,
                            stream,
                            passingYear,
                            marks,
                        }
                    ]
                }
            },
            {
                new: true,
            }
        )
        return res
            .status(201)
            .json(
                new ApiResponse(201, userEduQualification.educationQualification, "A new Education Qualification saved successfully!", true)
            )
    } catch (error) {
        return res
            .status(500)
            .json(
                new ApiError(500, {}, error?.message)
            )
    }
});

const updateUserQualification = ApiHandler(async (req, res) => {
    const { id,
        board,
        stream,
        passingYear,
        marks, } = req.body;

    if ([board,
        stream,
        passingYear,
        marks,].some(x => x === "")) {
        return res
            .status(400)
            .json(
                new ApiError(400, {}, "All fields are required for user.")
            )
    }

    try {
        const qualifications = await User.updateOne({ _id: req.user._id, "educationQualification._id": id },
            {
                $set: {
                    "educationQualification.$": {
                        board,
                        stream,
                        passingYear,
                        marks
                    }
                }
            },
            {
                new: true,
            }
        );

        console.log(qualifications);

        const userEducationQualification = await User.findById({ _id: req.user._id });

        return res
            .status(201)
            .json(
                new ApiResponse(201, userEducationQualification.educationQualification, "Education Qualification updated successfully!", true)
            )
    } catch (error) {
        return res
            .status(500)
            .json(
                new ApiError(500, {}, error?.message)
            )
    }
});

const deleteUserQualification = ApiHandler(async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res
            .status(400)
            .json(
                new ApiError(400, {}, "Please enter an ID for deleting education qualification")
            )
    }

    try {
        const deleteQualification = await User.updateOne({ _id: req.user._id },
            {
                $pull: {
                    educationQualification: {
                        _id: id
                    }
                }
            }
        );

        const userQualifications = await User.findById({ _id: req.user._id });

        return res
            .status(200)
            .json(
                new ApiResponse(200, userQualifications.educationQualification, "Education Qualification deleted successfully!", true)
            )
    } catch (error) {
        return res
            .status(500)
            .json(
                new ApiError(500, {}, error?.message)
            )
    }
});

module.exports = {
    registerUser,
    verifyRegisteringUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    userProfilePhoto,
    changeUserPassword,
    addPastExperience,
    updatePastExperience,
    deletePastExperience,
    addSkill,
    deleteSkill,
    addUserQualification,
    updateUserQualification,
    deleteUserQualification,
};