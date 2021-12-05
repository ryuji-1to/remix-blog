import type { Article } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import type { ActionFunction, LoaderFunction, MetaFunction } from 'remix';
import { Form, redirect, useLoaderData } from 'remix';

import { MainLayout } from '../../layouts/MainLayout';

export const action: ActionFunction = async ({ params }) => {
  const prisma = new PrismaClient();
  const deletedArticle = await prisma.article.delete({
    where: { id: Number(params.slug) },
  });
  if (!deletedArticle) {
    throw Error('Article not found');
  }

  return redirect('/');
};

export const loader: LoaderFunction = async ({ params }) => {
  const prisma = new PrismaClient();
  const { slug } = params;
  const article = await prisma.article.findUnique({
    where: { id: Number(slug) },
  });
  if (!article) {
    throw new Error('could not find the article');
  }

  return article;
};

export const meta: MetaFunction = ({ data }: { data: Article | undefined }) => {
  if (!data) {
    return {
      title: 'No slug',
      description: 'No slug found',
    };
  }

  return {
    title: `${data.title}`,
    description: 'This is slug page',
  };
};

export default function SlugRoute() {
  const data = useLoaderData();

  return (
    <MainLayout>
      <article className="flex flex-col mb-4 space-y-4">
        <h1 className="text-xl font-bold">Title : {data?.title}</h1>
        <p>author : {data?.author}</p>
        <p>content : {data?.content}</p>
      </article>
      <Form method="post">
        <button className="p-2 font-bold text-white bg-red-500 border border-red-500 rounded-md hover:bg-white hover:text-red-500">
          Delete this
        </button>
      </Form>
    </MainLayout>
  );
}
