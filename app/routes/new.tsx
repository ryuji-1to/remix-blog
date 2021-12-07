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
    const result = await createArticle({ title, author, content });
    if (result.status === 'success') {
      return redirect('/');
    } else {
      return json('error occurred', 500);
    }
  }

  return json('invalid data!!!', 400);
};

export default function NewProject() {
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
            className="px-4 py-2 text-white bg-blue-300 border border-blue-300 rounded-md hover:bg-white hover:text-blue-300"
          >
            {transition.submission ? 'posting...' : 'Submit'}
          </button>
        </p>
      </Form>
    </MainLayout>
  );
}
