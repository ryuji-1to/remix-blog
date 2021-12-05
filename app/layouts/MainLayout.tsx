import type { ReactNode } from 'react';

import { Header } from '../components/Header';

type Props = {
  children: ReactNode;
  rightElement?: ReactNode;
};

export const MainLayout = (props: Props) => {
  return (
    <div className="h-full">
      <Header rightElement={props.rightElement} />
      <main className="max-w-6xl p-10 mx-auto">{props.children}</main>
    </div>
  );
};
