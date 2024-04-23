import express from 'express';
import { log } from 'console';
import jwt from 'jsonwebtoken';
import prisma from './../db/index.js';
import 'dotenv/config';
import bcrypt from 'bcrypt';

const router = express.Router();

// register and send token
router.post('/register', async (req, res) => {
  try {
    const user = await prisma.users.create({
      data: {
        username: req.body.username,
        password: await bcrypt.hash(req.body.password, process.env.SALT*1)
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
      }
    })
    if (!user) res.status(401).send('Invalid username or password.');
    const pwMatch = await bcrypt.compare(req.body.password, user.password);
    if (!pwMatch) res.status(401).send('Invalid username or password.');
    const token = jwt.sign({id: user.id}, process.env.SECRETKEY);
    res.send({token});
  } catch(err) {
    log(err);
  }
})

export {router}