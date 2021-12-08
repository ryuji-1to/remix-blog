import type { ActionFunction, LoaderFunction, MetaFunction } from 'remix';

import { MainLayout } from '~/layouts/MainLayout';

export const action: ActionFunction = () => {
  return null;
};

export const loader: LoaderFunction = () => {
  return null;
};

export const meta: MetaFunction = () => {
  return {
    title: 'Admin route',
    description: 'This is admin route',
  };
};

export default function AdminRoute() {
  return <MainLayout>admin route</MainLayout>;
}
