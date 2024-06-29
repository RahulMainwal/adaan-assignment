const { Schema, default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        max: 30,
        min: 3,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: Number,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        max: 20,
        min: 6,
        trim: true,
    },
    passwordLength: {
        type: Number,
        required: true,
        trim: true,
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false,
    },
    photoUrl: {
        type: String,
        default: null,
        trim: true,
    },
    pastExprience: [
        {
            company: {
                type: String,
                trim: true,
            },
            post: {
                type: String,
                trim: true,
            },
            joiningDate: {
                type: String,
                trim: true,
            },
            exitDate: {
                type: String,
                trim: true,
            }
        }
    ],
    skillSet: [
        {
            skill: {
                type: String,
                trim: true,
            }
        }
    ],
    educationQualification: [
        {
            board: {
                type: String,
                trim: true,
            },
            stream: {
                type: String,
                trim: true,
            },
            passingYear: {
                type: Number,
                trim: true,
            },
            marks: {
                type: String,
                trim: true,
            }
        }
    ],
    dob: {
        type: String,
        trim: true,
        default: null,
    },
    gender: {
        type: String,
        trim: true,
        default: null,
    },
    location: {
        type: String,
        trim: true,
        default: null,
    }
},
    {
        timestamps: true,
    });


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("users", userSchema);

module.exports = User;