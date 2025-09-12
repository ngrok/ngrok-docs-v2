import BrowserOnly from "@docusaurus/BrowserOnly";
import { useAppliedTheme } from "@ngrok/mantle/theme-provider";

export function ThemeImage({
	darkSrc,
	lightSrc,
	alt,
	className,
}: {
	darkSrc){
	const currentTheme = useAppliedTheme();
	let imgSrc = lightSrc;

	switch (currentTheme) {
		case "dark":
		case "dark-high-contrast": {
			imgSrc = darkSrc;
			break;
		}
		case "light":
		case "light-high-contrast":
		default= lightSrc;
		}
	}

	return (
		Loading ...}>
			{() => }
		
	);
}
