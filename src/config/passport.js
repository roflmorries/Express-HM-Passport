import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { createUser, findUserByEmail, findUserByGoogleId, findUserById, validatePassword } from "../models/user.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { getDB } from "./db.js";

passport.use(new LocalStrategy(
  {usernameField: 'email'},
  async (email, password, done) => {
    console.log(`User email: ${email}`);
    console.log(`User password: ${password}`);
    const user = await findUserByEmail(email);
    if (!user) return done(null, false, { message: 'User with this email doesnt exists' });
    const valid = await validatePassword(user, password);
    if (!valid) return done(null, false, { message: 'Incorrect password' });
    return done(null, user)
  }
));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  let user = await findUserByGoogleId(profile.id);

  if (!user && profile.emails && profile.emails.length > 0) {
    user = await findUserByEmail(profile.emails[0].value);
    if (user && !user.googleId) {
      const db = getDB();
      await db.collection('users').updateOne(
        { _id: user._id }, { $set: { googleId: profile.id } }
      )
      user.googleId = profile.id;
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
}));

passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});

passport.deserializeUser(async (id, done) => {
  const user = await findUserById(id);
  if (user) done(null, user);
  else done(null, false);
})