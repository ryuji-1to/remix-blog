import { PrismaClient } from '@prisma/client';

export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    return setTimeout(resolve, ms);
  });
};

type Payload = {
  author: string;
  title: string;
  content: string;
};

export const createPost = async (payload: Payload) => {
  const prisma = new PrismaClient();
  const article = await prisma.article.create({
    data: {
      ...payload,
    },
  });
  await prisma.$disconnect();

  return article;
};
