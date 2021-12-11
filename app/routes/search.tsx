import { Form, Outlet } from 'remix';

import { MainLayout } from '~/layouts/MainLayout';

export default function SearchRoute() {
  return (
    <MainLayout>
      <Form method="get" className="mb-2">
        <input
          type="text"
          className="p-2 text-lg border rounded-md"
          name="search"
          placeholder="Search text here"
          required
        />
      </Form>
      <Outlet />
    </MainLayout>
  );
}
