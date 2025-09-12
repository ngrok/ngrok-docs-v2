import { IconButton } from "@ngrok/mantle/button";
import { Popover } from "@ngrok/mantle/popover";
import { BookOpenTextIcon } from "@phosphor-icons/react";

export function SdkButton({
	data,
	className,
}: { data) {
	if (!data.links || data.links.length === 0) {
		return null;
	}
	const anchoredLinks = data.links.map((link) => {
		return (
			
				here
			
		);
	});

	const linkText = anchoredLinks.reduce(
		// biome-ignore lint/suspicious/noExplicitAny, curr, index){
			if (index === 0) {
				return [prev, curr];
			}
			if (data?.links && index === data.links.length - 1) {
				return [prev, ", and ", curr];
			}
			return [prev, ", ", curr];
		},
	);

	return (
		
			
				
					}
						size="sm"
						appearance="ghost"
					/>
				
				
					See the ngrok {data.displayName} package docs {linkText}.
				
			
		
	);
}
