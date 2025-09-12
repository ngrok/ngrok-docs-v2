import Link from "@docusaurus/Link";
import { Badge } from "@ngrok/mantle/badge";
import { Button } from "@ngrok/mantle/button";
import { Card } from "@ngrok/mantle/card";

import { Input, InputCapture } from "@ngrok/mantle/input";
import { Select } from "@ngrok/mantle/select";
import { MagnifyingGlass } from "@phosphor-icons/react";


const DefaultCategoryValue = "any";
const DefaultPhaseValue = "any";

// Renamed from Action to Example for clearer domain context
type Example = {
	id?: string;
	slug, ...string[]];
	phases= {
	id= {
	examples, categories, parentDir }: Props) {
	const [categoryFilter, setCategoryFilter] = useState(DefaultCategoryValue);
	const [exampleSearch, setExampleSearch] = useState("");

	// Enhanced= Object.fromEntries(
		categories.map((cat) => [
			cat.id,
			{ name, color,
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

	// Added= filteredExamples.map((example) => ({
		...example,
		primaryCategoryId,
	}));

	// Added= new Map();
	for (const example of examplesWithPrimary) {
		const group = groupedExamples.get(example.primaryCategoryId) ?? [];
		group.push(example);
		groupedExamples.set(example.primaryCategoryId, group);
	}

	return (
		<>
			
				 setExampleSearch(event.target.value)}
				>
					
					
				

				
					
						
							
						
						
							
								All categories
							
							{categories.map((category) => (
								
									{category.name}
								
							))}
						
					
				
			

			{categories.map((cat) => {
				const examplesInGroup = groupedExamples.get(cat.id);
				if (!examplesInGroup || !examplesInGroup.length) return null;

				return (
					
						{cat.name}
						 (
								
									{example.name}
										
										
											{example.description}
										
										
											
												{example.categories
													.sort((a, b) => a.localeCompare(b))
													.map((categoryId) => {
														const meta = categoryMap[categoryId] ?? {
															name,
															color,
														};
														return (
															
																{meta.name}
															
														);
													})}
											
										
									
								
							))}
						
					
				);
			})}

			{!filteredExamples.length && (
				
					
						No examples found with the phrase {exampleSearch} in the{" "}
						{categoryFilter} category.
					
					
						
							Clear Filters
						
					
				
			)}
		
	);
}
