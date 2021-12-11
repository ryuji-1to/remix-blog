import { Outlet } from 'remix';

import { MainLayout } from '~/layouts/MainLayout';

export default function SearchRoute() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}
