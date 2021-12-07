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
  try {
    await prisma.article.create({
      data: {
        ...payload,
      },
    });
    await prisma.$disconnect();

    return { status: 'success' };
  } catch {
    await prisma.$disconnect();

    return { status: 'error' };
  }
};

export const editArticle = async (id: number, payload: Payload) => {
  const prisma = new PrismaClient();
  try {
    await prisma.article.update({
      where: {
        id: id,
      },
      data: {
        ...payload,
      },
    });
    await prisma.$disconnect();

    return { status: 'success' };
  } catch {
    await prisma.$disconnect();

    return { status: 'error' };
  }
};
