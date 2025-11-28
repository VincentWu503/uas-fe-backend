const bcrypt = require('bcrypt');
const passport = require('../middlewares/passport');

async function hashPassword(password) {
  const saltRounds = 16;

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });

  return hashedPassword;
}

async function checkDbHash(plainPassword, hashedPassword) {
  try {
    console.log("Comparing pw:", plainPassword);
    console.log("with hash:", hashedPassword);

    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    console.log("Comparison result:", isMatch);

    return isMatch;
  } catch (err) {
    console.error("Error comparing password:", err);
    return false;
  }
  // console.log(plainPassword);
  // console.log(hashedPassword);
  // return bcrypt.compareSync(plainPassword, hashedPassword);
}

module.exports = {
  hashPassword,
  checkDbHash,
};