import express from 'express';
import { log } from 'console';
import jwt from 'jsonwebtoken';
import prisma from './../db/index.js';
import 'dotenv/config';

const router = express.Router();

// register and send token
router.post('/register', async (req, res) => {
  try {
    log('i am here!')
    const user = await prisma.users.create({
      data: {
        username: req.body.username,
        password: req.body.password
      }
    })
    const token = jwt.sign({id: user.id}, process.env.SECRETKEY);
    res.status(201).send({token});
  } catch(err) {
    log(err);
  }
})

// login and send token
router.post('/login', async (req, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        username: req.body.username,
        password: req.body.password
      }
    })
    if (!user) res.status(401).send('Invalid username or password.');
    const token = jwt.sign({id: user.id}, process.env.SECRETKEY);
    res.send({token});
  } catch(err) {
    log(err);
  }
})

export {router}