import toast from 'react-hot-toast';
import type { ActionFunction } from 'remix';
import { Form, redirect, useActionData, useTransition } from 'remix';

import { MainLayout } from '../layouts/MainLayout';
import { createPost, sleep } from '../lib/';

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

  const errors = {
    title: false,
    content: false,
    author: false,
  };

  if (!title) errors.title = true;
  if (!content) errors.content = true;
  if (!author) errors.author = true;
  if (Object.values(errors).includes(true)) {
    return errors;
  }

  if (
    typeof title === 'string' &&
    typeof content === 'string' &&
    typeof author === 'string'
  ) {
    await sleep(2000);
    await createPost({ title, author, content });

    return redirect('/');
  }
};

export default function NewRoute() {
  const transition = useTransition();
  const errors = useActionData();

  return (
    <MainLayout
      rightElement={
        <button
          onClick={() => {
            return toast.success('hello');
          }}
        >
          toast
        </button>
      }
    >
      <Form method="post" className="flex flex-col space-y-4">
        <p className="flex flex-col">
          <label htmlFor="author">
            author
            {errors?.author && (
              <span className="text-red-500">author is required</span>
            )}
          </label>
          <input
            type="text"
            name="author"
            id="author"
            className="p-1 border border-blue-200 rounded-md"
            required
          />
        </p>
        <p className="flex flex-col">
          <label htmlFor="title">
            title
            {errors?.title && (
              <span className="text-red-500">title is required</span>
            )}
          </label>
          <input
            type="text"
            name="title"
            id="title"
            className="p-1 border border-blue-200 rounded-md"
            required
          />
        </p>
        <p className="flex flex-col">
          <label htmlFor="content">
            markdown{' '}
            {errors?.content && (
              <span className="text-red-500">content is required</span>
            )}
          </label>
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
