import type { Article } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import type {
  ErrorBoundaryComponent,
  LoaderFunction,
  MetaFunction,
} from 'remix';
import { Link, useLoaderData } from 'remix';

import { ErrorMessage } from '~/components/ErrorMessage';
import { PageLinkButton } from '~/components/PageLinkButton';
import { MainLayout } from '~/layouts/MainLayout';

export const loader: LoaderFunction = async () => {
  const prisma = new PrismaClient();
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
    <MainLayout rightElement={<PageLinkButton to="/new" label="New Post" />}>
      <nav>
        <h1 className="mb-2 text-xl font-bold">📚Articles</h1>
        <ul className="flex flex-col space-y-1">
          {data?.map((article: Article) => {
            return (
              <li key={article.id}>
                <Link
                  className="text-lg hover:underline line-clamp-1"
                  to={`/articles/${article.id}`}
                >
                  👉 {article.title}
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
