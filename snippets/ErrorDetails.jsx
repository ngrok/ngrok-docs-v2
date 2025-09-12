import ErrorBoundary from "@docusaurus/ErrorBoundary";
import loadable from "@loadable/component";

export const ErrorDetails = ({ error }) => {
	const LazyErrorPartial = loadable(
		() => import(`/snippets/errors/details/_${error}.mdx`),
	);
	return (
		<ErrorBoundary fallback={() => <br />}>
			<LazyErrorPartial />
		</ErrorBoundary>
	);
};