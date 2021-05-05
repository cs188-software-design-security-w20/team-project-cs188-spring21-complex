const bcrypt = require('bcrypt');

//Specify number of times the hashing algorithm takes place
const saltRounds = 10;

//Generate a new password with the plaintext as input
const generateHash = (plaintextPassword) => {
    bcrypt.genSalt(saltRounds,function(err,salt) {
        if (err) {
            return false;
        }
        bcrypt.hash(plaintextPassword, salt, function(hashErr, hash) {
            if (hashErr) {
                return false;
            }
            console.log(hash);
        });
    });
}

const comparePasswords = (plaintextPassword,hashedPassword) => {
    bcrypt.compare(plaintextPassword, hashedPassword, function(err,result) {
        if (err) {
            console.log('Error comparing the passwords.');
            return false
        }
        console.log(result);
    });
};


exports.generateHash = generateHash;
exports.comparePasswords = comparePasswords;



