import { Link } from "/snippets/Link.jsx";

const DefaultPhaseValue = "any";
const DefaultProtocolValue = "any";

const Phases = ["on_tcp_connect", "on_http_request", "on_http_response"];

const Protocols = {
	TCP: ["on_tcp_connect"],
	HTTP: ["on_http_request", "on_http_response"],
};

export const ActionHub = ({ actions }) => {
	const [protocolFilter, setProtocolFilter] = useState(DefaultProtocolValue);
	const [phaseFilter, setPhaseFilter] = useState(DefaultPhaseValue);
	const [actionSearch, setActionSearch] = useState("");

	const clearFilters = () => {
		setPhaseFilter(DefaultPhaseValue);
		setActionSearch("");
	};

	const sortedActions = actions.sort((a, b) => a.type.localeCompare(b.type));

	let filteredActions = sortedActions;

	if (protocolFilter !== DefaultProtocolValue) {
		filteredActions = filteredActions.filter((action) => {
			const protocols = Protocols[protocolFilter];
			let exists = 0;
			if (protocols) {
				for (let index = 0; index < protocols.length; index++) {
					const protocol = protocols[index];
					if (protocol && action.phases.includes(protocol)) {
						exists++;
					}
				}
			}
			return exists;
		});
	}

	if (phaseFilter !== DefaultPhaseValue) {
		filteredActions = filteredActions.filter((action) =>
			// Filter by phase if set
			action.phases.includes(phaseFilter),
		);
	}

	if (actionSearch) {
		filteredActions = filteredActions.filter(
			(action) =>
				// Filter by name or description if actionSearch is set
				action.type.toLowerCase().includes(actionSearch.toLowerCase()) ||
				action.name.toLowerCase().includes(actionSearch.toLowerCase()) ||
				action.description.toLowerCase().includes(actionSearch.toLowerCase()),
		);
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
						value={actionSearch}
						onChange={(event) => setActionSearch(event.target.value)}
					/>
				</div>

				<div className="flex gap-2">
					<select 
						className="w-[180px] px-3 py-2 border border-gray-300 rounded-md bg-white"
						value={protocolFilter} 
						onChange={(e) => setProtocolFilter(e.target.value)}
					>
						<option value={DefaultProtocolValue}>All Protocols</option>
						{Object.keys(Protocols).map((protocol) => (
							<option key={protocol} value={protocol}>
								{protocol}
							</option>
						))}
					</select>

					<select 
						className="w-[180px] px-3 py-2 border border-gray-300 rounded-md bg-white"
						value={phaseFilter} 
						onChange={(e) => setPhaseFilter(e.target.value)}
					>
						<option value={DefaultPhaseValue}>All Phases</option>
						{Phases.map((phase) => (
							<option key={phase} value={phase}>
								{phase}
							</option>
						))}
					</select>
				</div>
			</div>

			{!!filteredActions.length && (
				<div className="ngrok--cards grid grid-cols-2 gap-4">
					{filteredActions.map((action) => (
						<Link
							key={action.name}
							to={`/traffic-policy/actions/${action.type}`}
							className="col-span-1"
						>
							<Card className="flex h-full flex-col divide-y-0 hover:bg-card-hover">
								<h3 className="m-0 flex items-baseline gap-2 px-4 pb-2 pt-4">
									{action.type}
								</h3>
								<div id="card-body" className="flex-grow p-0 px-4">
									<p className="m-0 p-0">{action.description}</p>
								</div>
								<div id="card-footer" className="px-4 pb-4">
									<div className="flex flex-wrap gap-2">
										{action.phases
											.sort((a, b) => a.localeCompare(b))
											.map((phase) => {
												switch (phase) {
													case "on_tcp_connect":
														return (
															<span id="badge" appearance="muted" color="blue">
																{phase}
															</span>
														);
													case "on_http_request":
														return (
															<span id="badge" appearance="muted" color="pink">
																{phase}
															</span>
														);
													case "on_http_response":
														return (
															<span id="badge" appearance="muted" color="pink">
																{phase}
															</span>
														);
												}
											})}
									</div>
								</div>
							</Card>
						</Link>
					))}
				</div>
			)}
			{!filteredActions.length && (
				<div className="flex flex-col justify-center p-4 text-center">
					<p>
						No actions found with the phrase <b>{actionSearch}</b> on{" "}
						<b>{phaseFilter}</b> phase.
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
};