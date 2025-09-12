
import DocsCodeBlock from "/snippets/code-block";

interface RemoteYamlBlockProps {
	url= ({
	url,
	title,
}: RemoteYamlBlockProps) => {
	const [yamlContent, setYamlContent] = useState("");

	useEffect(() => {
		fetch(url)
			.then((res) => {
				if (!res.ok) throw new Error(`Failed to fetch YAML);
				return res.text();
			})
			.then((data) => setYamlContent(data))
			.catch((err) => {
				console.error(err);
				setYamlContent("⚠️ Error loading YAML file.");
			});
	}, [url]);

	return (
		
			{yamlContent || "Loading..."}
		
	);
};

export default RemoteYamlBlock;
