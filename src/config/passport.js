const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const { User } = require("../models");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.TOKEN_SECRET;

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await User.findOne({
          where: {
            id: jwt_payload.data.id,
            username: jwt_payload.data.username,
          },
        });

        if (user) {
          return done(null, user);
        }

        return done(null, false);
      } catch (err) {
        done(err, false);
      }
    })
  );
};
