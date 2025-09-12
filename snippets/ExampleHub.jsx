import Link from "@docusaurus/Link";

const DefaultCategoryValue = "any";
const DefaultPhaseValue = "any";


export default function ExampleHub({ examples, categories, parentDir }) {
	const [categoryFilter, setCategoryFilter] = useState(DefaultCategoryValue);
	const [exampleSearch, setExampleSearch] = useState("");

	// Enhanced: Map category ID to display name and color from YAML
	const categoryMap = Object.fromEntries(
		categories.map((cat) => [
			cat.id,
			{ name: cat.name, color: cat.color ?? "gray" },
		]),
	);

	const clearFilters = () => {
		setCategoryFilter(DefaultPhaseValue);
		setExampleSearch("");
	};

	let filteredExamples = examples;

	if (categoryFilter !== DefaultCategoryValue) {
		filteredExamples = filteredExamples.filter((example) =>
			example.categories.includes(categoryFilter),
		);
	}

	if (exampleSearch) {
		filteredExamples = filteredExamples.filter(
			(example) =>
				example.slug.toLowerCase().includes(exampleSearch.toLowerCase()) ||
				example.name.toLowerCase().includes(exampleSearch.toLowerCase()) ||
				example.description.toLowerCase().includes(exampleSearch.toLowerCase()),
		);
	}

	// Added: Assign primary category for grouping
	const examplesWithPrimary = filteredExamples.map((example) => ({
		...example,
		primaryCategoryId: example.categories[0],
	}));

	// Added: Group examples by primary category
	const groupedExamples = new Map();
	for (const example of examplesWithPrimary) {
		const group = groupedExamples.get(example.primaryCategoryId) ?? [];
		group.push(example);
		groupedExamples.set(example.primaryCategoryId, group);
	}

	return (
		<>
			<div className="mb-4 flex flex-wrap justify-between gap-4">
				<div className="relative max-w-64">
					<Icon icon="search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
					<input
						type="text"
						className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md font-sans"
						placeholder="Filter..."
						value={exampleSearch}
						onChange={(event) => setExampleSearch(event.target.value)}
					/>
				</div>

				<div className="flex gap-2">
					<select 
						className="w-[180px] px-3 py-2 border border-gray-300 rounded-md bg-white"
						value={categoryFilter} 
						onChange={(e) => setCategoryFilter(e.target.value)}
					>
						<option value={DefaultCategoryValue}>All categories</option>
						{categories.map((category) => (
							<option key={category.id} value={category.id}>
								{category.name}
							</option>
						))}
					</select>
				</div>
			</div>

			{categories.map((cat) => {
				const examplesInGroup = groupedExamples.get(cat.id);
				if (!examplesInGroup || !examplesInGroup.length) return null;

				return (
					<section key={cat.id} className="my-8">
						<h2 className="text-xl font-bold mb-2">{cat.name}</h2>
						<div className="ngrok--cards grid md:grid-cols-2 gap-4">
							{examplesInGroup.map((example) => (
								<Link
									key={example.name}
									to={`/${parentDir}/examples/${example.slug}`}
									className="col-span-1"
								>
									<Card title={example.name} className="flex h-full flex-col hover:bg-card-hover">
											<p className="m-0 p-0">{example.description}</p>
											<div className="flex flex-wrap gap-2">
												{example.categories
													.sort((a, b) => a.localeCompare(b))
													.map((categoryId) => {
														const meta = categoryMap[categoryId] ?? {
															name: categoryId,
															color: "gray",
														};
														return (
															<span
																key={categoryId}
																appearance="muted"
																color={meta.color}
															>
																{meta.name}
															</span>
														);
													})}
											</div>
									</Card>
								</Link>
							))}
						</div>
					</section>
				);
			})}

			{!filteredExamples.length && (
				<div className="flex flex-col justify-center p-4 text-center">
					<p>
						No examples found with the phrase <b>{exampleSearch}</b> in the{" "}
						<b>{categoryFilter}</b> category.
					</p>
					<div>
						<button type="button" onClick={clearFilters}>
							Clear Filters
						</button>
					</div>
				</div>
			)}
		</>
	);
}
