import prisma from './index.js';
import { faker } from '@faker-js/faker';
import { log } from 'console';

const seed = async () => {
  log('seeding database...');
  try {
    const {count} = await prisma.users.createMany({
      data: [
        {
          username: faker.internet.userName(),
          password: faker.internet.password()
        },
        {
          username: faker.internet.userName(),
          password: faker.internet.password()
        },
        {
          username: faker.internet.userName(),
          password: faker.internet.password()
        }
      ]
    })
    log('created users...')
    for (let i=1; i<=count; i++) {
      await prisma.robots.createMany({
        data: [
          {
            name: faker.animal.cow(),
            color: faker.color.human(),
            userid: i
          },
          {
            name: faker.animal.cow(),
            color: faker.color.human(),
            userid: i
          },
          {
            name: faker.animal.cow(),
            color: faker.color.human(),
            userid: i
          }
        ]
      })
    }
    log('created robots...')
    log('database seeded!');
  } catch(err) {
    log(err);
  }
}

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async e => {log(e); await prisma.$disconnect(); process.exit(1)})