import { prisma } from '~/db.server';

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

export const isString = (data: unknown): data is string => {
  if (typeof data === 'string') {
    if (!data.trim()) return false;

    return true;
  } else {
    return false;
  }
};

export const createArticle = async (payload: Payload) => {
  try {
    await prisma.article.create({
      data: {
        ...payload,
      },
    });
    await prisma.$disconnect();
  } catch {
    await prisma.$disconnect();
    throw Error('error');
  }
};

export const editArticle = async (id: number, payload: Payload) => {
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
  } catch {
    await prisma.$disconnect();

    throw Error('error occurred');
  }
};

export const deleteArticle = async (id: string) => {
  try {
    await prisma.article.delete({
      where: {
        id: Number(id),
      },
    });
    await prisma.$disconnect();
  } catch {
    await prisma.$disconnect();

    throw Error('Error deleting article');
  }
};

export const getAllArticles = async () => {
  try {
    const articles = await prisma.article.findMany();
    await prisma.$disconnect();

    return articles;
  } catch {
    await prisma.$disconnect();
    throw new Error('error');
  }
};

export const getArticleById = async (id: string) => {
  const article = await prisma.article.findUnique({
    where: {
      id: Number(id),
    },
  });
  await prisma.$disconnect();
  if (!article) throw new Response('Article not found', { status: 404 });

  return article;
};
