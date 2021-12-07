import type { ReactNode } from 'react';
import type { LinksFunction } from 'remix';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'remix';

import globalStylesUrl from '~/styles/global.css';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: globalStylesUrl }];
};

const Document = ({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) => {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
};

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}
