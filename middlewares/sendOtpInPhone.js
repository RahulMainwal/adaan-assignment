const ApiHandler = require('../utils/ApiHandler');
const otpGenerator = require('otp-generator');
const bcrypt = require("bcrypt");

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const authPhone = process.env.AUTH_PHONE;

const client = require('twilio')(accountSid, authToken);

const sendOtpOnPhone = ApiHandler(async (req, res, next) => {

    try {

        const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        console.log(otp);
        const hashOtp = await bcrypt.hash(otp.toString(), 12);

            const message = await client.messages.create({
                body: `OTP: ${otp}`,
                from: "+19788002544",
                to: `+91${req.body.phone}`
              });
              
              console.log(message.body);

        console.log(`Otp has been sent to ${req.body.phone}`);
        req.otp = hashOtp;
        return next();
    } catch (error) {
        console.log(error);
    }

});

module.exports = sendOtpOnPhone;