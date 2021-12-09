import type { Article } from '@prisma/client';
import type { LoaderFunction } from 'remix';
import { Link, useLoaderData } from 'remix';

import { getAllArticles } from '~/lib';

export const loader: LoaderFunction = async () => {
  const articles = await getAllArticles();

  return articles;
};

export default function Admin() {
  const data = useLoaderData<Article[]>();

  return (
    <nav className="prose">
      <h2>Articles</h2>
      <ul>
        {data.map((article) => {
          return (
            <li key={article.id}>
              <Link to={`/admin/articles/${article.id}`}>{article.title}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
