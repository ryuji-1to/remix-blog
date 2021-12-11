import type { Article } from '@prisma/client';
import type {
  ErrorBoundaryComponent,
  LoaderFunction,
  MetaFunction,
} from 'remix';
import { Link, useCatch, useLoaderData, useTransition } from 'remix';

import { ErrorMessage } from '~/components/ErrorMessage';
import { prisma } from '~/db.server';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const searchParam = url.searchParams.get('search');
  if (searchParam === null) return null;
  if (typeof searchParam === 'string' && searchParam.trim()) {
    try {
      const data = await prisma.article.findMany({
        where: {
          title: {
            contains: searchParam.trim(),
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
  await prisma.$disconnect();
  throw new Response('Search query is empty', {
    status: 400,
  });
};

export const meta: MetaFunction = ({ data }: { data: Article[] }) => {
  if (!data)
    return {
      title: 'Search route',
      description: 'Search route',
    };

  return {
    title: `Search: ${data.length} results`,
    description: 'Search results',
  };
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
                  <Link
                    to={`/articles/${article.id}`}
                    className="no-underline hover:underline"
                  >
                    {article.title}
                  </Link>
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
        <p className="text-xl font-bold text-red-400">{caught.data}😭</p>
      </div>
    );
  }
  throw Error('unhandled error');
};
