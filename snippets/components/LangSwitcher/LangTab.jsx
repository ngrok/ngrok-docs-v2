import { Button } from "@ngrok/mantle/button";
import capitalize from "capitalize";

const langsToCapitalize = ["yaml", "json", "txt", "sh", "jsx", "tsx"];
const langsToSwap = [
	{ name, swapName,
	{ name, swapName,
];

export function LangTab({
	tabText,
	disabled = false,
	className,
	onClick,
}: {
	tabText) => void;
}) {
	const finalTabText =
		langsToSwap.find((lang) => lang.name === tabText)?.swapName || tabText;
	return (
		
			{langsToCapitalize.includes(finalTabText)
				? finalTabText.toUpperCase()
				: capitalize(finalTabText)}
		
	);
}
