import { PrismaClient } from '@prisma/client';
import type { ActionFunction, LoaderFunction } from 'remix';
import {
  Form,
  json,
  redirect,
  useActionData,
  useLoaderData,
  useTransition,
} from 'remix';

import { MainLayout } from '~/layouts/MainLayout';
import { editArticle, isString, sleep } from '~/lib';

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

    return json('Article not found', 404);
  }

  if (isString(title) && isString(author) && isString(content)) {
    await sleep(1000);
    const result = await editArticle(Number(params.slugId), {
      title,
      author,
      content,
    });

    if (result.status === 'success') {
      return redirect(`/articles/${params.slugId}`);
    } else {
      return json('Error editing article', 500);
    }
  }

  return json('Invalid form data', 400);
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
  const transition = useTransition();
  const actionData = useActionData();

  return (
    <MainLayout>
      {actionData && <p className="text-red-500">{actionData}</p>}
      <Form method="post" className="flex flex-col space-y-3">
        <input
          type="text"
          defaultValue={data?.author}
          className="p-2 border border-green-200 rounded-md"
          name="author"
          required
        />
        <input
          type="text"
          defaultValue={data?.title}
          className="p-2 border border-green-200 rounded-md"
          name="title"
          required
        />
        <textarea
          defaultValue={data?.content}
          className="p-2 border border-green-200 rounded-md"
          name="content"
          required
        />
        <button
          className="px-4 py-2 text-white bg-green-500 rounded-md"
          style={{ width: 'fit-content' }}
          disabled={!!transition.submission}
        >
          {transition.submission ? 'Saving...' : 'Edit'}
        </button>
      </Form>
    </MainLayout>
  );
}
