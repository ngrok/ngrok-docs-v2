export const RemoteMarkdownEmbedder = ({
	url,
	textToRemove,
}) => {

	const [content, setContent] = useState("");

	useEffect(() => {
		fetch(url)
			.then((res) => res.text())
			.then(setContent);
	}, [url]);

	if (!content) {
		return (
			<pre className="min-h-[3.25rem] p-4 pr-[3.375rem] font-mono text-mono">
				Loading ...
			</pre>
		);
	}

	const finalContent = textToRemove
		? content.replace(textToRemove, "")
		: content;

	return `${finalContent}`;
};

