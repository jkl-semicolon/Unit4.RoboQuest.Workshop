import express from 'express';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import { log } from 'console';
import 'dotenv/config';
import {router as usersRouter} from './auth/auth.js';
import {router as robotsRouter} from './api/robots.js';
import bcrypt from 'bcrypt';

const server = express();
const PORT = process.env.PORT || 3000;

// middleware
server.use(morgan('dev'));
server.use(express.json());
server.use((req, _, next) => {
  log('----------------------------');
  log('----- LOGGING REQ BODY -----');
  log('----------------------------');
  log(req.body);
  log('----------------------------');
  log('--- END LOGGING REQ BODY ---');
  log('----------------------------');
  next();
})

// register & login route
server.use('/auth', usersRouter);

// check for token and attach user if token
server.use((req, _, next) => {
  const auth = req.headers.authorization;
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
  try {
    req.user = jwt.verify(token, process.env.SECRETKEY);
  } catch {
    req.user = null;
  }
  next();
})

// robots route
server.use('/api/v1/robots', robotsRouter);

server.listen(PORT, () => log('Listening on port ' + PORT + ', over.'));