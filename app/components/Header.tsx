import type { ReactNode } from 'react';
import { Link } from 'remix';

type Props = {
  rightElement?: ReactNode;
};

export const Header = (props: Props) => {
  return (
    <header className="border-b-2">
      <div className="flex items-center justify-between h-20 max-w-6xl px-10 mx-auto">
        <Link to="/" className="flex items-center text-2xl">
          <h1 className="mr-2 font-bold">Remix Blog</h1>
          <span className="animate-bounce">🥳</span>
        </Link>
        {props.rightElement}
      </div>
    </header>
  );
};
