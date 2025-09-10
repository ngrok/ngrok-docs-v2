import ErrorBoundary from "@docusaurus/ErrorBoundary";
import loadable from "@loadable/component";

export const ErrorDetails = ({ error }) => {
	const LazyErrorPartial = loadable(
		() => import(`/docs/errors/details/_${error}.md`),
	);
	return (
		<ErrorBoundary fallback={() => <br />}>
			<LazyErrorPartial />
		</ErrorBoundary>
	);
};