const bcrypt = require('bcrypt');

//Specify number of times the hashing algorithm takes place
const SALTROUNDS = 10;

//Generate a new password with the plaintext as input
const generateHash = async (plaintextPassword) => {
    // bcrypt.genSalt(saltRounds, function(err,salt) {
    //     if (err) {
    //         return false;
    //     }
    //     bcrypt.hash(plaintextPassword, salt, function(hashErr, hash) {
    //         if (hashErr) {
    //             return false;
    //         }
    //         console.log(hash);
    //     });
    // });
    const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(plaintextPassword, SALTROUNDS, function(err, hash) {
            if (err) {
                reject(err);
            }
            resolve(hash);
        }
    )});

    return hashedPassword;

};

const comparePasswords = (plaintextPassword,hashedPassword) => {
    bcrypt.compare(plaintextPassword, hashedPassword, function(err,result) {
        if (err) {
            console.log('Error comparing the passwords.');
            return false;
        }
        console.log(result);
    });
};

let test = async () => {
    let hash = await generateHash('hello');
    console.log(hash);
};

test();

exports.generateHash = generateHash;
exports.comparePasswords = comparePasswords;



