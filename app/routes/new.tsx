import type { ActionFunction } from 'remix';
import { Form, json, redirect, useActionData, useTransition } from 'remix';

import { MainLayout } from '../layouts/MainLayout';
import { createArticle, isString, sleep } from '../lib/';

export const meta = () => {
  return {
    title: 'New Post',
    description: 'This is new post page',
  };
};

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const title = body.get('title');
  const author = body.get('author');
  const content = body.get('content');

  if (isString(title) && isString(content) && isString(author)) {
    await sleep(2000);
    await createArticle({ title, author, content });

    return redirect('/');
  }

  return json('invalid data!!!', 400);
};

export default function NewArticle() {
  const transition = useTransition();
  const error = useActionData();

  return (
    <MainLayout>
      {error && <p className="text-lg font-bold text-red-500">{error}</p>}
      <Form method="post" className="flex flex-col space-y-4">
        <p className="flex flex-col">
          <label htmlFor="author">author</label>
          <input
            type="text"
            name="author"
            id="author"
            className="p-1 border border-blue-200 rounded-md"
            required
          />
        </p>
        <p className="flex flex-col">
          <label htmlFor="title">title</label>
          <input
            type="text"
            name="title"
            id="title"
            className="p-1 border border-blue-200 rounded-md"
            required
          />
        </p>
        <p className="flex flex-col">
          <label htmlFor="content">markdown </label>
          <textarea
            rows={10}
            name="content"
            id="content"
            className="p-1 border border-blue-200 rounded-md"
            required
          />
        </p>
        <p>
          <button
            type="submit"
            disabled={!!transition.submission}
            className="text-white bg-blue-500 btn"
          >
            {transition.submission ? 'posting...' : 'Submit'}
          </button>
        </p>
      </Form>
    </MainLayout>
  );
}
