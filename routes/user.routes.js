const { Router } = require("express");
const { registerUser, verifyRegisteringUser, loginUser, getUserProfile, updateUserProfile, logoutUser, userProfilePhoto, changeUserPassword, addPastExperience, updatePastExperience, deletePastExperience, addSkill, deleteSkill, addUserQualification, updateUserQualification, deleteUserQualification } = require("../controllers/user.controllers");
const { userDataValidator } = require("../validators/user.validator");
const sendOtpOnPhone = require("../middlewares/sendOtpInPhone");
const authUser = require("../middlewares/authUser");
const uploadPhoto = require("../middlewares/uploadPhoto");

const router = Router();

// Routing for user registration
router.route("/register").post(userDataValidator, sendOtpOnPhone, registerUser);

// Verify user otp for registration
router.route("/regisration/verification").post(verifyRegisteringUser);

// Login user
router.route("/login").post(loginUser);

// Secured route of logout user
router.route("/logout").get(logoutUser);

// Secured route of getting user profile
router.route("/profile").get(authUser, getUserProfile);

// Secured route of updating user profile
router.route("/profile").put(authUser, updateUserProfile)

// Secured route of updating user profile
router.route("/profile/photo").post(authUser, uploadPhoto.single("photo"), userProfilePhoto);

// Secured route of updating user password
router.route("/profile/password").put(authUser, changeUserPassword);

// Secured route of adding user past experience
router.route("/profile/experience").post(authUser, addPastExperience);

// Secured route of updating user past experience
router.route("/profile/experience").put(authUser, updatePastExperience);

// Secured route of deleting user past experience
router.route("/profile/experience/:id").delete(authUser, deletePastExperience);

// Secured route of adding user skill
router.route("/profile/skill").post(authUser, addSkill);

// Secured route of deleting user skill
router.route("/profile/skill/:id").delete(authUser, deleteSkill);

// Secured route of adding user education qualifications
router.route("/profile/eduqualification").post(authUser, addUserQualification);

// Secured route of updating user education qualifications
router.route("/profile/eduqualification").put(authUser, updateUserQualification);

// Secured route of deleting user education qualifications
router.route("/profile/eduqualification/:id").delete(authUser, deleteUserQualification);

const userRouter = router;

module.exports = userRouter;