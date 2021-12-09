import type { Article } from '@prisma/client';
import type {
  ActionFunction,
  ErrorBoundaryComponent,
  LoaderFunction,
} from 'remix';
import { Form, redirect, useCatch, useLoaderData, useParams } from 'remix';

import { ErrorMessage } from '~/components/ErrorMessage';
import { deleteArticle, getArticleById } from '~/lib';

export const action: ActionFunction = async ({ params }) => {
  if (typeof params.slug === 'undefined') {
    throw Error('No slug provided');
  }
  await deleteArticle(params.slug);

  return redirect('/admin/articles');
};

export const loader: LoaderFunction = async ({ params }) => {
  if (typeof params.slug === 'undefined') {
    throw new Response('Invalid slug', { status: 404 });
  }
  const article = await getArticleById(params.slug);

  return article;
};

export default function AdminSlugRoute() {
  const data = useLoaderData<Article>();

  return (
    <article className="prose">
      <h2>{data?.title}</h2>
      <p>{data?.content}</p>
      <p>author 👉 {data.author}</p>
      <Form method="delete">
        <button type="submit" className="font-bold text-red-500 ">
          Delete
        </button>
      </Form>
    </article>
  );
}

export const CatchBoundary = () => {
  const caught = useCatch();
  const params = useParams();
  if (caught.status === 404) {
    return <p>article {params.slug} is not found</p>;
  }
  throw Error('Unexpected error');
};

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return <ErrorMessage error={error.message} />;
};
