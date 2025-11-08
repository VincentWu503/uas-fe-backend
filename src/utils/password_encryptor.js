const bcrypt = require('bcrypt');

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
  // console.log(plainPassword);
  // console.log(hashedPassword);
  return bcrypt.compareSync(plainPassword, hashedPassword);
}

module.exports = {
  hashPassword,
  checkDbHash,
};