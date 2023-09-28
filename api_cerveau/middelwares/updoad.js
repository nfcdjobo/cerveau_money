const multer = require("multer");
const path = require("path");
let traitement = multer.diskStorage({
    destination: function(req, file, cb){
        console.log("1",file);
        const directory = file.fieldname=="logo"?"logo/":(file.fieldname=="profile"?"profile/":"autres/");
        console.log("directory",directory);
        cb(null, "stockage/"+directory);
    },
    filename: function(req, file, cb){
        console.log("2",file);
        const r = al => al.length == 2 ? al[1] : r;
        cb(null, Date.now()+r(Math.random().toString().split('.'))+path.extname(file.originalname));
    }
})

let chargement = multer({
    storage: traitement,
    fileFilter: function(req, file, callback){
        if(file.mimetype === "image/png" || file.mimetype === "image/svg" ||  file.mimetype === "image/jpg"
        || file.mimetype === "image/jpeg" || file.mimetype === "image/webp" || file.mimetype === "image/gif"
        || file.mimetype === "image/avif"){
            console.log("3", file);
            callback(null, true);
        }else{
            console.log("4",req.file);
            callback(null, false);
            console.log("Seule les image d'extention .png, .svg, .jpg, .gif, .webp, .avif et .jpeg sont recommandés.");
        }
    },
    limits:{fileSize:1024*1024*2}
});
module.exports = chargement;


