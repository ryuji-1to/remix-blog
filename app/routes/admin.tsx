import { Outlet } from 'remix';

import { MainLayout } from '~/layouts/MainLayout';

export const meta = () => {
  return {
    title: 'Admin route',
    description: 'This is admin route',
  };
};

export default function AdminRoute() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}
