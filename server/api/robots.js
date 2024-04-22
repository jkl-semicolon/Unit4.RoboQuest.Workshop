import express from 'express';
import { log } from 'console';
import prisma from './../db/index.js';
import { Prisma } from '@prisma/client';

const router = express.Router();

// get all robots
router.get('/', async (_, res) => {
  try {
    const robots = await prisma.robots.findMany();
    res.send(robots);
  } catch(err) {
    log(err);
  }
})

// get robot by id
router.get('/:id', async (req, res) => {
  try {
    const robot = await prisma.robots.findUnique({
      where: {id: req.params.id*1}
    })
    if (!robot) res.status(404).send('Robot not found.');
    res.send(robot);
  } catch(err) {
    log(err);
  }
})

// require login past this point
router.use((req, res, next) => {
  if (!req.user) res.status(401).send('You must be logged in to do that.');
  next();
})

// create new robot
router.post('/', async (req, res) => {
  try {
    const robot = await prisma.robots.create({
      data: {
        name: req.body.name,
        color: req.body.color,
        userid: req.user.id
      }
    })
    res.status(201).send(robot);
  } catch(err) {
    log(err);
  }
})

// update your own robots
router.put('/:id', myFunc(), async (req, res) => {
  try {
    const robot = await prisma.robots.update({
      data: {
        name: req.body.name,
        color: req.body.color
      },
      where: {
        id: req.params.id*1,
        userid: req.user.id
      }
    })
    res.send(robot);
  } catch(err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2025') res.status(401).send('Robot not found. / You can only update your own robots.')
    }
    log(err);
  }
})

// delete your own robots
router.delete('/:id', async (req, res) => {
  try {
    const robot = await prisma.robots.delete({
      where: {
        id: req.params.id*1,
        userid: req.user.id
      }
    })
    res.send(robot);
  } catch(err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2025') res.status(401).send('Robot not found. / You can only delete your own robots.')
    }
    log(err);
  }
})

export {router}