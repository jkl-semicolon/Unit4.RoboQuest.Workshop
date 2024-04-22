import { PrismaClient } from '@prisma/client';
import { log } from 'console';

const prisma = new PrismaClient({
  log: [
    {
      level: 'query',
      emit: 'event'
    },
    'info'
  ]
})
prisma.$on('query', e => log(e));

export default prisma;