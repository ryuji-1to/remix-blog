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

export const action: ActionFunction = async ({ params }) => {
  const prisma = new PrismaClient();
  try {
    await prisma.article.delete({
      where: { id: Number(params.slug) },
    });
    await prisma.$disconnect();

    return redirect('/');
  } catch {
    await prisma.$disconnect();
    throw Error('Failed to delete article');
  }
};

export const loader: LoaderFunction = async ({ params }) => {
  const prisma = new PrismaClient();
  const article = await prisma.article.findUnique({
    where: { id: Number(params.slug) },
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
  const data = useLoaderData<Article>();

  return (
    <>
      <article className="flex flex-col mb-4 space-y-4 prose">
        <h1>{data?.title}</h1>
        <p className="text-xl">{data?.content}</p>
        <p>author 👉 {data?.author}</p>
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
    </>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return <ErrorMessage error={error?.message} />;
};

export const CatchBoundary = () => {
  const caught = useCatch();
  const params = useParams();
  if (caught.status === 404) {
    return (
      <p className="text-lg font-bold text-red-400">
        404 Article {params.slug} is not found!!!
      </p>
    );
  }
  throw Error('Unknown error');
};
