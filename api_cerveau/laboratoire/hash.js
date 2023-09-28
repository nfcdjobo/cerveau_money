const bcrypt = require("bcrypt");
const  hash_password = password => bcrypt.hash(password, 10);
const verify_password = (password, hashing) => bcrypt.compare(password, hashing);
module.exports = {hash_password, verify_password};

