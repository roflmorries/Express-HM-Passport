import express, { urlencoded } from 'express';
import session from 'express-session';
import 'dotenv/config';
import passport from 'passport';
import './config/passport.js'
import authRouter from './routes/authRouter.js';
import protectedRouter from './routes/protectedRouter.js';
import helmet from 'helmet';
import { sessionOptions } from './config/sessionOptions.js';
import { connectDB } from './config/db.js';

const app = express();

app.use(express.json());
app.use(helmet());
app.use(urlencoded({ extended: false }));
app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());

await connectDB();

app.use('/auth', authRouter);
app.use('/protected', protectedRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
