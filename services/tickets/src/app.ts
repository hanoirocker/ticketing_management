import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from '@hanoiorg/ticketing_common';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes';

const app = express();
app.set('trust proxy', true); // trust proxy (since we're using ingress-nginx)
app.use(json());
app.use(
  cookieSession({
    signed: false, // don't encrypt the cookie
    secure: process.env.NODE_ENV !== 'test', // only use secure cookies in production!! if test env, use http (secure = false)
  })
);
app.use(currentUser);

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);

// If any not defined route is trying to be called, we raise an specific Error for it.
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

// Initialize errorHandler middleware. Basically, if any 'throw new <error_class>' is
// used on any of the request files, the middleware will processed this error classes and
// return a structured and solid message to the client (React app)
app.use(errorHandler);

export { app };
