const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const usersModel = require("../models/users_model.js");
require("dotenv").config();

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
      },
      async (payload, done) => {
        try {
          // console.log(payload)
          const user = await usersModel.findUserPayloadById(payload.id);
          // console.log('user at passport', user)
          return done(null, user || false);
        } catch (err) {
          //console.log(err);
          return done(err, false);
        }
      }
    )
  );
};
