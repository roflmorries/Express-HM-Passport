import express, { urlencoded } from 'express';
import session from 'express-session';
import 'dotenv/config';
import passport from 'passport';

const app = express();

const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60
  }
}

app.use(express.json());
app.use(urlencoded({ extended: false }));
app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session())

app.use('/auth', );
app.use('/');

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
