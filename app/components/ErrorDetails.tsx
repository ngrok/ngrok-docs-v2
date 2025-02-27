import { ErrorBoundary } from "react-error-boundary";
import Loadable from "react-loadable";

type ErrorDetailsProps = {
  error: `err_ngrok_${string}` | `err_ngrok_${number}` | (string & {});
};

export default function ErrorDetails({ error }: ErrorDetailsProps) {
  const Error = Loadable({
    loader: () => import(`/app/routes/docs+/errors/details/_${error}.md`),
    loading: <br />,
  });
  return (
    <ErrorBoundary fallback={<br />}>
      <Error />
    </ErrorBoundary>
  );
}
