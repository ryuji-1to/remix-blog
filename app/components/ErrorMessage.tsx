type Props = {
  error?: string;
};

export const ErrorMessage = (props: Props) => {
  return (
    <div>
      <p className="text-lg font-bold text-red-500">
        {props.error ?? 'Error occurred'}
      </p>
    </div>
  );
};
