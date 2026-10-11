import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { User } from "../models";
passport.use(
  "jwt",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET!,
    },
    async (payload, done) => {
      try {
        const user = await User.findByPk(payload.id);
        return done(null, user ?? false);
      } catch (error) {
        return done(error, false);
      }
    },
  ),
);
export default passport;
