import type { Article } from '@prisma/client';
import type { ErrorBoundaryComponent, LoaderFunction } from 'remix';
import { Link, useCatch, useLoaderData, useTransition } from 'remix';

import { ErrorMessage } from '~/components/ErrorMessage';
import { prisma } from '~/db.server';
import { sleep } from '~/lib';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const searchParam = url.searchParams.get('search');
  if (searchParam === null) return null;
  if (typeof searchParam === 'string') {
    try {
      await sleep(1000);
      const data = await prisma.article.findMany({
        where: {
          title: {
            contains: searchParam,
          },
        },
      });
      await prisma.$disconnect();

      return data;
    } catch {
      await prisma.$disconnect();
      throw Error('unhandled error');
    }
  }
};

export default function SearchIndex() {
  const data = useLoaderData<Article[]>();
  const transition = useTransition();

  return (
    <div>
      <section className="prose">
        <h2>Search Results</h2>
        <ul>
          {transition.submission ? (
            <p>Searching...</p>
          ) : data && !data.length ? (
            <p>No results</p>
          ) : (
            data?.map((article) => {
              return (
                <li key={article.id}>
                  <Link to={`/articles/${article.id}`}>{article.title}</Link>
                </li>
              );
            })
          )}
        </ul>
      </section>
    </div>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return <ErrorMessage error={error.message} />;
};

export const CatchBoundary = () => {
  const caught = useCatch();
  if (caught.status === 400) {
    return (
      <div>
        <p>caught error!!!</p>
      </div>
    );
  }
  throw Error('unhandled error');
};
