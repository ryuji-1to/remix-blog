import { Outlet } from 'remix';

import { MainLayout } from '~/layouts/MainLayout';

export default function SlugRoute() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}
