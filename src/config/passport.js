import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {
  createUser,
  findUserByEmail,
  findUserByGoogleId,
  findUserById,
  validatePassword
} from "../models/user.js";

passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await findUserByEmail(email);
      if (!user) return done(null, false, { message: 'User with this email does not exist' });
      const valid = await validatePassword(user, password);
      if (!valid) return done(null, false, { message: 'Incorrect password' });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await findUserByGoogleId(profile.id);

    if (!user && profile.emails && profile.emails.length > 0) {
      user = await findUserByEmail(profile.emails[0].value);
      if (user && !user.googleId) {
        user.googleId = profile.id;
        await user.save();
      }
    }

    if (!user) {
      user = await createUser({
        email: profile.emails[0].value,
        password: null,
        googleId: profile.id
      });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserById(id);
    if (user) done(null, user);
    else done(null, false);
  } catch (err) {
    done(err);
  }
});