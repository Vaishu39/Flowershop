const multer = require('multer'); //Middleware for handling file uploads.
const path = require('path'); //Provides utilities for working with file and directory paths.


var storage = multer.diskStorage({ //Defines where uploaded files are stored (uploads/ folder).
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) { //Generates a unique filename using the current timestamp
        let ext = path.extname(file.originalname)
        cb(null, Date.now() + ext) // preserves the original file extension.
    }
})

var upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) { //Ensures only PNG, JPG, and JPEG file types are allowed.
        if (
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg"
        ) {
            callback(null, true)
        } else {
            console.log('only jpg ,png, & jpeg file supported!')
            callback(null, false)
        }
    },
})

module.exports = upload