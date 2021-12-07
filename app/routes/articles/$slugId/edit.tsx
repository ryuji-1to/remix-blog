import { PrismaClient } from '@prisma/client';
import type { ActionFunction, LoaderFunction } from 'remix';
import { Form, redirect, useLoaderData } from 'remix';

import { MainLayout } from '~/layouts/MainLayout';

export const action: ActionFunction = async ({ request, params }) => {
  const prisma = new PrismaClient();
  const formData = await request.formData();
  const title = formData.get('title');
  const author = formData.get('author');
  const content = formData.get('content');

  const article = await prisma.article.findUnique({
    where: {
      id: Number(params.slugId),
    },
  });
  if (!article) {
    await prisma.$disconnect();
    throw Error('Article not found');
  }
  if (
    typeof title === 'string' &&
    typeof author === 'string' &&
    typeof content === 'string'
  ) {
    await prisma.article.update({
      where: {
        id: Number(params.slugId),
      },
      data: {},
    });
  }

  await prisma.$disconnect();

  return redirect(`/articles/${params.slugId}`);
};

export const loader: LoaderFunction = async ({ params }) => {
  const prisma = new PrismaClient();
  const article = await prisma.article.findUnique({
    where: {
      id: Number(params.slugId),
    },
  });
  await prisma.$disconnect();
  if (!article) {
    throw new Error('Article not found');
  }

  return article;
};

export default function Edit() {
  const data = useLoaderData();

  return (
    <MainLayout>
      <Form method="post" className="flex flex-col space-y-2">
        <input
          type="text"
          defaultValue={data?.author}
          className="border"
          name="author"
        />
        <input
          type="text"
          defaultValue={data?.title}
          className="border"
          name="title"
        />
        <textarea
          defaultValue={data?.content}
          className="border"
          name="content"
        />
        <button className="border">Edit</button>
      </Form>
    </MainLayout>
  );
}
