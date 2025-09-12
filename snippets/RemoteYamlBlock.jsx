export const RemoteYamlBlock = ({
	url,
	title,
}) => {
	const [yamlContent, setYamlContent] = useState("");

	useEffect(() => {
		fetch(url)
			.then((res) => {
				if (!res.ok) throw new Error(`Failed to fetch YAML: ${res.statusText}`);
				return res.text();
			})
			.then((data) => setYamlContent(data))
			.catch((err) => {
				console.error(err);
				setYamlContent("⚠️ Error loading YAML file.");
			});
	}, [url]);

	const snippet = `
	\`\`\`yml ${title || ""}
	${yamlContent}	
	\`\`\`
	  `;

	return (
		snippet
	);
};
