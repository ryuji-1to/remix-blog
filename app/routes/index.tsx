import type { Article } from '@prisma/client';
import type {
  ErrorBoundaryComponent,
  LoaderFunction,
  MetaFunction,
} from 'remix';
import { Link, useLoaderData } from 'remix';

import { ErrorMessage } from '~/components/ErrorMessage';
import { PageLinkButton } from '~/components/PageLinkButton';
import { prisma } from '~/db.server';
import { MainLayout } from '~/layouts/MainLayout';

export const loader: LoaderFunction = async () => {
  try {
    const articles = await prisma.article.findMany();
    await prisma.$disconnect();

    return articles;
  } catch (error) {
    throw Error('failed to load articles');
  }
};

export const meta: MetaFunction = () => {
  return {
    title: 'Home',
    description: 'This is home route',
  };
};

export default function IndexRoute() {
  const data = useLoaderData<Article[]>();

  return (
    <MainLayout
      rightElement={
        <div className="flex space-x-2">
          <PageLinkButton to="/search" label="Search" className="bg-gray-500" />
          <PageLinkButton to="/new" label="New Post" />
        </div>
      }
    >
      <nav>
        <h1 className="mb-2 text-xl font-bold">📚Articles</h1>
        <ul className="flex flex-col space-y-2">
          {data?.map((article: Article) => {
            return (
              <li key={article.id} className="w-fit">
                <Link to={`/articles/${article.id}`} className="line-clamp-1">
                  👉{' '}
                  <span className="text-lg hover:underline">
                    {article.title}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
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
