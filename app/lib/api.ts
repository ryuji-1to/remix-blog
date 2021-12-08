import { PrismaClient } from '@prisma/client';

type Payload = {
  author: string;
  title: string;
  content: string;
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    return setTimeout(resolve, ms);
  });
};

export const createArticle = async (payload: Payload) => {
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

export const isString = (data: unknown): data is string => {
  if (typeof data === 'string') {
    if (!data.trim()) return false;

    return true;
  } else {
    return false;
  }
};

export const deleteArticle = async (id: string) => {
  const prisma = new PrismaClient();
  try {
    await prisma.article.delete({
      where: {
        id: Number(id),
      },
    });
    await prisma.$disconnect();

    return { status: 'success' };
  } catch {
    await prisma.$disconnect();

    return { status: 'error' };
  }
};
