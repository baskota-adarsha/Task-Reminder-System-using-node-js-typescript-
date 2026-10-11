import passport from "../config/passport";
export const auth = passport.authenticate("jwt", { session: false });
