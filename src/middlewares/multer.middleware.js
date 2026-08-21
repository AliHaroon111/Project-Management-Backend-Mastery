import multer from "multer";

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, `./public/images`) // `./public/images` is the destination
    },
    filename: function(req, file, cb){
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});

export const upload = multer({
    storage,
    limits: {
        fileSize: 1 * 1000 * 1000 // appprox=1MB
    }
})