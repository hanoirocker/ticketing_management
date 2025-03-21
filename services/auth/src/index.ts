import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// If any not defined route is trying to be called, we raise an specific Error for it.
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

// Initialize errorHandler middleware. Basically, if any 'throw new <error_class>' is
// used on any of the request files, the middleware will processed this error classes and
// return a structured and solid message to the client (React app)
app.use(errorHandler);

app.listen(3000, () => {
  console.log('Auth service Listening on port 3000');
});
