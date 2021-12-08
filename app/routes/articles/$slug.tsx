import type { Article } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import type {
  ActionFunction,
  ErrorBoundaryComponent,
  LoaderFunction,
  MetaFunction,
} from 'remix';
import {
  Form,
  Link,
  redirect,
  useCatch,
  useLoaderData,
  useParams,
} from 'remix';

import { ErrorMessage } from '~/components/ErrorMessage';
import { MainLayout } from '~/layouts/MainLayout';

export const action: ActionFunction = async ({ params }) => {
  const prisma = new PrismaClient();
  try {
    await prisma.article.delete({
      where: { id: Number(params.slug) },
    });
    await prisma.$disconnect();

    return redirect('/');
  } catch {
    throw Error('Failed to delete article');
  }
};

export const loader: LoaderFunction = async ({ params }) => {
  const prisma = new PrismaClient();
  const { slug } = params;
  const article = await prisma.article.findUnique({
    where: { id: Number(slug) },
  });
  await prisma.$disconnect();
  if (!article) {
    throw new Response('could not find the article', {
      status: 404,
    });
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
        <button
          type="submit"
          className="p-2 mr-2 font-bold text-white bg-red-500 border border-red-500 rounded-md hover:bg-white hover:text-red-500"
        >
          Delete
        </button>
        <Link to="./edit">
          <button
            type="button"
            className="p-2 font-bold text-white bg-blue-500 border border-blue-500 rounded-md hover:bg-white hover:text-blue-500"
          >
            Edit
          </button>
        </Link>
      </Form>
    </MainLayout>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <MainLayout>
      <ErrorMessage error={error?.message} />
    </MainLayout>
  );
};

export const CatchBoundary = () => {
  const caught = useCatch();
  const params = useParams();
  if (caught.status === 404) {
    return (
      <MainLayout>
        <p className="text-lg font-bold text-red-400">
          404 Article {params.slug} is not found!!!
        </p>
      </MainLayout>
    );
  }
  throw Error('Unknown error');
};
