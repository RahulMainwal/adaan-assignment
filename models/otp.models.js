const { Schema, default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");

const otpSchema = new Schema({
    phoneNumber: {
        type: Number,
        required: true,
    },
    phoneOtp: {
        type: String,
        required: true,
    },
    phoneOtpExpiredAt: {
        type: Number,
        required: true,
    }
},
    {
        timestamps: true,
    });

const OneTimePassword = mongoose.model("otps", otpSchema);

module.exports = OneTimePassword;