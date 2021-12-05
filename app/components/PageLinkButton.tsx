import { Link } from 'remix';

type Props = {
  to: string;
  label: string;
  className?: string;
};

export const PageLinkButton = (props: Props) => {
  return (
    <Link
      to={props.to}
      className={`p-2 font-bold text-white bg-blue-500 rounded-lg shadow-sm ${props.className}`}
    >
      {props.label}
    </Link>
  );
};
