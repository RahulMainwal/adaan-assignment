const multer = require("multer");

const uploadPhoto = multer({
    limits: 800000,
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        const allowedFileType = ["jpg", "jpeg", "png"];
        if (allowedFileType.includes(file.mimetype.split("/")[1])) {
            cb(null, true)
        } else {
            cb(null, false)
        }
    }
})
module.exports = uploadPhoto;